# Architecture — Alnilam Frontend

## Overview

Vue 3 **Single Page Application** (SPA) yang konsumsi REST API dari [alnilam-backend](../../alnilam-backend/).

## Application Layers

```
┌────────────────────────────────────────────────┐
│  Router (vue-router) + Guards                  │
│  - Public routes: /, /catalog, /product/:slug  │
│  - Auth routes: /dashboard                     │
│  - Admin routes: /admin/*                      │
└─────────────────────┬──────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  Pages (Views)                                 │
│  - src/pages/*.vue                             │
│  - Compose components + call stores            │
└─────────────────────┬──────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  Stores (Pinia)                                │
│  - src/stores/auth.ts (user, token)            │
│  - Future: cart.ts, notifications.ts           │
└─────────────────────┬──────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  API Client (Axios)                            │
│  - src/api.ts                                  │
│  - Bearer token interceptor                    │
│  - Global error handling                       │
└─────────────────────┬──────────────────────────┘
                      ↓ HTTP JSON
        [alnilam-backend REST API]
```

## Design Principles

### 1. Component-Based UI
Setiap page adalah composition dari components. Pages di `src/pages/`, reusable components di `src/components/` (Phase 2+).

### 2. Type Safety First
- **TypeScript strict mode**
- Semua data dari API punya interface di `src/types.ts`
- Props typed dengan `defineProps<T>()`
- Composables return typed refs

### 3. Composition API
Semua component pakai `<script setup lang="ts">` (Options API deprecated di kode baru).

### 4. Reactive State via Pinia
- Auth state persistent (localStorage)
- Cart state (Phase 2)
- Notifications (Phase 3)

### 5. Route-Based Code Splitting
Router pakai dynamic import → per-page chunk:
```typescript
component: () => import('@/pages/Catalog.vue')
```

## Folder Structure

```
src/
├── api.ts                # Axios instance + interceptors
├── types.ts              # TypeScript interfaces (mirror backend)
├── router.ts             # Vue Router config + guards
├── main.ts               # App bootstrap
├── App.vue               # Root layout (nav, footer)
├── style.css             # Tailwind base + component classes
├── stores/
│   └── auth.ts           # Pinia store: user, token, RBAC helpers
└── pages/
    ├── Home.vue          # Landing (hero + featured products)
    ├── Catalog.vue       # Browse with filter/search
    ├── ProductDetail.vue # Detail dengan sidebar sticky
    ├── Dashboard.vue     # Per-role dashboard
    ├── NotFound.vue      # 404 fallback
    ├── auth/
    │   ├── Login.vue
    │   └── Register.vue
    └── admin/
        └── Products.vue  # Admin CRUD (modal form)
```

## Naming Conventions

| Item | Style | Example |
|---|---|---|
| Components/Pages | PascalCase | `ProductCard.vue` |
| Composables | camelCase + prefix `use` | `useMeeting.ts` |
| Stores | camelCase + prefix `use` + suffix `Store` | `useAuthStore` |
| Files (non-Vue) | camelCase | `api.ts`, `types.ts` |
| CSS classes | kebab-case (Tailwind default) | `btn-primary` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |
| Interfaces | PascalCase | `interface Product` |

## Data Flow

### Page Load Flow

```
1. User navigates to /catalog
2. Router matches → check guards (auth, admin)
3. Catalog.vue mounted → onMounted() calls API
4. api.get('/catalog/products') → Axios request
5. Backend responds JSON
6. Data set to ref → Vue reactivity re-render
7. UI updated
```

### Auth Flow

```
1. User submits login form
2. authStore.login(email, password) called
3. api.post('/auth/login', ...)
4. Response: { user, token }
5. token saved to localStorage
6. user + token saved to Pinia state
7. Router redirect to /dashboard
8. Every subsequent API call: interceptor adds Bearer header
```

### Error Handling

**Global (axios interceptor):**
- 401 → auto logout + redirect login
- 5xx → toast error (Phase 2)

**Per-component:**
- 422 validation → show field errors
- 403 → show forbidden message
- 404 → show not found

## Environment Variables

Vite convention: `VITE_*` (accessible via `import.meta.env`).

`.env.local` (dev):
```
VITE_API_URL=http://127.0.0.1:8000/api
```

`.env.production` (Vercel):
```
VITE_API_URL=https://api.alnilam.id/api
```

**Note:** Vite env vars di-bake at build time (bukan runtime). Ubah env var = rebuild.

## Build & Bundle

**Dev:**
```bash
npm run dev  # Vite HMR di port 5173
```

**Production:**
```bash
npm run build  # Output di dist/
```

Bundle output (typical):
- `index.html` — root
- `assets/index-*.js` — main bundle (~150 KB gzip: 56 KB)
- `assets/*.js` — per-page code split
- `assets/*.css` — Tailwind purged CSS

## Performance Considerations

### 1. Code Splitting
Sudah aktif via lazy imports di router.

### 2. Image Optimization
Untuk Phase 2:
- `<img>` dengan `loading="lazy"`
- WebP/AVIF format
- Responsive `srcset`

### 3. Prefetch
Router link prefetch on hover (Vue Router default).

### 4. Cache API Response
Phase 2: consider TanStack Query untuk request cache/dedup.

## Accessibility (a11y)

**Wajib:**
- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- Focus visible (Tailwind `focus:` classes)
- ARIA labels untuk interactive tanpa label
- Kontras warna WCAG AA minimum

**Testing:**
- Keyboard-only navigation
- Screen reader (NVDA / VoiceOver)
- axe DevTools browser extension

## Browser Support

Vue 3 + Vite target: **modern browsers** (last 2 versions).

Test priority:
- Chrome (main)
- Safari (iOS + macOS)
- Firefox
- Edge

Not supported: IE11 (Vue 3 tidak support).

## Related

- [COMPONENTS.md](COMPONENTS.md) — Design system
- [API-INTEGRATION.md](API-INTEGRATION.md) — Backend integration
- [STATE-MANAGEMENT.md](STATE-MANAGEMENT.md) — Pinia patterns
- [ROUTING.md](ROUTING.md) — Vue Router setup
- [DEVELOPMENT.md](DEVELOPMENT.md) — Dev workflow
