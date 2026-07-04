# API Integration — Alnilam Frontend

**⭐ Referensi utama:** [alnilam-backend/docs/API-REFERENCE.md](../../alnilam-backend/docs/API-REFERENCE.md) — API contract source of truth.

Dokumen ini menjelaskan **cara consume** API dari sisi frontend.

## Setup

### Axios Instance (`src/api.ts`)

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Auto-attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
    }
    return Promise.reject(error)
  }
)

export default api
```

## Type Safety

**Rule:** Setiap request/response punya TypeScript type di `src/types.ts`.

```typescript
// types.ts — MIRROR API-REFERENCE.md
export interface Product {
  id: number
  category_id: number
  slug: string
  name: string
  short_description: string
  long_description: string
  base_price: string | number  // ⚠️ PHP decimal comes as string
  delivery_days: number
  revisions_included: number
  deliverables: string[] | null
  thumbnail_url: string | null
  status: 'draft' | 'published' | 'unpublished'
  featured: boolean
  order_count: number
  avg_rating: string | number
  category?: Category
  created_at: string
  updated_at: string
}

export interface Paginated<T> {
  current_page: number
  data: T[]
  total: number
  per_page: number
  last_page: number
  next_page_url: string | null
  prev_page_url: string | null
}

export interface AuthResponse {
  user: User
  token: string
}
```

## Common Patterns

### 1. Simple GET

```typescript
import api from '@/api'
import type { Category } from '@/types'

const { data } = await api.get<Category[]>('/catalog/categories')
```

### 2. GET dengan Query Params

```typescript
const { data } = await api.get<Paginated<Product>>('/catalog/products', {
  params: {
    category: 'video-production',
    featured: 1,
    sort: 'popular',
  }
})
```

### 3. POST (Create)

```typescript
try {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email: 'admin@alnilam.test',
    password: 'password',
  })
  // handle success: data.user, data.token
} catch (e: any) {
  if (e.response?.status === 401) {
    error.value = 'Email atau password salah'
  } else if (e.response?.status === 422) {
    validationErrors.value = e.response.data.errors
  } else {
    error.value = 'Terjadi kesalahan. Coba lagi.'
  }
}
```

### 4. PATCH (Update)

```typescript
await api.patch(`/admin/products/${productId}`, {
  name: 'Updated name',
  status: 'published',
})
```

### 5. DELETE

```typescript
await api.delete(`/admin/products/${productId}`)
// Response 204 No Content
```

### 6. Handle Loading State

```typescript
const loading = ref(true)
const error = ref<string | null>(null)
const products = ref<Product[]>([])

async function load() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get<Paginated<Product>>('/catalog/products')
    products.value = data.data
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Gagal memuat produk'
  } finally {
    loading.value = false
  }
}
```

### 7. Composable Pattern (Reusable)

```typescript
// src/composables/useProducts.ts
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

Pakai di component:
```vue
<script setup lang="ts">
import { useProducts } from '@/composables/useProducts'

const { products, loading, fetch } = useProducts()
onMounted(() => fetch({ featured: 1 }))
</script>
```

## Authentication

### Login Flow

```typescript
// stores/auth.ts
async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  token.value = data.token
  user.value = data.user
  localStorage.setItem('auth_token', data.token)
}
```

### Check Auth on App Load

`router.ts`:
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
})
```

### Logout

```typescript
async function logout() {
  try {
    if (token.value) await api.post('/auth/logout')
  } catch { /* ignore server errors */ }
  token.value = null
  user.value = null
  localStorage.removeItem('auth_token')
}
```

## Error Handling

### Global (Interceptor)

Di `api.ts` — handle patterns umum:
- 401 → clear token, redirect login
- 429 → show rate limit message
- 5xx → generic error toast

### Component-level

Handle spesifik per action:

```typescript
try {
  await api.post('/orders', payload)
} catch (e: any) {
  const status = e.response?.status
  const errors = e.response?.data?.errors  // 422 validation
  const message = e.response?.data?.message  // Generic

  switch (status) {
    case 422:
      validationErrors.value = errors
      break
    case 403:
      error.value = 'Anda tidak punya akses'
      break
    case 404:
      router.push({ name: 'not-found' })
      break
    default:
      error.value = message || 'Terjadi kesalahan'
  }
}
```

## Money & Decimals

⚠️ **Penting:** PHP `decimal` type kembali sebagai **string** dari API.

```typescript
// ❌ Ini bug
const p: Product = await api.get(...)
console.log(p.base_price + 1)  // "5000000.001" string concat!

// ✅ Parse jelas
const price = typeof p.base_price === 'string'
  ? parseFloat(p.base_price)
  : p.base_price

// ✅ Format untuk display
function formatPrice(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(n)
}
```

## Date & Timezone

Backend return ISO 8601 string, timezone UTC. Format di frontend:

```typescript
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('id')

dayjs('2026-07-04T12:34:56.000000Z').format('DD MMM YYYY')  // "04 Jul 2026"
dayjs('2026-07-04T12:34:56.000000Z').fromNow()              // "2 jam lalu"
```

## Pagination

Laravel default pagination:

```typescript
async function loadPage(page: number) {
  const { data } = await api.get<Paginated<Product>>('/catalog/products', {
    params: { page, per_page: 12 }
  })
  products.value = data.data
  totalPages.value = data.last_page
}
```

## File Upload (Phase 2+)

```typescript
async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)

  const { data } = await api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded / progressEvent.total!) * 100)
      uploadProgress.value = percent
    }
  })
}
```

## Backend Contract Changes

Ketika backend team update API:

1. **Read** [alnilam-backend/docs/API-REFERENCE.md](../../alnilam-backend/docs/API-REFERENCE.md) latest
2. **Update** `src/types.ts` — add/change interface field
3. **Update** consumer code (components, composables)
4. **Test** — semua flow yang consume endpoint tersebut

Kalau breaking change, coordinate release timing dengan backend.

## Testing API Calls

### Manual (Browser DevTools)
1. Buka app di browser
2. F12 → Network tab
3. Filter XHR/Fetch
4. Trigger action → cek request/response

### Automated (Vitest + MSW)

Phase 2+, pakai Mock Service Worker:

```typescript
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get('/api/catalog/products', (req, res, ctx) => {
    return res(ctx.json({ data: [mockProduct] }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md) — Overall design
- [STATE-MANAGEMENT.md](STATE-MANAGEMENT.md) — Pinia + reactive
- [alnilam-backend/docs/API-REFERENCE.md](../../alnilam-backend/docs/API-REFERENCE.md) — **⭐ Source of truth**
