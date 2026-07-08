/* ================================================================
   Lia’s Garten – Klangwelt
   Alle Geräusche werden mit der Web-Audio-API erzeugt,
   es werden keine Audiodateien benötigt.
   ================================================================ */

const AudioKit = (() => {
  let ctx = null;
  let master = null;
  let ambientGain = null;
  let muted = false;
  let ambientTimer = null;
  let musicGain = null;
  let musicOn = true;
  let musicTimer = null;

  let unlockEl = null;

  /* iPhone/iPad: Der Stumm-Schalter schaltet Web-Audio normalerweise ab.
     Eine (stille) laufende <audio>-Spur hebt die Tonausgabe in den
     Wiedergabe-Modus, dann sind auch die Spielgeräusche hörbar. */
  function makeSilentUnlock() {
    try {
      const n = 8000;
      const buf = new ArrayBuffer(44 + n * 2);
      const dv = new DataView(buf);
      const w = (o, str) => { for (let i = 0; i < str.length; i++) dv.setUint8(o + i, str.charCodeAt(i)); };
      w(0, "RIFF"); dv.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt ");
      dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
      dv.setUint32(24, 8000, true); dv.setUint32(28, 16000, true);
      dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
      w(36, "data"); dv.setUint32(40, n * 2, true);
      /* Als data-URI einbetten – blob-URLs sind in manchen strengen
         Umgebungen (Content Security Policy) nicht erlaubt. */
      const bytes = new Uint8Array(buf);
      let bin = "";
      for (let i = 0; i < bytes.length; i += 4096) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 4096));
      }
      unlockEl = document.createElement("audio");
      unlockEl.src = "data:audio/wav;base64," + btoa(bin);
      unlockEl.loop = true;
      unlockEl.setAttribute("playsinline", "");
      unlockEl.play().catch(() => { /* dann eben nicht */ });
    } catch (e) { /* optionaler Trick, kein Problem */ }
  }

  function init() {
    if (ctx) {
      resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = musicOn ? 1 : 0;
    musicGain.connect(ctx.destination);
    makeSilentUnlock();
    startAmbient();
    startMusic();
  }

  /* Nach Tab-Wechseln oder Pausen den Ton wieder aufwecken. */
  function resume() {
    if (ctx && ctx.state === "suspended") ctx.resume();
    if (unlockEl && unlockEl.paused) unlockEl.play().catch(() => {});
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  /* Ein einzelner weicher Ton mit Hüllkurve und optionalem Gleiten. */
  function tone(freq, dur, { type = "sine", vol = 0.18, when = 0, glideTo = null, pan = 0 } = {}) {
    if (!ctx) return;
    const t0 = now() + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let dest = master;
    if (pan && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      p.connect(master);
      dest = p;
    }
    osc.connect(gain).connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /* Kurzes gefiltertes Rauschen (für Platschen, Knuspern usw.). */
  function noise(dur, { vol = 0.15, when = 0, freq = 900, q = 1.2 } = {}) {
    if (!ctx) return;
    const t0 = now() + when;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.value = freq;
    filt.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt).connect(gain).connect(master);
    src.start(t0);
  }

  /* Sanfte Hintergrund-Atmosphäre: leiser Akkord-Teppich
     und ab und zu ein Vogelzwitschern. */
  function startAmbient() {
    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.045;
    ambientGain.connect(master);

    [130.8, 196.0, 261.6].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.5;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain).connect(g.gain);
      osc.connect(g).connect(ambientGain);
      osc.start();
      lfo.start();
    });

    scheduleBird();
  }

  function scheduleBird() {
    ambientTimer = setTimeout(() => {
      if (ctx && !muted) ambientChirp();
      scheduleBird();
    }, 6000 + Math.random() * 9000);
  }

  function ambientChirp() {
    const base = 1500 + Math.random() * 900;
    const pan = Math.random() * 1.6 - 0.8;
    for (let i = 0; i < 3; i++) {
      tone(base + i * 120, 0.09, { vol: 0.05, when: i * 0.13, glideTo: base + 500, pan });
    }
  }

  /* ------------ Hintergrundmusik ------------
     Eine kleine, selbst komponierte Melodie im Wiegenlied-Stil,
     die in einer sanften Schleife läuft. Eigener Lautstärkekanal,
     damit sie unabhängig von den Geräuschen abschaltbar ist. */

  const Q = 0.42; /* Länge einer Viertelnote in Sekunden */

  /* [Frequenz, Dauer in Vierteln] – 0 = Pause */
  const MELODY = [
    [330, 1], [392, 1], [440, 2],
    [392, 1], [330, 1], [262, 2],
    [294, 1], [330, 1], [392, 1], [330, 1],
    [294, 3], [0, 1],
    [330, 1], [392, 1], [440, 1], [523, 1],
    [440, 1], [392, 1], [330, 2],
    [392, 1], [330, 1], [294, 1], [330, 1],
    [262, 3], [0, 1],
  ];
  /* Ein Basston pro Takt (4 Viertel) */
  const BASS = [131, 131, 196, 196, 175, 175, 196, 131];

  function musicNote(freq, dur, when, vol, type = "triangle") {
    if (!freq) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(vol, when + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur * 0.95);
    osc.connect(gain).connect(musicGain);
    osc.start(when);
    osc.stop(when + dur);
  }

  function scheduleMusic(t0) {
    let t = t0;
    MELODY.forEach(([f, d]) => {
      musicNote(f, d * Q, t, 0.05);
      /* leises Echo eine Oktave höher */
      if (f) musicNote(f * 2, d * Q * 0.7, t + 0.06, 0.012);
      t += d * Q;
    });
    BASS.forEach((f, bar) => {
      musicNote(f, 4 * Q, t0 + bar * 4 * Q, 0.045, "sine");
      musicNote(f * 1.5, 2 * Q, t0 + bar * 4 * Q + 2 * Q, 0.02, "sine");
    });
    return t - t0;
  }

  function startMusic() {
    if (!ctx) return;
    stopMusicTimer();
    const loop = () => {
      const dur = scheduleMusic(ctx.currentTime + 0.15);
      musicTimer = setTimeout(loop, (dur + 0.6) * 1000 - 200);
    };
    loop();
  }

  function stopMusicTimer() {
    if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
  }

  function setMusicOn(on) {
    musicOn = on;
    if (musicGain) musicGain.gain.value = on ? 1 : 0;
  }

  function isMusicOn() { return musicOn; }

  /* ------------ Benannte Spielgeräusche ------------ */

  const sfx = {
    pop()     { tone(520, 0.1, { vol: 0.22 }); tone(780, 0.12, { when: 0.05, vol: 0.18 }); },
    chime()   { [660, 830, 990].forEach((f, i) => tone(f, 0.35, { when: i * 0.07, vol: 0.12 })); },
    boing()   { tone(180, 0.28, { type: "triangle", glideTo: 520, vol: 0.2 }); },
    success() { [523, 587, 659, 784, 1046].forEach((f, i) => tone(f, 0.28, { when: i * 0.1, vol: 0.16, type: "triangle" })); },
    fanfare() {
      [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) =>
        tone(f, 0.32, { when: i * 0.13, vol: 0.16, type: "triangle" }));
      noise(0.5, { vol: 0.05, when: 0.9, freq: 3500 });
    },
    croak()   {
      [0, 0.24].forEach((w) => {
        tone(150, 0.2, { type: "square", glideTo: 85, vol: 0.22, when: w });
        tone(300, 0.2, { type: "sawtooth", glideTo: 170, vol: 0.08, when: w });
      });
    },
    buzz()    { tone(190, 0.5, { type: "sawtooth", vol: 0.14, glideTo: 240 }); tone(196, 0.5, { type: "sawtooth", vol: 0.11, glideTo: 250 }); },
    chirp()   { [0, 0.16, 0.34].forEach(w => tone(1900, 0.11, { when: w, glideTo: 2700, vol: 0.18 })); },
    hoot()    { tone(392, 0.32, { glideTo: 295, vol: 0.26 }); tone(392, 0.48, { glideTo: 275, vol: 0.26, when: 0.42 }); },
    splash()  { noise(0.35, { vol: 0.26, freq: 1400, q: 0.7 }); tone(300, 0.2, { glideTo: 120, vol: 0.12 }); },
    munch()   { [0, 0.18, 0.36].forEach(w => noise(0.1, { vol: 0.24, when: w, freq: 700, q: 2 })); },
    twinkle() { tone(1568, 0.3, { vol: 0.14 }); tone(2093, 0.4, { when: 0.08, vol: 0.12 }); },
    quack()   {
      [0, 0.19, 0.38].forEach((w, i) => {
        tone(330 - i * 25, 0.14, { type: "sawtooth", glideTo: 200 - i * 15, vol: 0.2, when: w });
      });
    },
    peep()    { [0, 0.18].forEach(w => tone(1046, 0.13, { glideTo: 1450, vol: 0.2, when: w })); },
    snuffle() { noise(0.14, { vol: 0.18, freq: 450, q: 1.5 }); noise(0.12, { vol: 0.15, when: 0.2, freq: 400, q: 1.5 }); },
    water()   { noise(0.7, { vol: 0.1, freq: 2500, q: 0.5 }); noise(0.5, { vol: 0.08, when: 0.3, freq: 3000, q: 0.5 }); },
    whoosh()  { noise(0.3, { vol: 0.1, freq: 800, q: 0.4 }); },
    hello()   { tone(660, 0.14, { vol: 0.14 }); tone(880, 0.2, { when: 0.14, vol: 0.14 }); },
    meow()    { tone(520, 0.16, { type: "triangle", glideTo: 900, vol: 0.2 }); tone(900, 0.5, { type: "triangle", glideTo: 360, vol: 0.24, when: 0.16 }); },
    woof()    {
      [0, 0.26].forEach((w) => {
        tone(170, 0.14, { type: "sawtooth", glideTo: 80, vol: 0.3, when: w });
        noise(0.11, { vol: 0.2, when: w, freq: 480, q: 0.8 });
      });
    },
    whee()    { tone(392, 0.5, { type: "triangle", glideTo: 900, vol: 0.14 }); tone(900, 0.25, { type: "triangle", glideTo: 660, vol: 0.1, when: 0.5 }); },
    gull()    { [0, 0.3].forEach((w) => tone(1350, 0.28, { type: "sawtooth", glideTo: 750, vol: 0.12, when: w })); },
    hop()     { tone(300, 0.12, { type: "triangle", glideTo: 600, vol: 0.14 }); tone(340, 0.12, { type: "triangle", glideTo: 640, vol: 0.12, when: 0.16 }); },
    thud()    { tone(140, 0.15, { type: "triangle", glideTo: 70, vol: 0.2 }); },
    note(step = 0) {
      const scale = [523, 587, 659, 784, 880, 1046];
      tone(scale[step % scale.length], 0.45, { vol: 0.16, type: "triangle" });
    },
  };

  function play(name, arg) {
    if (!ctx || muted) return;
    if (sfx[name]) sfx[name](arg);
  }

  function setMuted(m) {
    muted = m;
    if (master) master.gain.value = m ? 0 : 1;
    if (m && window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function isMuted() { return muted; }

  return { init, resume, play, setMuted, isMuted, setMusicOn, isMusicOn };
})();
