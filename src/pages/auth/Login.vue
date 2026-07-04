<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('admin@alnilam.test')
const password = ref('password')
const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null
  try {
    await auth.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Login gagal. Periksa email dan password Anda.'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto px-4 py-12">
    <div class="card p-8">
      <h1 class="text-2xl font-bold mb-2 text-center">Login</h1>
      <p class="text-center text-gray-600 mb-6">
        Selamat datang kembali di Alnilam.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="label">Email</label>
          <input v-model="email" type="email" class="input" required autocomplete="email" />
        </div>
        <div>
          <label class="label">Password</label>
          <input v-model="password" type="password" class="input" required autocomplete="current-password" />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {{ error }}
        </div>

        <button type="submit" :disabled="auth.loading" class="btn-primary w-full">
          {{ auth.loading ? 'Login...' : 'Login' }}
        </button>
      </form>

      <div class="text-center text-sm text-gray-600 mt-6">
        Belum punya akun?
        <RouterLink to="/register" class="text-brand-700 font-medium hover:underline">
          Daftar di sini
        </RouterLink>
      </div>

      <!-- Demo credential hints -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-xs text-gray-500 font-semibold mb-2">🧪 Demo credentials (password: <code>password</code>):</p>
        <div class="text-xs space-y-1 text-gray-600">
          <div>
            <button
              @click="email = 'admin@alnilam.test'; password = 'password'"
              class="underline hover:text-brand-700"
              type="button"
            >
              admin@alnilam.test
            </button> — Admin (full access)
          </div>
          <div>
            <button
              @click="email = 'client@alnilam.test'; password = 'password'"
              class="underline hover:text-brand-700"
              type="button"
            >
              client@alnilam.test
            </button> — Client
          </div>
          <div>
            <button
              @click="email = 'creator@alnilam.test'; password = 'password'"
              class="underline hover:text-brand-700"
              type="button"
            >
              creator@alnilam.test
            </button> — Creator
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
