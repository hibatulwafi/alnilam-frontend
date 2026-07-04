<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '@/api'
import type { Product } from '@/types'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get<Product>(`/catalog/products/${route.params.slug}`)
    product.value = data
  } catch (e: any) {
    error.value = e.response?.status === 404 ? 'Produk tidak ditemukan.' : 'Gagal memuat produk.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, load)

function formatPrice(price: string | number) {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function notImplemented(msg: string) {
  window.alert(msg)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-16 text-gray-500">Memuat produk...</div>
    <div v-else-if="error" class="text-center py-16">
      <p class="text-gray-600">{{ error }}</p>
      <RouterLink to="/catalog" class="btn-primary mt-4">Kembali ke Katalog</RouterLink>
    </div>
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <!-- Main content -->
      <div>
        <div class="text-sm text-gray-500 mb-2">
          <RouterLink to="/catalog" class="hover:text-brand-700">Katalog</RouterLink>
          <span class="mx-2">›</span>
          <RouterLink
            v-if="product.category"
            :to="{ name: 'catalog', query: { category: product.category.slug } }"
            class="hover:text-brand-700"
          >
            {{ product.category.name }}
          </RouterLink>
        </div>

        <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
          <img
            v-if="product.thumbnail_url"
            :src="product.thumbnail_url"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex items-center gap-3 flex-wrap mb-3">
          <span v-if="product.featured" class="badge bg-yellow-100 text-yellow-800">⭐ Featured</span>
          <span class="badge bg-green-100 text-green-800">✓ Verified Creator</span>
          <span class="text-sm text-gray-600">
            <span class="text-yellow-500">★</span>
            <span class="font-medium">{{ Number(product.avg_rating).toFixed(1) }}</span>
            <span class="text-gray-500"> · {{ product.order_count }} order selesai</span>
          </span>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
        <p class="text-lg text-gray-600 mb-8">{{ product.short_description }}</p>

        <div class="prose max-w-none border-t pt-6">
          <h2 class="text-xl font-bold mb-3">Detail Layanan</h2>
          <div class="text-gray-700 whitespace-pre-line">{{ product.long_description }}</div>
        </div>

        <div v-if="product.deliverables?.length" class="border-t pt-6 mt-6">
          <h2 class="text-xl font-bold mb-3">Yang Anda Dapatkan</h2>
          <ul class="space-y-2">
            <li v-for="(d, i) in product.deliverables" :key="i" class="flex items-start gap-2">
              <span class="text-green-600 mt-1">✓</span>
              <span>{{ d }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Sidebar (sticky) -->
      <aside class="lg:sticky lg:top-20 lg:self-start">
        <div class="card p-6">
          <div class="text-sm text-gray-500">Harga mulai</div>
          <div class="text-3xl font-bold text-brand-800 mb-6">{{ formatPrice(product.base_price) }}</div>

          <div class="space-y-3 text-sm mb-6">
            <div class="flex justify-between">
              <span class="text-gray-500">Waktu pengerjaan</span>
              <span class="font-medium">{{ product.delivery_days }} hari</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Revisi termasuk</span>
              <span class="font-medium">{{ product.revisions_included }} kali</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kategori</span>
              <span class="font-medium">{{ product.category?.name }}</span>
            </div>
          </div>

          <button
            class="btn-primary w-full text-lg py-3 mb-2"
            @click="notImplemented('Demo — order flow belum diimplementasi. Ini prototype MVP untuk validate stack.')"
          >
            Pesan Sekarang
          </button>
          <button
            class="btn-secondary w-full"
            @click="notImplemented('Demo — cart belum diimplementasi.')"
          >
            + Tambah ke Cart
          </button>

          <div class="text-xs text-gray-500 text-center mt-4">
            🛡️ Dana ditahan platform sampai project selesai
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.prose h2 { @apply text-xl font-bold mt-4 mb-2; }
</style>
