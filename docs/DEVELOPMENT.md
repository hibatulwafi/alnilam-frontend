# Development Guide — Alnilam Frontend

## Prerequisites

- Node.js 20+
- npm 10+

Cek:
```bash
node --version
npm --version
```

## Initial Setup

```bash
# Clone
git clone git@github.com:USERNAME/alnilam-frontend.git
cd alnilam-frontend

# Install
npm install

# Env (optional untuk dev)
cp .env.production.example .env.local
# Edit VITE_API_URL kalau backend bukan di localhost:8000

# Start
npm run dev
```

**Wajib:** Backend running dulu di `http://127.0.0.1:8000`.
Setup backend: [alnilam-backend README](../../alnilam-backend/README.md)

## Scripts

```bash
npm run dev          # Dev server (HMR) di localhost:5173
npm run build        # Production build ke dist/
npm run preview      # Preview production build lokal
npm run type-check   # TypeScript check tanpa build (Phase 2)
```

## Daily Workflow

### Add new page

1. **Create component** — `src/pages/YourPage.vue`
2. **Add route** — `src/router.ts`
   ```typescript
   { path: '/your-page', name: 'your-page', component: () => import('@/pages/YourPage.vue') }
   ```
3. **Add nav link** (kalau perlu) — `src/App.vue`
4. **Test** — Buka `http://localhost:5173/your-page`

### Add new API integration

1. **Update types** — `src/types.ts`
   ```typescript
   export interface Order { ... }
   ```
2. **Call API** — pakai `api.get()`, `api.post()`, dll
3. **Update store** kalau state perlu shared

Baca detail: [API-INTEGRATION.md](API-INTEGRATION.md)

### Add new store

1. **Create file** — `src/stores/cart.ts`
2. **Define store:**
   ```typescript
   export const useCartStore = defineStore('cart', () => {
     const items = ref([])
     // ...
     return { items }
   })
   ```
3. **Use di component:**
   ```typescript
   const cart = useCartStore()
   ```

Baca detail: [STATE-MANAGEMENT.md](STATE-MANAGEMENT.md)

### Add new component (reusable)

Phase 2+, extract common patterns ke `src/components/`:

```
src/components/
├── ProductCard.vue
├── EmptyState.vue
├── LoadingSpinner.vue
└── ...
```

Rule: kalau UI pattern muncul di 3+ tempat, extract ke component.

## TypeScript Best Practices

### 1. Explicit types di public API

```typescript
// ❌ Implicit
function formatPrice(price) {
  return `Rp ${price}`
}

// ✅ Explicit
function formatPrice(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
```

### 2. Ref types

```typescript
// ❌
const items = ref([])  // Type: Ref<never[]>

// ✅
const items = ref<Product[]>([])
```

### 3. Props types

```vue
<script setup lang="ts">
interface Props {
  product: Product
  variant?: 'default' | 'compact'
}

const props = defineProps<Props>()

// With defaults
const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>
```

### 4. Emits types

```vue
<script setup lang="ts">
const emit = defineEmits<{
  submit: [payload: FormData]
  cancel: []
}>()

emit('submit', formData)
</script>
```

### 5. Avoid `any`

```typescript
// ❌
function handle(data: any) { ... }

// ✅
function handle(data: unknown) {
  if (typeof data === 'string') {
    // ...
  }
}
```

## Vue Composition API Patterns

### Reactive vs Ref

```typescript
// ref — for primitives + objects (always use .value)
const count = ref(0)
count.value++

// reactive — only for objects (no .value, but limited)
const state = reactive({ count: 0 })
state.count++

// Rekomendasi: prefer ref untuk konsistensi
```

### Computed

```typescript
const products = ref<Product[]>([])
const featuredProducts = computed(() =>
  products.value.filter(p => p.featured)
)
```

### Watch

```typescript
// Simple
watch(searchQuery, (newQ) => {
  loadProducts({ search: newQ })
})

// Debounced
let timeout: number | null = null
watch(searchQuery, (q) => {
  if (timeout) clearTimeout(timeout)
  timeout = window.setTimeout(() => loadProducts({ search: q }), 300)
})

// Watch multiple
watch([sort, category], () => loadProducts())

// Immediate + deep
watch(form, () => validate(), { immediate: true, deep: true })
```

### Lifecycle

```typescript
onMounted(() => {
  loadProducts()
})

onUnmounted(() => {
  // cleanup subscriptions
})
```

## Styling Best Practices

### Tailwind first, custom CSS second

```vue
<!-- ✅ Tailwind utility -->
<button class="bg-brand-700 text-white px-4 py-2 rounded-lg hover:bg-brand-800">
  Submit
</button>

<!-- ✅ Component class (defined di style.css) -->
<button class="btn-primary">Submit</button>

<!-- ❌ Inline style -->
<button style="background: #0F4C81; color: white;">Submit</button>
```

### Scoped styles (kalau perlu)

```vue
<template>
  <div class="custom-thing">...</div>
</template>

<style scoped>
.custom-thing {
  /* only applied di this component */
}
</style>
```

Prefer Tailwind, tapi scoped OK untuk complex animations, transitions, atau third-party override.

## Development Tools

### Vue DevTools

Install browser extension:
- Chrome: https://chrome.google.com/webstore (search "Vue.js devtools")
- Firefox: https://addons.mozilla.org/firefox

Feature:
- Component tree
- Pinia state
- Vue Router routes
- Component events

### VS Code Extensions

Recommended (`.vscode/extensions.json`):
- Volar (Vue Language Features)
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- ESLint

## Debugging

### Console

```typescript
console.log('Debug:', variable)
console.table(products.value)  // tabular
console.group('Group')
console.log('...')
console.groupEnd()
```

### Vue Reactive Value Peek

```typescript
console.log('Ref:', products.value)  // unwrap ref
console.log('Computed:', featuredCount.value)  // unwrap computed
```

### Network Tab (DevTools)

- F12 → Network tab
- Filter: Fetch/XHR
- Trigger action → inspect request/response

## Build & Deploy

### Production Build

```bash
npm run build
```

Output di `dist/`:
- `index.html`
- `assets/index-*.js` (main bundle)
- `assets/*.js` (per-page chunks)
- `assets/*.css` (Tailwind purged)

Test lokal:
```bash
npm run preview
```

### Deploy Vercel

Auto-deploy on push ke `main` branch (kalau sudah connect).

Detail: [DEPLOYMENT.md](DEPLOYMENT.md)

## Common Issues

### "Cannot find module '@/xxx'"

Cek `tsconfig.app.json`:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

Dan `vite.config.ts`:
```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

### "Network Error" saat API call

1. Backend running di port 8000? `curl http://127.0.0.1:8000/api/catalog/categories`
2. CORS OK di backend? Cek `backend/config/cors.php` → `allowed_origins` include frontend URL
3. `.env.local` `VITE_API_URL` benar?

### "401 Unauthorized" walau baru login

Token tidak ter-attach:
1. Cek localStorage: `localStorage.getItem('auth_token')`
2. Cek network tab: request header `Authorization: Bearer ...` ada?
3. Sanctum config di backend benar?

### Build error "Type 'X' is not assignable to type 'Y'"

Cek `types.ts` — mungkin field naming beda dengan API response. Pakai DevTools Network → response JSON → compare dengan interface.

## Contributing to This Repo

1. Branch: `git checkout -b feature/order-page`
2. Edit code
3. Test manual di browser
4. Run build: `npm run build`
5. Commit dengan Conventional Commits:
   ```
   feat(catalog): add search debouncing
   fix(auth): handle expired token gracefully
   docs(api): update Order type schema
   style(button): adjust hover color
   ```
6. Push + create PR

## Learning Resources

- **Vue 3 Docs:** https://vuejs.org
- **Vue Router:** https://router.vuejs.org
- **Pinia:** https://pinia.vuejs.org
- **Tailwind CSS:** https://tailwindcss.com
- **Vite:** https://vite.dev
- **TypeScript for Vue:** https://vuejs.org/guide/typescript/overview.html

**Local docs:**
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [COMPONENTS.md](COMPONENTS.md)
- [API-INTEGRATION.md](API-INTEGRATION.md)
- [STATE-MANAGEMENT.md](STATE-MANAGEMENT.md)
- [ROUTING.md](ROUTING.md)
