# Architektur: Lia’s Garten

## Überblick

Das Spiel ist ein **reines Web-Spiel ohne Abhängigkeiten** (HTML/CSS/JS,
alle Grafiken als SVG, alle Klänge per Web-Audio erzeugt). Genau das macht
es app-tauglich: Derselbe Code läuft im Browser **und** — in eine native
Hülle verpackt — als App im Apple App Store und Google Play Store.

```
┌────────────────────────────────────────────────┐
│                 Spiel-Kern (Web)               │
│  index.html · style.css · scenes.js · game.js  │
│  audio.js                                      │
│  ▸ läuft heute direkt im Browser               │
├────────────────────────────────────────────────┤
│           Capacitor-Hülle (später)             │
│  ▸ iOS-Projekt (Xcode)   ▸ Android (Gradle)    │
│  ▸ Plugin: In-App-Käufe  ▸ Plugin: Haptik usw. │
└────────────────────────────────────────────────┘
```

## Inhalts-Modell: Kapitel → Bilder → Aufgaben

Definiert in `scenes.js`:

```js
const CHAPTERS = [
  {
    id: "garten",         // stabile ID (auch Produkt-ID für den Kauf)
    name: "Garten",       // Anzeigename
    icon: "flower",       // Symbol aus CardIcons
    free: true,           // ohne Kauf spielbar?
    screens: [sceneGarden, scenePond, ...],   // 2–10+ Bilder
  },
  ...
];
```

- **Kapitel** bündeln Bilder zu einem Thema (Garten, Jahreszeiten,
  Urlaub, Feste, …). Neue Kapitel = neuer Eintrag in `CHAPTERS`.
- **Bilder (Screens)** sind eigenständige Szenen mit `id`, `tasks`,
  `html(done)` und `init(svg, api)`. Die Sterne-Anzeige gilt pro Bild.
- **Aufgaben** haben global eindeutige IDs (`t1…`, `s1…`, `e1…`) und
  ihre Texte in `TASK_INFO` (`label` für die Übersicht, `prompt` als
  Einladung, `praise` als Lob, `icon` für die Karten).
- Ist ein Kapitel komplett gelöst, gibt es eine einmalige
  Abschluss-Feier (`save.celebrated`).

### Neues Kapitel anlegen (Checkliste)

1. Szenen schreiben (`scenes.js`): Aufgaben-IDs vergeben, `TASK_INFO`
   ergänzen, ggf. neue Zeichen-Funktionen und `CardIcons`.
2. Kapitel-Eintrag in `CHAPTERS` ergänzen (`free: false` für Kauf-Kapitel).
3. Fertig — Menü, Fortschritt, Hilfe und Feier funktionieren automatisch.

## Freischaltung & In-App-Käufe

Die Spiel-Logik fragt ausschließlich **eine** Funktion (in `game.js`):

```js
const isChapterUnlocked = (ch) => ch.free === true || save.unlocked[ch.id] === true;
```

- Gesperrte Kapitel erscheinen im Menü ausgegraut mit Schloss;
  Antippen zeigt eine kindgerechte Karte („Frag Mama oder Papa").
- **Web heute:** Test-Kapitel stehen auf `free: true`.
- **App später:** Ein Store-Adapter (Capacitor-Plugin, z. B.
  `@revenuecat/purchases-capacitor` oder `cordova-plugin-purchase`)
  validiert den Kauf und ruft dann einfach
  `save.unlocked[chapterId] = true; persist();` auf.
  Kauf-Wiederherstellung („Restore Purchases") schreibt dieselben Flags.
- Kapitel-IDs sind bewusst stabil und produkttauglich
  (`garten`, `jahreszeiten`, `urlaub`, `ereignisse`).

## Schritte zur App (wenn es so weit ist)

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Lia's Garten" "de.example.liasgarten" --web-dir .
npm install @capacitor/ios @capacitor/android
npx cap add ios      # erzeugt ./ios  (Xcode-Projekt)
npx cap add android  # erzeugt ./android (Gradle-Projekt)
npx cap sync         # Web-Dateien in die Apps kopieren
```

Danach: App-Icons/Splashscreens, IAP-Plugin einbinden, Produkte in App
Store Connect / Play Console anlegen, Kinder-Kategorie-Richtlinien
beachten (keine Werbung, Kaufbestätigung durch Eltern — z. B. eine
Eltern-Schranke vor dem Kaufdialog).

Wichtige bereits eingebaute App-Tauglichkeiten:

- Kein Netzwerkzugriff, alles offline (Store-Anforderung für Kinder-Apps ✓)
- Ton-Freischaltung über echte Tipp-Gesten (iOS-WebView-Regeln ✓)
- Ersatz-Tonausgabe für restriktive WebViews ✓
- Fortschritt in `localStorage` (in der App persistent im WebView-Container)

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst, Kopfleiste, Overlays (Karten, Hilfe, Einstellungen) |
| `style.css` | Layout, Kapitel-Menü, Aufgaben-Übersicht, Animationen |
| `scenes.js` | `CHAPTERS`, alle Szenen, `TASK_INFO`, sämtliche SVG-Zeichnungen |
| `game.js` | Engine: Menü, Navigation, Drag & Drop, Hilfe, Karten, Speichern, Entitlements |
| `audio.js` | Klangerzeugung (Web-Audio), Tierstimmen-Baukasten, Ersatz-Wiedergabe, Musik |
