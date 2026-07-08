/* ================================================================
   Lias Garten – Szenen und Zeichnungen
   Alle Bilder sind handgebaute SVG-Grafiken im weichen Comicstil.
   Konvention: Jede Figur ist ein äußeres <g> (Position per
   transform-Attribut) mit einem inneren <g class="inner"> für
   CSS-Animationen, damit sich beides nicht in die Quere kommt.
   ================================================================ */

/* ---------- kleine Bausteine ---------- */

function wrap(x, y, s, attrs, inner, innerCls = "") {
  return `<g transform="translate(${x},${y}) scale(${s})" ${attrs}><g class="inner ${innerCls}">${inner}</g></g>`;
}

/* Unsichtbare, großzügige Tippfläche für kleine Finger. */
function hit(r = 44, x = 0, y = 0) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="transparent"/>`;
}

function face(s = 1, mood = "happy") {
  const mouth = mood === "happy"
    ? `<path d="M -6 6 Q 0 12 6 6" fill="none" stroke="#3a2c20" stroke-width="2.2" stroke-linecap="round"/>`
    : mood === "oh"
      ? `<ellipse cx="0" cy="8" rx="3" ry="4" fill="#3a2c20"/>`
      : `<path d="M -6 9 Q 0 5 6 9" fill="none" stroke="#3a2c20" stroke-width="2.2" stroke-linecap="round"/>`;
  return `<g transform="scale(${s})">
    <circle cx="-9" cy="0" r="3" fill="#3a2c20"/><circle cx="-8" cy="-1" r="1" fill="#fff"/>
    <circle cx="9" cy="0" r="3" fill="#3a2c20"/><circle cx="10" cy="-1" r="1" fill="#fff"/>
    ${mouth}
    <circle cx="-15" cy="6" r="3.4" fill="#ff9d9d" opacity="0.5"/>
    <circle cx="15" cy="6" r="3.4" fill="#ff9d9d" opacity="0.5"/>
  </g>`;
}

function sleepyFace(s = 1) {
  return `<g transform="scale(${s})">
    <path d="M -12 0 Q -9 3 -6 0" fill="none" stroke="#3a2c20" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M 6 0 Q 9 3 12 0" fill="none" stroke="#3a2c20" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M -5 8 Q 0 11 5 8" fill="none" stroke="#3a2c20" stroke-width="2" stroke-linecap="round"/>
  </g>`;
}

function sun(x, y) {
  let rays = "";
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 * Math.PI) / 180;
    rays += `<line x1="${Math.cos(a) * 62}" y1="${Math.sin(a) * 62}" x2="${Math.cos(a) * 86}" y2="${Math.sin(a) * 86}"
      stroke="#ffd23e" stroke-width="11" stroke-linecap="round"/>`;
  }
  return wrap(x, y, 1, `class="pokeable" data-sound="chime"`, `
    ${rays}
    <circle r="55" fill="#ffdf5e" stroke="#f5b73e" stroke-width="5"/>
    ${face(1.5)}
  `);
}

function cloud(x, y, s) {
  return wrap(x, y, s, `class="pokeable" data-sound="whoosh"`, `
    <ellipse cx="0" cy="0" rx="58" ry="30" fill="#ffffff"/>
    <ellipse cx="-38" cy="10" rx="34" ry="20" fill="#ffffff"/>
    <ellipse cx="40" cy="9" rx="36" ry="22" fill="#ffffff"/>
    <ellipse cx="0" cy="14" rx="60" ry="18" fill="#f2fbff"/>
  `, "drifting");
}

function flower(color, center = "#ffd23e", s = 1, withFace = true) {
  let petals = "";
  for (let i = 0; i < 7; i++) {
    petals += `<ellipse rx="14" ry="27" fill="${color}" transform="rotate(${i * (360 / 7)}) translate(0,-27)"/>`;
  }
  return `<g transform="scale(${s})">
    <path d="M 0 0 Q -6 60 0 108" fill="none" stroke="#5f9e45" stroke-width="8" stroke-linecap="round"/>
    <path d="M 0 60 Q -30 52 -36 30 Q -10 34 0 52 Z" fill="#74b95a"/>
    <path d="M 2 80 Q 30 74 38 52 Q 12 56 2 74 Z" fill="#74b95a"/>
    <g>${petals}<circle r="21" fill="${center}" stroke="#e8a62c" stroke-width="3"/>
    ${withFace ? face(0.85) : ""}</g>
  </g>`;
}

function tulip(color, s = 1) {
  return `<g transform="scale(${s})">
    <path d="M 0 0 Q 4 40 0 76" fill="none" stroke="#5f9e45" stroke-width="7" stroke-linecap="round"/>
    <path d="M 0 42 Q -24 38 -28 20 Q -8 24 0 38 Z" fill="#74b95a"/>
    <path d="M -20 -18 Q -20 8 0 10 Q 20 8 20 -18 Q 12 -8 6 -20 Q 0 -6 -6 -20 Q -12 -8 -20 -18 Z" fill="${color}"/>
  </g>`;
}

function grassTuft(x, y, s = 1, col = "#7cbf55") {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M 0 0 Q -8 -22 -14 -30 M 0 0 Q 0 -26 2 -34 M 0 0 Q 8 -20 15 -28"
      fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>
  </g>`;
}

function butterfly(x, y, s, color, cls = "") {
  return wrap(x, y, s, `class="pokeable ${cls}" data-sound="pop"`, `
    <g class="flapping">
      <ellipse cx="-16" cy="-8" rx="16" ry="13" fill="${color}"/>
      <ellipse cx="-14" cy="8" rx="12" ry="10" fill="${color}" opacity="0.8"/>
      <ellipse cx="16" cy="-8" rx="16" ry="13" fill="${color}"/>
      <ellipse cx="14" cy="8" rx="12" ry="10" fill="${color}" opacity="0.8"/>
      <circle cx="-16" cy="-8" r="4" fill="#fff" opacity="0.7"/>
      <circle cx="16" cy="-8" r="4" fill="#fff" opacity="0.7"/>
    </g>
    <ellipse rx="4.5" ry="14" fill="#5b4632"/>
    <circle cy="-14" r="6" fill="#5b4632"/>
    <path d="M -3 -18 Q -7 -26 -10 -28 M 3 -18 Q 7 -26 10 -28" stroke="#5b4632" stroke-width="2" fill="none" stroke-linecap="round"/>
  `, "floaty");
}

function bee(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(44, 0, -4)}
    <g class="flapping" style="animation-duration:0.15s">
      <ellipse cx="-8" cy="-20" rx="13" ry="9" fill="#dff3ff" opacity="0.9"/>
      <ellipse cx="10" cy="-20" rx="13" ry="9" fill="#dff3ff" opacity="0.9"/>
    </g>
    <ellipse rx="24" ry="18" fill="#ffd23e" stroke="#e8a62c" stroke-width="2.5"/>
    <path d="M -8 -17 Q -12 0 -8 17 M 4 -18 Q 0 0 4 18 M 15 -13 Q 12 0 15 13"
      stroke="#4a3826" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="21" cy="-4" r="12" fill="#ffdf5e" stroke="#e8a62c" stroke-width="2"/>
    <circle cx="19" cy="-6" r="2.2" fill="#3a2c20"/>
    <circle cx="27" cy="-6" r="2.2" fill="#3a2c20"/>
    <path d="M 20 0 Q 23 3 26 0" stroke="#3a2c20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M -24 2 L -31 -2 M -24 6 L -31 8" stroke="#4a3826" stroke-width="2" stroke-linecap="round"/>
  </g>`;
}

function ladybug(s = 1) {
  return `<g transform="scale(${s})">
    <circle cx="14" cy="-3" r="8" fill="#4a3826"/>
    <ellipse rx="17" ry="13" fill="#e84c3d" stroke="#b93425" stroke-width="2"/>
    <line x1="2" y1="-13" x2="2" y2="13" stroke="#4a3826" stroke-width="2.5"/>
    <circle cx="-7" cy="-5" r="3" fill="#4a3826"/>
    <circle cx="-4" cy="6" r="3" fill="#4a3826"/>
    <circle cx="8" cy="-7" r="2.6" fill="#4a3826"/>
    <circle cx="9" cy="6" r="2.6" fill="#4a3826"/>
    <circle cx="16" cy="-6" r="1.6" fill="#fff"/>
  </g>`;
}

function snail(s = 1) {
  return `<g transform="scale(${s})">
    <path d="M -28 12 Q -34 0 -26 -6 Q -20 -10 -16 -4 L -14 12 Q 10 18 34 12 Q 38 8 34 4 Q 20 8 0 4 Z" fill="#e8b04b"/>
    <circle cx="6" cy="-8" r="20" fill="#c77f3f" stroke="#a5652c" stroke-width="3"/>
    <path d="M 6 -8 m 0 -13 a 13 13 0 1 1 -13 13 a 9 9 0 1 0 9 -9 a 5 5 0 1 0 -5 5" fill="none" stroke="#a5652c" stroke-width="3" stroke-linecap="round"/>
    <path d="M -26 -6 Q -28 -18 -32 -22 M -22 -6 Q -20 -18 -17 -22" stroke="#e8b04b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="-32" cy="-23" r="3.5" fill="#e8b04b"/><circle cx="-16" cy="-23" r="3.5" fill="#e8b04b"/>
    <circle cx="-27" cy="-3" r="2" fill="#3a2c20"/>
    <path d="M -28 3 Q -25 5 -22 3" stroke="#3a2c20" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>`;
}

function lia(s = 1) {
  return `<g transform="scale(${s})">
    <ellipse cx="0" cy="118" rx="34" ry="8" fill="#000" opacity="0.1"/>
    <path d="M -16 70 L -13 112 L -5 112 L -6 74 M 16 70 L 13 112 L 5 112 L 6 74" fill="#e8a87c"/>
    <ellipse cx="-9" cy="114" rx="9" ry="5" fill="#e0634e"/>
    <ellipse cx="9" cy="114" rx="9" ry="5" fill="#e0634e"/>
    <path d="M -24 28 Q -30 60 -20 76 L 20 76 Q 30 60 24 28 Z" fill="#ff8fab"/>
    <path d="M -24 34 L -38 58 L -30 62 L -18 44 M 24 34 L 38 58 L 30 62 L 18 44" fill="#e8a87c" class="liaArm"/>
    <circle cx="-38" cy="61" r="6" fill="#e8a87c"/><circle cx="38" cy="61" r="6" fill="#e8a87c"/>
    <circle cx="0" cy="0" r="30" fill="#f2c09a"/>
    <path d="M -30 -4 Q -32 -32 0 -32 Q 32 -32 30 -4 Q 22 -14 14 -22 Q 4 -12 -8 -22 Q -18 -12 -30 -4 Z" fill="#8a5a35"/>
    <path d="M -30 -2 Q -36 18 -30 30 Q -24 16 -28 -2 M 30 -2 Q 36 18 30 30 Q 24 16 28 -2" fill="#8a5a35"/>
    <ellipse cx="0" cy="-26" rx="36" ry="10" fill="#ffd23e" stroke="#e8a62c" stroke-width="2.5"/>
    <path d="M -22 -28 Q -22 -48 0 -48 Q 22 -48 22 -28 Z" fill="#ffdf5e" stroke="#e8a62c" stroke-width="2.5"/>
    <circle cx="14" cy="-30" r="5" fill="#ff8fab"/>
    ${face(1, "happy")}
  </g>`;
}

function frog(s = 1) {
  return `<g transform="scale(${s})">
    <ellipse cx="0" cy="14" rx="34" ry="26" fill="#79c850" stroke="#569436" stroke-width="3"/>
    <ellipse cx="0" cy="22" rx="22" ry="14" fill="#c8ecae"/>
    <circle class="frogThroat" cx="0" cy="26" r="0" fill="#e3f7d2" opacity="0.9"/>
    <path d="M -30 34 Q -40 40 -34 44 L -18 40 M 30 34 Q 40 40 34 44 L 18 40" fill="#79c850" stroke="#569436" stroke-width="2.5"/>
    <circle cx="-16" cy="-10" r="13" fill="#79c850" stroke="#569436" stroke-width="3"/>
    <circle cx="16" cy="-10" r="13" fill="#79c850" stroke="#569436" stroke-width="3"/>
    <circle cx="-16" cy="-11" r="7" fill="#fff"/><circle cx="16" cy="-11" r="7" fill="#fff"/>
    <circle class="frogEyeL" cx="-15" cy="-10" r="3.6" fill="#3a2c20"/>
    <circle class="frogEyeR" cx="17" cy="-10" r="3.6" fill="#3a2c20"/>
    <path class="frogMouth" d="M -12 8 Q 0 16 12 8" fill="none" stroke="#3f6d2a" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="-24" cy="10" r="4" fill="#ff9d9d" opacity="0.5"/>
    <circle cx="24" cy="10" r="4" fill="#ff9d9d" opacity="0.5"/>
  </g>`;
}

function duck(s = 1, col = "#fff", beak = "#f5a340") {
  return `<g transform="scale(${s})">
    ${hit(50, 0, -6)}
    <path d="M -34 0 Q -44 -18 -30 -20 Q -20 -22 -16 -10 L -12 2 Q 10 14 34 2 Q 44 -4 38 -14 L 30 -8 Q 10 4 -6 -4 Z"
      fill="${col}" stroke="#d8c9a3" stroke-width="0" opacity="0"/>
    <ellipse cx="4" cy="4" rx="30" ry="20" fill="${col}" stroke="#e3d5b0" stroke-width="2.5"/>
    <path d="M 22 0 Q 38 -6 34 6 Q 28 12 18 8 Z" fill="${col}" stroke="#e3d5b0" stroke-width="2"/>
    <circle cx="-18" cy="-18" r="14" fill="${col}" stroke="#e3d5b0" stroke-width="2.5"/>
    <path d="M -30 -16 Q -42 -14 -40 -10 Q -36 -6 -28 -10 Z" fill="${beak}" stroke="#d8862c" stroke-width="1.5"/>
    <circle cx="-20" cy="-21" r="2.8" fill="#3a2c20"/>
    <circle cx="-19" cy="-22" r="1" fill="#fff"/>
    <circle cx="-13" cy="-14" r="3" fill="#ff9d9d" opacity="0.5"/>
  </g>`;
}

function fish(s = 1, col = "#f5a340") {
  return `<g transform="scale(${s})">
    <ellipse rx="22" ry="13" fill="${col}" stroke="#d8862c" stroke-width="2.5"/>
    <path d="M 18 0 L 34 -12 L 32 0 L 34 12 Z" fill="${col}" stroke="#d8862c" stroke-width="2"/>
    <path d="M -2 -12 Q 4 -22 10 -14 Z" fill="${col}" stroke="#d8862c" stroke-width="2"/>
    <circle cx="-11" cy="-3" r="2.8" fill="#3a2c20"/><circle cx="-10" cy="-4" r="1" fill="#fff"/>
    <path d="M -14 4 Q -11 7 -8 4" stroke="#3a2c20" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>`;
}

function dragonfly(s = 1) {
  return `<g transform="scale(${s})">
    <g class="flapping" style="animation-duration:0.12s">
      <ellipse cx="-14" cy="-10" rx="20" ry="7" fill="#bfe8f7" opacity="0.85" transform="rotate(-18)"/>
      <ellipse cx="14" cy="-10" rx="20" ry="7" fill="#bfe8f7" opacity="0.85" transform="rotate(18)"/>
    </g>
    <ellipse cx="10" cy="2" rx="20" ry="5" fill="#5eb3d8"/>
    <circle cx="-12" cy="0" r="8" fill="#3f92ba"/>
    <circle cx="-15" cy="-3" r="2.4" fill="#3a2c20"/><circle cx="-9" cy="-3" r="2.4" fill="#3a2c20"/>
    <path d="M -15 3 Q -12 5 -9 3" stroke="#1e4c63" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>`;
}

function cattail(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><g class="inner swaying">
    <path d="M 0 0 L 0 -110" stroke="#5f9e45" stroke-width="6" stroke-linecap="round"/>
    <path d="M 8 -14 Q 26 -50 20 -90" stroke="#74b95a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-108" rx="10" ry="26" fill="#8a5a35"/>
    <path d="M 0 -134 L 0 -148" stroke="#5f9e45" stroke-width="4" stroke-linecap="round"/>
  </g></g>`;
}

function lilypad(x, y, s = 1, withFlower = false) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M 0 0 m -44 0 a 44 20 0 1 0 88 0 L 12 -4 Z" fill="#5faf51" stroke="#4a8f3e" stroke-width="2.5"/>
    ${withFlower ? `<g transform="translate(-20,-12)">
      <ellipse rx="8" ry="14" fill="#ffb3c8" transform="rotate(0)"/>
      <ellipse rx="8" ry="14" fill="#ffb3c8" transform="rotate(72)"/>
      <ellipse rx="8" ry="14" fill="#ffb3c8" transform="rotate(144)"/>
      <ellipse rx="8" ry="14" fill="#ffb3c8" transform="rotate(216)"/>
      <ellipse rx="8" ry="14" fill="#ffb3c8" transform="rotate(288)"/>
      <circle r="7" fill="#ffd23e"/></g>` : ""}
  </g>`;
}

function flySwarm(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(48, 0, -6)}
    <g class="floaty">
      <path d="M -20 -10 Q 0 -24 20 -8 Q 4 -2 -20 -10" fill="none" stroke="#9aa7b0" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.7"/>
      <g transform="translate(-18,-6)">${miniFly()}</g>
      <g transform="translate(14,-16)">${miniFly()}</g>
      <g transform="translate(4,6)">${miniFly()}</g>
    </g>
  </g>`;
}

function miniFly() {
  return `<g>
    <g class="flapping" style="animation-duration:0.1s">
      <ellipse cx="-5" cy="-6" rx="6" ry="4" fill="#cfe4ef" opacity="0.9"/>
      <ellipse cx="5" cy="-6" rx="6" ry="4" fill="#cfe4ef" opacity="0.9"/>
    </g>
    <ellipse rx="7" ry="6" fill="#5b6770"/>
    <circle cx="-2.5" cy="-1.5" r="1.6" fill="#fff"/><circle cx="2.5" cy="-1.5" r="1.6" fill="#fff"/>
    <circle cx="-2.5" cy="-1.5" r="0.8" fill="#3a2c20"/><circle cx="2.5" cy="-1.5" r="0.8" fill="#3a2c20"/>
  </g>`;
}

function appleTree(s = 1) {
  return `<g transform="scale(${s})">
    <path d="M -22 190 Q -30 120 -14 60 L 14 60 Q 30 120 22 190 Q 0 198 -22 190 Z" fill="#96683c" stroke="#7a5230" stroke-width="4"/>
    <path d="M -10 120 Q -50 100 -66 74 L -54 66 Q -26 92 -8 104 M 10 130 Q 46 116 60 92 L 50 84 Q 26 106 8 116"
      fill="#96683c" stroke="#7a5230" stroke-width="3"/>
    <g class="canopy">
      <circle cx="-70" cy="30" r="62" fill="#74b95a"/>
      <circle cx="70" cy="30" r="62" fill="#74b95a"/>
      <circle cx="0" cy="-30" r="76" fill="#82c467"/>
      <circle cx="-40" cy="-8" r="58" fill="#8ccb60"/>
      <circle cx="44" cy="-6" r="56" fill="#8ccb60"/>
      <circle cx="0" cy="14" r="60" fill="#97d46e"/>
      <g class="treeApple"><circle cx="-58" cy="-16" r="13" fill="#e84c3d"/><path d="M -58 -28 Q -56 -34 -52 -36" stroke="#7a5230" stroke-width="2.5" fill="none"/></g>
      <g class="treeApple"><circle cx="30" cy="-48" r="13" fill="#e84c3d"/><path d="M 30 -60 Q 32 -66 36 -68" stroke="#7a5230" stroke-width="2.5" fill="none"/></g>
      <g class="treeApple"><circle cx="62" cy="18" r="13" fill="#e84c3d"/><path d="M 62 6 Q 64 0 68 -2" stroke="#7a5230" stroke-width="2.5" fill="none"/></g>
      <g class="treeApple"><circle cx="-20" cy="34" r="13" fill="#e84c3d"/><path d="M -20 22 Q -18 16 -14 14" stroke="#7a5230" stroke-width="2.5" fill="none"/></g>
    </g>
  </g>`;
}

function apple(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(36, 0, -4)}
    <circle r="17" fill="#e84c3d" stroke="#b93425" stroke-width="2.5"/>
    <path d="M 0 -15 Q 1 -23 6 -26" stroke="#7a5230" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M 4 -22 Q 14 -28 18 -20 Q 10 -16 4 -22 Z" fill="#74b95a"/>
    <ellipse cx="-6" cy="-6" rx="4" ry="6" fill="#fff" opacity="0.35"/>
  </g>`;
}

function hedgehog(s = 1) {
  let spikes = "";
  for (let i = 0; i < 9; i++) {
    const a = 200 + i * 17;
    const rad = (a * Math.PI) / 180;
    const x1 = Math.cos(rad) * 30, y1 = Math.sin(rad) * 26 + 2;
    const x2 = Math.cos(rad) * 52, y2 = Math.sin(rad) * 44 + 2;
    spikes += `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="#7a5230" stroke-width="9" stroke-linecap="round"/>`;
  }
  return `<g transform="scale(${s})">
    ${spikes}
    <ellipse cx="0" cy="6" rx="36" ry="28" fill="#96683c"/>
    <ellipse cx="-24" cy="12" rx="22" ry="18" fill="#e8c49a"/>
    <path d="M -40 6 Q -52 10 -50 16 Q -44 20 -36 16 Z" fill="#e8c49a"/>
    <circle cx="-49" cy="15" r="4.5" fill="#4a3826"/>
    <circle cx="-30" cy="4" r="3" fill="#3a2c20"/><circle cx="-29" cy="3" r="1" fill="#fff"/>
    <circle cx="-18" cy="4" r="3" fill="#3a2c20"/><circle cx="-17" cy="3" r="1" fill="#fff"/>
    <path class="hogMouth" d="M -30 12 Q -25 16 -20 12" stroke="#3a2c20" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="-34" cy="10" r="3" fill="#ff9d9d" opacity="0.5"/>
    <ellipse cx="-8" cy="32" rx="6" ry="4" fill="#7a5230"/>
    <ellipse cx="14" cy="32" rx="6" ry="4" fill="#7a5230"/>
  </g>`;
}

function nestChick(s = 1) {
  return `<g transform="scale(${s})">
    <g class="chick">
      <ellipse cx="0" cy="-18" rx="17" ry="15" fill="#ffdf5e" stroke="#e8a62c" stroke-width="2"/>
      <circle cx="0" cy="-36" r="12" fill="#ffdf5e" stroke="#e8a62c" stroke-width="2"/>
      <path d="M 2 -46 Q 0 -52 -4 -52 M 6 -45 Q 6 -52 2 -53" stroke="#e8a62c" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="-5" cy="-38" r="2.4" fill="#3a2c20"/><circle cx="5" cy="-38" r="2.4" fill="#3a2c20"/>
      <path class="beak" d="M -4 -32 L 0 -26 L 4 -32 Z" fill="#f5a340"/>
      <path d="M -14 -20 Q -22 -24 -22 -14 Q -16 -12 -12 -16 Z" fill="#ffd23e"/>
    </g>
    <path d="M -30 -8 Q 0 6 30 -8 Q 32 10 0 14 Q -32 10 -30 -8 Z" fill="#a5652c" stroke="#7a5230" stroke-width="2.5"/>
    <path d="M -28 -6 Q 0 4 28 -6 M -24 0 Q 0 8 24 0" stroke="#c77f3f" stroke-width="2.5" fill="none"/>
  </g>`;
}

function worm(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(46, 0, -8)}
    <path d="M -26 6 Q -20 -12 -6 -8 Q 8 -4 12 -14 Q 18 -24 28 -18"
      fill="none" stroke="#e88fa2" stroke-width="12" stroke-linecap="round"/>
    <circle cx="28" cy="-19" r="8" fill="#e88fa2"/>
    <circle cx="26" cy="-22" r="1.8" fill="#3a2c20"/><circle cx="32" cy="-22" r="1.8" fill="#3a2c20"/>
    <path d="M 26 -16 Q 29 -14 32 -16" stroke="#3a2c20" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="34" cy="-18" r="2.4" fill="#ff9d9d" opacity="0.6"/>
  </g>`;
}

function squirrel(s = 1) {
  return `<g transform="scale(${s})">
    <path class="sqTail" d="M 18 10 Q 44 6 42 -24 Q 40 -46 22 -44 Q 34 -30 26 -14 Q 22 -4 16 2 Z"
      fill="#c46a3f" stroke="#a04e28" stroke-width="2.5"/>
    <ellipse cx="0" cy="8" rx="18" ry="16" fill="#d8794a"/>
    <ellipse cx="2" cy="12" rx="10" ry="9" fill="#f2cba5"/>
    <circle cx="-6" cy="-12" r="13" fill="#d8794a"/>
    <path d="M -14 -22 Q -18 -32 -10 -30 Z M 0 -24 Q 2 -34 8 -28 Z" fill="#d8794a" stroke="#a04e28" stroke-width="2"/>
    <circle cx="-10" cy="-14" r="2.6" fill="#3a2c20"/><circle cx="-1" cy="-14" r="2.6" fill="#3a2c20"/>
    <circle cx="-6" cy="-8" r="2.6" fill="#7a5230"/>
    <path d="M -9 -5 Q -6 -3 -3 -5" stroke="#3a2c20" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="-8" cy="24" rx="6" ry="3.5" fill="#c46a3f"/><ellipse cx="8" cy="24" rx="6" ry="3.5" fill="#c46a3f"/>
  </g>`;
}

function mushroom(x, y, s = 1) {
  return wrap(x, y, s, `class="pokeable" data-sound="boing"`, `
    <path d="M -8 0 Q -10 -14 0 -14 Q 10 -14 8 0 Z" fill="#f5ecd7"/>
    <path d="M -22 -12 Q -22 -34 0 -34 Q 22 -34 22 -12 Q 0 -6 -22 -12 Z" fill="#e84c3d" stroke="#b93425" stroke-width="2.5"/>
    <circle cx="-9" cy="-24" r="4" fill="#fff" opacity="0.85"/>
    <circle cx="7" cy="-19" r="3" fill="#fff" opacity="0.85"/>
  `);
}

function berryBush(x, y, s = 1) {
  return wrap(x, y, s, `class="pokeable" data-sound="pop"`, `
    <circle cx="-24" cy="0" r="26" fill="#5faf51"/>
    <circle cx="20" cy="-4" r="30" fill="#6cbb58"/>
    <circle cx="-2" cy="-20" r="26" fill="#7cc763"/>
    <circle cx="-18" cy="-10" r="6" fill="#7b4fa5"/>
    <circle cx="8" cy="-22" r="6" fill="#7b4fa5"/>
    <circle cx="22" cy="-2" r="6" fill="#7b4fa5"/>
    <circle cx="-4" cy="2" r="6" fill="#7b4fa5"/>
  `);
}

function wateringCan(s = 1) {
  return `<g transform="scale(${s})">
    <path d="M -26 -20 L 26 -20 Q 30 4 24 26 L -24 26 Q -30 4 -26 -20 Z" fill="#5eb3d8" stroke="#3f92ba" stroke-width="3"/>
    <path d="M -26 -14 L -52 -34 L -58 -26 L -30 -4 Z" fill="#5eb3d8" stroke="#3f92ba" stroke-width="3"/>
    <circle cx="-56" cy="-31" r="9" fill="#3f92ba"/>
    <path d="M 24 -16 Q 44 -12 42 6 Q 40 18 26 20" fill="none" stroke="#3f92ba" stroke-width="7" stroke-linecap="round"/>
    <path d="M -20 -20 Q 0 -34 20 -20" fill="none" stroke="#3f92ba" stroke-width="6" stroke-linecap="round"/>
    <circle cx="-6" cy="2" r="3" fill="#bfe8f7"/><circle cx="8" cy="6" r="3" fill="#bfe8f7"/><circle cx="0" cy="14" r="3" fill="#bfe8f7"/>
  </g>`;
}

function owl(s = 1) {
  return `<g transform="scale(${s})">
    <ellipse cx="0" cy="10" rx="34" ry="38" fill="#96683c" stroke="#7a5230" stroke-width="3"/>
    <path d="M -30 -20 Q -34 -36 -20 -30 Z M 30 -20 Q 34 -36 20 -30 Z" fill="#96683c" stroke="#7a5230" stroke-width="2.5"/>
    <ellipse cx="0" cy="18" rx="20" ry="22" fill="#e8c49a"/>
    <path d="M -16 14 Q -8 8 0 14 Q 8 8 16 14 M -12 24 Q -4 18 4 24 Q 12 18 20 24" stroke="#d8a878" stroke-width="2" fill="none"/>
    <g class="owlEyesOpen" style="display:none">
      <circle cx="-13" cy="-8" r="11" fill="#fff"/><circle cx="13" cy="-8" r="11" fill="#fff"/>
      <circle cx="-12" cy="-7" r="5" fill="#3a2c20"/><circle cx="14" cy="-7" r="5" fill="#3a2c20"/>
      <circle cx="-10" cy="-9" r="1.8" fill="#fff"/><circle cx="16" cy="-9" r="1.8" fill="#fff"/>
    </g>
    <g class="owlEyesClosed">
      <path d="M -20 -8 Q -13 -2 -6 -8 M 6 -8 Q 13 -2 20 -8" stroke="#3a2c20" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M -5 0 L 0 8 L 5 0 Z" fill="#f5a340"/>
    <path d="M -12 44 L -12 52 M -6 44 L -6 53 M 6 44 L 6 53 M 12 44 L 12 52" stroke="#f5a340" stroke-width="3.5" stroke-linecap="round"/>
  </g>`;
}

function fireflyBug(s = 1, lit = false) {
  return `<g transform="scale(${s})">
    ${hit(42, 0, -4)}
    <circle class="ffGlow" r="30" fill="#ffe95c" opacity="${lit ? 0.4 : 0}"/>
    <g class="flapping" style="animation-duration:0.18s">
      <ellipse cx="-7" cy="-12" rx="9" ry="6" fill="#dff3ff" opacity="0.85"/>
      <ellipse cx="7" cy="-12" rx="9" ry="6" fill="#dff3ff" opacity="0.85"/>
    </g>
    <ellipse class="ffBody" cx="0" cy="4" rx="9" ry="12" fill="${lit ? "#ffe95c" : "#9aa78a"}" stroke="${lit ? "#e8c02c" : "#7a8a6a"}" stroke-width="2"/>
    <circle cx="0" cy="-10" r="8" fill="#5b6770"/>
    <circle cx="-3" cy="-12" r="2" fill="#fff"/><circle cx="3" cy="-12" r="2" fill="#fff"/>
    <circle cx="-3" cy="-12" r="1" fill="#3a2c20"/><circle cx="3" cy="-12" r="1" fill="#3a2c20"/>
    <path d="M -3 -6 Q 0 -4 3 -6" stroke="#dfe8ef" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M -4 -17 Q -7 -22 -10 -23 M 4 -17 Q 7 -22 10 -23" stroke="#5b6770" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>`;
}

function star(x, y, s, cls = "twinkling") {
  return `<g transform="translate(${x},${y}) scale(${s})" class="pokeable" data-sound="twinkle">
    <g class="inner ${cls}">
      <path d="M 0 -12 L 3.5 -3.5 L 12 -3 L 5.5 3 L 7.5 12 L 0 7 L -7.5 12 L -5.5 3 L -12 -3 L -3.5 -3.5 Z" fill="#fff6c8"/>
    </g>
  </g>`;
}

function heart(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})" class="heartPop">
    <path d="M 0 6 C -8 -4 -20 0 -18 10 C -16 18 -6 24 0 30 C 6 24 16 18 18 10 C 20 0 8 -4 0 6 Z" fill="#ff6b8a"/>
  </g>`;
}

/* ---------- Karten-Symbole für die Wissens-Karten ---------- */

const CardIcons = {
  flower:   `<svg viewBox="-70 -80 140 200">${flower("#ff8fab", "#ffd23e", 1.1)}</svg>`,
  bee:      `<svg viewBox="-60 -60 120 120">${bee(1.4)}</svg>`,
  frog:     `<svg viewBox="-60 -55 120 120">${frog(1.3)}</svg>`,
  duck:     `<svg viewBox="-70 -60 140 120">${duck(1.3)}</svg>`,
  hedgehog: `<svg viewBox="-75 -65 150 130">${hedgehog(1.2)}</svg>`,
  chick:    `<svg viewBox="-55 -75 110 120">${nestChick(1.3)}</svg>`,
  firefly:  `<svg viewBox="-55 -55 110 110">${fireflyBug(1.5, true)}</svg>`,
  rainbow:  `<svg viewBox="-70 -60 140 110">
    <path d="M -56 40 A 56 56 0 0 1 56 40" fill="none" stroke="#e84c3d" stroke-width="10"/>
    <path d="M -45 40 A 45 45 0 0 1 45 40" fill="none" stroke="#f5a340" stroke-width="10"/>
    <path d="M -34 40 A 34 34 0 0 1 34 40" fill="none" stroke="#ffd23e" stroke-width="10"/>
    <path d="M -23 40 A 23 23 0 0 1 23 40" fill="none" stroke="#79c850" stroke-width="10"/>
    <path d="M -12 40 A 12 12 0 0 1 12 40" fill="none" stroke="#5eb3d8" stroke-width="10"/>
    <ellipse cx="-56" cy="42" rx="18" ry="12" fill="#fff"/>
    <ellipse cx="56" cy="42" rx="18" ry="12" fill="#fff"/>
  </svg>`,
};

/* ================================================================
   SZENE 1 – Das Blumenbeet
   ================================================================ */

const sceneGarden = {
  id: "garden",
  tasks: [
    { id: "t1", source: "#can", target: "#mound" },
    { id: "t2", source: "#bee", target: "#bigflower" },
  ],
  html(done) {
    const t1 = done("t1"), t2 = done("t2");
    return `
    <defs>
      <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8ed4f7"/><stop offset="1" stop-color="#e3f6ff"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#gSky)"/>
    ${sun(870, 110)}
    ${cloud(210, 95, 1)}
    ${cloud(540, 60, 0.7)}
    <path d="M 0 420 Q 250 340 520 410 Q 780 470 1000 400 L 1000 700 L 0 700 Z" fill="#a8de7c"/>
    <path d="M 0 500 Q 300 450 620 505 Q 850 540 1000 500 L 1000 700 L 0 700 Z" fill="#8ccb60"/>
    <path d="M 60 700 Q 60 610 120 600 L 640 600 Q 700 610 700 700 Z" fill="#a5713f"/>
    <path d="M 80 700 Q 84 625 130 618 L 630 618 Q 676 625 680 700 Z" fill="#8a5a35"/>
    ${grassTuft(70, 590, 1.2)}
    ${grassTuft(720, 630, 1.4)}
    ${grassTuft(950, 580, 1.1)}
    ${grassTuft(360, 480, 1)}

    ${wrap(160, 470, 1, `id="lia" class="pokeable" data-sound="hello"`, lia(1))}

    ${wrap(300, 640, 1, `class="pokeable" data-sound="pop"`, flower("#ff8fab"), "swaying")}
    ${wrap(390, 655, 0.85, `class="pokeable" data-sound="pop"`, flower("#b892e0", "#fff3b0"), "swaying")}
    ${wrap(240, 660, 0.7, `class="pokeable" data-sound="pop"`, tulip("#f5a340", 1.3))}
    ${wrap(460, 648, 0.75, `class="pokeable" data-sound="pop"`, tulip("#e84c3d", 1.3))}

    ${wrap(430, 500, 1, `id="ladybug" class="pokeable" data-sound="chirp"`, `
      <path d="M -30 14 Q 0 2 34 12 Q 20 26 -6 24 Z" fill="#74b95a"/>
      <g transform="translate(0,-2)">${ladybug(1)}</g>
    `)}
    ${wrap(700, 665, 0.9, `id="snail" class="pokeable" data-sound="boing"`, snail(1))}

    <g id="mound" transform="translate(560,640)">
      <ellipse rx="46" ry="16" fill="#6e4526"/>
      ${t1 ? "" : `<g class="sprout swaying"><path d="M 0 -6 Q -1 -18 0 -24" stroke="#5f9e45" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 0 -22 Q -10 -28 -12 -36 Q -2 -34 0 -24 Q 8 -30 12 -38 Q 2 -36 0 -24" fill="#74b95a"/></g>`}
    </g>
    <g id="bigflower" transform="translate(560,640)">
      ${t1 ? `<g transform="translate(0,-128)">${flower("#ffb3c8", "#ffd23e", 1.15)}</g>` : ""}
    </g>
    ${t1 ? butterfly(660, 470, 1, "#b892e0", "") : ""}
    ${t2 ? `<g transform="translate(524,540)"><g class="inner floaty">${bee(0.8)}</g></g>` : ""}

    ${!t2 ? wrap(760, 300, 1, `id="bee" class="grabbable"`, bee(1), "floaty") : ""}
    ${wrap(870, 600, 1, `id="can" class="grabbable"`, wateringCan(1))}
    `;
  },
  init(svg, api) {
    if (!api.done("t1")) {
      api.drag("#can", "#mound", 110, (canEl) => {
        api.play("water");
        const inner = canEl.querySelector(":scope > .inner");
        inner.style.transformOrigin = "center";
        inner.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(-38deg)" }, { transform: "rotate(-38deg)" }, { transform: "rotate(0deg)" }],
          { duration: 1600, easing: "ease-in-out" }
        );
        for (let i = 0; i < 7; i++) {
          const d = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          d.setAttribute("r", 5);
          d.setAttribute("fill", "#5eb3d8");
          d.setAttribute("cx", 500 + Math.random() * 90);
          d.setAttribute("cy", 560);
          svg.appendChild(d);
          d.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(70px)", opacity: 0 }],
            { duration: 500, delay: 200 + i * 130, easing: "ease-in", fill: "forwards" });
          setTimeout(() => d.remove(), 1400 + i * 130);
        }
        setTimeout(() => {
          const sprout = svg.querySelector(".sprout");
          if (sprout) sprout.classList.add("fadeOut");
          const bf = svg.querySelector("#bigflower");
          bf.innerHTML = `<g class="growIn"><g transform="translate(0,-128)">${flower("#ffb3c8", "#ffd23e", 1.15)}</g></g>`;
          api.play("success");
          setTimeout(() => {
            api.complete("t1", {
              icon: "flower",
              text: "Pflanzen brauchen Wasser und Sonne, damit sie groß und stark werden können.",
            });
          }, 1500);
        }, 1500);
      });
    }
    if (!api.done("t2")) {
      api.drag("#bee", "#bigflower", 130, (beeEl) => {
        if (!api.done("t1")) return false;
        api.play("buzz");
        beeEl.setAttribute("transform", "translate(524,540) scale(0.8)");
        beeEl.classList.remove("grabbable");
        api.sparkleBurst(560, 520);
        setTimeout(() => {
          api.play("success");
          api.complete("t2", {
            icon: "bee",
            text: "Bienen sammeln süßen Nektar von den Blumen und machen daraus leckeren Honig.",
          });
        }, 700);
        return true;
      });
    }
    const lia = svg.querySelector("#lia");
    if (lia) lia.addEventListener("pointerdown", () => {
      const arm = lia.querySelector(".liaArm");
      if (arm) arm.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(-14deg)" }, { transform: "rotate(0deg)" }, { transform: "rotate(-14deg)" }, { transform: "rotate(0deg)" }],
        { duration: 900 });
    });
  },
};

/* ================================================================
   SZENE 2 – Der Teich
   ================================================================ */

const scenePond = {
  id: "pond",
  tasks: [
    { id: "t3", source: "#flies", target: "#frog" },
    { id: "t4", source: "#duckling", target: "#mama" },
  ],
  html(done) {
    const t3 = done("t3"), t4 = done("t4");
    return `
    <defs>
      <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9bdcf5"/><stop offset="1" stop-color="#eaf9ff"/>
      </linearGradient>
      <radialGradient id="pWater" cx="0.5" cy="0.4" r="0.8">
        <stop offset="0" stop-color="#8fd4e8"/><stop offset="1" stop-color="#5eb3d8"/>
      </radialGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#pSky)"/>
    ${sun(120, 100)}
    ${cloud(660, 80, 0.9)}
    ${cloud(370, 130, 0.6)}
    <path d="M 0 380 Q 260 320 540 375 Q 800 425 1000 370 L 1000 700 L 0 700 Z" fill="#a8de7c"/>
    <path d="M 0 480 Q 300 440 1000 480 L 1000 700 L 0 700 Z" fill="#8ccb60"/>
    <ellipse id="pondWater" cx="510" cy="545" rx="430" ry="140" fill="url(#pWater)" stroke="#4a9cc4" stroke-width="5"/>
    <ellipse cx="400" cy="510" rx="150" ry="30" fill="#aee2f0" opacity="0.5"/>
    <ellipse cx="650" cy="580" rx="120" ry="22" fill="#aee2f0" opacity="0.4"/>

    ${cattail(130, 520, 1)}
    ${cattail(175, 545, 0.8)}
    ${cattail(905, 505, 0.95)}
    ${cattail(860, 540, 0.75)}
    ${grassTuft(60, 460, 1.3)}
    ${grassTuft(950, 620, 1.4)}
    ${grassTuft(260, 430, 1)}

    ${lilypad(330, 620, 1, true)}
    ${lilypad(760, 620, 0.85)}
    <g transform="translate(640,505)">${lilypad(0, 32, 1.1)}</g>

    ${wrap(640, 505, 1, `id="frog" class="pokeable" data-sound="croak"`, frog(1), t3 ? "" : "")}

    ${wrap(450, 555, 1, `id="mama" class="pokeable" data-sound="quack"`, duck(1.1), "bobbing")}
    ${t4
      ? wrap(535, 570, 1, `class="pokeable" data-sound="peep"`, duck(0.6, "#ffdf5e", "#f5a340"), "bobbing")
      : wrap(150, 620, 1, `id="duckling" class="grabbable"`, duck(0.6, "#ffdf5e", "#f5a340"), "bobbing")}

    ${!t3 ? wrap(380, 330, 1, `id="flies" class="grabbable"`, flySwarm(1.1)) : ""}

    ${wrap(830, 270, 1, `id="dragonfly" class="pokeable" data-sound="whoosh"`, dragonfly(1.1), "floaty")}
    ${wrap(560, 640, 1, `id="fish" class="pokeable" data-sound="splash"`, fish(1), "bobbing")}
    ${butterfly(240, 300, 0.8, "#f5a340")}
    `;
  },
  init(svg, api) {
    if (!api.done("t3")) {
      api.drag("#flies", "#frog", 120, (fliesEl) => {
        const frogEl = svg.querySelector("#frog");
        api.play("croak");
        const tongue = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tongue.setAttribute("d", "M 640 520 Q 600 480 560 450");
        tongue.setAttribute("stroke", "#ff8fab");
        tongue.setAttribute("stroke-width", "10");
        tongue.setAttribute("fill", "none");
        tongue.setAttribute("stroke-linecap", "round");
        svg.appendChild(tongue);
        tongue.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 500, fill: "forwards" });
        fliesEl.classList.add("fadeOut");
        setTimeout(() => {
          tongue.remove();
          fliesEl.remove();
          api.play("munch");
          const throat = frogEl.querySelector(".frogThroat");
          if (throat) throat.animate([{ r: 0 }, { r: 12 }, { r: 0 }], { duration: 900 });
          frogEl.querySelector(":scope > .inner").classList.add("happyBounce");
          setTimeout(() => {
            api.play("success");
            api.complete("t3", {
              icon: "frog",
              text: "Frösche fangen Fliegen und Mücken mit ihrer langen, klebrigen Zunge.",
            });
          }, 900);
        }, 450);
        return true;
      });
    }
    if (!api.done("t4")) {
      api.drag("#duckling", "#mama", 130, (duckEl) => {
        api.play("quack");
        api.play("peep");
        duckEl.setAttribute("transform", "translate(535,570) scale(1)");
        duckEl.classList.remove("grabbable");
        api.svgAppend(heart(500, 500, 1));
        api.svgAppend(heart(560, 490, 0.8));
        setTimeout(() => {
          api.play("success");
          api.complete("t4", {
            icon: "duck",
            text: "Kleine Entenküken schwimmen immer ganz dicht bei ihrer Mama.",
          });
        }, 900);
        return true;
      });
    }
    const fishEl = svg.querySelector("#fish");
    if (fishEl) fishEl.addEventListener("pointerdown", () => {
      fishEl.querySelector(":scope > .inner").animate(
        [{ transform: "translateY(0) rotate(0deg)" }, { transform: "translateY(-90px) rotate(-20deg)" }, { transform: "translateY(0) rotate(0deg)" }],
        { duration: 800, easing: "ease-out" });
    });
    const df = svg.querySelector("#dragonfly");
    if (df) df.addEventListener("pointerdown", () => {
      df.querySelector(":scope > .inner").animate(
        [{ transform: "translate(0,0)" }, { transform: "translate(-120px,-40px)" }, { transform: "translate(60px,-80px)" }, { transform: "translate(0,0)" }],
        { duration: 1600, easing: "ease-in-out" });
    });
  },
};

/* ================================================================
   SZENE 3 – Der Apfelbaum
   ================================================================ */

const sceneTree = {
  id: "tree",
  tasks: [
    { id: "t5", source: "#apple1", target: "#hedgehog" },
    { id: "t6", source: "#worm", target: "#nest" },
  ],
  html(done) {
    const t5 = done("t5"), t6 = done("t6");
    return `
    <defs>
      <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a1def2"/><stop offset="1" stop-color="#f0faff"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#tSky)"/>
    ${sun(880, 100)}
    ${cloud(280, 80, 0.8)}
    ${cloud(600, 120, 0.6)}
    <path d="M 0 400 Q 300 340 600 400 Q 830 445 1000 390 L 1000 700 L 0 700 Z" fill="#a8de7c"/>
    <path d="M 0 520 Q 400 470 1000 530 L 1000 700 L 0 700 Z" fill="#8ccb60"/>

    ${wrap(310, 440, 1, `id="treetop" class="pokeable" data-sound="whoosh"`, appleTree(1.15))}

    <g transform="translate(430,388)">${wrap(0, 0, 1, `id="nest"`, nestChick(1))}</g>

    ${wrap(316, 590, 1, `id="squirrel" class="pokeable" data-sound="chirp"`, squirrel(1))}

    ${mushroom(150, 660, 1.1)}
    ${mushroom(197, 668, 0.75)}
    ${berryBush(80, 590, 1)}
    ${grassTuft(560, 560, 1.2)}
    ${grassTuft(940, 600, 1.4)}
    ${grassTuft(700, 680, 1.2)}
    ${wrap(610, 480, 0.8, `class="pokeable" data-sound="pop"`, flower("#f5a340", "#fff3b0"), "swaying")}

    ${wrap(830, 610, 1, `id="hedgehog" class="pokeable" data-sound="snuffle"`, hedgehog(1))}

    ${!t5 ? wrap(500, 640, 1, `id="apple1" class="grabbable"`, apple(1)) : ""}
    ${wrap(575, 660, 0.9, `id="apple2" class="grabbable"`, apple(1))}

    ${!t6 ? wrap(660, 672, 1, `id="worm" class="grabbable"`, worm(1), "bobbing") : ""}
    ${butterfly(720, 320, 0.9, "#ff8fab")}
    `;
  },
  init(svg, api) {
    const feedHog = (appleEl, taskId) => {
      const hog = svg.querySelector("#hedgehog");
      api.play("munch");
      api.play("snuffle");
      appleEl.classList.add("fadeOut");
      setTimeout(() => appleEl.remove(), 600);
      hog.querySelector(":scope > .inner").classList.add("happyBounce");
      setTimeout(() => hog.querySelector(":scope > .inner").classList.remove("happyBounce"), 1600);
      if (taskId && !api.done(taskId)) {
        setTimeout(() => {
          api.play("success");
          api.complete(taskId, {
            icon: "hedgehog",
            text: "Igel lieben Äpfel, Beeren und kleine Käfer zum Fressen.",
          });
        }, 1000);
      }
      return true;
    };
    api.drag("#apple1", "#hedgehog", 120, (el) => feedHog(el, "t5"));
    api.drag("#apple2", "#hedgehog", 120, (el) => feedHog(el, api.done("t5") ? null : "t5"));

    if (!api.done("t6")) {
      api.drag("#worm", "#nest", 110, (wormEl) => {
        const nest = svg.querySelector("#nest");
        api.play("peep");
        wormEl.classList.add("fadeOut");
        setTimeout(() => wormEl.remove(), 500);
        const chick = nest.querySelector(".chick");
        if (chick) chick.animate(
          [{ transform: "translateY(0)" }, { transform: "translateY(-16px)" }, { transform: "translateY(0)" }, { transform: "translateY(-12px)" }, { transform: "translateY(0)" }],
          { duration: 1100 });
        setTimeout(() => api.play("chirp"), 300);
        setTimeout(() => {
          api.play("success");
          api.complete("t6", {
            icon: "chick",
            text: "Vogelkinder rufen laut piep, piep! Ihre Eltern bringen ihnen Futter ins Nest.",
          });
        }, 1200);
        return true;
      });
    }

    const tree = svg.querySelector("#treetop");
    if (tree) tree.addEventListener("pointerdown", () => {
      const apples = tree.querySelectorAll(".treeApple");
      const pick = apples[Math.floor(Math.random() * apples.length)];
      if (pick) {
        pick.animate(
          [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(230px)", opacity: 1 }, { transform: "translateY(230px)", opacity: 0 }],
          { duration: 1100, easing: "cubic-bezier(0.4,0,1,1)" });
        setTimeout(() => api.play("thud"), 700);
      }
    });
    const sq = svg.querySelector("#squirrel");
    if (sq) sq.addEventListener("pointerdown", () => {
      const tail = sq.querySelector(".sqTail");
      if (tail) tail.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(16deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0deg)" }],
        { duration: 700 });
    });
  },
};

/* ================================================================
   SZENE 4 – Die Nachtwiese  (wird freigespielt)
   ================================================================ */

const sceneNight = {
  id: "night",
  locked: true,
  tasks: [
    { id: "t7", source: "#ff1", target: "#owl" },
  ],
  html(done) {
    const t7 = done("t7");
    const ffPos = [[250, 480], [420, 380], [590, 470], [730, 360], [860, 500]];
    let ffs = "";
    ffPos.forEach(([x, y], i) => {
      ffs += wrap(x, y, 1, `id="ff${i + 1}" class="pokeable firefly ${t7 ? "lit" : ""}" data-idx="${i}"`, fireflyBug(1.1, t7), "floaty");
    });
    return `
    <defs>
      <linearGradient id="nSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1b2a5e"/><stop offset="1" stop-color="#3d4f8a"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#nSky)"/>
    ${star(150, 100, 1.2)} ${star(320, 60, 0.9)} ${star(500, 130, 1.1)} ${star(680, 70, 0.8)}
    ${star(940, 200, 1)} ${star(80, 240, 0.9)} ${star(400, 220, 0.7)} ${star(600, 180, 1)}
    ${wrap(850, 130, 1, `id="moon" class="pokeable" data-sound="chime"`, `
      <circle r="58" fill="#fff3b0" stroke="#e8d67c" stroke-width="4"/>
      <circle cx="-18" cy="-14" r="9" fill="#efe0a0"/>
      <circle cx="14" cy="18" r="7" fill="#efe0a0"/>
      <circle cx="20" cy="-22" r="5" fill="#efe0a0"/>
      ${sleepyFace(1.4)}
    `)}
    <path d="M 0 430 Q 260 370 540 430 Q 800 480 1000 420 L 1000 700 L 0 700 Z" fill="#2e4d3a"/>
    <path d="M 0 540 Q 400 490 1000 545 L 1000 700 L 0 700 Z" fill="#26422f"/>
    <circle cx="80" cy="270" r="72" fill="#1d3325"/>
    <circle cx="185" cy="230" r="82" fill="#1d3325"/>
    <circle cx="130" cy="165" r="70" fill="#22402e"/>
    <circle cx="235" cy="300" r="60" fill="#1d3325"/>
    <path d="M 130 700 L 138 400 Q 140 360 160 350 L 168 355 Q 162 380 164 420 L 178 700 Z" fill="#173021"/>
    <path d="M 158 430 Q 240 388 350 375" stroke="#173021" stroke-width="16" fill="none" stroke-linecap="round"/>

    ${wrap(312, 322, 1, `id="owl" class="pokeable" data-sound="hoot"`, owl(1))}

    ${grassTuft(500, 640, 1.3, "#3a6647")}
    ${grassTuft(700, 600, 1.1, "#3a6647")}
    ${grassTuft(880, 660, 1.4, "#3a6647")}
    ${grassTuft(100, 620, 1.2, "#3a6647")}
    ${mushroom(620, 640, 0.9)}
    ${wrap(430, 620, 0.7, `class="pokeable" data-sound="pop"`, tulip("#b892e0", 1.3))}
    ${ffs}
    `;
  },
  init(svg, api) {
    if (api.done("t7")) {
      const owlEl = svg.querySelector("#owl");
      owlEl.querySelector(".owlEyesOpen").style.display = "";
      owlEl.querySelector(".owlEyesClosed").style.display = "none";
      return;
    }
    let litCount = 0;
    svg.querySelectorAll(".firefly").forEach((ff) => {
      ff.addEventListener("pointerdown", () => {
        if (ff.classList.contains("lit")) return;
        ff.classList.add("lit");
        litCount++;
        api.play("note", litCount - 1);
        const glow = ff.querySelector(".ffGlow");
        const body = ff.querySelector(".ffBody");
        glow.setAttribute("opacity", "0.4");
        glow.animate([{ opacity: 0 }, { opacity: 0.55 }, { opacity: 0.4 }], { duration: 700 });
        body.setAttribute("fill", "#ffe95c");
        body.setAttribute("stroke", "#e8c02c");
        if (litCount >= 5) {
          setTimeout(() => {
            const owlEl = svg.querySelector("#owl");
            owlEl.querySelector(".owlEyesOpen").style.display = "";
            owlEl.querySelector(".owlEyesClosed").style.display = "none";
            api.play("hoot");
            owlEl.querySelector(":scope > .inner").classList.add("happyBounce");
            svg.querySelectorAll(".firefly").forEach((f, i) => {
              f.querySelector(":scope > .inner").animate(
                [{ transform: "translate(0,0)" }, { transform: `translate(${Math.sin(i * 2) * 60}px,-70px)` }, { transform: "translate(0,0)" }],
                { duration: 2200, delay: i * 120, easing: "ease-in-out" });
            });
            setTimeout(() => {
              api.play("fanfare");
              api.complete("t7", {
                icon: "firefly",
                text: "Glühwürmchen leuchten in der Nacht, um ihre Freunde zu finden.",
              });
            }, 2000);
          }, 700);
        }
      });
    });
  },
};

const SCENES = [sceneGarden, scenePond, sceneTree, sceneNight];
const ALL_TASKS = ["t1", "t2", "t3", "t4", "t5", "t6", "t7"];
const UNLOCK_NIGHT_AT = 6;
