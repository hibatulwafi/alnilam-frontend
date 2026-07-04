<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'
import type { Category, Product, Paginated } from '@/types'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const showForm = ref(false)
const editingProduct = ref<Product | null>(null)

const emptyForm = () => ({
  id: null as number | null,
  category_id: 0,
  name: '',
  short_description: '',
  long_description: '',
  base_price: 0,
  delivery_days: 7,
  revisions_included: 3,
  deliverables: '',
  thumbnail_url: '',
  status: 'draft' as 'draft' | 'published' | 'unpublished',
  featured: false,
})

const form = ref(emptyForm())
const formError = ref<string | null>(null)

async function loadAll() {
  loading.value = true
  try {
    const [pRes, cRes] = await Promise.all([
      api.get<Paginated<Product>>('/catalog/products', { params: { per_page: 100 } }),
      api.get<Category[]>('/catalog/categories'),
    ])
    products.value = pRes.data.data
    categories.value = cRes.data
    if (categories.value.length > 0 && !form.value.category_id) {
      form.value.category_id = categories.value[0].id
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadAll)

function openCreate() {
  editingProduct.value = null
  form.value = emptyForm()
  if (categories.value.length > 0) form.value.category_id = categories.value[0].id
  formError.value = null
  showForm.value = true
}

function openEdit(p: Product) {
  editingProduct.value = p
  form.value = {
    id: p.id,
    category_id: p.category_id,
    name: p.name,
    short_description: p.short_description,
    long_description: p.long_description,
    base_price: typeof p.base_price === 'string' ? parseFloat(p.base_price) : p.base_price,
    delivery_days: p.delivery_days,
    revisions_included: p.revisions_included,
    deliverables: (p.deliverables || []).join('\n'),
    thumbnail_url: p.thumbnail_url || '',
    status: p.status,
    featured: p.featured,
  }
  formError.value = null
  showForm.value = true
}

async function save() {
  formError.value = null
  try {
    const payload = {
      category_id: form.value.category_id,
      name: form.value.name,
      short_description: form.value.short_description,
      long_description: form.value.long_description,
      base_price: form.value.base_price,
      delivery_days: form.value.delivery_days,
      revisions_included: form.value.revisions_included,
      deliverables: form.value.deliverables.split('\n').map(s => s.trim()).filter(Boolean),
      thumbnail_url: form.value.thumbnail_url || null,
      status: form.value.status,
      featured: form.value.featured,
    }

    if (form.value.id) {
      await api.put(`/admin/products/${form.value.id}`, payload)
    } else {
      await api.post('/admin/products', payload)
    }
    showForm.value = false
    await loadAll()
  } catch (e: any) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan produk.'
  }
}

async function remove(p: Product) {
  if (!confirm(`Yakin hapus "${p.name}"?`)) return
  try {
    await api.delete(`/admin/products/${p.id}`)
    await loadAll()
  } catch (e: any) {
    alert('Gagal menghapus: ' + (e.response?.data?.message || 'Unknown error'))
  }
}

function formatPrice(price: string | number) {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

const statusColor = computed(() => (status: string) => ({
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  unpublished: 'bg-yellow-100 text-yellow-700',
}[status] || 'bg-gray-100'))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Admin — Katalog Produk</h1>
        <p class="text-gray-600 mt-1">Kelola produk jasa yang ditawarkan di platform</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        + Tambah Produk
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">Memuat...</div>
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr class="text-left text-xs font-semibold text-gray-600 uppercase">
            <th class="px-4 py-3">Nama</th>
            <th class="px-4 py-3">Kategori</th>
            <th class="px-4 py-3">Harga</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Order</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="p in products" :key="p.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="font-medium">{{ p.name }}</div>
              <div class="text-xs text-gray-500">{{ p.short_description.slice(0, 60) }}{{ p.short_description.length > 60 ? '...' : '' }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ categories.find(c => c.id === p.category_id)?.name }}
            </td>
            <td class="px-4 py-3 font-medium">{{ formatPrice(p.base_price) }}</td>
            <td class="px-4 py-3">
              <span class="badge" :class="statusColor(p.status)">{{ p.status }}</span>
              <span v-if="p.featured" class="badge bg-yellow-100 text-yellow-700 ml-1">★</span>
            </td>
            <td class="px-4 py-3 text-sm">{{ p.order_count }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <button @click="openEdit(p)" class="text-brand-700 hover:underline text-sm">Edit</button>
              <button @click="remove(p)" class="text-red-600 hover:underline text-sm">Hapus</button>
            </td>
          </tr>
          <tr v-if="!products.length">
            <td colspan="6" class="px-4 py-12 text-center text-gray-500">
              Belum ada produk. Klik "Tambah Produk" untuk mulai.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal form -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold">
            {{ form.id ? 'Edit Produk' : 'Tambah Produk' }}
          </h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <form @submit.prevent="save" class="p-6 space-y-4">
          <div>
            <label class="label">Nama Produk</label>
            <input v-model="form.name" required class="input" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Kategori</label>
              <select v-model="form.category_id" class="input" required>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">Harga (IDR)</label>
              <input v-model.number="form.base_price" type="number" min="0" required class="input" />
            </div>
          </div>
          <div>
            <label class="label">Deskripsi Singkat</label>
            <input v-model="form.short_description" required maxlength="500" class="input" />
          </div>
          <div>
            <label class="label">Deskripsi Detail</label>
            <textarea v-model="form.long_description" required rows="4" class="input"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Waktu Pengerjaan (hari)</label>
              <input v-model.number="form.delivery_days" type="number" min="1" required class="input" />
            </div>
            <div>
              <label class="label">Revisi Termasuk</label>
              <input v-model.number="form.revisions_included" type="number" min="0" required class="input" />
            </div>
          </div>
          <div>
            <label class="label">Deliverables (1 per baris)</label>
            <textarea v-model="form.deliverables" rows="3" class="input"
              placeholder="File MP4 1080p&#10;File MP4 vertical 9:16&#10;Source file"></textarea>
          </div>
          <div>
            <label class="label">Thumbnail URL</label>
            <input v-model="form.thumbnail_url" type="url" class="input" placeholder="https://..." />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Status</label>
              <select v-model="form.status" class="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
            <div class="flex items-end">
              <label class="flex items-center gap-2 py-2">
                <input v-model="form.featured" type="checkbox" class="w-4 h-4" />
                <span class="text-sm">Featured</span>
              </label>
            </div>
          </div>

          <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {{ formError }}
          </div>

          <div class="flex gap-2 justify-end pt-2">
            <button type="button" @click="showForm = false" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
