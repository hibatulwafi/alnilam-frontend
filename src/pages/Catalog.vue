<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import api from '@/api'
import type { Category, Product, Paginated } from '@/types'

const route = useRoute()
const router = useRouter()

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const total = ref(0)

const selectedCategory = ref((route.query.category as string) || '')
const search = ref((route.query.search as string) || '')
const sort = ref((route.query.sort as string) || 'newest')

async function loadCategories() {
  const { data } = await api.get<Category[]>('/catalog/categories')
  categories.value = data
}

async function loadProducts() {
  loading.value = true
  try {
    const params: Record<string, string> = { sort: sort.value }
    if (selectedCategory.value) params.category = selectedCategory.value
    if (search.value) params.search = search.value

    const { data } = await api.get<Paginated<Product>>('/catalog/products', { params })
    products.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function updateFilter() {
  router.replace({
    query: {
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      ...(search.value ? { search: search.value } : {}),
      ...(sort.value !== 'newest' ? { sort: sort.value } : {}),
    },
  })
}

watch([selectedCategory, sort], () => {
  updateFilter()
  loadProducts()
})

let searchTimeout: number | null = null
watch(search, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = window.setTimeout(() => {
    updateFilter()
    loadProducts()
  }, 300)
})

onMounted(async () => {
  await Promise.all([loadCategories(), loadProducts()])
})

function formatPrice(price: string | number) {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Katalog Jasa</h1>
      <p class="text-gray-600 mt-1">{{ total }} jasa tersedia</p>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <input
        v-model="search"
        type="search"
        placeholder="🔍 Cari jasa..."
        class="input flex-1"
      />
      <select v-model="sort" class="input md:w-48">
        <option value="newest">Terbaru</option>
        <option value="popular">Terpopuler</option>
        <option value="price_asc">Harga terendah</option>
        <option value="price_desc">Harga tertinggi</option>
        <option value="rating">Rating tertinggi</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      <!-- Sidebar filter -->
      <aside class="space-y-2">
        <h3 class="font-semibold text-gray-900 mb-3">Kategori</h3>
        <button
          @click="selectedCategory = ''"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg transition-colors',
            !selectedCategory ? 'bg-brand-100 text-brand-800 font-medium' : 'hover:bg-gray-100 text-gray-700'
          ]"
        >
          Semua Kategori
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.slug"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg transition-colors',
            selectedCategory === cat.slug ? 'bg-brand-100 text-brand-800 font-medium' : 'hover:bg-gray-100 text-gray-700'
          ]"
        >
          {{ cat.name }}
          <span class="text-xs text-gray-500 float-right mt-0.5">{{ cat.products_count ?? 0 }}</span>
        </button>
      </aside>

      <!-- Product Grid -->
      <div>
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="card animate-pulse">
            <div class="aspect-video bg-gray-200"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
        <div v-else-if="!products.length" class="text-center py-16">
          <p class="text-gray-500 text-lg">Tidak ada jasa ditemukan.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="p in products"
            :key="p.id"
            :to="{ name: 'product-detail', params: { slug: p.slug } }"
            class="card hover:shadow-lg transition-shadow"
          >
            <div class="aspect-video bg-gray-100 relative">
              <img v-if="p.thumbnail_url" :src="p.thumbnail_url" :alt="p.name" class="w-full h-full object-cover" />
              <span v-if="p.featured" class="absolute top-2 left-2 badge bg-yellow-100 text-yellow-800">
                ⭐ Featured
              </span>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-1 text-sm mb-1">
                <span class="text-yellow-500">★</span>
                <span class="font-medium">{{ Number(p.avg_rating).toFixed(1) }}</span>
                <span class="text-gray-500">· {{ p.order_count }} order</span>
              </div>
              <h3 class="font-semibold line-clamp-2 mb-1">{{ p.name }}</h3>
              <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ p.short_description }}</p>
              <div class="flex items-center justify-between border-t pt-3 text-sm">
                <span class="text-gray-500">
                  📅 {{ p.delivery_days }} hari
                </span>
                <span class="font-bold text-brand-700">{{ formatPrice(p.base_price) }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
