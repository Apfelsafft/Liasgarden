/* ================================================================
   Lias Garten – Spiel-Engine
   Szenenwechsel, Ziehen & Ablegen, Glühwürmchen-Hilfe,
   Wissens-Karten, Sterne-Fortschritt und Speichern.
   ================================================================ */

(() => {
  const SAVE_KEY = "liasGartenSave";

  /* ---------- Spielstand ---------- */

  let save = { done: {}, muted: false };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) save = Object.assign(save, JSON.parse(raw));
  } catch (e) { /* Speicher nicht verfügbar – Spiel läuft trotzdem */ }

  if (location.search.includes("reset")) {
    save = { done: {}, muted: false };
    persist();
  }

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

  /* ---------- Sprachausgabe ---------- */

  function speak(text) {
    if (AudioKit.isMuted() || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.86;
    u.pitch = 1.15;
    const voice = speechSynthesis.getVoices().find((v) => v.lang.startsWith("de"));
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }
  if (window.speechSynthesis) speechSynthesis.getVoices();

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
  }

  function wirePokes(svg) {
    svg.querySelectorAll(".pokeable").forEach((el) => {
      el.addEventListener("pointerdown", () => {
        const inner = el.querySelector(":scope > .inner") || el;
        inner.classList.remove("wiggling");
        void inner.getBBox && inner.getBoundingClientRect();
        inner.classList.add("wiggling");
        setTimeout(() => inner.classList.remove("wiggling"), 600);
        const snd = el.dataset.sound;
        if (snd) AudioKit.play(snd);
      });
    });
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
      sparkleBurst(x, y) {
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const s = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          s.setAttribute("cx", x); s.setAttribute("cy", y);
          s.setAttribute("r", 5); s.setAttribute("fill", "#ffe95c");
          svg.appendChild(s);
          s.animate(
            [{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * 70}px,${Math.sin(a) * 70}px)`, opacity: 0 }],
            { duration: 800, easing: "ease-out", fill: "forwards" });
          setTimeout(() => s.remove(), 900);
        }
      },
      drag: (srcSel, targetSel, radius, onSuccess) => makeDraggable(svg, srcSel, targetSel, radius, onSuccess),
      complete(taskId, fact) {
        if (save.done[taskId]) return;
        save.done[taskId] = true;
        persist();
        updateChrome();
        showCard(fact, taskId);
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

  function showCard(fact, taskId) {
    stopHint();
    document.getElementById("factIcon").innerHTML = CardIcons[fact.icon] || "";
    document.getElementById("factText").textContent = fact.text;
    const n = doneCount();
    document.getElementById("factStars").innerHTML = starSvg(n);
    cardOverlay.classList.add("show");
    AudioKit.play("fanfare");
    setTimeout(() => speak(fact.text), 700);

    document.getElementById("btnSpeak").onclick = () => speak(fact.text);
    document.getElementById("btnCardOk").onclick = () => {
      cardOverlay.classList.remove("show");
      if (window.speechSynthesis) speechSynthesis.cancel();
      AudioKit.play("pop");
      /* Szene im Fertig-Zustand neu aufbauen (zeigt z. B. die Biene
         auf der Blume oder das Küken bei seiner Mama) */
      showScene(currentScene);
      if (taskId === "t7") celebrate();
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
      showCard({ icon: "rainbow", text: "Hurra! Du hast Lias ganzen Garten zum Leben erweckt!" }, "final");
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
    AudioKit.play("pop");
    updateChrome();
  });

  document.getElementById("btnHint").addEventListener("click", () => showHint());

  /* ---------- Glühwürmchen-Hilfe ---------- */

  function nextHintTarget() {
    /* 1. offene Aufgabe in der aktuellen Szene */
    const svg = stage.querySelector("svg.scene");
    const scene = SCENES[currentScene];
    for (const t of scene.tasks) {
      if (!save.done[t.id]) {
        /* Aufgaben der Reihe nach: t2 erst zeigen, wenn t1 fertig ist */
        if (scene.id === "garden" && t.id === "t2" && !save.done.t1) continue;
        const src = svg && svg.querySelector(t.source);
        const tgt = svg && svg.querySelector(t.target);
        if (src) return { el: src, tgt };
      }
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

  window.addEventListener("pointerdown", resetIdle, true);

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
        style="font-family:inherit">Lias Garten</text>
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

    ov.querySelector("#playBtn").addEventListener("pointerdown", () => {
      AudioKit.init();
      AudioKit.setMuted(save.muted === true);
      AudioKit.play("hello");
      started = true;
      ov.style.transition = "opacity 0.7s ease";
      ov.style.opacity = "0";
      setTimeout(() => { ov.remove(); }, 700);
      topbar.style.display = "";
      showScene(0);
    });
  }

  /* ---------- Los geht's ---------- */

  topbar.style.display = "none";
  buildStart();
  updateChrome();
})();
