# 🌻 Lia’s Garten

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
| 🍂 Herbstwald | Eichel zum Eichhörnchen, Blätter zum Igel bringen | Wintervorräte, Winterschlaf im Blätternest |
| ⛄ Winter | Körner ins Vogelhäuschen streuen, Schneemann-Nase | Vögel füttern im Winter |
| 🏖️ Strand-Urlaub | Schneckenhaus zum Einsiedlerkrebs, Seestern ins Meer | Wo Einsiedlerkrebse wohnen, Seesterne brauchen Wasser |
| 🗽 Amerika | Mit dem Boot zur Freiheitsstatue fahren, Delfin füttern | Die Freiheitsstatue steht auf einer Insel, Delfine leben im Meer |
| 🌙 Nachtwiese *(großes Finale, wird freigespielt)* | Alle Glühwürmchen zum Leuchten bringen | Warum Glühwürmchen leuchten |

Dazu ist **alles in jeder Szene antippbar**: Sonne, Wolken, Schnecke,
Marienkäfer, Eichhörnchen, Fische, Sterne … alles wackelt, klingt und
reagiert — es gibt kein Falsch, kein Verlieren und keinen Zeitdruck.

## Die wichtigsten Funktionen

- **Aufgaben-Karten:** Beim Betreten einer Szene lädt eine Karte mit einem
  Natur-Fakt zum Handeln ein („Igel lieben Äpfel! Bringst du dem Igel einen
  Apfel?") und wird auf Deutsch vorgelesen. Nach dem Lösen folgt eine
  Lob-Karte — perfekt für Kinder, die noch nicht lesen können.
- **Glühwürmchen-Hilfe:** Nach kurzer Zeit ohne Fortschritt (oder per
  Knopfdruck oben rechts) fliegt ein Glühwürmchen zum nächsten möglichen
  Schritt und lässt Start und Ziel funkeln. Ein Festhängen ist dadurch
  unmöglich.
- **Lia macht mit:** Wird Lia angetippt, winkt sie, springt, kichert oder
  macht einen Purzelbaum — mit passender Sprachausgabe („Hallo, ich bin
  Lia!", „Hurra!", „Juhu, ein Purzelbaum!").
- **Tierstimmen:** Frosch quakt, Enten schnattern, die Eule ruft huhu,
  Vögel zwitschern, die Katze miaut und der Hund bellt — jedes Tier
  antwortet auf Berührung mit Bewegung, Funkeln und seinem Laut.
- **Sterne-Fortschritt:** Sieben Sterne führen zum großen Finale mit
  Sternenregen. Mit sechs Sternen öffnet sich die geheime Nachtwiese.
- **Klangwelt & Musik:** Alle Geräusche und eine sanfte, selbst komponierte
  Hintergrundmelodie werden live mit der Web-Audio-API erzeugt. Musik und
  Geräusche sind getrennt abschaltbar (Noten- und Lautsprecher-Knopf).
- **Neustart-Knopf:** Der runde Pfeil oben rechts setzt das Spiel nach
  einer kindgerechten Bestätigungsfrage auf den Anfang zurück.
- **Speichern:** Der Fortschritt bleibt im Browser erhalten
  (`localStorage`). Alternativ setzt auch `index.html?reset` zurück.

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
