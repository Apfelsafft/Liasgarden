# 🌻 Lias Garten

Ein liebevolles Entdecker- und Lernspiel für Kinder von **2 bis 5 Jahren**.
Das Kind erkundet einen handgezeichneten Garten voller süßer Tiere und
Pflanzen, löst kleine Aufgaben durch Antippen und Ziehen und lernt dabei
spielerisch etwas über Natur, Flora und Fauna.

## Spielen

Einfach `index.html` in einem modernen Browser öffnen — es wird nichts
installiert und nichts aus dem Internet geladen. Am schönsten ist das Spiel
auf einem Tablet im Querformat.

Alternativ mit einem kleinen lokalen Server:

```bash
npx serve .
# oder
python3 -m http.server 8000
```

## Was das Kind erlebt

| Szene | Aufgaben | Lernthema |
|---|---|---|
| 🌸 Blumenbeet | Samen gießen, Biene zur Blume bringen | Pflanzen brauchen Wasser & Sonne, Bienen machen Honig |
| 🐸 Teich | Frosch füttern, Entenküken zur Mama bringen | Was Frösche fressen, Entenfamilien |
| 🍎 Apfelbaum | Igel füttern, Vogelküken füttern | Was Igel mögen, wie Vogeleltern füttern |
| 🌙 Nachtwiese *(wird freigespielt)* | Alle Glühwürmchen zum Leuchten bringen | Warum Glühwürmchen leuchten |

Dazu ist **alles in jeder Szene antippbar**: Sonne, Wolken, Schnecke,
Marienkäfer, Eichhörnchen, Fische, Sterne … alles wackelt, klingt und
reagiert — es gibt kein Falsch, kein Verlieren und keinen Zeitdruck.

## Die wichtigsten Funktionen

- **Glühwürmchen-Hilfe:** Nach kurzer Zeit ohne Fortschritt (oder per
  Knopfdruck oben rechts) fliegt ein Glühwürmchen zum nächsten möglichen
  Schritt und lässt Start und Ziel funkeln. Ein Festhängen ist dadurch
  unmöglich.
- **Wissens-Karten:** Nach jeder gelösten Aufgabe erscheint eine Karte mit
  einem kleinen Natur-Fakt, der per Sprachausgabe (deutsch) vorgelesen wird —
  perfekt für Kinder, die noch nicht lesen können.
- **Sterne-Fortschritt:** Sieben Sterne führen zum großen Finale mit
  Sternenregen. Mit sechs Sternen öffnet sich die geheime Nachtwiese.
- **Klangwelt:** Alle Geräusche und die sanfte Hintergrundatmosphäre werden
  live mit der Web-Audio-API erzeugt (abschaltbar über den Ton-Knopf).
- **Speichern:** Der Fortschritt bleibt im Browser erhalten
  (`localStorage`). Zum Zurücksetzen die Seite mit `?reset` öffnen,
  z. B. `index.html?reset`.

## Gestaltung für 2- bis 5-Jährige

- Keine Texte im Spiel selbst — alles funktioniert über Bilder, Symbole und Ton
- Sehr große Tippflächen mit zusätzlichen unsichtbaren Touch-Zonen für kleine Finger
- Nur Tippen und Ziehen, keine komplizierten Gesten
- Sofortige fröhliche Rückmeldung auf jede Berührung
- Kein Scheitern, keine Punkte, kein Zeitdruck, keine Werbung, keine externen Inhalte

## Technik

Reines HTML/CSS/JavaScript ohne Abhängigkeiten:

| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst, Kopfleiste, Overlays |
| `style.css` | Layout und alle CSS-Animationen |
| `scenes.js` | Die vier Szenen und sämtliche SVG-Zeichnungen |
| `game.js` | Spiel-Engine: Szenenwechsel, Ziehen & Ablegen, Hilfe, Karten, Speichern |
| `audio.js` | Klangerzeugung mit der Web-Audio-API |
