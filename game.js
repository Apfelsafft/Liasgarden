/* ================================================================
   Lia’s Garten – Spiel-Engine
   Szenenwechsel, Ziehen & Ablegen, Glühwürmchen-Hilfe,
   Wissens-Karten, Sterne-Fortschritt und Speichern.
   ================================================================ */

(() => {
  const SAVE_KEY = "liasGartenSave";

  /* ---------- Spielstand ---------- */

  let save = { done: {}, muted: false, musicOff: false };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) save = Object.assign(save, JSON.parse(raw));
  } catch (e) { /* Speicher nicht verfügbar – Spiel läuft trotzdem */ }

  if (location.search.includes("reset")) {
    save.done = {};
    delete save.soundMode;
    persist();
  }

  /* Welche Aufgaben-Einladungen in dieser Sitzung schon gezeigt wurden */
  const promptShown = {};

  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* egal */ }
  }

  const doneCount = () => ALL_TASKS.filter((t) => save.done[t]).length;
  const nightUnlocked = () => doneCount() >= UNLOCK_NIGHT_AT;

  /* ---------- Grundgerüst der Seite ---------- */

  const stage = document.getElementById("stage");
  let currentScene = 0;
  let started = false;
  let idleTimer = null;
  let hintBusy = false;

  const topbar = document.getElementById("topbar");
  const starRow = document.getElementById("starRow");
  const navLeft = document.getElementById("navLeft");
  const navRight = document.getElementById("navRight");
  const dots = document.getElementById("dots");
  const helperFly = document.getElementById("helperFly");
  const cardOverlay = document.getElementById("cardOverlay");

  /* ---------- Sprachausgabe ----------
     Wir suchen die menschlichste deutsche Stimme, die das Gerät
     anbietet (Siri-, Premium- und Google-Stimmen klingen deutlich
     natürlicher als die Roboter-Ersatzstimmen), und sprechen in zwei
     Rollen: die Vorlesestimme wie eine Mama, Lia wie ein Kind. */

  let bestVoice = null;

  function rateVoice(v) {
    const n = v.name.toLowerCase();
    let score = 0;
    if (/siri/.test(n)) score += 60;
    if (/enhanced|premium|erweitert|natural|neural|plus/.test(n)) score += 50;
    if (/google/.test(n)) score += 40;
    if (/anna|petra|helena|katja|hedda|marlene|vicki|amala/.test(n)) score += 20;
    if (/eloquence|compact|espeak|robot/.test(n)) score -= 40;
    if (v.lang.toLowerCase() === "de-de") score += 5;
    return score;
  }

  function chooseVoice() {
    if (!window.speechSynthesis) return;
    const german = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("de"));
    if (!german.length) return;
    german.sort((a, b) => rateVoice(b) - rateVoice(a));
    bestVoice = german[0];
  }

  if (window.speechSynthesis) {
    chooseVoice();
    speechSynthesis.addEventListener("voiceschanged", chooseVoice);
  }

  /* Gesprochene Tierlaute ("Miau!") – aber nie in eine offene
     Karten-Vorlesung hineinreden */
  AudioKit.setSpeakHandler((word) => {
    if (document.getElementById("cardOverlay").classList.contains("show")) return;
    if (document.getElementById("confirmOverlay").classList.contains("show")) return;
    speak(word, "kind");
  });

  const VOICE_ROLES = {
    mama: { rate: 0.95, pitch: 1.05 },
    kind: { rate: 1.05, pitch: 1.5 },
  };

  function speak(text, role = "mama") {
    if (AudioKit.isMuted() || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const r = VOICE_ROLES[role] || VOICE_ROLES.mama;
    u.lang = "de-DE";
    u.rate = r.rate;
    u.pitch = r.pitch;
    if (!bestVoice) chooseVoice();
    if (bestVoice) u.voice = bestVoice;
    speechSynthesis.speak(u);
  }

  /* ---------- Szene anzeigen ---------- */

  function showScene(idx) {
    currentScene = idx;
    stopHint();
    stage.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 1000 700");
    svg.setAttribute("preserveAspectRatio", "xMidYMax slice");
    svg.classList.add("scene");
    const scene = SCENES[idx];
    svg.innerHTML = scene.html((t) => !!save.done[t]);
    stage.appendChild(svg);

    document.body.style.background = scene.id === "night" ? "#1b2a5e" : "#bde8ff";

    wirePokes(svg);
    scene.init(svg, makeApi(svg, scene));
    updateChrome();
    resetIdle();
    maybeShowPrompt();
  }

  /* Erste offene Aufgabe der Szene (Reihenfolge beachten) */
  function currentTaskOf(scene) {
    for (const t of scene.tasks) {
      if (save.done[t.id]) continue;
      if (scene.id === "garden" && t.id === "t2" && !save.done.t1) continue;
      return t;
    }
    return null;
  }

  /* Aufgaben-Einladung zeigen: der Natur-Fakt wird zur Aufgabe */
  function maybeShowPrompt() {
    if (!started || cardOverlay.classList.contains("show")) return;
    const task = currentTaskOf(SCENES[currentScene]);
    if (!task || promptShown[task.id]) return;
    const sceneIdx = currentScene;
    setTimeout(() => {
      if (currentScene !== sceneIdx || cardOverlay.classList.contains("show")) return;
      if (confirmOverlay.classList.contains("show")) return;
      if (promptShown[task.id] || save.done[task.id]) return;
      promptShown[task.id] = true;
      const info = TASK_INFO[task.id];
      showCard({ icon: info.icon, text: info.prompt });
      AudioKit.play("chime");
    }, 700);
  }

  /* ---------- Große Reaktionen beim Antippen ----------
     Jeder feste Gegenstand kann eine richtig sichtbare Aktion
     ausführen – nicht nur wackeln. Alle Animationen kehren von
     selbst zur Ausgangsposition zurück. */

  const POKE_ACTIONS = {
    /* hoher Hüpfer mit Quetsch-Landung (Pilze, Sandburg, Igel, Frosch) */
    bigBounce: (inner) => inner.animate([
      { transform: "translateY(0) scale(1,1)" },
      { transform: "translateY(-120px) scale(0.92,1.1)", offset: 0.3 },
      { transform: "translateY(0) scale(1.18,0.82)", offset: 0.55 },
      { transform: "translateY(-55px) scale(1,1)", offset: 0.75 },
      { transform: "translateY(0) scale(1,1)" },
    ], { duration: 1400, easing: "ease-in-out" }),
    /* großer Bogenflug über den Bildschirm und zurück (Wasserball) */
    flyArc: (inner) => inner.animate([
      { transform: "translate(0,0) rotate(0deg)" },
      { transform: "translate(-240px,-220px) rotate(-160deg)", offset: 0.25 },
      { transform: "translate(-460px,-20px) rotate(-320deg)", offset: 0.5 },
      { transform: "translate(-240px,-200px) rotate(-160deg)", offset: 0.75 },
      { transform: "translate(0,0) rotate(0deg)" },
    ], { duration: 2600, easing: "ease-in-out" }),
    /* wegrollen und zurück (Kürbis) */
    roll: (inner) => inner.animate([
      { transform: "translateX(0) rotate(0deg)" },
      { transform: "translateX(-110px) rotate(-200deg)", offset: 0.4 },
      { transform: "translateX(60px) rotate(120deg)", offset: 0.75 },
      { transform: "translateX(0) rotate(0deg)" },
    ], { duration: 1800, easing: "ease-in-out" }),
    /* einmal ganz herumdrehen (Sonne) */
    spin: (inner) => inner.animate([
      { transform: "rotate(0deg)" },
      { transform: "rotate(360deg)" },
    ], { duration: 1500, easing: "ease-in-out" }),
    /* aufplustern und davonschweben (Wolken) */
    puff: (inner) => inner.animate([
      { transform: "translate(0,0) scale(1)" },
      { transform: "translate(70px,-20px) scale(1.3)", offset: 0.5 },
      { transform: "translate(0,0) scale(1)" },
    ], { duration: 1600, easing: "ease-in-out" }),
    /* wie eine Sternschnuppe flitzen (Sterne) */
    zip: (inner) => inner.animate([
      { transform: "translate(0,0) scale(1)" },
      { transform: "translate(140px,-70px) scale(1.5)", offset: 0.4 },
      { transform: "translate(70px,30px) scale(1.2)", offset: 0.7 },
      { transform: "translate(0,0) scale(1)" },
    ], { duration: 1100, easing: "ease-in-out" }),
    /* sanft aufleuchten und größer werden (Mond) */
    pulse: (inner) => inner.animate([
      { transform: "scale(1)", filter: "brightness(1)" },
      { transform: "scale(1.3)", filter: "brightness(1.35)", offset: 0.4 },
      { transform: "scale(1)", filter: "brightness(1)" },
    ], { duration: 1300, easing: "ease-in-out" }),
    /* fröhlicher Wackeltanz (Schneemann) */
    dance: (inner) => inner.animate([
      { transform: "rotate(0deg) translateY(0)" },
      { transform: "rotate(-13deg) translateY(-24px)", offset: 0.2 },
      { transform: "rotate(12deg) translateY(0)", offset: 0.4 },
      { transform: "rotate(-10deg) translateY(-20px)", offset: 0.6 },
      { transform: "rotate(9deg) translateY(0)", offset: 0.8 },
      { transform: "rotate(0deg) translateY(0)" },
    ], { duration: 1600, easing: "ease-in-out" }),
    /* kräftig schütteln (Bäume, Beerenbusch) */
    shiver: (inner) => inner.animate([
      { transform: "rotate(0deg)" }, { transform: "rotate(-7deg)" },
      { transform: "rotate(7deg)" }, { transform: "rotate(-6deg)" },
      { transform: "rotate(5deg)" }, { transform: "rotate(0deg)" },
    ], { duration: 800, easing: "ease-in-out" }),
    /* verstecken und wieder hervorschauen (Schnecke) */
    peek: (inner) => inner.animate([
      { transform: "scale(1,1) translateY(0)" },
      { transform: "scale(0.65,0.7) translateY(10px)", offset: 0.25 },
      { transform: "scale(0.65,0.7) translateY(10px)", offset: 0.6 },
      { transform: "scale(1.15,1.1) translateY(-6px)", offset: 0.85 },
      { transform: "scale(1,1) translateY(0)" },
    ], { duration: 2000, easing: "ease-in-out" }),
    /* eine Flugrunde drehen (Marienkäfer) */
    loop: (inner) => inner.animate([
      { transform: "translate(0,0) rotate(0deg)" },
      { transform: "translate(90px,-110px) rotate(30deg)", offset: 0.3 },
      { transform: "translate(180px,-30px) rotate(-20deg)", offset: 0.55 },
      { transform: "translate(80px,30px) rotate(15deg)", offset: 0.8 },
      { transform: "translate(0,0) rotate(0deg)" },
    ], { duration: 2200, easing: "ease-in-out" }),
    /* seitwärts flitzen wie ein echter Krebs */
    scuttle: (inner) => inner.animate([
      { transform: "translateX(0)" },
      { transform: "translateX(-130px)", offset: 0.3 },
      { transform: "translateX(-130px)", offset: 0.45 },
      { transform: "translateX(90px)", offset: 0.75 },
      { transform: "translateX(0)" },
    ], { duration: 1700, easing: "ease-in-out" }),
    /* freudig aufblühen (Blumen) */
    bloom: (inner) => inner.animate([
      { transform: "scale(1) rotate(0deg)" },
      { transform: "scale(1.4) rotate(-12deg)", offset: 0.35 },
      { transform: "scale(1.25) rotate(10deg)", offset: 0.65 },
      { transform: "scale(1) rotate(0deg)" },
    ], { duration: 1100, easing: "ease-in-out" }),
    /* kurz auffliegen und wieder landen (Wintervögel) */
    flutter: (inner) => inner.animate([
      { transform: "translate(0,0) rotate(0deg)" },
      { transform: "translate(-30px,-90px) rotate(-15deg)", offset: 0.35 },
      { transform: "translate(30px,-70px) rotate(15deg)", offset: 0.65 },
      { transform: "translate(0,0) rotate(0deg)" },
    ], { duration: 1500, easing: "ease-in-out" }),
    /* kopfüber abtauchen (Entenmama) */
    dip: (inner) => inner.animate([
      { transform: "rotate(0deg) translateY(0)" },
      { transform: "rotate(38deg) translateY(14px)", offset: 0.35 },
      { transform: "rotate(38deg) translateY(14px)", offset: 0.6 },
      { transform: "rotate(0deg) translateY(0)" },
    ], { duration: 1600, easing: "ease-in-out" }),
    /* Katzensprung */
    pounce: (inner) => inner.animate([
      { transform: "translate(0,0) rotate(0deg) scale(1,1)" },
      { transform: "translate(0,6px) scale(1.1,0.85)", offset: 0.15 },
      { transform: "translate(-60px,-100px) rotate(-12deg) scale(1,1)", offset: 0.45 },
      { transform: "translate(-90px,0) scale(1.08,0.9)", offset: 0.65 },
      { transform: "translate(-40px,-40px)", offset: 0.82 },
      { transform: "translate(0,0) rotate(0deg) scale(1,1)" },
    ], { duration: 1900, easing: "ease-in-out" }),
  };

  function pokeFeedback(svg, el, e) {
    const snd = el.dataset.sound;
    if (snd) AudioKit.play(snd);
    try {
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
      sparkleAt(svg, pt.x, pt.y, 5, 46);
    } catch (err) { /* ohne Funkeln geht es auch */ }
  }

  function runPokeAction(el) {
    const inner = el.querySelector(":scope > .inner") || el;
    const action = el.dataset.action;
    if (action && POKE_ACTIONS[action]) {
      inner.style.transformBox = "fill-box";
      inner.style.transformOrigin = "center";
      POKE_ACTIONS[action](inner, el);
    } else {
      inner.classList.remove("wiggling");
      void inner.getBBox && inner.getBoundingClientRect();
      inner.classList.add("wiggling");
      setTimeout(() => inner.classList.remove("wiggling"), 600);
    }
    if (el._tapAction) el._tapAction();
  }

  function wirePokes(svg) {
    svg.querySelectorAll(".pokeable").forEach((el) => {
      if (el.dataset.free === "1") {
        wireFreePokeable(svg, el);
      } else {
        el.addEventListener("pointerdown", (e) => {
          pokeFeedback(svg, el, e);
          runPokeAction(el);
        });
      }
    });
  }

  /* ---------- Frei bewegliche Figuren ----------
     Kurzes Tippen löst die Aktion aus; Ziehen trägt die Figur über
     den Bildschirm. Wird sie bei einer anderen Figur abgesetzt,
     begrüßen sich die beiden – ganz ohne Aufgabe, nur zum Erkunden. */

  function wireFreePokeable(svg, el) {
    el.classList.add("grabbable");
    let base = parseTranslate(el.getAttribute("transform"));
    let startPt = null;
    let dragging = false;
    let dx = 0, dy = 0;

    const svgScale = () => {
      const r = svg.getBoundingClientRect();
      return Math.max(r.width / 1000, r.height / 700);
    };

    el.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      startPt = { x: e.clientX, y: e.clientY };
      dragging = false;
      dx = 0; dy = 0;
      /* Erst nach vorne holen, DANN den Finger einfangen – ein
         DOM-Umzug nach setPointerCapture bricht die Verfolgung ab. */
      el.parentNode.appendChild(el);
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
      pokeFeedback(svg, el, e);
      resetIdle();
    });

    el.addEventListener("pointermove", (e) => {
      if (!startPt) return;
      const s = svgScale();
      dx = (e.clientX - startPt.x) / s;
      dy = (e.clientY - startPt.y) / s;
      if (!dragging && Math.hypot(dx, dy) > 14) dragging = true;
      if (dragging) {
        el.setAttribute("transform", `translate(${base.x + dx},${base.y + dy}) scale(${base.s})`);
      }
    });

    const end = () => {
      if (!startPt) return;
      startPt = null;
      if (!dragging) {
        /* kurzes Tippen → große Aktion */
        runPokeAction(el);
        return;
      }
      /* abgesetzt: dort bleiben (im Bild halten) und Freunde treffen */
      base = {
        x: Math.min(980, Math.max(20, base.x + dx)),
        y: Math.min(690, Math.max(20, base.y + dy)),
        s: base.s,
      };
      el.setAttribute("transform", `translate(${base.x},${base.y}) scale(${base.s})`);
      meetFriend(svg, el);
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  const GREETINGS = ["Hallo, du!", "Hihi, das ist schön!", "Na, kleiner Freund?", "Ich hab dich lieb!"];

  function meetFriend(svg, el) {
    const a = el.getBoundingClientRect();
    const acx = a.left + a.width / 2, acy = a.top + a.height / 2;
    let best = null, bestDist = Infinity, bcx = 0, bcy = 0;
    svg.querySelectorAll(".pokeable, .grabbable").forEach((other) => {
      if (other === el || el.contains(other) || other.contains(el)) return;
      const b = other.getBoundingClientRect();
      if (a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom) return;
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const d = Math.hypot(acx - cx, acy - cy);
      if (d < bestDist) { bestDist = d; best = other; bcx = cx; bcy = cy; }
    });
    if (!best) {
      AudioKit.play("pop");
      return;
    }
    /* Die beiden begrüßen sich: Aktionen, Laute und Herzchen */
    runPokeAction(el);
    const partner = best;
    setTimeout(() => {
      const snd = partner.dataset.sound;
      if (snd) AudioKit.play(snd);
      runPokeAction(partner);
    }, 280);
    try {
      const mid = new DOMPoint((acx + bcx) / 2, Math.min(acy, bcy) - 20)
        .matrixTransform(svg.getScreenCTM().inverse());
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.innerHTML = heart(mid.x - 18, mid.y, 1) + heart(mid.x + 22, mid.y + 8, 0.7);
      svg.appendChild(g);
      sparkleAt(svg, mid.x, mid.y + 30, 6, 55);
      setTimeout(() => g.remove(), 1600);
    } catch (err) { /* Herzchen sind optional */ }
    if (el.id === "lia" || partner.id === "lia") {
      speak(GREETINGS[Math.floor(Math.random() * GREETINGS.length)], "kind");
    }
  }

  const SPARKLE_COLORS = ["#ffe95c", "#ffd23e", "#fff6c8", "#ffb3c8"];

  function sparkleAt(svg, x, y, n = 8, r = 70) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.8;
      const s = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      s.setAttribute("cx", x); s.setAttribute("cy", y);
      s.setAttribute("r", 3.5 + Math.random() * 3);
      s.setAttribute("fill", SPARKLE_COLORS[i % SPARKLE_COLORS.length]);
      svg.appendChild(s);
      s.animate(
        [{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px)`, opacity: 0 }],
        { duration: 650 + Math.random() * 300, easing: "ease-out", fill: "forwards" });
      setTimeout(() => s.remove(), 1000);
    }
  }

  /* ---------- Schnittstelle für die Szenen ---------- */

  function makeApi(svg, scene) {
    return {
      done: (t) => !!save.done[t],
      play: (name, arg) => AudioKit.play(name, arg),
      svgAppend(markup) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.innerHTML = markup;
        svg.appendChild(g);
        setTimeout(() => g.remove(), 2500);
      },
      sparkleBurst(x, y) { sparkleAt(svg, x, y, 8, 70); },
      drag: (srcSel, targetSel, radius, onSuccess) => makeDraggable(svg, srcSel, targetSel, radius, onSuccess),
      speak,
      complete(taskId) {
        if (save.done[taskId]) return;
        save.done[taskId] = true;
        persist();
        updateChrome();
        const info = TASK_INFO[taskId];
        showCard({ icon: info.icon, text: info.praise, taskId, praise: true });
      },
    };
  }

  /* ---------- Ziehen und Ablegen ---------- */

  function makeDraggable(svg, srcSel, targetSel, radius, onSuccess) {
    const el = svg.querySelector(srcSel);
    if (!el) return;
    el.classList.add("grabbable");

    const base = parseTranslate(el.getAttribute("transform"));
    let startPt = null;
    let dx = 0, dy = 0;

    function svgScale() {
      const r = svg.getBoundingClientRect();
      /* preserveAspectRatio slice: die größere Skalierung gilt */
      return Math.max(r.width / 1000, r.height / 700);
    }

    el.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      startPt = { x: e.clientX, y: e.clientY };
      dx = 0; dy = 0;
      el.classList.add("grabbing");
      el.parentNode.appendChild(el);
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
      AudioKit.play("pop");
      resetIdle();
    });

    el.addEventListener("pointermove", (e) => {
      if (!startPt) return;
      const s = svgScale();
      dx = (e.clientX - startPt.x) / s;
      dy = (e.clientY - startPt.y) / s;
      el.setAttribute("transform", `translate(${base.x + dx},${base.y + dy}) scale(${base.s})`);
    });

    function endDrag() {
      if (!startPt) return;
      startPt = null;
      el.classList.remove("grabbing");

      const target = svg.querySelector(targetSel);
      let hit = false;
      if (target) {
        const a = el.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        const acx = a.left + a.width / 2, acy = a.top + a.height / 2;
        const bcx = b.left + b.width / 2, bcy = b.top + b.height / 2;
        const dist = Math.hypot(acx - bcx, acy - bcy);
        hit = dist < radius * svgScale();
      }

      if (hit) {
        const ok = onSuccess(el);
        if (ok !== false) return;
      }
      /* sanft zurückgleiten */
      const fromX = base.x + dx, fromY = base.y + dy;
      const t0 = performance.now();
      const dur = 350;
      function back(t) {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        el.setAttribute("transform",
          `translate(${fromX + (base.x - fromX) * e},${fromY + (base.y - fromY) * e}) scale(${base.s})`);
        if (p < 1) requestAnimationFrame(back);
      }
      requestAnimationFrame(back);
    }

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
  }

  function parseTranslate(tr) {
    const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/.exec(tr || "");
    const sm = /scale\(\s*([-\d.]+)/.exec(tr || "");
    return { x: m ? +m[1] : 0, y: m ? +m[2] : 0, s: sm ? +sm[1] : 1 };
  }

  /* ---------- Wissens-Karte ---------- */

  function showCard({ icon, text, taskId = null, praise = false }) {
    stopHint();
    document.getElementById("factIcon").innerHTML = CardIcons[icon] || "";
    document.getElementById("factText").textContent = text;
    document.getElementById("factStars").innerHTML = starSvg(doneCount());
    cardOverlay.classList.add("show");
    if (praise) AudioKit.play("fanfare");
    setTimeout(() => speak(text), praise ? 700 : 400);

    document.getElementById("btnSpeak").onclick = () => speak(text);
    document.getElementById("btnCardOk").onclick = () => {
      cardOverlay.classList.remove("show");
      if (window.speechSynthesis) speechSynthesis.cancel();
      AudioKit.play("pop");
      if (praise) {
        /* Szene im Fertig-Zustand neu aufbauen (zeigt z. B. die Biene
           auf der Blume) und danach die nächste Aufgabe einladen */
        showScene(currentScene);
        if (taskId === "t7") celebrate();
      } else {
        resetIdle();
      }
    };
  }

  function starSvg(n) {
    let s = "";
    for (let i = 0; i < ALL_TASKS.length; i++) {
      const fill = i < n ? "#ffd23e" : "#e8e2d0";
      const stroke = i < n ? "#e8a62c" : "#c9c2ae";
      s += `<svg viewBox="-14 -14 28 28"><path d="M 0 -12 L 3.5 -3.5 L 12 -3 L 5.5 3 L 7.5 12 L 0 7 L -7.5 12 L -5.5 3 L -12 -3 L -3.5 -3.5 Z"
        fill="${fill}" stroke="${stroke}" stroke-width="1.5"/></svg>`;
    }
    return s;
  }

  /* ---------- Abschluss-Feier ---------- */

  function celebrate() {
    const svg = stage.querySelector("svg.scene");
    if (!svg) return;
    AudioKit.play("fanfare");
    const colors = ["#ffd23e", "#ff8fab", "#79c850", "#5eb3d8", "#b892e0", "#f5a340"];
    for (let i = 0; i < 26; i++) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const x = 40 + Math.random() * 920;
      g.setAttribute("transform", `translate(${x},-30) scale(${0.8 + Math.random() * 1.2})`);
      g.innerHTML = `<path d="M 0 -12 L 3.5 -3.5 L 12 -3 L 5.5 3 L 7.5 12 L 0 7 L -7.5 12 L -5.5 3 L -12 -3 L -3.5 -3.5 Z"
        fill="${colors[i % colors.length]}"/>`;
      g.classList.add("confettiStar");
      g.style.animationDelay = `${Math.random() * 1.4}s`;
      svg.appendChild(g);
      setTimeout(() => g.remove(), 4400);
    }
    setTimeout(() => {
      showCard({ icon: "rainbow", text: "Hurra! Du hast Lia’s ganzen Garten zum Leben erweckt!" });
    }, 2600);
  }

  /* ---------- Kopfleiste, Pfeile, Punkte ---------- */

  function updateChrome() {
    starRow.innerHTML = starSvg(doneCount());

    navLeft.classList.toggle("hidden", currentScene === 0);
    const lastIdx = nightUnlocked() ? SCENES.length - 1 : SCENES.length - 2;
    navRight.classList.toggle("hidden", currentScene >= lastIdx);

    dots.innerHTML = "";
    SCENES.forEach((sc, i) => {
      const d = document.createElement("div");
      d.className = "dot" + (i === currentScene ? " active" : "");
      if (sc.locked && !nightUnlocked()) d.classList.add("locked");
      dots.appendChild(d);
    });

    document.getElementById("muteIcon").innerHTML = AudioKit.isMuted()
      ? `<path d="M4 9v6h4l5 4V5L8 9H4z" fill="#8a8a8a"/><line x1="16" y1="9" x2="21" y2="15" stroke="#e05a5a" stroke-width="2.5" stroke-linecap="round"/><line x1="21" y1="9" x2="16" y2="15" stroke="#e05a5a" stroke-width="2.5" stroke-linecap="round"/>`
      : `<path d="M4 9v6h4l5 4V5L8 9H4z" fill="#6aab48"/><path d="M16 8 Q 19 12 16 16 M 18 5.5 Q 22.5 12 18 18.5" stroke="#6aab48" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

    document.getElementById("musicIcon").innerHTML = AudioKit.isMusicOn()
      ? `<path d="M9 18 V6 l9 -2 v12" fill="none" stroke="#6aab48" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.8" fill="#6aab48"/><circle cx="15.5" cy="16" r="2.8" fill="#6aab48"/>`
      : `<path d="M9 18 V6 l9 -2 v12" fill="none" stroke="#8a8a8a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.8" fill="#8a8a8a"/><circle cx="15.5" cy="16" r="2.8" fill="#8a8a8a"/><line x1="3" y1="3" x2="21" y2="21" stroke="#e05a5a" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  navLeft.addEventListener("click", () => {
    AudioKit.play("whoosh");
    if (currentScene > 0) showScene(currentScene - 1);
  });
  navRight.addEventListener("click", () => {
    AudioKit.play("whoosh");
    const lastIdx = nightUnlocked() ? SCENES.length - 1 : SCENES.length - 2;
    if (currentScene < lastIdx) showScene(currentScene + 1);
  });

  document.getElementById("btnMute").addEventListener("click", () => {
    AudioKit.setMuted(!AudioKit.isMuted());
    save.muted = AudioKit.isMuted();
    persist();
    AudioKit.play("pop");
    updateChrome();
  });

  document.getElementById("btnMusic").addEventListener("click", () => {
    AudioKit.setMusicOn(!AudioKit.isMusicOn());
    save.musicOff = !AudioKit.isMusicOn();
    persist();
    AudioKit.play("pop");
    updateChrome();
  });

  document.getElementById("btnHint").addEventListener("click", () => showHint());

  /* ---------- Bestätigungs-Dialog (Neustart, Ton-Prüfung) ---------- */

  const confirmOverlay = document.getElementById("confirmOverlay");

  const RESET_ICON = `<svg viewBox="0 0 24 24">
    <path d="M 19 12 a 7 7 0 1 1 -2.5 -5.4" fill="none" stroke="#e8955e" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M 17 2.5 L 17.2 7.2 L 12.5 6.6 Z" fill="#e8955e"/>
  </svg>`;
  const NOTE_ICON = `<svg viewBox="0 0 24 24">
    <path d="M9 18 V6 l9 -2 v12" fill="none" stroke="#6aab48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="6.5" cy="18" r="2.6" fill="#6aab48"/><circle cx="15.5" cy="16" r="2.6" fill="#6aab48"/>
  </svg>`;

  function showConfirm(text, iconHtml, onYes, onNo) {
    document.getElementById("confirmText").textContent = text;
    document.getElementById("confirmIcon").innerHTML = iconHtml;
    confirmOverlay.classList.add("show");
    document.getElementById("btnResetYes").onclick = () => {
      confirmOverlay.classList.remove("show");
      AudioKit.play("pop");
      if (onYes) onYes();
    };
    document.getElementById("btnResetNo").onclick = () => {
      confirmOverlay.classList.remove("show");
      AudioKit.play("pop");
      if (onNo) onNo();
    };
  }

  /* ---------- Einstellungen ----------
     Hier lässt sich der Klangweg der Tierstimmen jederzeit umschalten
     (mit sofortigem Miau als Hörprobe), und hier wohnt der Neustart. */

  const settingsOverlay = document.getElementById("settingsOverlay");

  function updateSettingsUI() {
    const mode = AudioKit.getSoundMode();
    settingsOverlay.querySelectorAll(".soundOpt").forEach((b) => {
      b.classList.toggle("selected", b.dataset.mode === mode);
    });
  }

  document.getElementById("btnSettings").addEventListener("click", () => {
    AudioKit.play("pop");
    updateSettingsUI();
    settingsOverlay.classList.add("show");
  });

  settingsOverlay.querySelectorAll(".soundOpt").forEach((b) => {
    b.addEventListener("click", () => {
      AudioKit.setSoundMode(b.dataset.mode);
      save.soundMode = b.dataset.mode;
      persist();
      updateSettingsUI();
      /* sofortige Hörprobe auf dem neuen Weg */
      setTimeout(() => AudioKit.play("meow"), 250);
    });
  });

  document.getElementById("btnSettingsClose").addEventListener("click", () => {
    settingsOverlay.classList.remove("show");
    AudioKit.play("pop");
    resetIdle();
  });

  document.getElementById("btnSettingsReset").addEventListener("click", () => {
    settingsOverlay.classList.remove("show");
    AudioKit.play("pop");
    speak("Möchtest du noch einmal von vorne anfangen?");
    showConfirm("Noch einmal von vorne anfangen?", RESET_ICON, () => {
      save.done = {};
      Object.keys(promptShown).forEach((k) => delete promptShown[k]);
      persist();
      AudioKit.play("success");
      speak("Los geht's!");
      showScene(0);
    }, resetIdle);
  });

  /* ---------- Glühwürmchen-Hilfe ---------- */

  function nextHintTarget() {
    /* 1. offene Aufgabe in der aktuellen Szene */
    const svg = stage.querySelector("svg.scene");
    const task = currentTaskOf(SCENES[currentScene]);
    if (task && svg) {
      const src = svg.querySelector(task.source);
      const tgt = svg.querySelector(task.target);
      if (src) return { el: src, tgt };
    }
    /* 2. sonst: Pfeil zur nächsten Szene mit offener Aufgabe */
    for (let i = 0; i < SCENES.length; i++) {
      if (i === currentScene) continue;
      if (SCENES[i].locked && !nightUnlocked()) continue;
      if (SCENES[i].tasks.some((t) => !save.done[t.id])) {
        return { el: i > currentScene ? navRight : navLeft, tgt: null };
      }
    }
    return null;
  }

  function showHint() {
    if (!started || hintBusy || cardOverlay.classList.contains("show")) return;
    const hint = nextHintTarget();
    if (!hint) return;
    hintBusy = true;

    const r = hint.el.getBoundingClientRect();
    const x = r.left + r.width / 2 - 37;
    const y = r.top + r.height / 2 - 37 - Math.min(60, r.height / 2 + 20);

    helperFly.style.left = `${window.innerWidth / 2 - 37}px`;
    helperFly.style.top = `-90px`;
    helperFly.classList.add("visible");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      helperFly.style.left = `${x}px`;
      helperFly.style.top = `${Math.max(8, y)}px`;
    }));
    AudioKit.play("twinkle");

    const sparkles = [hint.el, hint.tgt].filter(Boolean);
    sparkles.forEach((el) => el.classList.add("sparkleTarget"));

    setTimeout(() => AudioKit.play("twinkle"), 1700);
    setTimeout(() => {
      helperFly.classList.remove("visible");
      sparkles.forEach((el) => el.classList.remove("sparkleTarget"));
      hintBusy = false;
    }, 5200);
  }

  function stopHint() {
    helperFly.classList.remove("visible");
    document.querySelectorAll(".sparkleTarget").forEach((el) => el.classList.remove("sparkleTarget"));
    hintBusy = false;
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    if (!started) return;
    idleTimer = setTimeout(() => {
      showHint();
      resetIdle();
    }, 16000);
  }

  /* Ton bei jeder Gelegenheit aufwecken. Wichtig: iPhone und iPad
     schalten Audio erst bei einem VOLLSTÄNDIGEN Tipp frei (click/
     touchend) – Finger-runter (pointerdown) reicht dort nicht. */
  window.addEventListener("pointerdown", () => {
    AudioKit.resume();
    resetIdle();
  }, true);
  ["pointerup", "touchend", "click"].forEach((t) =>
    window.addEventListener(t, () => AudioKit.resume(), true));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) AudioKit.resume();
  });

  /* ---------- Startbildschirm ---------- */

  function buildStart() {
    const ov = document.getElementById("startOverlay");
    ov.innerHTML = `
    <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="sSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8ed4f7"/><stop offset="1" stop-color="#eaf9ff"/>
        </linearGradient>
      </defs>
      <rect width="1000" height="700" fill="url(#sSky)"/>
      ${sun(140, 120)}
      ${cloud(700, 90, 1)}
      ${cloud(420, 150, 0.6)}
      <path d="M 0 460 Q 300 390 620 455 Q 850 500 1000 445 L 1000 700 L 0 700 Z" fill="#a8de7c"/>
      <path d="M 0 560 Q 400 510 1000 565 L 1000 700 L 0 700 Z" fill="#8ccb60"/>
      ${wrap(180, 560, 1, `class="pokeable"`, flower("#ff8fab"), "swaying")}
      ${wrap(840, 545, 0.9, `class="pokeable"`, flower("#b892e0", "#fff3b0"), "swaying")}
      ${wrap(280, 600, 0.7, ``, tulip("#f5a340", 1.3))}
      ${wrap(760, 620, 0.7, ``, tulip("#e84c3d", 1.3))}
      ${butterfly(290, 300, 1, "#b892e0")}
      ${butterfly(730, 260, 0.8, "#f5a340")}
      ${wrap(880, 640, 0.9, ``, snail(1))}

      <text x="500" y="200" text-anchor="middle" font-size="95" font-weight="bold"
        fill="#4a7c2f" stroke="#fff" stroke-width="10" paint-order="stroke"
        style="font-family:inherit">Lia’s Garten</text>
      <text x="500" y="265" text-anchor="middle" font-size="30" fill="#5a7a3f"
        stroke="#fff" stroke-width="6" paint-order="stroke"
        style="font-family:inherit">Tippe auf die Sonnenblume!</text>

      <g id="playBtn" transform="translate(500,480)" style="cursor:pointer">
        <g class="inner floaty">
          <circle r="105" fill="#fff" opacity="0.55"/>
          <g transform="translate(0,-30)">
            <path d="M 0 30 Q -4 90 0 130" stroke="#5f9e45" stroke-width="10" fill="none" stroke-linecap="round"/>
            <path d="M 0 80 Q -34 74 -40 50 Q -12 56 0 74 Z" fill="#74b95a"/>
            <path d="M 2 104 Q 36 98 44 72 Q 14 78 2 96 Z" fill="#74b95a"/>
            ${(() => { let p = ""; for (let i = 0; i < 12; i++) p += `<ellipse rx="15" ry="34" fill="#ffd23e" transform="rotate(${i * 30}) translate(0,-38)"/>`; return p; })()}
            <circle r="30" fill="#96683c"/>
            <circle cx="-8" cy="-6" r="3.4" fill="#3a2c20"/><circle cx="8" cy="-6" r="3.4" fill="#3a2c20"/>
            <circle cx="-7" cy="-7" r="1.2" fill="#fff"/><circle cx="9" cy="-7" r="1.2" fill="#fff"/>
            <path d="M -8 4 Q 0 11 8 4" stroke="#3a2c20" stroke-width="2.6" fill="none" stroke-linecap="round"/>
            <circle cx="-15" cy="1" r="4" fill="#ff9d9d" opacity="0.55"/>
            <circle cx="15" cy="1" r="4" fill="#ff9d9d" opacity="0.55"/>
          </g>
        </g>
      </g>
    </svg>`;

    /* "click" statt "pointerdown": Nur ein vollständiger Tipp zählt auf
       iPhone/iPad als Freischalt-Geste für Ton und Sprachausgabe. */
    let startDone = false;
    const startGame = () => {
      if (startDone) return;
      startDone = true;
      AudioKit.init();
      AudioKit.setMuted(save.muted === true);
      AudioKit.setMusicOn(save.musicOff !== true);
      AudioKit.play("hello");
      /* Sprachausgabe innerhalb der echten Nutzer-Geste entsperren,
         damit die späteren automatischen Vorlese-Aufrufe funktionieren. */
      if (window.speechSynthesis) {
        try {
          const primer = new SpeechSynthesisUtterance(" ");
          primer.volume = 0;
          primer.lang = "de-DE";
          speechSynthesis.speak(primer);
        } catch (e) { /* nicht schlimm */ }
      }
      /* gespeicherte Klangweg-Wahl anwenden */
      if (save.soundMode === "element") AudioKit.setSoundMode("element");
      if (save.soundMode === "speak") AudioKit.setSoundMode("speak");
      started = true;
      ov.style.transition = "opacity 0.7s ease";
      ov.style.opacity = "0";
      setTimeout(() => { ov.remove(); }, 700);
      topbar.style.display = "";
      showScene(0);
    };
    const btn = ov.querySelector("#playBtn");
    btn.addEventListener("click", startGame);
    btn.addEventListener("touchend", startGame);
  }

  /* ---------- Los geht's ---------- */

  topbar.style.display = "none";
  buildStart();
  updateChrome();
})();
