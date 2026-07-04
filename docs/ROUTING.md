# Routing — Alnilam Frontend

## Overview

**Tool:** Vue Router 4 dengan history mode (bukan hash).

## Route Structure

`src/router.ts`:

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/Home.vue') },
  { path: '/catalog', name: 'catalog', component: () => import('@/pages/Catalog.vue') },
  { path: '/product/:slug', name: 'product-detail', component: () => import('@/pages/ProductDetail.vue') },

  // Guest only (redirect kalau sudah login)
  { path: '/login', name: 'login', component: () => import('@/pages/auth/Login.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('@/pages/auth/Register.vue'), meta: { guestOnly: true } },

  // Auth required
  { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard.vue'), meta: { requiresAuth: true } },

  // Admin only
  { path: '/admin/products', name: 'admin-products', component: () => import('@/pages/admin/Products.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

  // Fallback
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
]
```

## Route Guards

**Global beforeEach:**

```typescript
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Fetch user data on first navigation kalau token ada
  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})
```

## Meta Fields

| Meta | Description |
|---|---|
| `requiresAuth` | User harus login |
| `requiresAdmin` | User harus role=admin |
| `requiresCreator` | User harus role=creator (Phase 2) |
| `requiresClient` | User harus role=client (Phase 2) |
| `guestOnly` | Redirect kalau sudah login |
| `layout` | Custom layout (Phase 2, e.g. 'admin', 'public') |

## Navigation Patterns

### RouterLink (declarative)

```vue
<template>
  <RouterLink to="/catalog">Katalog</RouterLink>
  <RouterLink :to="{ name: 'product-detail', params: { slug: product.slug } }">
    {{ product.name }}
  </RouterLink>
  <RouterLink :to="{ name: 'catalog', query: { category: 'video' } }">
    Video Category
  </RouterLink>
</template>
```

### Programmatic (composable)

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// Push (add history)
router.push('/dashboard')
router.push({ name: 'product-detail', params: { slug: 'xxx' } })

// Replace (no history)
router.replace('/login')

// Back
router.back()

// With query
router.push({
  name: 'catalog',
  query: { search: 'video', sort: 'popular' }
})
```

### Redirect After Login

```typescript
// Login page
async function handleLogin() {
  await auth.login(email.value, password.value)
  const redirect = (route.query.redirect as string) || '/dashboard'
  router.push(redirect)
}
```

## URL Conventions

| Pattern | Example | Convention |
|---|---|---|
| Home | `/` | — |
| List (plural) | `/catalog`, `/orders` | Plural noun |
| Detail (slug) | `/product/product-video-30-detik-abc123` | Prefer slug over ID |
| Nested | `/orders/:id/tracking` | Max 2 level |
| Auth | `/login`, `/register`, `/forgot-password` | Not `/auth/login` |
| Admin | `/admin/products`, `/admin/users` | Prefix `/admin` |
| Query params | `/catalog?category=video&sort=popular` | Filter, sort, search |

## Route Params

### Params (path)
```typescript
{ path: '/product/:slug' }

// In component
const route = useRoute()
console.log(route.params.slug)  // string
```

### Query (search string)
```typescript
console.log(route.query.category)  // string | null
console.log(route.query.sort)
```

### Type-safe params (Phase 2+)
```typescript
// Vue Router 4 supports typed routes via unplugin-vue-router
// Not setup yet in this project
```

## Scroll Behavior

```typescript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition  // browser back/forward
    return { top: 0 }  // default: scroll to top
  }
})
```

## Route Transition (Phase 2+)

```vue
<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

## Named Views (Phase 2+)

Untuk layout complex:
```vue
<template>
  <RouterView name="header" />
  <RouterView />
  <RouterView name="footer" />
</template>
```

Not needed yet — kita pakai `App.vue` sebagai wrapper.

## Nested Routes (Phase 2+)

Contoh untuk `/admin/*`:
```typescript
{
  path: '/admin',
  component: () => import('@/pages/admin/Layout.vue'),
  meta: { requiresAdmin: true },
  children: [
    { path: '', name: 'admin-dashboard', component: () => import('@/pages/admin/Dashboard.vue') },
    { path: 'products', name: 'admin-products', component: () => import('@/pages/admin/Products.vue') },
    { path: 'users', name: 'admin-users', component: () => import('@/pages/admin/Users.vue') },
  ]
}
```

## Route Meta Progressive Loading (Phase 2+)

Show progress bar saat navigation:

```bash
npm install nprogress
```

```typescript
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})
```

## Server-Side Routes Vercel

`vercel.json` (sudah setup):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Kenapa:** Vue Router history mode — semua URL harus fallback ke `index.html`. Tanpa ini, refresh page = 404.

## SEO Considerations

**Current state:** SPA — SEO limited (crawler tidak execute JS well).

**Improvement path (Phase 2+):**
1. **Meta tags dynamic** — pakai `@vueuse/head` untuk update `<title>` & meta per route
2. **SSR** — migrate ke Nuxt 3 (major refactor, tapi improve SEO drastically)
3. **Static generation** — untuk static pages (about, privacy, terms)

Minimal implementation sekarang:

```typescript
// src/composables/useMeta.ts
import { watch } from 'vue'
import { useRoute } from 'vue-router'

export function useMeta(title: string, description?: string) {
  watch(() => title, (newTitle) => {
    document.title = `${newTitle} — Alnilam`
    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', description)
    }
  }, { immediate: true })
}
```

Usage:
```vue
<script setup>
useMeta('Product Video 30 Detik', 'Video promosi produk 30 detik...')
</script>
```

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md) — Overall design
- [STATE-MANAGEMENT.md](STATE-MANAGEMENT.md) — Auth store for guards
- Vue Router docs: https://router.vuejs.org
