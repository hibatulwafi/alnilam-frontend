# Alnilam Frontend

Vue 3 SPA untuk platform Alnilam — marketplace jasa content creator.

**Stack:** Vue 3 + TypeScript + Vite + Tailwind + Pinia + Vue Router

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup env
cp .env.production.example .env.local
# Edit VITE_API_URL kalau backend bukan di localhost:8000

# 3. Start dev server
npm run dev
```

Frontend running di: **http://127.0.0.1:5173**

**Note:** Butuh backend running dulu di `http://127.0.0.1:8000`. Setup backend: [alnilam-backend](../alnilam-backend/).

---

## Demo Credentials

Login page menyediakan quick-login buttons (password: `password`):

- `admin@alnilam.test` — Admin
- `client@alnilam.test` — Client
- `creator@alnilam.test` — Creator

---

## Related Repositories

| Repo | Purpose |
|---|---|
| [alnilam-backend](../alnilam-backend/) | REST API — data source |
| **alnilam-frontend** (this) | Vue 3 SPA |
| [alnilam-demo](../alnilam-demo/) | Orchestration (run keduanya bersamaan) |

---

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Frontend design
- [COMPONENTS.md](docs/COMPONENTS.md) — Design system & components
- [API-INTEGRATION.md](docs/API-INTEGRATION.md) — **⭐ Bagaimana consume backend**
- [STATE-MANAGEMENT.md](docs/STATE-MANAGEMENT.md) — Pinia patterns
- [ROUTING.md](docs/ROUTING.md) — Vue Router + guards
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel deploy
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) — Dev workflow

---

## Scripts

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # Production build ke dist/
npm run preview      # Preview production build lokal
npm run type-check   # TypeScript check tanpa build
```

---

## Tech Stack Detail

| Layer | Tech | Version |
|---|---|---|
| Framework | Vue | 3.5 |
| Language | TypeScript | 5.9 |
| Build | Vite | 7.x |
| CSS | Tailwind CSS | 3.4 |
| State | Pinia | 2.x |
| Router | Vue Router | 4.x |
| HTTP | Axios | latest |

---

## For AI Coding Agents

Repository ini punya [CLAUDE.md](CLAUDE.md) + agents di `.claude/agents/`.

Agents:
- `vue-expert` — Vue 3 Composition API patterns
- `ui-designer` — Tailwind + design system
- `api-consumer` — HTTP integration & type safety

---

## License / IP

Copyright © [NAMA_VENDOR] & [NAMA_KLIEN]. All rights reserved. Confidential.
