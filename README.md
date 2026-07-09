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

## Kapitel und Bilder

Das Spiel ist in **Kapitel** gegliedert; jedes Kapitel enthält mehrere
Bilder (Screens) mit eigenen Aufgaben. Die Sterne-Anzeige gilt pro Bild,
das Kapitel-Menü zeigt den Fortschritt je Kapitel, und wer ein ganzes
Kapitel löst, bekommt eine Feier mit Sternenregen.

| Kapitel | Bilder |
|---|---|
| 🌸 Garten | Blumenbeet · Teich · Apfelbaum · Nachtwiese |
| 🌈 Jahreszeiten | Frühling · Sommer · Herbstwald · Winter |
| 🏖️ Urlaub | Strand · Amerika (Freiheitsstatue) |
| 🎂 Feste | Ostern · Geburtstag · Weihnachten · Silvester |

Insgesamt 14 Bilder mit 27 Aufgaben. Neue Kapitel lassen sich einfach
ergänzen (siehe `ARCHITEKTUR.md`) — die Struktur ist bereits auf
per In-App-Kauf freischaltbare Kapitel vorbereitet.

Dazu ist **alles in jeder Szene antippbar**: Sonne, Wolken, Schnecke,
Marienkäfer, Eichhörnchen, Fische, Sterne … alles wackelt, klingt und
reagiert — es gibt kein Falsch, kein Verlieren und keinen Zeitdruck.

## Die wichtigsten Funktionen

- **Aufgaben-Karten:** Beim Betreten einer Szene lädt eine Karte mit einem
  Natur-Fakt zum Handeln ein („Igel lieben Äpfel! Bringst du dem Igel einen
  Apfel?") und wird auf Deutsch vorgelesen. Nach dem Lösen folgt eine
  Lob-Karte — perfekt für Kinder, die noch nicht lesen können.
- **Aufgaben-Übersicht & Glühwürmchen-Hilfe:** Der Glühwürmchen-Knopf
  zeigt alle Aufgaben des aktuellen Bildes — gelöste mit Haken, offene
  mit einem eigenen Glühwürmchen, das beim Antippen direkt zur Aufgabe
  fliegt und Start und Ziel funkeln lässt. Nach kurzer Zeit ohne
  Fortschritt hilft das Glühwürmchen auch von selbst. Ein Festhängen
  ist unmöglich.
- **Lia macht mit:** Wird Lia angetippt, winkt sie, springt, kichert oder
  macht einen Purzelbaum — mit passender Sprachausgabe („Hallo, ich bin
  Lia!", „Hurra!", „Juhu, ein Purzelbaum!").
- **Tierstimmen:** Frosch quakt, Enten schnattern, die Eule ruft huhu,
  Vögel zwitschern, die Katze miaut und der Hund bellt — jedes Tier
  antwortet auf Berührung mit Bewegung, Funkeln und seinem Laut.
- **Sterne-Fortschritt:** Jede gelöste Aufgabe füllt einen Stern des
  aktuellen Bildes; ein komplett gelöstes Kapitel wird mit Konfetti-
  Sternenregen und einer Jubel-Karte gefeiert.
- **Klangwelt & Musik:** Alle Geräusche und eine sanfte, selbst komponierte
  Hintergrundmelodie werden live mit der Web-Audio-API erzeugt. Musik und
  Geräusche sind getrennt abschaltbar (Noten- und Lautsprecher-Knopf).
- **Ton-Prüfung:** Beim ersten Start fragt das Spiel, ob die Melodie zu
  hören ist (die Frage wird vorgelesen). Bleibt der Ton stumm, probiert
  es einen zweiten Wiedergabe-Weg — und zur Not sprechen die Tiere ihre
  Laute mit der Kinderstimme („Miau!", „Wuff, wuff!"). Die Wahl wird
  gespeichert; `?reset` fragt neu.
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
| `scenes.js` | Kapitel, alle Szenen und sämtliche SVG-Zeichnungen |
| `game.js` | Spiel-Engine: Szenenwechsel, Ziehen & Ablegen, Hilfe, Karten, Speichern |
| `audio.js` | Klangerzeugung mit der Web-Audio-API |

Details zur Kapitel-Struktur und zum Weg in die App Stores: `ARCHITEKTUR.md`.
