# CLAUDE.md — Alnilam Frontend

Konteks AI assistant untuk `alnilam-frontend` repository.

## Repository Purpose

Frontend SPA (Single Page Application) untuk platform Alnilam. **Konsumer utama** dari [alnilam-backend](../alnilam-backend/) REST API.

**Tech Stack:**
- Vue 3 (Composition API) + TypeScript
- Vite 7.x (build tool)
- Tailwind CSS 3.x (styling)
- Pinia (state management)
- Vue Router 4 (routing dengan guards)
- Axios (HTTP client)

## Repository Relations

Bagian dari **3-repo Alnilam ecosystem:**

| Repo | Purpose | Relation |
|---|---|---|
| [alnilam-backend](../alnilam-backend/) | REST API (PHP/Laravel) | **Data source** — semua data dari sini |
| **alnilam-frontend** (INI) | Vue 3 SPA | UI layer |
| [alnilam-demo](../alnilam-demo/) | Orchestration | Run backend + frontend bersamaan |

**API Contract:** [alnilam-backend/docs/API-REFERENCE.md](../alnilam-backend/docs/API-REFERENCE.md)

Semua type di `src/types.ts` harus **exact match** dengan response schema di API-REFERENCE.

## Directory Structure

```
alnilam-frontend/
├── src/
│   ├── api.ts                  # Axios instance + interceptor
│   ├── types.ts                # TypeScript types (mirror backend)
│   ├── router.ts               # Vue Router + auth/admin guards
│   ├── main.ts                 # App bootstrap
│   ├── App.vue                 # Root layout dengan nav
│   ├── style.css               # Tailwind base + custom components
│   ├── stores/
│   │   └── auth.ts             # Pinia auth store (token, user)
│   └── pages/
│       ├── Home.vue            # Landing page
│       ├── Catalog.vue         # Browse products dengan filter
│       ├── ProductDetail.vue   # Product page dengan sidebar sticky
│       ├── Dashboard.vue       # Per-role dashboard
│       ├── NotFound.vue        # 404
│       ├── auth/
│       │   ├── Login.vue       # dengan quick-login demo
│       │   └── Register.vue    # role picker (client/creator)
│       └── admin/
│           └── Products.vue    # Admin CRUD dengan modal
├── docs/                       # Repo-specific docs
├── public/                     # Static assets
├── vite.config.ts
├── vercel.json                 # Deploy config
├── tailwind.config.js
├── tsconfig.json
└── CLAUDE.md                   # This file
```

## Coding Conventions

### Vue 3 Composition API

**Always use `<script setup lang="ts">`:**

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'
import type { Product } from '@/types'

const auth = useAuthStore()
const products = ref<Product[]>([])
const loading = ref(true)

const featuredCount = computed(() => products.value.filter(p => p.featured).length)

async function load() {
  loading.value = true
  try {
    const { data } = await api.get<Product[]>('/catalog/products')
    products.value = data
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- content -->
  </div>
</template>
```

### TypeScript Strict

- **Semua fungsi punya type** (parameter + return)
- **Response types** dari `@/types.ts` mirror backend
- **Refs typed:** `ref<Product[]>([])` bukan `ref([])`
- **No `any`** — pakai `unknown` kalau bener-bener tidak tahu
- **Assert type** dari API dengan casting kalau perlu: `data as Product`

### Tailwind CSS

**Component classes di `style.css`:**
```css
@layer components {
  .btn-primary {
    @apply btn bg-brand-700 text-white hover:bg-brand-800;
  }
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200;
  }
}
```

**Do:**
- Pakai design system class kalau ada (`.btn-primary`, `.card`, `.input`)
- Prefix `brand-` untuk brand color (biru Alnilam #0F4C81)
- Mobile-first responsive (`sm:`, `md:`, `lg:`)
- Semantic sizing (`text-sm`, `text-lg`, bukan `text-[13px]`)

**Don't:**
- ❌ Inline style (`style="color: red"`)
- ❌ CSS terpisah per component (all Tailwind)
- ❌ !important
- ❌ Random hex color (pakai palette Tailwind)

### State Management (Pinia)

**Setup store pattern:**
```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('auth_token', data.token)
  }

  return { user, token, isAuthenticated, login }
})
```

**Do:**
- Setup store (function-based) — lebih flexible
- Persist critical state via localStorage
- Reactive refs, not plain values

**Don't:**
- ❌ Store business logic UI-specific (keep in component)
- ❌ Store computed cross-component data yang bisa fetch fresh
- ❌ Direct mutate state dari component (call action)

### Routing

**Route guards di `router.ts`:**
```typescript
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
})
```

## API Integration

### Axios Instance

`src/api.ts` — global config dengan interceptor:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### Consuming API

```typescript
// GET
const { data } = await api.get<Product[]>('/catalog/products')

// POST
const { data } = await api.post<AuthResponse>('/auth/login', { email, password })

// Error handling
try {
  await api.post('/orders', payload)
} catch (e: any) {
  if (e.response?.status === 422) {
    errors.value = e.response.data.errors // validation errors
  } else {
    globalError.value = e.response?.data?.message || 'Unknown error'
  }
}
```

### Type Safety

`src/types.ts` mirror backend response:
```typescript
export interface Product {
  id: number
  category_id: number
  name: string
  base_price: string | number  // decimal comes as string from PHP
  // ...
}
```

**Sync rule:** Kalau backend add field ke response, add ke `types.ts`.

## Deployment

Deploy ke **Vercel** — auto-detect Vite.

- Config: `vercel.json` (SPA rewrites, security headers)
- Env vars: `VITE_API_URL` = backend URL
- Preview per PR (Vercel default)

Detail: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## When Editing This Repo

**Do:**
- ✅ Update `types.ts` kalau API response changes
- ✅ Test flow di browser sebelum push
- ✅ Run `npm run build` untuk verify no TS errors
- ✅ Test dengan credentials demo (`admin@alnilam.test`)
- ✅ Responsive test — mobile, tablet, desktop breakpoint

**Don't:**
- ❌ Hardcode API URL — pakai `import.meta.env.VITE_API_URL`
- ❌ Store token di cookie (kita pakai localStorage + Bearer)
- ❌ Skip TypeScript type
- ❌ Add inline style
- ❌ Assume backend response — always define type
- ❌ Console.log di production build

## Related Documentation

- [README.md](README.md) — Setup & quickstart
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Frontend design
- [docs/COMPONENTS.md](docs/COMPONENTS.md) — Design system
- [docs/API-INTEGRATION.md](docs/API-INTEGRATION.md) — **⭐ How to consume backend**
- [docs/STATE-MANAGEMENT.md](docs/STATE-MANAGEMENT.md) — Pinia patterns
- [docs/ROUTING.md](docs/ROUTING.md) — Vue Router + guards
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel deploy
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — Dev workflow

## Version Compatibility

| Frontend Version | Backend Compatibility |
|---|---|
| v1.0.x | v1.0.x |

Kalau backend breaking API change, koordinasi + bump major.

## For AI Coding Agents

Repository ini punya agents di `.claude/agents/`:
- `vue-expert` — Vue 3 Composition API + Pinia best practice
- `ui-designer` — Tailwind + design system + accessibility
- `api-consumer` — HTTP client + type safety + error handling
