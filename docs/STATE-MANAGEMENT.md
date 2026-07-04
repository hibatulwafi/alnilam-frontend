# State Management — Alnilam Frontend

## Overview

**Tool:** Pinia (Vuex successor untuk Vue 3)

## Store Pattern

Kita pakai **Setup Store** (function-based) — lebih flexible & TypeScript-friendly dari Options Store.

## Example — Auth Store

`src/stores/auth.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import type { User, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State (refs)
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)

  // Getters (computed)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isCreator = computed(() => user.value?.role === 'creator')
  const isClient = computed(() => user.value?.role === 'client')

  // Actions (functions)
  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await api.get<{ user: User }>('/auth/me')
      user.value = data.user
    } catch {
      logout()
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('auth_token', data.token)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) await api.post('/auth/logout')
    } catch { /* ignore */ }
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  // Expose
  return {
    user, token, loading,
    isAuthenticated, isAdmin, isCreator, isClient,
    fetchMe, login, logout,
  }
})
```

## Usage in Component

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// Reactive — akses langsung
console.log(auth.user)
console.log(auth.isAuthenticated)

// Call action
async function handleLogin() {
  await auth.login('email@test.com', 'password')
}
</script>

<template>
  <div v-if="auth.isAuthenticated">
    Hi, {{ auth.user?.name }}!
  </div>
  <div v-else>
    <button @click="handleLogin">Login</button>
  </div>
</template>
```

## Rules

### 1. Store per Domain

- `auth` — user, token, permissions
- `cart` — Phase 2 — items, totals
- `notifications` — Phase 3 — unread count, items
- `products` — **jangan** buat store untuk data yang mudah fetch. Fetch di composable/component.

### 2. Store hanya untuk Cross-Component State

Kalau data cuma dipakai 1 component, **jangan** di store — pakai `ref` lokal.

### 3. Persist Selective

Simpan ke localStorage hanya yang perlu:
- ✅ `token` (auth)
- ✅ `cart items` (persist across session)
- ❌ Product list (fetch fresh saat visit)
- ❌ User details cache lama (fetch fresh via `fetchMe`)

### 4. Handle Loading & Error di Store

```typescript
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    // ...
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
```

## Composable vs Store

| Use Case | Solution |
|---|---|
| Auth state (user, token) | **Store** |
| Cart items | **Store** |
| Fetch products for catalog | **Composable** (`useProducts`) |
| Fetch product detail | **Composable** or ref lokal |
| Modal open/close state | Ref lokal |
| Toast notifications | Composable + provide/inject |
| Theme (dark/light) | Store |
| Locale | Store |

## Composable Example

`src/composables/useProducts.ts`:

```typescript
import { ref } from 'vue'
import api from '@/api'
import type { Product, Paginated } from '@/types'

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const total = ref(0)

  async function fetch(params: Record<string, any> = {}) {
    loading.value = true
    try {
      const { data } = await api.get<Paginated<Product>>('/catalog/products', { params })
      products.value = data.data
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  return { products, loading, total, fetch }
}
```

## Store State Persistence (Phase 2+)

Kalau butuh persist store state (bukan cuma auth token), pakai `pinia-plugin-persistedstate`:

```bash
npm install pinia-plugin-persistedstate
```

```typescript
// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  // ...
  return { items }
}, {
  persist: true  // auto-persist ke localStorage
})
```

## Testing Stores (Phase 2+)

```typescript
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('AuthStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('starts logged out', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('logs in successfully', async () => {
    const auth = useAuthStore()
    await auth.login('admin@alnilam.test', 'password')
    expect(auth.isAuthenticated).toBe(true)
  })
})
```

## Anti-Patterns to Avoid

### ❌ Mutating Store State from Component

```typescript
// BAD
const auth = useAuthStore()
auth.user = { ... }  // Direct mutation
```

```typescript
// GOOD — call action
const auth = useAuthStore()
await auth.fetchMe()
```

### ❌ Store as Global Bag of Data

```typescript
// BAD
export const useAppStore = defineStore('app', () => {
  const products = ref([])
  const categories = ref([])
  const orders = ref([])
  const users = ref([])
  const dashboard = ref({})
  // ... 20 more fields
})
```

Split per domain, atau pakai composable untuk data fetch.

### ❌ Circular Dependencies

Kalau store A butuh store B yang butuh store A — refactor, mungkin logic bisa pindah ke composable.

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md) — Overall architecture
- [API-INTEGRATION.md](API-INTEGRATION.md) — Store patterns untuk API data
- Pinia docs: https://pinia.vuejs.org
