# Design System & Components — Alnilam Frontend

## Brand

**Primary Color:** Biru Alnilam
- `#0F4C81` (brand-700, default)
- `#155A9C` (brand-600, hover)

**Palette (Tailwind config):**
```
brand-50   #EEF4FA
brand-100  #D4E3F2
brand-200  #A9C7E5
brand-300  #7EABD8
brand-400  #548FCB
brand-500  #2973BE
brand-600  #155A9C   ← Hover
brand-700  #0F4C81   ← Primary (default)
brand-800  #0A3E66   ← Text on light bg
brand-900  #062E4B   ← Deep accent
```

**Font:** Inter (fallback: Segoe UI, system-ui, sans-serif)

## Component Classes (di `style.css`)

Reusable component styles via Tailwind `@layer components`:

### Buttons

```html
<!-- Primary action -->
<button class="btn-primary">Simpan</button>

<!-- Secondary/outline -->
<button class="btn-secondary">Batal</button>

<!-- Destructive -->
<button class="btn-danger">Hapus</button>
```

Definisi (`style.css`):
```css
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors;
}
.btn-primary {
  @apply btn bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50;
}
.btn-danger {
  @apply btn bg-red-600 text-white hover:bg-red-700;
}
```

### Form Inputs

```html
<div>
  <label class="label">Email</label>
  <input class="input" type="email" required />
</div>
```

Classes:
```css
.input {
  @apply w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none;
}
.label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
```

### Card

```html
<div class="card p-6">
  <h3>Content</h3>
</div>
```

```css
.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden;
}
```

### Badge

```html
<span class="badge bg-brand-100 text-brand-800">Admin</span>
<span class="badge bg-green-100 text-green-800">Published</span>
<span class="badge bg-yellow-100 text-yellow-800">⭐ Featured</span>
```

```css
.badge {
  @apply inline-block px-2 py-0.5 rounded text-xs font-medium;
}
```

## Layout Patterns

### Page Container

```html
<div class="max-w-7xl mx-auto px-4 py-8">
  <!-- content -->
</div>
```

Sizes:
- `max-w-3xl` — narrow (auth forms, single-column)
- `max-w-4xl` — medium (dashboard, forms)
- `max-w-7xl` — wide (catalog, dashboards)

### Header (Sticky)

Sudah ada di `App.vue`:
- `<header>` dengan `sticky top-0 z-40`
- Logo di kiri
- Nav center
- User menu kanan
- Border bottom

### Sidebar Layout (2-column)

```html
<div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
  <!-- Main content -->
  <div>...</div>

  <!-- Sticky sidebar -->
  <aside class="lg:sticky lg:top-20 lg:self-start">
    <div class="card p-6">...</div>
  </aside>
</div>
```

### Grid List

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div v-for="item in items" :key="item.id" class="card">...</div>
</div>
```

## Component Patterns

### Loading States

```vue
<template>
  <div v-if="loading" class="grid grid-cols-3 gap-4">
    <div v-for="i in 6" :key="i" class="card animate-pulse">
      <div class="aspect-video bg-gray-200"></div>
      <div class="p-4">
        <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
  <div v-else-if="!items.length" class="text-center py-16 text-gray-500">
    Tidak ada data.
  </div>
  <div v-else>
    <!-- content -->
  </div>
</template>
```

### Modal

```vue
<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b flex items-center justify-between">
        <h2 class="text-xl font-bold">Title</h2>
        <button @click="show = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
      </div>
      <div class="p-6">
        <!-- content -->
      </div>
    </div>
  </div>
</template>
```

### Form with Validation

```vue
<script setup lang="ts">
const form = ref({ email: '', password: '' })
const errors = ref<Record<string, string[]>>({})
const globalError = ref<string | null>(null)

async function submit() {
  errors.value = {}
  globalError.value = null
  try {
    await api.post('/auth/login', form.value)
  } catch (e: any) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors
    } else {
      globalError.value = e.response?.data?.message || 'Error'
    }
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4">
    <div>
      <label class="label">Email</label>
      <input v-model="form.email" type="email" class="input" required />
      <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email[0] }}</p>
    </div>

    <div v-if="globalError" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
      {{ globalError }}
    </div>

    <button type="submit" class="btn-primary w-full">Submit</button>
  </form>
</template>
```

### Empty State

```vue
<div class="text-center py-16">
  <div class="text-8xl mb-4">📦</div>
  <h2 class="text-2xl font-bold mb-2">Belum ada order</h2>
  <p class="text-gray-600 mb-6">Mulai jelajahi katalog kami.</p>
  <RouterLink to="/catalog" class="btn-primary">Lihat Katalog</RouterLink>
</div>
```

## Responsive Breakpoints

Tailwind defaults:
- `sm:` — 640px+
- `md:` — 768px+ (tablet)
- `lg:` — 1024px+ (desktop)
- `xl:` — 1280px+
- `2xl:` — 1536px+

**Rule:** Mobile-first. Tulis mobile styles default, add `md:`/`lg:` untuk larger.

```html
<!-- Mobile: full width, Desktop: max 7xl centered -->
<div class="px-4 md:px-8 lg:max-w-7xl lg:mx-auto">
```

## Accessibility (a11y)

### Semantic HTML
```html
✅ <button @click="doSomething">Click</button>
❌ <div @click="doSomething">Click</div>
```

### ARIA (kalau perlu)
```html
<button aria-label="Close modal" @click="close">×</button>

<input
  type="search"
  aria-label="Search products"
  placeholder="🔍 Cari..."
/>
```

### Focus Visible
Sudah include di `.btn`, `.input` — `focus:ring` untuk indicator.

### Contrast
- Text on white: minimum `text-gray-700` (WCAG AA)
- Text on brand-700: white (auto contrast)

### Keyboard Navigation
- Tab order logical
- Escape close modal
- Enter submit form

## Icons

Pakai emoji untuk demo (simple):
- 🎬 Video
- 📷 Camera
- ✏️ Pen
- 🎨 Palette
- 📺 Live

Phase 2+, pakai icon library:
- **Iconify** — universal (`~ 200k+ icons`)
- **Heroicons** — Tailwind team
- **Lucide** — modern, clean

## Component Library Consideration (Phase 2+)

Kalau butuh headless UI:
- **Radix Vue** — headless primitives (menu, dialog, dsb)
- **Headless UI** — Tailwind team
- **PrimeVue** — full component (kurang customizable)

Rekomendasi: **build custom** menggunakan Radix Vue untuk komponen kompleks (dialog, dropdown, popover).

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md) — Overall design
- [ROUTING.md](ROUTING.md) — Router setup
- [DEVELOPMENT.md](DEVELOPMENT.md) — Dev workflow
