# Frontend Setup Guide

## Node.js

Es wird empfohlen, einen **Version Manager** zu verwenden, um unterschiedliche Node.js-Versionen einfach zu verwalten.

### [fnm](https://github.com/Schniz/fnm)

Ein sehr schneller und einfacher Node-Version-Manager, geschrieben in Rust.
Die Installation ist auf **Linux** und **macOS** mit dem automatischen Installationsskript am einfachsten (unter macOS alternativ über Homebrew).
Auf **Windows** empfiehlt sich die Installation über **Winget**.
→ Folge der offiziellen Anleitung im [fnm Repository](https://github.com/Schniz/fnm#installation).

### [Volta](https://volta.sh/)

Alternativ kann **Volta** verwendet werden.
Volta verwaltet Node.js und JavaScript-Tools projektbasiert und funktioniert auch auf **allen Plattformen**.
→ Folge der offiziellen Anleitung auf [volta.sh](https://volta.sh/).

---

## pnpm

Für das Projekt wird **pnpm** als Paketmanager verwendet, da es schnell und ressourcenschonend ist.
Corepack wird aktuell nicht mehr empfohlen, daher sollte pnpm direkt installiert werden.

Empfohlene Installationsmethoden:

- **Systempaketmanager**
  - macOS: `brew install pnpm`
  - Windows: `winget install pnpm` oder `scoop install pnpm`
  - Linux: Siehe [pnpm.io/installation](https://pnpm.io/installation)

- **npm (wenn vorhanden)**
  ```bash
  npm install -g pnpm
  ```

→ Folge der offiziellen Anleitung unter [pnpm.io/installation](https://pnpm.io/installation) für dein Betriebssystem.

---

## Editor

Prettier wird von Zed out-of-the-Box unterstützt, während für VSCode eine Extension benötigt wird, welche [hier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) zu finden ist.
Für Oxlint wird bei beiden eine Extension nötig, welche [hier für VSCode](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) und [für Zed](https://zed.dev/extensions?query=oxc) zu finden sind.

---

## Nächste Schritte

Sobald **Node.js** und **pnpm** installiert sind, überprüfe die Installation mit:

```bash
node -v
pnpm -v
```

Beide Befehle sollten eine Versionsnummer ausgeben.
Falls einer der Befehle nicht gefunden wird, prüfe bitte deine Pfadkonfiguration oder folge erneut der Installationsanleitung des jeweiligen Tools.

Wenn beide Tools korrekt installiert sind, kehre zum [**Frontend README**](../../frontend/README.md#installation) zurück,
um mit dem Projekt Setup fortzufahren und der Entwicklung beginnen zu können.
