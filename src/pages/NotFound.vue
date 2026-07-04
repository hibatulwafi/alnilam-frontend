<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="max-w-md mx-auto px-4 py-24 text-center">
    <div class="text-8xl mb-4">🔍</div>
    <h1 class="text-4xl font-bold text-gray-900 mb-2">404</h1>
    <p class="text-gray-600 mb-6">Halaman yang Anda cari tidak ditemukan.</p>
    <RouterLink to="/" class="btn-primary">
      Kembali ke Beranda
    </RouterLink>
  </div>
</template>
