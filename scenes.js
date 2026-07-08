/* ================================================================
   Lia’s Garten – Szenen und Zeichnungen
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

/* ---------- Aufgaben: erst die Einladung, dann das Lob ----------
   Die Karte VOR der Aufgabe erklärt den Natur-Fakt und lädt zum
   Handeln ein; die Karte danach feiert den Erfolg. */

const TASK_INFO = {
  t1: {
    icon: "flower",
    prompt: "Pflanzen brauchen Wasser, um zu wachsen. Gießt du den kleinen Samen mit der Gießkanne?",
    praise: "Super gemacht! Schau nur, wie groß die Blume geworden ist!",
  },
  t2: {
    icon: "bee",
    prompt: "Bienen lieben Blumen und machen aus Nektar Honig. Bringst du die Biene zur Blume?",
    praise: "Toll! Die Biene sammelt jetzt süßen Nektar.",
  },
  t3: {
    icon: "frog",
    prompt: "Frösche fressen am liebsten Fliegen. Bringst du dem Frosch die Fliegen?",
    praise: "Mmmh! Das hat dem Frosch richtig gut geschmeckt.",
  },
  t4: {
    icon: "duck",
    prompt: "Entenküken schwimmen immer dicht bei ihrer Mama. Bringst du das kleine Küken zu ihr?",
    praise: "Wie schön! Jetzt ist das Küken wieder bei seiner Mama.",
  },
  t5: {
    icon: "hedgehog",
    prompt: "Igel lieben Äpfel! Bringst du dem Igel einen Apfel?",
    praise: "Super gemacht! Der Igel freut sich riesig.",
  },
  t6: {
    icon: "chick",
    prompt: "Vogelkinder haben großen Hunger und fressen gerne Würmer. Bringst du dem Küken den Wurm?",
    praise: "Piep, piep! Jetzt ist das Vogelkind satt und glücklich.",
  },
  t7: {
    icon: "firefly",
    prompt: "Glühwürmchen leuchten in der Nacht. Tippst du alle Glühwürmchen an, damit sie hell leuchten?",
    praise: "Wunderschön! Alles leuchtet und die Eule ist aufgewacht.",
  },
  t8: {
    icon: "squirrel",
    prompt: "Eichhörnchen sammeln im Herbst Eicheln und Nüsse für den Winter. Bringst du dem Eichhörnchen die Eichel?",
    praise: "Klasse! Jetzt hat das Eichhörnchen einen Vorrat für den Winter.",
  },
  t9: {
    icon: "hedgehog",
    prompt: "Igel bauen sich aus Blättern ein kuscheliges Nest für den Winterschlaf. Bringst du dem Igel die Blätter?",
    praise: "Wunderbar! Der Igel kuschelt sich in sein Blätternest. Schlaf gut!",
  },
  t10: {
    icon: "bird",
    prompt: "Im Winter finden Vögel kaum Futter. Streust du ihnen Körner ins Vogelhäuschen?",
    praise: "Toll! Die hungrigen Vögel picken schon die Körner.",
  },
  t11: {
    icon: "snowman",
    prompt: "Der Schneemann hat noch gar keine Nase! Schenkst du ihm die Möhre?",
    praise: "Hihi! Was für eine schöne Möhrennase.",
  },
  t12: {
    icon: "crab",
    prompt: "Einsiedlerkrebse wohnen in leeren Schneckenhäusern. Schenkst du dem kleinen Krebs das Häuschen?",
    praise: "Juhu! Der Einsiedlerkrebs hat ein neues Zuhause.",
  },
  t13: {
    icon: "starfish",
    prompt: "Seesterne leben im Meer und brauchen Wasser. Bringst du den Seestern zurück ins Meer?",
    praise: "Super! Der Seestern schwimmt wieder fröhlich im Meer.",
  },
  t14: {
    icon: "liberty",
    prompt: "Lia macht eine große Reise nach Amerika! Die Freiheitsstatue steht auf einer kleinen Insel. Fährst du Lia mit dem Boot zu ihr?",
    praise: "Hurra! Lia ist bei der Freiheitsstatue angekommen. Was für eine Reise!",
  },
  t15: {
    icon: "dolphin",
    prompt: "Delfine leben im Meer und springen gern aus dem Wasser. Bringst du dem Delfin einen Fisch?",
    praise: "Toll! Der Delfin freut sich und macht einen Freudensprung.",
  },
};

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
  return wrap(x, y, 1, `class="pokeable" data-sound="chime" data-action="spin"`, `
    ${rays}
    <circle r="55" fill="#ffdf5e" stroke="#f5b73e" stroke-width="5"/>
    ${face(1.5)}
  `);
}

function cloud(x, y, s) {
  return wrap(x, y, s, `class="pokeable" data-sound="whoosh" data-action="puff"`, `
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
    ${hit(62, 0, 20)}
    <path d="M 0 0 Q -6 60 0 108" fill="none" stroke="#5f9e45" stroke-width="8" stroke-linecap="round"/>
    <path d="M 0 60 Q -30 52 -36 30 Q -10 34 0 52 Z" fill="#74b95a"/>
    <path d="M 2 80 Q 30 74 38 52 Q 12 56 2 74 Z" fill="#74b95a"/>
    <g>${petals}<circle r="21" fill="${center}" stroke="#e8a62c" stroke-width="3"/>
    ${withFace ? face(0.85) : ""}</g>
  </g>`;
}

function tulip(color, s = 1) {
  return `<g transform="scale(${s})">
    ${hit(48, 0, 14)}
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
  return wrap(x, y, s, `class="pokeable ${cls}" data-sound="pop" data-action="loop"`, `
    ${hit(46)}
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
    ${hit(44)}
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
    ${hit(52, 0, -4)}
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
    ${hit(75, 0, 40)}
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
    ${hit(60, 0, 6)}
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
    ${hit(46)}
    <ellipse rx="22" ry="13" fill="${col}" stroke="#d8862c" stroke-width="2.5"/>
    <path d="M 18 0 L 34 -12 L 32 0 L 34 12 Z" fill="${col}" stroke="#d8862c" stroke-width="2"/>
    <path d="M -2 -12 Q 4 -22 10 -14 Z" fill="${col}" stroke="#d8862c" stroke-width="2"/>
    <circle cx="-11" cy="-3" r="2.8" fill="#3a2c20"/><circle cx="-10" cy="-4" r="1" fill="#fff"/>
    <path d="M -14 4 Q -11 7 -8 4" stroke="#3a2c20" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>`;
}

function dragonfly(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(48)}
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
    ${hit(62, -4, 2)}
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
    ${hit(52, 6, -6)}
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
  return wrap(x, y, s, `class="pokeable" data-sound="boing" data-action="bigBounce"`, `
    ${hit(42, 0, -16)}
    <path d="M -8 0 Q -10 -14 0 -14 Q 10 -14 8 0 Z" fill="#f5ecd7"/>
    <path d="M -22 -12 Q -22 -34 0 -34 Q 22 -34 22 -12 Q 0 -6 -22 -12 Z" fill="#e84c3d" stroke="#b93425" stroke-width="2.5"/>
    <circle cx="-9" cy="-24" r="4" fill="#fff" opacity="0.85"/>
    <circle cx="7" cy="-19" r="3" fill="#fff" opacity="0.85"/>
  `);
}

function berryBush(x, y, s = 1) {
  return wrap(x, y, s, `class="pokeable" data-sound="pop" data-action="shiver"`, `
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

function cat(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(58, 0, -14)}
    <path class="catTail" d="M 26 30 Q 52 24 50 -2 Q 49 -14 40 -12 Q 46 0 38 12 Q 32 22 24 24 Z" fill="#e8955e" stroke="#c4713a" stroke-width="2.5"/>
    <ellipse cx="0" cy="22" rx="26" ry="20" fill="#f2a86e"/>
    <path d="M -12 8 Q -14 26 -8 40 M 2 6 Q 0 26 4 40" stroke="#e08a4e" stroke-width="3" fill="none"/>
    <circle cx="-2" cy="-16" r="20" fill="#f2a86e"/>
    <path d="M -18 -28 L -22 -46 L -6 -34 Z" fill="#f2a86e" stroke="#c4713a" stroke-width="2"/>
    <path d="M 14 -28 L 18 -46 L 2 -34 Z" fill="#f2a86e" stroke="#c4713a" stroke-width="2"/>
    <path d="M -17 -40 L -12 -34 M 13 -40 L 8 -34" stroke="#ffd8ba" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-9" cy="-18" r="2.8" fill="#3a2c20"/><circle cx="-8" cy="-19" r="1" fill="#fff"/>
    <circle cx="6" cy="-18" r="2.8" fill="#3a2c20"/><circle cx="7" cy="-19" r="1" fill="#fff"/>
    <path d="M -4 -12 L -2 -9 L 0 -12 Z" fill="#e0634e"/>
    <path d="M -2 -9 Q -6 -5 -10 -7 M -2 -9 Q 2 -5 6 -7" stroke="#3a2c20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M -16 -12 L -26 -14 M -16 -8 L -26 -7 M 12 -12 L 22 -14 M 12 -8 L 22 -7" stroke="#c4713a" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="-14" cy="-10" r="3.4" fill="#ff9d9d" opacity="0.5"/>
    <circle cx="11" cy="-10" r="3.4" fill="#ff9d9d" opacity="0.5"/>
    <ellipse cx="-12" cy="41" rx="7" ry="4" fill="#e8955e"/>
    <ellipse cx="6" cy="41" rx="7" ry="4" fill="#e8955e"/>
  </g>`;
}

function dog(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(58, 0, -12)}
    <path class="dogTail" d="M 26 12 Q 44 4 46 -12 Q 46 -20 39 -18 Q 40 -6 30 2 Q 26 6 24 8 Z" fill="#b58452" stroke="#94683c" stroke-width="2.5"/>
    <ellipse cx="0" cy="20" rx="28" ry="21" fill="#c99a64"/>
    <ellipse cx="-2" cy="28" rx="16" ry="11" fill="#f0dcbc"/>
    <circle cx="-4" cy="-16" r="21" fill="#c99a64"/>
    <path d="M -22 -28 Q -34 -26 -32 -6 Q -31 4 -24 0 Q -26 -16 -20 -26 Z" fill="#94683c"/>
    <path d="M 14 -28 Q 26 -26 24 -6 Q 23 4 16 0 Q 18 -16 12 -26 Z" fill="#94683c"/>
    <circle cx="-11" cy="-18" r="3" fill="#3a2c20"/><circle cx="-10" cy="-19" r="1.1" fill="#fff"/>
    <circle cx="4" cy="-18" r="3" fill="#3a2c20"/><circle cx="5" cy="-19" r="1.1" fill="#fff"/>
    <ellipse cx="-4" cy="-8" rx="9" ry="7" fill="#f0dcbc"/>
    <ellipse cx="-4" cy="-11" rx="4.5" ry="3.5" fill="#3a2c20"/>
    <path d="M -4 -7 Q -4 -4 -4 -3 M -4 -3 Q -9 0 -12 -3 M -4 -3 Q 1 0 4 -3" stroke="#3a2c20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path class="dogTongue" d="M -6 -1 Q -4 6 -1 -1 Z" fill="#e0634e"/>
    <circle cx="-16" cy="-10" r="3.4" fill="#ff9d9d" opacity="0.5"/>
    <circle cx="9" cy="-10" r="3.4" fill="#ff9d9d" opacity="0.5"/>
    <ellipse cx="-14" cy="40" rx="7" ry="4" fill="#b58452"/>
    <ellipse cx="8" cy="40" rx="7" ry="4" fill="#b58452"/>
  </g>`;
}

function owl(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(58, 0, 6)}
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
  return `<g transform="translate(${x},${y}) scale(${s})" class="pokeable" data-sound="twinkle" data-action="zip">
    <g class="inner ${cls}">
      ${hit(30)}
      <path d="M 0 -12 L 3.5 -3.5 L 12 -3 L 5.5 3 L 7.5 12 L 0 7 L -7.5 12 L -5.5 3 L -12 -3 L -3.5 -3.5 Z" fill="#fff6c8"/>
    </g>
  </g>`;
}

function heart(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})" class="heartPop">
    <path d="M 0 6 C -8 -4 -20 0 -18 10 C -16 18 -6 24 0 30 C 6 24 16 18 18 10 C 20 0 8 -4 0 6 Z" fill="#ff6b8a"/>
  </g>`;
}

/* ---------- Herbst, Winter und Strand ---------- */

function acorn(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(38)}
    <ellipse cx="0" cy="6" rx="13" ry="16" fill="#c99a64" stroke="#94683c" stroke-width="2"/>
    <path d="M -15 -4 Q 0 -14 15 -4 Q 15 4 0 4 Q -15 4 -15 -4 Z" fill="#7a5230"/>
    <path d="M 0 -10 Q 2 -18 7 -20" stroke="#7a5230" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="-4" cy="6" r="2" fill="#3a2c20"/><circle cx="4" cy="6" r="2" fill="#3a2c20"/>
    <path d="M -3 11 Q 0 13 3 11" stroke="#3a2c20" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>`;
}

function leaf(color, s = 1, r = 0) {
  return `<g transform="scale(${s}) rotate(${r})">
    <path d="M 0 -18 Q 14 -8 12 6 Q 8 18 0 20 Q -8 18 -12 6 Q -14 -8 0 -18 Z" fill="${color}"/>
    <path d="M 0 -14 L 0 24" stroke="#a5652c" stroke-width="2" stroke-linecap="round"/>
  </g>`;
}

function leafBundle(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(46)}
    ${leaf("#e8963e", 1, -25)}
    <g transform="translate(18,6)">${leaf("#d9772e", 0.9, 20)}</g>
    <g transform="translate(-16,8)">${leaf("#f0b04a", 0.85, -50)}</g>
  </g>`;
}

function autumnTree(s = 1) {
  return `<g transform="scale(${s})">
    <path d="M -18 160 Q -24 100 -12 50 L 12 50 Q 24 100 18 160 Q 0 168 -18 160 Z" fill="#96683c" stroke="#7a5230" stroke-width="3.5"/>
    <g class="canopy">
      <circle cx="-55" cy="30" r="50" fill="#d9772e"/>
      <circle cx="55" cy="30" r="50" fill="#e8963e"/>
      <circle cx="0" cy="-20" r="62" fill="#f0b04a"/>
      <circle cx="-30" cy="0" r="48" fill="#e8963e"/>
      <circle cx="34" cy="-2" r="46" fill="#d9772e"/>
    </g>
  </g>`;
}

function pumpkin(x, y, s = 1) {
  return wrap(x, y, s, `class="pokeable" data-sound="boing" data-action="roll"`, `
    ${hit(46, 0, -14)}
    <ellipse cx="0" cy="-12" rx="30" ry="24" fill="#e8963e" stroke="#c4713a" stroke-width="3"/>
    <ellipse cx="-14" cy="-12" rx="12" ry="22" fill="none" stroke="#c4713a" stroke-width="2.5"/>
    <ellipse cx="14" cy="-12" rx="12" ry="22" fill="none" stroke="#c4713a" stroke-width="2.5"/>
    <path d="M 0 -34 Q -2 -44 6 -47" stroke="#5f9e45" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="-8" cy="-16" r="2.6" fill="#3a2c20"/><circle cx="8" cy="-16" r="2.6" fill="#3a2c20"/>
    <path d="M -6 -8 Q 0 -3 6 -8" stroke="#3a2c20" stroke-width="2" fill="none" stroke-linecap="round"/>
  `);
}

function fallingLeaves(count = 6) {
  const cols = ["#e8963e", "#d9772e", "#f0b04a", "#c9552e"];
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = 60 + Math.round((880 / count) * i + Math.random() * 60);
    const dur = 9 + Math.random() * 7;
    const delay = -Math.random() * dur;
    out += `<g transform="translate(${x},0)">
      <g class="fallingLeaf" style="animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s">
        ${leaf(cols[i % cols.length], 0.8, Math.round(Math.random() * 360))}
      </g></g>`;
  }
  return out;
}

function snowflakes(count = 10) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = 40 + Math.round((920 / count) * i + Math.random() * 50);
    const dur = 8 + Math.random() * 6;
    const delay = -Math.random() * dur;
    const r = 3 + Math.random() * 4;
    out += `<g transform="translate(${x},0)">
      <g class="snowflake" style="animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s">
        <circle r="${r.toFixed(1)}" fill="#fff" opacity="0.9"/>
      </g></g>`;
  }
  return out;
}

function snowman(s = 1, hasNose = false) {
  return `<g transform="scale(${s})">
    ${hit(80, 0, -60)}
    <ellipse cx="0" cy="4" rx="56" ry="12" fill="#dbeaf5"/>
    <circle cx="0" cy="-34" r="44" fill="#ffffff" stroke="#c9dcea" stroke-width="3"/>
    <circle cx="0" cy="-98" r="33" fill="#ffffff" stroke="#c9dcea" stroke-width="3"/>
    <circle cx="0" cy="-146" r="25" fill="#ffffff" stroke="#c9dcea" stroke-width="3"/>
    <path d="M -30 -100 L -56 -112 M 30 -100 L 56 -112" stroke="#94683c" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-106" r="3.5" fill="#3a2c20"/>
    <circle cx="0" cy="-88" r="3.5" fill="#3a2c20"/>
    <circle cx="0" cy="-40" r="3.5" fill="#3a2c20"/>
    <path d="M -25 -170 Q 0 -182 25 -170 L 22 -158 Q 0 -166 -22 -158 Z" fill="#e0634e"/>
    <path d="M -14 -176 L -12 -190 Q 0 -196 12 -190 L 14 -176" fill="#e0634e" stroke="#c14a38" stroke-width="2"/>
    <circle cx="-9" cy="-152" r="3" fill="#3a2c20"/><circle cx="9" cy="-152" r="3" fill="#3a2c20"/>
    ${hasNose
      ? `<path class="snowNose" d="M 0 -144 L 26 -138 L 2 -134 Z" fill="#e8963e" stroke="#c4713a" stroke-width="1.5"/>
         <path d="M -8 -136 Q 0 -130 8 -136" stroke="#3a2c20" stroke-width="2.2" fill="none" stroke-linecap="round"/>
         <circle cx="-14" cy="-140" r="3.4" fill="#ff9d9d" opacity="0.55"/><circle cx="14" cy="-140" r="3.4" fill="#ff9d9d" opacity="0.55"/>`
      : `<ellipse cx="0" cy="-137" rx="3.4" ry="4.5" fill="#3a2c20"/>`}
  </g>`;
}

function carrot(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(40)}
    <path d="M -20 -8 L 22 2 L -14 12 Q -24 4 -20 -8 Z" fill="#e8963e" stroke="#c4713a" stroke-width="2"/>
    <path d="M -18 -6 Q -30 -12 -36 -8 M -19 -2 Q -32 -2 -36 2" stroke="#5f9e45" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>`;
}

function firTree(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(66, 0, -60)}
    <rect x="-9" y="-12" width="18" height="26" rx="4" fill="#7a5230"/>
    <path d="M 0 -150 L 38 -92 L -38 -92 Z" fill="#3a7050"/>
    <path d="M 0 -118 L 48 -52 L -48 -52 Z" fill="#437c59"/>
    <path d="M 0 -84 L 58 -10 L -58 -10 Z" fill="#4d8a63"/>
    <path d="M -2 -148 Q 10 -132 24 -114 Q 8 -118 -2 -122 Z" fill="#eef7fd" opacity="0.9"/>
    <path d="M -34 -60 Q -14 -54 8 -58 Q -8 -46 -30 -50 Z" fill="#eef7fd" opacity="0.9"/>
    <path d="M 14 -28 Q 34 -24 50 -16 Q 28 -12 10 -18 Z" fill="#eef7fd" opacity="0.9"/>
  </g>`;
}

function birdFeeder(s = 1, filled = false) {
  return `<g transform="scale(${s})">
    <rect x="-5" y="-60" width="10" height="130" rx="4" fill="#96683c"/>
    <rect x="-46" y="-78" width="92" height="14" rx="6" fill="#b58452"/>
    <path d="M -50 -78 L 0 -128 L 50 -78 Z" fill="#c9552e" stroke="#a5652c" stroke-width="3"/>
    <rect x="-34" y="-76" width="68" height="8" fill="#e8c49a"/>
    ${filled ? `<path d="M -30 -78 Q 0 -90 30 -78 Z" fill="#e8b04b"/>
      <circle cx="-14" cy="-82" r="2.5" fill="#94683c"/><circle cx="2" cy="-84" r="2.5" fill="#94683c"/><circle cx="16" cy="-82" r="2.5" fill="#94683c"/>` : ""}
  </g>`;
}

function winterBird(s = 1, col = "#e0634e") {
  return `<g transform="scale(${s})">
    ${hit(36, 0, -6)}
    <ellipse cx="0" cy="0" rx="16" ry="13" fill="#8a7a68"/>
    <circle cx="10" cy="-8" r="9" fill="#8a7a68"/>
    <ellipse cx="-2" cy="3" rx="10" ry="8" fill="${col}"/>
    <path d="M -14 -4 Q -24 -8 -26 0 Q -18 4 -12 2 Z" fill="#6d6053"/>
    <path d="M 17 -9 L 25 -7 L 17 -4 Z" fill="#f5a340"/>
    <circle cx="9" cy="-10" r="2.2" fill="#3a2c20"/><circle cx="10" cy="-11" r="0.8" fill="#fff"/>
    <path d="M -4 12 L -4 16 M 4 12 L 4 16" stroke="#f5a340" stroke-width="2" stroke-linecap="round"/>
  </g>`;
}

function seedBag(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(44, 0, -10)}
    <path d="M -22 12 Q -26 -18 -12 -26 L 12 -26 Q 26 -18 22 12 Q 0 20 -22 12 Z" fill="#e8d5b0" stroke="#bfa87c" stroke-width="2.5"/>
    <path d="M -12 -26 Q -16 -34 -10 -38 M 12 -26 Q 16 -34 10 -38" stroke="#bfa87c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M -14 -22 L 14 -22" stroke="#bfa87c" stroke-width="2"/>
    <circle cx="-8" cy="-4" r="3" fill="#94683c"/><circle cx="6" cy="-8" r="3" fill="#94683c"/>
    <circle cx="0" cy="4" r="3" fill="#94683c"/><circle cx="10" cy="2" r="3" fill="#94683c"/>
  </g>`;
}

function bunny(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(50, 0, -16)}
    <ellipse cx="0" cy="6" rx="24" ry="19" fill="#f7f7f2"/>
    <circle cx="-2" cy="-18" r="16" fill="#f7f7f2"/>
    <path d="M -12 -30 Q -18 -56 -8 -56 Q -2 -52 -4 -32 Z" fill="#f7f7f2" stroke="#dcdcd2" stroke-width="2"/>
    <path d="M 6 -30 Q 4 -58 14 -56 Q 20 -50 12 -30 Z" fill="#f7f7f2" stroke="#dcdcd2" stroke-width="2"/>
    <path d="M -10 -48 Q -12 -40 -8 -36 M 10 -48 Q 12 -42 10 -36" stroke="#ffd8d8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-8" cy="-20" r="2.6" fill="#3a2c20"/><circle cx="4" cy="-20" r="2.6" fill="#3a2c20"/>
    <ellipse cx="-2" cy="-13" rx="2.6" ry="2" fill="#ff9d9d"/>
    <path d="M -2 -11 Q -2 -8 -2 -7 M -2 -7 Q -6 -4 -8 -7 M -2 -7 Q 2 -4 4 -7" stroke="#3a2c20" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="20" cy="10" r="9" fill="#ffffff"/>
    <ellipse cx="-10" cy="24" rx="7" ry="4" fill="#eaeae2"/><ellipse cx="8" cy="24" rx="7" ry="4" fill="#eaeae2"/>
  </g>`;
}

function seagull(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(46, 0, -4)}
    <g class="flapping" style="animation-duration:0.35s">
      <path d="M -10 -8 Q -38 -26 -54 -18 Q -40 -4 -12 -2 Z" fill="#f2f6f8"/>
      <path d="M 10 -8 Q 38 -26 54 -18 Q 40 -4 12 -2 Z" fill="#f2f6f8"/>
    </g>
    <ellipse cx="0" cy="0" rx="18" ry="11" fill="#ffffff" stroke="#d5dde2" stroke-width="2"/>
    <circle cx="14" cy="-7" r="8" fill="#ffffff" stroke="#d5dde2" stroke-width="2"/>
    <path d="M 21 -8 L 30 -6 L 21 -3 Z" fill="#f5a340"/>
    <circle cx="13" cy="-9" r="2" fill="#3a2c20"/>
    <path d="M -16 2 L -24 6 L -15 7 Z" fill="#d5dde2"/>
  </g>`;
}

function sailboat(s = 1) {
  return `<g transform="scale(${s})">
    <path d="M -34 0 L 34 0 L 22 16 L -22 16 Z" fill="#c9552e" stroke="#a5432a" stroke-width="2"/>
    <path d="M 0 -4 L 0 -58" stroke="#7a5230" stroke-width="4"/>
    <path d="M 4 -54 Q 34 -34 6 -8 Z" fill="#ffffff" stroke="#d5dde2" stroke-width="2"/>
    <path d="M -4 -48 Q -26 -30 -4 -10 Z" fill="#ffd23e" stroke="#e8a62c" stroke-width="2"/>
  </g>`;
}

function sandcastle(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(70, 0, -40)}
    <rect x="-52" y="-38" width="30" height="42" rx="3" fill="#e8cf9a" stroke="#cfb277" stroke-width="2.5"/>
    <rect x="22" y="-38" width="30" height="42" rx="3" fill="#e8cf9a" stroke="#cfb277" stroke-width="2.5"/>
    <rect x="-30" y="-56" width="60" height="60" rx="3" fill="#f0dcae" stroke="#cfb277" stroke-width="2.5"/>
    <path d="M -30 -56 L -30 -66 L -22 -66 L -22 -56 M -8 -56 L -8 -66 L 0 -66 L 0 -56 M 14 -56 L 14 -66 L 22 -66 L 22 -56 L 30 -56 L 30 -66" fill="#f0dcae" stroke="#cfb277" stroke-width="2.5"/>
    <path d="M -52 -38 L -52 -46 L -46 -46 L -46 -38 M -34 -38 L -34 -46 L -28 -46 L -28 -38 M 28 -38 L 28 -46 L 34 -46 L 34 -38 M 46 -38 L 46 -46 L 52 -46 L 52 -38" fill="#e8cf9a" stroke="#cfb277" stroke-width="2"/>
    <path d="M 0 -66 L 0 -88" stroke="#94683c" stroke-width="3"/>
    <path class="castleFlag" d="M 0 -88 L 20 -82 L 0 -76 Z" fill="#e0634e"/>
    <path d="M -12 -30 Q 0 -22 12 -30 L 12 -6 L -12 -6 Z" fill="#cfb277"/>
  </g>`;
}

function crabFig(s = 1, withShell = false) {
  return `<g transform="scale(${s})">
    ${hit(54, 0, -6)}
    ${withShell ? `<g transform="translate(2,-26)">
      <circle r="17" fill="#c77f3f" stroke="#a5652c" stroke-width="2.5"/>
      <path d="M 0 -13 a 13 13 0 1 1 -13 13 a 9 9 0 1 0 9 -9 a 5 5 0 1 0 -5 5" fill="none" stroke="#a5652c" stroke-width="2.5" stroke-linecap="round"/>
    </g>` : ""}
    <path d="M -18 -14 Q -34 -30 -28 -38 Q -20 -36 -14 -22 M -28 -38 Q -36 -36 -38 -30" stroke="#e0634e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M 18 -14 Q 34 -30 28 -38 Q 20 -36 14 -22 M 28 -38 Q 36 -36 38 -30" stroke="#e0634e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="0" rx="24" ry="17" fill="#e8755e" stroke="#c14a38" stroke-width="2.5"/>
    <path d="M -20 12 L -28 20 M -8 15 L -12 24 M 8 15 L 12 24 M 20 12 L 28 20" stroke="#c14a38" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M -8 -14 Q -8 -24 -6 -26 M 8 -14 Q 8 -24 6 -26" stroke="#c14a38" stroke-width="2.5" fill="none"/>
    <circle cx="-6" cy="-27" r="4.5" fill="#fff"/><circle cx="6" cy="-27" r="4.5" fill="#fff"/>
    <circle cx="-6" cy="-27" r="2" fill="#3a2c20"/><circle cx="6" cy="-27" r="2" fill="#3a2c20"/>
    <path d="M -5 -4 Q 0 0 5 -4" stroke="#8a3325" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="-13" cy="-6" r="3" fill="#ffb3a0" opacity="0.7"/><circle cx="13" cy="-6" r="3" fill="#ffb3a0" opacity="0.7"/>
  </g>`;
}

function spiralShell(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(40)}
    <circle r="18" fill="#e8b04b" stroke="#c48a3a" stroke-width="2.5"/>
    <path d="M 0 -14 a 14 14 0 1 1 -14 14 a 10 10 0 1 0 10 -10 a 6 6 0 1 0 -6 6" fill="none" stroke="#c48a3a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 14 10 Q 24 14 26 20 Q 18 22 12 17 Z" fill="#e8b04b" stroke="#c48a3a" stroke-width="2"/>
  </g>`;
}

function starfishFig(s = 1) {
  let arms = "";
  for (let i = 0; i < 5; i++) {
    arms += `<path d="M 0 -6 Q 6 -20 0 -30 Q -6 -20 0 -6 Z" fill="#f5a05e" stroke="#d87f3c" stroke-width="2"
      transform="rotate(${i * 72}) translate(0,-4)"/>`;
  }
  return `<g transform="scale(${s})">
    ${hit(46)}
    ${arms}
    <circle r="13" fill="#f7b578"/>
    <circle cx="-4" cy="-2" r="2.4" fill="#3a2c20"/><circle cx="4" cy="-2" r="2.4" fill="#3a2c20"/>
    <path d="M -4 4 Q 0 7 4 4" stroke="#3a2c20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="-8" cy="2" r="2.4" fill="#ff9d9d" opacity="0.6"/><circle cx="8" cy="2" r="2.4" fill="#ff9d9d" opacity="0.6"/>
  </g>`;
}

function palm(s = 1) {
  return `<g transform="scale(${s})">
    <path d="M -8 160 Q -14 80 4 10 L 20 14 Q 6 84 10 160 Z" fill="#b58452" stroke="#94683c" stroke-width="3"/>
    <path d="M -4 12 L 0 2 L 8 10 L 14 2 L 16 12" fill="none" stroke="#94683c" stroke-width="2"/>
    <path d="M 10 8 Q -50 -18 -76 8 Q -40 18 8 16 Z" fill="#4d9c60"/>
    <path d="M 12 6 Q 0 -50 -30 -58 Q -16 -20 8 10 Z" fill="#5faf6e"/>
    <path d="M 14 6 Q 40 -46 74 -42 Q 52 -8 16 12 Z" fill="#4d9c60"/>
    <path d="M 14 10 Q 70 -8 92 16 Q 52 26 14 16 Z" fill="#5faf6e"/>
    <circle cx="4" cy="16" r="8" fill="#96683c"/>
    <circle cx="20" cy="20" r="7" fill="#96683c"/>
  </g>`;
}

function beachBall(x, y, s = 1) {
  return wrap(x, y, s, `class="pokeable" data-sound="boing" data-action="flyArc"`, `
    ${hit(44)}
    <circle r="24" fill="#fff"/>
    <path d="M 0 -24 A 24 24 0 0 1 20.8 12 L 0 0 Z" fill="#e0634e"/>
    <path d="M 20.8 12 A 24 24 0 0 1 -20.8 12 L 0 0 Z" fill="#ffd23e"/>
    <path d="M -20.8 12 A 24 24 0 0 1 0 -24 L 0 0 Z" fill="#5eb3d8"/>
    <circle r="24" fill="none" stroke="#c9c2ae" stroke-width="2"/>
  `);
}

/* ---------- Amerika: Freiheitsstatue, Fähre, Delfin ---------- */

function libertyStatue(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(95, 0, -90)}
    <rect x="-55" y="50" width="110" height="26" rx="3" fill="#b8a888" stroke="#a89878" stroke-width="3"/>
    <rect x="-45" y="-10" width="90" height="62" fill="#c9b8a0" stroke="#a89878" stroke-width="3"/>
    <rect x="-36" y="-24" width="72" height="16" rx="2" fill="#b8a888" stroke="#a89878" stroke-width="2.5"/>
    <path d="M -34 -26 L -20 -118 L 20 -118 L 34 -26 Z" fill="#7fbfa8" stroke="#5fa88e" stroke-width="3"/>
    <path d="M -14 -30 Q -10 -70 -8 -100 M 6 -30 Q 8 -70 9 -100 M 20 -30 Q 18 -60 16 -84"
      stroke="#5fa88e" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M -18 -108 L -42 -82 L -33 -73 L -13 -97 Z" fill="#7fbfa8" stroke="#5fa88e" stroke-width="2"/>
    <g transform="rotate(-15 -42 -80)"><rect x="-52" y="-94" width="20" height="28" rx="3" fill="#8fcbb5" stroke="#5fa88e" stroke-width="2"/></g>
    <path d="M 15 -112 L 33 -168 L 44 -164 L 27 -108 Z" fill="#7fbfa8" stroke="#5fa88e" stroke-width="2"/>
    <path d="M 31 -176 L 49 -170" stroke="#5fa88e" stroke-width="9" stroke-linecap="round"/>
    <g class="torch">
      <path d="M 40 -180 Q 32 -198 40 -212 Q 43 -200 47 -196 Q 49 -206 52 -210 Q 54 -194 48 -182 Z"
        fill="#ffd23e" stroke="#f5a340" stroke-width="2"/>
    </g>
    <circle cx="0" cy="-132" r="17" fill="#8fcbb5" stroke="#5fa88e" stroke-width="2.5"/>
    <path d="M -15 -141 L -21 -160 M -8 -145 L -10 -166 M 0 -147 L 0 -170 M 8 -145 L 10 -166 M 15 -141 L 21 -160"
      stroke="#7fbfa8" stroke-width="5" stroke-linecap="round"/>
    <path d="M -16 -139 Q 0 -149 16 -139" stroke="#5fa88e" stroke-width="4" fill="none"/>
    <circle cx="-6" cy="-133" r="2.2" fill="#3a2c20"/><circle cx="6" cy="-133" r="2.2" fill="#3a2c20"/>
    <path d="M -5 -127 Q 0 -123 5 -127" stroke="#3a2c20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="-11" cy="-128" r="2.6" fill="#ff9d9d" opacity="0.5"/>
    <circle cx="11" cy="-128" r="2.6" fill="#ff9d9d" opacity="0.5"/>
  </g>`;
}

function usFlag() {
  return `<g>
    <rect width="34" height="22" fill="#fff" stroke="#c9c2ae" stroke-width="1"/>
    <rect width="34" height="3.2" y="2.8" fill="#e0634e"/>
    <rect width="34" height="3.2" y="9.2" fill="#e0634e"/>
    <rect width="34" height="3.2" y="15.6" fill="#e0634e"/>
    <rect width="14" height="11" fill="#3f5fa8"/>
    <circle cx="3.5" cy="3.5" r="1" fill="#fff"/><circle cx="8" cy="5.5" r="1" fill="#fff"/>
    <circle cx="3.5" cy="8" r="1" fill="#fff"/><circle cx="11" cy="2.8" r="1" fill="#fff"/>
  </g>`;
}

function ferryBoat(s = 1, withLia = true) {
  return `<g transform="scale(${s})">
    ${hit(95, 0, -18)}
    <path d="M -82 0 L 82 0 L 62 36 L -62 36 Z" fill="#e0634e" stroke="#b94a38" stroke-width="3"/>
    <path d="M -82 0 L 82 0 L 78 10 L -78 10 Z" fill="#fff"/>
    <rect x="-48" y="-36" width="72" height="36" rx="6" fill="#fff" stroke="#c9dcea" stroke-width="2.5"/>
    <circle cx="-32" cy="-18" r="6.5" fill="#7ec8f0" stroke="#5eb3d8" stroke-width="1.5"/>
    <circle cx="-10" cy="-18" r="6.5" fill="#7ec8f0" stroke="#5eb3d8" stroke-width="1.5"/>
    <circle cx="12" cy="-18" r="6.5" fill="#7ec8f0" stroke="#5eb3d8" stroke-width="1.5"/>
    <rect x="34" y="-56" width="15" height="24" rx="3" fill="#5eb3d8" stroke="#3f92ba" stroke-width="2"/>
    <circle class="steam floaty" cx="42" cy="-66" r="7" fill="#fff" opacity="0.8"/>
    <path d="M -64 -2 L -64 -62" stroke="#94683c" stroke-width="4"/>
    <g transform="translate(-64,-62)">${usFlag()}</g>
    ${withLia ? `<g transform="translate(60,-50)">${lia(0.42)}</g>` : ""}
  </g>`;
}

function dolphinFig(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(64, 0, -8)}
    <path d="M -2 -30 Q 3 -50 15 -52 Q 13 -37 6 -28 Z" fill="#7ba8c9" stroke="#5a86a8" stroke-width="2.5"/>
    <path d="M -50 10 Q -64 2 -72 -12 Q -57 -9 -49 -2 Q -54 -17 -49 -26 Q -40 -12 -43 3 Z" fill="#7ba8c9" stroke="#5a86a8" stroke-width="2.5"/>
    <path d="M -50 10 Q -30 -34 10 -30 Q 50 -26 58 4 Q 40 20 0 20 Q -30 20 -50 10 Z" fill="#7ba8c9" stroke="#5a86a8" stroke-width="3"/>
    <ellipse cx="8" cy="8" rx="30" ry="9" fill="#dfeef7" opacity="0.9"/>
    <path d="M 56 0 Q 70 3 72 8 Q 62 13 52 10 Z" fill="#7ba8c9" stroke="#5a86a8" stroke-width="2"/>
    <circle cx="36" cy="-8" r="3.6" fill="#3a2c20"/><circle cx="37" cy="-9" r="1.3" fill="#fff"/>
    <path d="M 46 7 Q 53 11 60 7" stroke="#2f5a78" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="43" cy="-1" r="3.4" fill="#ff9d9d" opacity="0.55"/>
  </g>`;
}

function buoy(s = 1) {
  return `<g transform="scale(${s})">
    ${hit(46, 0, -20)}
    <ellipse cx="0" cy="10" rx="24" ry="8" fill="#c14a38"/>
    <path d="M -20 8 L -12 -34 L 12 -34 L 20 8 Z" fill="#e0634e" stroke="#b94a38" stroke-width="2.5"/>
    <path d="M -16 -8 L 16 -8 L 17.5 0 L -17.5 0 Z" fill="#fff"/>
    <rect x="-8" y="-48" width="16" height="16" rx="3" fill="#ffd23e" stroke="#e8a62c" stroke-width="2"/>
    <circle cx="0" cy="-40" r="4" fill="#f5a340"/>
  </g>`;
}

function nySkyline() {
  const win = (x, y) => `<rect x="${x}" y="${y}" width="6" height="8" rx="1" fill="#eef7fd" opacity="0.8"/>`;
  return `<g>
    <g fill="#a8c4d9" stroke="#8fb0c9" stroke-width="2">
      <rect x="30" y="290" width="58" height="150" rx="3"/>
      <rect x="98" y="250" width="46" height="190" rx="3"/>
      <rect x="154" y="305" width="62" height="135" rx="3"/>
      <rect x="226" y="215" width="44" height="225" rx="3"/>
      <path d="M 238 215 L 244 178 L 252 178 L 258 215 Z"/>
      <path d="M 246 178 L 246 158 L 250 158 L 250 178 Z"/>
      <rect x="280" y="280" width="52" height="160" rx="3"/>
      <rect x="342" y="245" width="40" height="195" rx="3"/>
      <rect x="392" y="315" width="58" height="125" rx="3"/>
    </g>
    ${win(46, 310)}${win(64, 310)}${win(46, 335)}${win(64, 335)}
    ${win(112, 270)}${win(128, 270)}${win(112, 296)}${win(128, 296)}
    ${win(170, 325)}${win(190, 325)}${win(170, 350)}
    ${win(238, 240)}${win(254, 240)}${win(238, 266)}${win(254, 266)}${win(238, 292)}
    ${win(294, 300)}${win(312, 300)}${win(294, 326)}
    ${win(352, 265)}${win(368, 265)}${win(352, 291)}
    ${win(406, 335)}${win(424, 335)}
  </g>`;
}

/* Lia reagiert überall gleich – wird vom Blumenbeet und vom Strand genutzt */
function wireLia(svg, api) {
  const liaEl = svg.querySelector("#lia");
  if (!liaEl) return;
  const liaInner = liaEl.querySelector(":scope > .inner");
  const actions = [
    () => {
      api.play("hello");
      api.speak("Hallo, ich bin Lia!", "kind");
      const arm = liaEl.querySelector(".liaArm");
      if (arm) arm.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(0deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(0deg)" }],
        { duration: 1000 });
    },
    () => {
      api.play("boing");
      api.speak("Hurra!", "kind");
      liaInner.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-55px)" }, { transform: "translateY(0)" }, { transform: "translateY(-30px)" }, { transform: "translateY(0)" }],
        { duration: 1100, easing: "ease-in-out" });
    },
    () => {
      api.play("whee");
      api.speak("Juhu, ein Purzelbaum!", "kind");
      liaInner.style.transformBox = "fill-box";
      liaInner.style.transformOrigin = "center";
      liaInner.animate(
        [{ transform: "translateY(0) rotate(0deg)" }, { transform: "translateY(-45px) rotate(180deg)" }, { transform: "translateY(0) rotate(360deg)" }],
        { duration: 1200, easing: "ease-in-out" });
    },
    () => {
      api.play("chime");
      api.speak("Hihi, das kitzelt!", "kind");
      liaInner.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0deg)" }],
        { duration: 800 });
    },
  ];
  let last = -1;
  liaEl.addEventListener("pointerdown", () => {
    let i;
    do { i = Math.floor(Math.random() * actions.length); } while (i === last);
    last = i;
    actions[i]();
  });
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
  squirrel: `<svg viewBox="-60 -75 120 130">${squirrel(1.3)}</svg>`,
  bird:     `<svg viewBox="-55 -45 110 90">${winterBird(1.8)}</svg>`,
  snowman:  `<svg viewBox="-75 -205 150 230">${snowman(1, true)}</svg>`,
  crab:     `<svg viewBox="-60 -70 120 115">${crabFig(1.3, true)}</svg>`,
  starfish: `<svg viewBox="-55 -55 110 110">${starfishFig(1.5)}</svg>`,
  liberty:  `<svg viewBox="-80 -235 160 330">${libertyStatue(1)}</svg>`,
  dolphin:  `<svg viewBox="-88 -70 176 105">${dolphinFig(1.1)}</svg>`,
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

    ${wrap(160, 470, 1, `id="lia" class="pokeable"`, lia(1))}
    ${wrap(735, 470, 1, `id="cat" class="pokeable" data-sound="meow" data-action="pounce"`, cat(1))}

    ${wrap(300, 640, 1, `class="pokeable" data-sound="pop" data-action="bloom"`, flower("#ff8fab"), "swaying")}
    ${wrap(390, 655, 0.85, `class="pokeable" data-sound="pop" data-action="bloom"`, flower("#b892e0", "#fff3b0"), "swaying")}
    ${wrap(240, 660, 0.7, `class="pokeable" data-sound="pop" data-action="bloom"`, tulip("#f5a340", 1.3))}
    ${wrap(460, 648, 0.75, `class="pokeable" data-sound="pop" data-action="bloom"`, tulip("#e84c3d", 1.3))}

    ${wrap(430, 500, 1, `id="ladybug" class="pokeable" data-sound="chirp" data-action="loop"`, `
      <path d="M -30 14 Q 0 2 34 12 Q 20 26 -6 24 Z" fill="#74b95a"/>
      <g transform="translate(0,-2)">${ladybug(1)}</g>
    `)}
    ${wrap(700, 665, 0.9, `id="snail" class="pokeable" data-sound="boing" data-action="peek"`, snail(1))}

    <g id="mound" transform="translate(560,640)">
      <ellipse rx="46" ry="16" fill="#6e4526"/>
      ${t1 ? "" : `<g class="sprout swaying"><path d="M 0 -6 Q -1 -18 0 -24" stroke="#5f9e45" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 0 -22 Q -10 -28 -12 -36 Q -2 -34 0 -24 Q 8 -30 12 -38 Q 2 -36 0 -24" fill="#74b95a"/></g>`}
    </g>
    <g id="bigflower" transform="translate(560,640)">
      ${t1 ? `<g transform="translate(0,-128)">${flower("#ffb3c8", "#ffd23e", 1.15)}</g>` : ""}
    </g>
    ${t1 ? butterfly(660, 470, 1, "#b892e0", "") : ""}
    ${t2 ? wrap(524, 540, 0.8, `class="pokeable" data-sound="buzz" data-action="loop"`, bee(1), "floaty") : ""}

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
          setTimeout(() => api.complete("t1"), 1500);
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
          api.complete("t2");
        }, 700);
        return true;
      });
    }

    /* Lia macht bei jedem Antippen etwas anderes */
    wireLia(svg, api);

    /* Die Katze wedelt mit dem Schwanz */
    const catEl = svg.querySelector("#cat");
    if (catEl) catEl.addEventListener("pointerdown", () => {
      const tail = catEl.querySelector(".catTail");
      if (tail) {
        tail.style.transformBox = "fill-box";
        tail.style.transformOrigin = "10% 95%";
        tail.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(24deg)" }, { transform: "rotate(-8deg)" }, { transform: "rotate(18deg)" }, { transform: "rotate(0deg)" }],
          { duration: 1100, easing: "ease-in-out" });
      }
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
    ${wrap(80, 545, 0.95, `id="dog" class="pokeable" data-sound="woof"`, dog(1))}

    ${lilypad(330, 620, 1, true)}
    ${lilypad(760, 620, 0.85)}
    <g transform="translate(640,505)">${lilypad(0, 32, 1.1)}</g>

    ${wrap(640, 505, 1, `id="frog" class="pokeable" data-sound="croak" data-action="bigBounce"`, frog(1), t3 ? "" : "")}

    ${wrap(450, 555, 1, `id="mama" class="pokeable" data-sound="quack" data-action="dip"`, duck(1.1), "bobbing")}
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
            api.complete("t3");
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
          api.complete("t4");
        }, 900);
        return true;
      });
    }

    /* Der Hund wedelt und hüpft */
    const dogEl = svg.querySelector("#dog");
    if (dogEl) dogEl.addEventListener("pointerdown", () => {
      const tail = dogEl.querySelector(".dogTail");
      if (tail) {
        tail.style.transformBox = "fill-box";
        tail.style.transformOrigin = "10% 90%";
        tail.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(22deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(22deg)" }, { transform: "rotate(0deg)" }],
          { duration: 900, easing: "ease-in-out" });
      }
      const inner = dogEl.querySelector(":scope > .inner");
      inner.classList.remove("happyBounce");
      void inner.getBoundingClientRect();
      inner.classList.add("happyBounce");
      setTimeout(() => inner.classList.remove("happyBounce"), 1500);
    });
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

    ${wrap(310, 440, 1, `id="treetop" class="pokeable" data-sound="whoosh" data-action="shiver"`, appleTree(1.15))}

    <g transform="translate(430,388)">${wrap(0, 0, 1, `id="nest" class="pokeable" data-sound="peep"`, nestChick(1))}</g>

    ${wrap(316, 590, 1, `id="squirrel" class="pokeable" data-sound="chirp" data-action="bigBounce"`, squirrel(1))}

    ${mushroom(150, 660, 1.1)}
    ${mushroom(197, 668, 0.75)}
    ${berryBush(80, 590, 1)}
    ${grassTuft(560, 560, 1.2)}
    ${grassTuft(940, 600, 1.4)}
    ${grassTuft(700, 680, 1.2)}
    ${wrap(610, 480, 0.8, `class="pokeable" data-sound="pop" data-action="bloom"`, flower("#f5a340", "#fff3b0"), "swaying")}

    ${wrap(830, 610, 1, `id="hedgehog" class="pokeable" data-sound="snuffle" data-action="bigBounce"`, hedgehog(1))}

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
          api.complete(taskId);
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
          api.complete("t6");
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
   SZENE 4 – Der Herbstwald
   ================================================================ */

const sceneAutumn = {
  id: "autumn",
  tasks: [
    { id: "t8", source: "#acorn", target: "#squirrel2" },
    { id: "t9", source: "#leafpile", target: "#hedgehog2" },
  ],
  html(done) {
    const t8 = done("t8"), t9 = done("t9");
    return `
    <defs>
      <linearGradient id="aSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd9a0"/><stop offset="1" stop-color="#fff3dd"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#aSky)"/>
    ${sun(880, 110)}
    ${cloud(320, 80, 0.85)}
    ${cloud(620, 130, 0.6)}
    <path d="M 0 410 Q 280 350 560 410 Q 810 455 1000 400 L 1000 700 L 0 700 Z" fill="#d9b25e"/>
    <path d="M 0 520 Q 400 470 1000 530 L 1000 700 L 0 700 Z" fill="#c49a4a"/>

    ${wrap(170, 460, 1.25, `id="atree1" class="pokeable" data-sound="whoosh" data-action="shiver"`, autumnTree(1))}
    ${wrap(880, 500, 0.9, `class="pokeable" data-sound="whoosh" data-action="shiver"`, autumnTree(1))}

    ${wrap(560, 590, 1, `class="pokeable" data-sound="whoosh" data-action="shiver"`, `
      ${hit(60, 0, -6)}
      <ellipse cx="0" cy="4" rx="52" ry="18" fill="#d9772e"/>
      <ellipse cx="-20" cy="-8" rx="28" ry="14" fill="#e8963e"/>
      <ellipse cx="22" cy="-6" rx="26" ry="13" fill="#f0b04a"/>
      <ellipse cx="0" cy="-16" rx="22" ry="11" fill="#c9552e"/>
    `)}

    ${pumpkin(920, 665, 1.1)}
    ${mushroom(80, 655, 1)}
    ${mushroom(120, 668, 0.7)}
    ${grassTuft(420, 560, 1.2, "#a8823c")}
    ${grassTuft(700, 680, 1.3, "#a8823c")}
    ${grassTuft(960, 590, 1.1, "#a8823c")}

    ${wrap(250, 620, 1.35, `id="squirrel2" class="pokeable" data-sound="chirp" data-action="bigBounce"`, squirrel(1))}
    ${t8 ? `<g transform="translate(300,635)">${acorn(0.85)}</g>` : ""}
    ${!t8 ? wrap(490, 660, 1, `id="acorn" class="grabbable"`, acorn(1), "bobbing") : ""}

    ${wrap(790, 620, 1.05, `id="hedgehog2" class="pokeable" data-sound="snuffle" data-action="bigBounce"`, hedgehog(1))}
    ${t9 ? `<g transform="translate(796,596)">
        ${leaf("#e8963e", 1.1, -30)}
        <g transform="translate(26,8)">${leaf("#d9772e", 1, 35)}</g>
        <g transform="translate(-22,10)">${leaf("#f0b04a", 0.95, -60)}</g>
        <g class="inner twinkling" transform="translate(46,-48)">
          <circle r="4" fill="#fff" opacity="0.8"/><circle cx="12" cy="-12" r="6" fill="#fff" opacity="0.7"/>
        </g>
      </g>`
      : wrap(400, 645, 1, `id="leafpile" class="grabbable"`, leafBundle(1), "bobbing")}

    ${fallingLeaves(7)}
    ${butterfly(660, 300, 0.8, "#d9772e")}
    `;
  },
  init(svg, api) {
    if (!api.done("t8")) {
      api.drag("#acorn", "#squirrel2", 120, (acornEl) => {
        const sq = svg.querySelector("#squirrel2");
        api.play("munch");
        acornEl.classList.add("fadeOut");
        setTimeout(() => acornEl.remove(), 500);
        sq.querySelector(":scope > .inner").classList.add("happyBounce");
        const tail = sq.querySelector(".sqTail");
        if (tail) tail.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(18deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0deg)" }],
          { duration: 800 });
        setTimeout(() => {
          api.play("success");
          api.complete("t8");
        }, 1000);
        return true;
      });
    }
    if (!api.done("t9")) {
      api.drag("#leafpile", "#hedgehog2", 120, (leavesEl) => {
        api.play("whoosh");
        api.play("snuffle");
        leavesEl.setAttribute("transform", "translate(796,596) scale(1)");
        leavesEl.classList.remove("grabbable");
        const hog = svg.querySelector("#hedgehog2");
        hog.querySelector(":scope > .inner").classList.add("happyBounce");
        setTimeout(() => {
          api.play("success");
          api.complete("t9");
        }, 1000);
        return true;
      });
    }
  },
};

/* ================================================================
   SZENE 5 – Der Winter
   ================================================================ */

const sceneWinter = {
  id: "winter",
  tasks: [
    { id: "t10", source: "#seeds", target: "#feeder" },
    { id: "t11", source: "#carrot", target: "#snowmanTarget" },
  ],
  html(done) {
    const t10 = done("t10"), t11 = done("t11");
    return `
    <defs>
      <linearGradient id="wSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b8d8ec"/><stop offset="1" stop-color="#e8f3fb"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#wSky)"/>
    ${wrap(880, 110, 1, `class="pokeable" data-sound="chime" data-action="pulse"`, `
      <circle r="48" fill="#fff8e0" stroke="#f0e4b8" stroke-width="4" opacity="0.9"/>
      ${face(1.3)}
    `)}
    ${cloud(280, 80, 0.9)}
    ${cloud(560, 120, 0.65)}
    <path d="M 0 420 Q 280 360 560 420 Q 810 465 1000 410 L 1000 700 L 0 700 Z" fill="#eef5fb"/>
    <path d="M 0 530 Q 400 480 1000 540 L 1000 700 L 0 700 Z" fill="#ffffff"/>

    ${wrap(90, 640, 1.15, `class="pokeable" data-sound="whoosh" data-action="shiver"`, firTree(1))}
    ${wrap(950, 620, 0.95, `class="pokeable" data-sound="whoosh" data-action="shiver"`, firTree(1))}
    ${wrap(560, 560, 0.6, `class="pokeable" data-sound="whoosh" data-action="shiver"`, firTree(1))}

    ${wrap(300, 655, 1, `id="snowmanFig" class="pokeable" data-sound="boing" data-action="dance"`, snowman(1, t11))}
    <g id="snowmanTarget" transform="translate(300,510)"><circle r="46" fill="transparent"/></g>
    ${!t11 ? wrap(470, 668, 1, `id="carrot" class="grabbable"`, carrot(1), "bobbing") : ""}

    ${wrap(760, 655, 1, `id="feeder"`, birdFeeder(1, t10))}
    ${t10
      ? `${wrap(714, 572, 0.8, `class="pokeable" data-sound="chirp" data-action="flutter"`, winterBird(1), "bobbing")}
         ${wrap(806, 572, 0.8, `class="pokeable" data-sound="chirp" data-action="flutter"`, winterBird(1, "#f0b04a"), "bobbing")}`
      : `${wrap(650, 665, 0.9, `id="wbird1" class="pokeable" data-sound="chirp" data-action="flutter"`, winterBird(1), "bobbing")}
         ${wrap(870, 668, 0.9, `id="wbird2" class="pokeable" data-sound="chirp" data-action="flutter"`, winterBird(1, "#f0b04a"), "bobbing")}`}
    ${!t10 ? wrap(560, 660, 1, `id="seeds" class="grabbable"`, seedBag(1)) : ""}

    ${wrap(170, 640, 1, `id="bunny" class="pokeable" data-sound="hop"`, bunny(1))}
    ${snowflakes(12)}
    `;
  },
  init(svg, api) {
    if (!api.done("t10")) {
      api.drag("#seeds", "#feeder", 130, (bagEl) => {
        api.play("pop");
        const inner = bagEl.querySelector(":scope > .inner");
        inner.style.transformOrigin = "center";
        inner.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(-120deg)" }, { transform: "rotate(-120deg)" }],
          { duration: 900, fill: "forwards" });
        bagEl.classList.add("fadeOut");
        setTimeout(() => bagEl.remove(), 900);
        /* Die Vögel fliegen sofort zum Häuschen */
        const b1 = svg.querySelector("#wbird1");
        const b2 = svg.querySelector("#wbird2");
        if (b1) b1.querySelector(":scope > .inner").animate(
          [{ transform: "translate(0,0)" }, { transform: "translate(70px,-100px)" }],
          { duration: 1100, easing: "ease-in-out", fill: "forwards" });
        if (b2) b2.querySelector(":scope > .inner").animate(
          [{ transform: "translate(0,0)" }, { transform: "translate(-70px,-105px)" }],
          { duration: 1200, easing: "ease-in-out", fill: "forwards" });
        setTimeout(() => api.play("chirp"), 900);
        setTimeout(() => {
          api.play("success");
          api.complete("t10");
        }, 1400);
        return true;
      });
    }
    if (!api.done("t11")) {
      api.drag("#carrot", "#snowmanTarget", 110, (carrotEl) => {
        api.play("chime");
        carrotEl.classList.add("fadeOut");
        setTimeout(() => carrotEl.remove(), 400);
        const sm = svg.querySelector("#snowmanFig");
        api.sparkleBurst(300, 510);
        sm.querySelector(":scope > .inner").classList.add("happyBounce");
        setTimeout(() => {
          api.play("success");
          api.complete("t11");
        }, 1000);
        return true;
      });
    }
    const bun = svg.querySelector("#bunny");
    if (bun) bun.addEventListener("pointerdown", () => {
      bun.querySelector(":scope > .inner").animate(
        [{ transform: "translate(0,0)" }, { transform: "translate(-30px,-55px)" }, { transform: "translate(-60px,0)" }, { transform: "translate(-30px,-45px)" }, { transform: "translate(0,0)" }],
        { duration: 1400, easing: "ease-in-out" });
    });
  },
};

/* ================================================================
   SZENE 6 – Urlaub am Strand
   ================================================================ */

const sceneBeach = {
  id: "beach",
  tasks: [
    { id: "t12", source: "#shell", target: "#crab" },
    { id: "t13", source: "#starfish", target: "#seaTarget" },
  ],
  html(done) {
    const t12 = done("t12"), t13 = done("t13");
    return `
    <defs>
      <linearGradient id="bSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8ed4f7"/><stop offset="1" stop-color="#e0f5ff"/>
      </linearGradient>
      <linearGradient id="bSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6fc2e0"/><stop offset="1" stop-color="#3f92ba"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#bSky)"/>
    ${sun(880, 100)}
    ${cloud(300, 80, 0.9)}
    ${cloud(580, 120, 0.6)}
    <path id="sea" d="M 0 380 Q 80 368 160 380 Q 240 392 320 380 Q 400 368 480 380 Q 560 392 640 380 Q 720 368 800 380 Q 880 392 1000 378 L 1000 620 L 0 620 Z" fill="url(#bSea)"/>
    <path d="M 60 430 Q 150 420 240 430 M 420 470 Q 510 460 600 470 M 700 425 Q 780 417 860 425" stroke="#bfe8f7" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/>
    <g id="seaTarget" transform="translate(520,470)"><circle r="110" fill="transparent"/></g>
    <path d="M 0 600 Q 250 560 500 585 Q 760 610 1000 575 L 1000 700 L 0 700 Z" fill="#f0dcae"/>
    <path d="M 0 640 Q 400 615 1000 635 L 1000 700 L 0 700 Z" fill="#e8cf9a"/>

    ${wrap(160, 415, 1, ``, sailboat(1), "bobbing")}
    ${wrap(600, 210, 1, `id="seagull" class="pokeable" data-sound="gull"`, seagull(1), "floaty")}
    ${wrap(75, 435, 1.05, `class="pokeable" data-sound="whoosh"`, palm(1), "swaying")}

    <rect x="160" y="600" width="150" height="66" rx="10" fill="#ff8fab" transform="rotate(-3 235 633)"/>
    <path d="M 175 606 L 185 664 M 205 603 L 215 661 M 235 601 L 245 659 M 265 600 L 275 658 M 292 600 L 300 656" stroke="#fff" stroke-width="7" transform="rotate(-3 235 633)" opacity="0.7"/>
    ${wrap(235, 512, 0.95, `id="lia" class="pokeable"`, lia(1))}

    ${wrap(840, 650, 1, `class="pokeable" data-sound="thud" data-action="bigBounce"`, sandcastle(1))}
    ${beachBall(645, 655, 0.95)}

    ${t13
      ? `<g transform="translate(540,480)"><g class="inner bobbing">${starfishFig(0.95)}</g></g>`
      : wrap(340, 650, 1, `id="starfish" class="grabbable"`, starfishFig(1), "bobbing")}

    ${wrap(740, 615, 1, `id="crab" class="pokeable" data-sound="pop" data-action="scuttle"`, crabFig(1, t12))}
    ${!t12 ? wrap(470, 660, 1, `id="shell" class="grabbable"`, spiralShell(1), "bobbing") : ""}

    ${wrap(660, 450, 0.9, `id="seafish" class="pokeable" data-sound="splash"`, fish(1, "#79c850"), "bobbing")}
    `;
  },
  init(svg, api) {
    wireLia(svg, api);
    if (!api.done("t12")) {
      api.drag("#shell", "#crab", 110, (shellEl) => {
        api.play("pop");
        shellEl.classList.add("fadeOut");
        setTimeout(() => shellEl.remove(), 400);
        const crabEl = svg.querySelector("#crab");
        api.sparkleBurst(740, 590);
        crabEl.querySelector(":scope > .inner").classList.add("happyBounce");
        setTimeout(() => {
          api.play("success");
          api.complete("t12");
        }, 1000);
        return true;
      });
    }
    if (!api.done("t13")) {
      api.drag("#starfish", "#seaTarget", 300, (starEl) => {
        api.play("splash");
        starEl.classList.remove("grabbable");
        starEl.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 500, delay: 300, fill: "forwards" });
        api.sparkleBurst(520, 480);
        setTimeout(() => {
          api.play("success");
          api.complete("t13");
        }, 1000);
        return true;
      });
    }
    const gullEl = svg.querySelector("#seagull");
    if (gullEl) gullEl.addEventListener("pointerdown", () => {
      gullEl.querySelector(":scope > .inner").animate(
        [{ transform: "translate(0,0)" }, { transform: "translate(-160px,-50px)" }, { transform: "translate(80px,-90px)" }, { transform: "translate(0,0)" }],
        { duration: 2400, easing: "ease-in-out" });
    });
    const sf = svg.querySelector("#seafish");
    if (sf) sf.addEventListener("pointerdown", () => {
      sf.querySelector(":scope > .inner").animate(
        [{ transform: "translateY(0) rotate(0deg)" }, { transform: "translateY(-80px) rotate(-20deg)" }, { transform: "translateY(0) rotate(0deg)" }],
        { duration: 800, easing: "ease-out" });
    });
  },
};

/* ================================================================
   SZENE 7 – Amerika: Mit dem Boot zur Freiheitsstatue
   ================================================================ */

const sceneAmerica = {
  id: "america",
  tasks: [
    { id: "t14", source: "#boat", target: "#island" },
    { id: "t15", source: "#snack", target: "#dolphin" },
  ],
  html(done) {
    const t14 = done("t14"), t15 = done("t15");
    return `
    <defs>
      <linearGradient id="usSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8ed4f7"/><stop offset="1" stop-color="#e8f6ff"/>
      </linearGradient>
      <linearGradient id="usSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6fb8d8"/><stop offset="1" stop-color="#3f7fa8"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#usSky)"/>
    ${sun(100, 100)}
    ${cloud(420, 80, 0.85)}
    ${cloud(680, 140, 0.6)}
    ${nySkyline()}
    <path d="M 0 438 Q 250 428 500 438 Q 750 448 1000 436 L 1000 700 L 0 700 Z" fill="url(#usSea)"/>
    <path d="M 80 500 Q 170 492 260 500 M 380 560 Q 470 552 560 560 M 620 480 Q 700 473 780 480 M 200 640 Q 300 632 400 640"
      stroke="#bfe8f7" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>

    <g id="island">
      <ellipse cx="838" cy="590" rx="125" ry="36" fill="#c9b8a0" stroke="#a89878" stroke-width="3"/>
      <ellipse cx="838" cy="580" rx="105" ry="26" fill="#8ccb60"/>
      ${wrap(838, 574, 1, `id="liberty" class="pokeable" data-sound="chime"`, libertyStatue(1))}
    </g>

    ${wrap(390, 200, 0.9, `class="pokeable" data-sound="gull" data-action="loop"`, seagull(1), "floaty")}
    ${wrap(660, 260, 0.65, `class="pokeable" data-sound="gull" data-action="loop"`, seagull(1), "floaty")}
    ${wrap(60, 470, 0.6, ``, sailboat(1), "bobbing")}
    ${wrap(600, 500, 0.9, `id="buoy" class="pokeable" data-sound="chime" data-action="dance"`, buoy(1), "bobbing")}

    ${t14
      ? wrap(680, 570, 0.9, `id="boatDone" class="pokeable" data-sound="horn"`, ferryBoat(1, true), "bobbing")
      : wrap(225, 550, 0.9, `id="boat" class="grabbable"`, ferryBoat(1, true), "bobbing")}

    ${wrap(430, 620, 1, `id="dolphin" class="pokeable" data-sound="whistle"`, dolphinFig(1), "bobbing")}
    ${!t15 ? wrap(180, 660, 1, `id="snack" class="grabbable"`, fish(0.9, "#f5a340"), "bobbing") : ""}
    `;
  },
  init(svg, api) {
    if (!api.done("t14")) {
      api.drag("#boat", "#island", 170, (boatEl) => {
        api.play("horn");
        boatEl.classList.remove("grabbable");
        boatEl.setAttribute("transform", "translate(680,570) scale(0.9)");
        api.play("splash");
        api.sparkleBurst(790, 420);
        const arm = boatEl.querySelector(".liaArm");
        if (arm) arm.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(0deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(0deg)" }],
          { duration: 1100 });
        setTimeout(() => {
          api.play("success");
          api.complete("t14");
        }, 1200);
        return true;
      });
    } else {
      /* Angedockt: Tippen lässt das Horn tuten und Lia winken */
      const boat = svg.querySelector("#boatDone");
      if (boat) boat.addEventListener("pointerdown", () => {
        const arm = boat.querySelector(".liaArm");
        if (arm) arm.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(0deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(0deg)" }],
          { duration: 1000 });
      });
    }

    if (!api.done("t15")) {
      api.drag("#snack", "#dolphin", 130, (fishEl) => {
        api.play("munch");
        fishEl.classList.add("fadeOut");
        setTimeout(() => fishEl.remove(), 400);
        const d = svg.querySelector("#dolphin");
        d.querySelector(":scope > .inner").animate(
          [{ transform: "translate(0,0) rotate(0deg)" },
           { transform: "translate(30px,-170px) rotate(-24deg)", offset: 0.45 },
           { transform: "translate(60px,0) rotate(10deg)", offset: 0.8 },
           { transform: "translate(0,0) rotate(0deg)" }],
          { duration: 1600, easing: "ease-in-out" });
        setTimeout(() => api.play("whistle"), 300);
        setTimeout(() => api.play("splash"), 1300);
        setTimeout(() => {
          api.play("success");
          api.complete("t15");
        }, 1700);
        return true;
      });
    }

    /* Delfin springt beim Antippen */
    const dol = svg.querySelector("#dolphin");
    if (dol) dol.addEventListener("pointerdown", () => {
      dol.querySelector(":scope > .inner").animate(
        [{ transform: "translate(0,0) rotate(0deg)" },
         { transform: "translate(-30px,-150px) rotate(-20deg)", offset: 0.45 },
         { transform: "translate(0,0) rotate(0deg)" }],
        { duration: 1400, easing: "ease-in-out" });
      setTimeout(() => api.play("splash"), 1100);
    });

    /* Die Fackel funkelt, wenn man die Freiheitsstatue antippt */
    const lib = svg.querySelector("#liberty");
    if (lib) lib.addEventListener("pointerdown", () => {
      const torch = lib.querySelector(".torch");
      if (torch) {
        torch.style.transformBox = "fill-box";
        torch.style.transformOrigin = "center bottom";
        torch.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.8)" }, { transform: "scale(1)" }],
          { duration: 900, easing: "ease-in-out" });
      }
      api.sparkleBurst(878, 388);
    });
  },
};

/* ================================================================
   SZENE 8 – Die Nachtwiese  (wird freigespielt)
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
    ${wrap(850, 130, 1, `id="moon" class="pokeable" data-sound="chime" data-action="pulse"`, `
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

    ${wrap(312, 322, 1, `id="owl" class="pokeable" data-sound="hoot" data-action="flutter"`, owl(1))}

    ${grassTuft(500, 640, 1.3, "#3a6647")}
    ${grassTuft(700, 600, 1.1, "#3a6647")}
    ${grassTuft(880, 660, 1.4, "#3a6647")}
    ${grassTuft(100, 620, 1.2, "#3a6647")}
    ${mushroom(620, 640, 0.9)}
    ${wrap(430, 620, 0.7, `class="pokeable" data-sound="pop" data-action="bloom"`, tulip("#b892e0", 1.3))}
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
              api.complete("t7");
            }, 2000);
          }, 700);
        }
      });
    });
  },
};

const SCENES = [sceneGarden, scenePond, sceneTree, sceneAutumn, sceneWinter, sceneBeach, sceneAmerica, sceneNight];
const ALL_TASKS = ["t1", "t2", "t3", "t4", "t5", "t6", "t8", "t9", "t10", "t11", "t12", "t13", "t14", "t15", "t7"];
const UNLOCK_NIGHT_AT = 14;
