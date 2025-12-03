# BahnPlanNext Frontend

## Projektstruktur

Die Projektstruktur im Verzeichnis **frontend** orientiert sich an üblichen vite Projekten.

- `.react-router` - ein Ordner mit durch React Router generierten temporären Typescript Dateien.
- `node_modules` - beinhaltet durch pnpm installierte Packete.
- `public` - für statische Assets, wie zum Beispiel Fonts.
- `.oxlintrc.json` - config Datei für Oxlint, Eslint ähnlicher Syntax.
- `.dockerignore` & `.prettierignore` - Datei und Ordner ignore Dateien für Docker und Prettier.
- `.prettierrc.json` - config Datei für den Formatter Prettier.
- `Dockerfile` - Docker image für Frontend server.
- `package.json` - Pnpm (npm) project config, mit ausführbaren Skripts und Packet Abhängigkeiten.
- `pnpm-lock.yaml` - Pnpm Packet Abhängigkeiten Installationsplan Datei (sehr groß, aber gut zu mergen).
- `react-router.config.ts` - React Router spezifische Configuration.
- `tsconfig.json` - Typescript Configuration.
- `vite.config.ts` - Vite config mit Tailwind, React Router und Tsconfig plugins, beinhaltet auch Vitest config unter `test: { ... }`
- `app` - umfasst den gesamten code der React Router App.
- `app/routes` - Ordner für Routen.
- `app/components` - Ordner für Componenten.
- `app/app.css` - beinhaltet globales css und Tailwind import.
- `app/root.tsx` - Root Componente mit ErrorBoundary und Layout, welches html Grundstruktur rendert.
- `app/routes` - exportiert die React Router Routen configuration.

## Links

- [React](https://react.dev/)
- [Tailwind](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Prettier](https://prettier.io/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- [Vitest](https://vitest.dev/)
- [Vite](https://vite.dev/)

## Getting Started

### Setup

Ein Setup Guide, um NodeJs und Pnpm zu installieren, gibt es [hier](../docs/deployment/Frontend-Setup.md).

### Installation

Zuerste müssen die Pakete installiert werden:

```bash
pnpm install
```

Für Tests muss Playwright die Browser Chromium, Firefox und Webkit installieren.

```bash
pnpm dlx playwright install
```

### Development

Der Vite Entwicklungsserver kann gestartet werden, um lokale Änderungen direkt auszuprobieren.

```bash
pnpm run dev
```

Die App sollte dann bei `http://localhost:5173` verfügbar sein.

> Tip: In der Konsole, wo der Befehl `pnpm run dev` ausgeführt wird, gibt es die Möglichkeit `h` zu drücken,
> um die Tastenkürzel des Vite Dev Servers zu sehen. Mit `o` wird die App im Browser geöffnet und mit `q` wird der Server beendet.

## Linter ausführen

```bash
pnpm run lint
```

## Formatter ausführen

```bash
pnpm run format
```

## Tests ausführen

```bash
pnpm run test
```

Oder im Browser Mode um Tests im Browser inspizieren zu können.

```bash
pnpm run test:browser
```

> Da können sogar Componenten und React Tests gerendert betrachtet werden

## Coverage

```bash
pnpm run coverage
```

## Docker Deployment

To build and run using Docker or Podman:

```bash
docker build -t bahnplan-next .

# Run the container
docker run -p 3000:3000 bahnplan-next
```

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

---

Built with ❤️ using React Router.
