<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Selamat datang, {{ auth.user?.name }}!
      </h1>
      <p class="text-gray-600 mt-1">
        Role Anda: <span class="badge bg-brand-100 text-brand-800">{{ auth.user?.role }}</span>
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="card p-6">
        <div class="text-3xl mb-2">📦</div>
        <div class="text-2xl font-bold">0</div>
        <div class="text-sm text-gray-500">Active Orders</div>
      </div>
      <div class="card p-6">
        <div class="text-3xl mb-2">🎬</div>
        <div class="text-2xl font-bold">0</div>
        <div class="text-sm text-gray-500">Projects</div>
      </div>
      <div class="card p-6">
        <div class="text-3xl mb-2">💬</div>
        <div class="text-2xl font-bold">0</div>
        <div class="text-sm text-gray-500">Messages</div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-bold mb-4">🚧 Demo MVP Notice</h2>
      <p class="text-gray-700 mb-4">
        Dashboard ini adalah prototype untuk validate stack Laravel 12 + Vue 3.
        Fitur berikut sudah working:
      </p>
      <ul class="space-y-2 text-sm text-gray-700 mb-6">
        <li>✅ Registrasi & login (Sanctum token auth)</li>
        <li>✅ RBAC (Client, Creator, Admin dengan permission berbeda)</li>
        <li>✅ Public catalog browsing (kategori & produk)</li>
        <li>✅ Product detail page</li>
        <li v-if="auth.isAdmin">✅ Admin CRUD produk & kategori</li>
        <li>⏳ Order & payment flow — planned Phase 2</li>
        <li>⏳ Project management — planned Phase 3</li>
        <li>⏳ Chat & meeting — planned Phase 3-4</li>
      </ul>

      <div class="flex gap-2 flex-wrap">
        <RouterLink to="/catalog" class="btn-primary">
          Jelajahi Katalog
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin/products" class="btn-secondary">
          Admin Panel
        </RouterLink>
      </div>
    </div>
  </div>
</template>
