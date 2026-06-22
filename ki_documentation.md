# Dokumentation des KI-Einsatzes

Projekt: Webshop mit KI-gestützter Webentwicklung (Projektauftrag 3)

Kurzüberblick
In diesem Projekt wurden mehrere AI-Tools eingesetzt, um Layout-, Code- und Textbausteine schnell zu erzeugen, Varianten zu prototypisieren und Dokumentation zu verfassen. Ziel war: 100% eigener HTML/CSS-Code in der Auslieferung bei gleichzeitiger Nutzung von AI-Assistenz während der Entwicklung.

Verwendete (kostenlose / lokal einbindbare) Tools
- GitHub Copilot (IDE-Plugin): Eingesetzt in VS Code zur Live-Vervollständigung und Vorschlägen direkt beim Schreiben von HTML/CSS/JS. Viele Boilerplate-Elemente (Header, Grid-Layout, Karten) und CSS-Patterns wurden mit Copilot-Vorschlägen beschleunigt.
- Ollama (lokaler LLM-Runner): Ollama wurde lokal betrieben, um kleinere LLM-Modelle für schnelle Snippet-Generierung und Textvarianten einzusetzen. Ollama erlaubt das Ausführen von Modellen lokal über eine einfache CLI (ohne externe API-Kosten).

Hinweis: Beide Tools wurden lokal bzw. in der Entwicklungsumgebung verwendet; es wurden keine kostenpflichtigen API-Aufrufe in den Produktionscode eingebaut.

Konkrete Integration in den Code
1) GitHub Copilot
- Nutzung: Copilot lief als VS Code-Erweiterung während des Codierens. Vorschläge wurden direkt im Editor akzeptiert oder angepasst.
- Beispiele im Repository:
  - css/styles.css enthält Grid- und Karten-Styles, die während des Tippens von Copilot vorgeschlagen und anschließend verfeinert wurden (z. B. .products-grid, .card, .no-image-Placeholder).
  - HTML-Boilerplate (Header, Footer, Container-Struktur) wurde durch Copilot-Snippets beschleunigt.
- Arbeitsweise: Vorschläge manuell prüfen, an Projekt-Styleguide anpassen, nicht blind übernehmen.

2) Ollama (lokaler LLM-Runner)
- Nutzung: Ollama wurde lokal eingesetzt, um schnell HTML/CSS-Snippets und Textvarianten zu erzeugen. Die Generierung erfolgte per CLI-Aufruf aus einem kleinen Node- oder Shell-Skript; Ergebnisse wurden in temporäre Dateien geschrieben und anschließend geprüft.
- Typischer Workflow:
  1. Entwickler formuliert einen Prompt (z. B. "Erzeuge eine kompakte Produktkarte in HTML mit Bild, Titel und Preis").
  2. Ein kurzes Skript ruft die Ollama-CLI lokal auf und schreibt das Ergebnis in eine temporäre Datei (tmp/card.html).
  3. Entwickler prüft den Vorschlag, passt Klassen/ARIA/Accessibility an und überführt die finale Variante in die Produktseiten (z. B. products.html oder product-pX.html).
- Beispiel-Node-Skript (Prototyp):

```js
// run-ollama.js (Beispiel)
const { execSync } = require('child_process');
const fs = require('fs');
const prompt = 'Erzeuge eine kompakte Produktkarte in HTML mit Bild, Titel und Preis';
// Annahme: 'ollama' ist lokal installiert und ein Modell (z.B. 'llama2') verfügbar
const out = execSync(`ollama run llama2 --prompt "${prompt}"`);
fs.writeFileSync('tmp/card.html', out.toString());
console.log('Snippet in tmp/card.html geschrieben');
```

- Integration im Repo: Das erzeugte tmp/card.html diente als Vorschlag; nach manueller Prüfung wurde die passende Variante in die statischen Produktseiten übernommen.

Beispiele, wo AI geholfen hat
- Layout-Entscheidungen: verschiedene Grid-Varianten (1,2,4 Spalten) wurden schnell generiert und visuell verglichen.
- HTML-Card-Varianten: Ollama lieferte mehrere Varianten, von denen die passendste manuell ausgesucht wurde.
- Texte & Erklärungen: ChatGPT (Konversation) unterstützte die Formulierung von Dokumentationstexten; diese wurden geprüft und in ki_documentation.md übernommen.

Vergleich der verwendeten Tools (kurz)
- Integration: Copilot (IDE) = nahtlos, Ollama (CLI) = leicht integrierbar in lokale Skripte
- Ergebnisqualität: Copilot = gute Boilerplate; Ollama = nützliche Varianten und Textideen; ChatGPT = erklärungsstark für Dokumentation
- Datenschutz/Offline: Ollama-Modelle können lokal betrieben werden (gute Datenschutzkontrolle); Copilot sendet Kontext an GitHub (siehe GitHub-Richtlinien)

Sicherheits- und Ethikhinweise
- Alle automatisch erzeugten Codeschnipsel wurden manuell geprüft (Accessibility, License, Security).
- Keine fremden, urheberrechtlich geschützten Inhalte wurden übernommen. Bei Bildern/Videos wurden Platzhalter genutzt; Produktbilder sollten beim Deployment durch lizenzfreie oder eigene Assets ersetzt werden.

Reproduzierbarkeit / Setup (kurz)
- GitHub Copilot: Als VS Code Extension aktivieren (GitHub Account benötigt). Vorschläge erscheinen inline beim Tippen.
- Ollama (lokal):
  1. Ollama installieren (siehe https://ollama.ai für Anleitungen).
  2. Modell lokal laden, z. B. `ollama pull llama2` (abhängig vom Modell und Lizenz).
  3. Beispielskript ausführen: node run-ollama.js

Hinweis: Für einige Modelle sind größere Ressourcen (RAM/GPU) nötig; für kleine Modelle reicht typischerweise ein moderner CPU.

Fazit und Lernreflexion
- Kombinierter Einsatz von IDE-Assistenz (Copilot) und lokalem LLM-Runner (Ollama) beschleunigte das Erzeugen und Vergleichen von UI-Varianten.
- KI-Tools sind am effektivsten, wenn sie menschliches Review und gestalterische Entscheidungen unterstützen — nicht ersetzen.

Kontakt / Referenz
- Projekt-Root enthält Beispiele (wireframes.md, styleguide.md) und den tatsächlichen Code; diese Dokumentation beschreibt, wie die AI-Assistenz in den Entwicklungsfluss eingebettet wurde.
