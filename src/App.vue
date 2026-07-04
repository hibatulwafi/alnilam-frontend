<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Nav -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-9 h-9 bg-brand-700 text-white rounded-lg flex items-center justify-center font-bold">
            A
          </div>
          <span class="font-bold text-xl text-brand-800">Alnilam</span>
          <span class="hidden sm:block text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded ml-1">Demo</span>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-6">
          <RouterLink to="/catalog" class="text-gray-700 hover:text-brand-700">
            Katalog
          </RouterLink>
          <RouterLink
            v-if="auth.isAuthenticated"
            to="/dashboard"
            class="text-gray-700 hover:text-brand-700"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            v-if="auth.isAdmin"
            to="/admin/products"
            class="text-gray-700 hover:text-brand-700"
          >
            Admin
          </RouterLink>
        </nav>

        <div class="flex items-center gap-3">
          <template v-if="auth.isAuthenticated && auth.user">
            <span class="hidden sm:block text-sm">
              <span class="text-gray-500">Hi,</span>
              <span class="font-medium">{{ auth.user.name }}</span>
              <span class="text-xs badge bg-brand-100 text-brand-700 ml-2">
                {{ auth.user.role }}
              </span>
            </span>
            <button @click="handleLogout" class="btn-secondary text-sm">
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="text-sm text-gray-700 hover:text-brand-700">
              Login
            </RouterLink>
            <RouterLink to="/register" class="btn-primary text-sm">
              Daftar
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-6 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          <strong>Alnilam Demo</strong> — Platform Jasa Content Creator
          <span class="mx-2">•</span>
          Laravel 12 + Vue 3 + Tailwind CSS
        </p>
        <p class="mt-1 text-xs text-gray-400">
          Stack demo prototype • MIT License • Confidential
        </p>
      </div>
    </footer>
  </div>
</template>
