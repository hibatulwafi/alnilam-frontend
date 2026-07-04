<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/api'
import type { Category, Product, Paginated } from '@/types'

const categories = ref<Category[]>([])
const featured = ref<Product[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [cRes, pRes] = await Promise.all([
      api.get<Category[]>('/catalog/categories'),
      api.get<Paginated<Product>>('/catalog/products', { params: { featured: 1 } }),
    ])
    categories.value = cRes.data
    featured.value = pRes.data.data.slice(0, 4)
  } finally {
    loading.value = false
  }
})

function formatPrice(price: string | number) {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <!-- Hero -->
  <section class="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div class="max-w-3xl">
        <span class="inline-block bg-white/10 backdrop-blur px-3 py-1 rounded-full text-sm font-medium mb-4">
          🎬 Managed Marketplace • Curated by Alnilam
        </span>
        <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Content Creator profesional untuk brand Anda
        </h1>
        <p class="text-xl text-brand-100 mb-8 leading-relaxed">
          Video, foto, copywriting, desain — dari creator ter-verifikasi dengan kualitas terjamin,
          pembayaran aman, dan project tracking transparan.
        </p>
        <div class="flex gap-3 flex-wrap">
          <RouterLink to="/catalog" class="btn bg-white text-brand-800 hover:bg-brand-50 text-lg px-6 py-3">
            Jelajahi Katalog
          </RouterLink>
          <RouterLink to="/register" class="btn border-2 border-white/30 text-white hover:bg-white/10 text-lg px-6 py-3">
            Daftar Gratis
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="flex items-end justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Kategori Jasa</h2>
        <p class="text-gray-600 mt-1">Pilih kategori sesuai kebutuhan konten Anda</p>
      </div>
      <RouterLink to="/catalog" class="text-brand-700 font-medium hover:underline">
        Lihat semua →
      </RouterLink>
    </div>
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div v-for="i in 5" :key="i" class="card p-6 animate-pulse">
        <div class="w-12 h-12 bg-gray-200 rounded mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <RouterLink
        v-for="cat in categories"
        :key="cat.id"
        :to="{ name: 'catalog', query: { category: cat.slug } }"
        class="card p-6 hover:shadow-lg transition-shadow group"
      >
        <img v-if="cat.icon_url" :src="cat.icon_url" alt="" class="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
        <h3 class="font-semibold text-gray-900">{{ cat.name }}</h3>
        <p class="text-xs text-gray-500 mt-1">
          {{ cat.products_count ?? 0 }} jasa tersedia
        </p>
      </RouterLink>
    </div>
  </section>

  <!-- Featured Products -->
  <section class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Pilihan Terbaik</h2>
          <p class="text-gray-600 mt-1">Jasa unggulan dari creator ter-verifikasi</p>
        </div>
      </div>
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="card animate-pulse">
          <div class="aspect-video bg-gray-200"></div>
          <div class="p-4">
            <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RouterLink
          v-for="p in featured"
          :key="p.id"
          :to="{ name: 'product-detail', params: { slug: p.slug } }"
          class="card hover:shadow-lg transition-shadow overflow-hidden"
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
            <div class="flex items-center justify-between border-t pt-3">
              <span class="text-xs text-gray-500">Mulai dari</span>
              <span class="font-bold text-brand-700">{{ formatPrice(p.base_price) }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Trust indicators -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="text-center p-6">
        <div class="text-4xl mb-3">🛡️</div>
        <h3 class="font-bold text-lg mb-2">Pembayaran Aman</h3>
        <p class="text-gray-600 text-sm">Dana ditahan platform sampai project Anda selesai & di-approve</p>
      </div>
      <div class="text-center p-6">
        <div class="text-4xl mb-3">✨</div>
        <h3 class="font-bold text-lg mb-2">Kualitas Terjaga</h3>
        <p class="text-gray-600 text-sm">Setiap creator melalui verifikasi ketat & quality gate</p>
      </div>
      <div class="text-center p-6">
        <div class="text-4xl mb-3">💬</div>
        <h3 class="font-bold text-lg mb-2">Kolaborasi Mudah</h3>
        <p class="text-gray-600 text-sm">Chat & video meeting terintegrasi dalam 1 platform</p>
      </div>
    </div>
  </section>
</template>
