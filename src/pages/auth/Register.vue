<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: 'client' as 'client' | 'creator',
})

const errors = ref<Record<string, string[]>>({})
const globalError = ref<string | null>(null)

async function handleSubmit() {
  errors.value = {}
  globalError.value = null
  try {
    await auth.register(form.value)
    router.push('/dashboard')
  } catch (e: any) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors || {}
    } else {
      globalError.value = e.response?.data?.message || 'Registrasi gagal.'
    }
  }
}
</script>

<template>
  <div class="max-w-md mx-auto px-4 py-12">
    <div class="card p-8">
      <h1 class="text-2xl font-bold mb-2 text-center">Daftar Akun</h1>
      <p class="text-center text-gray-600 mb-6">
        Buat akun baru di Alnilam.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="label">Saya adalah</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="form.role = 'client'"
              :class="[
                'p-3 rounded-lg border-2 text-center transition-colors',
                form.role === 'client' ? 'border-brand-600 bg-brand-50 text-brand-800 font-medium' : 'border-gray-200'
              ]"
            >
              <div class="text-2xl mb-1">🛍️</div>
              <div class="text-sm">Client</div>
              <div class="text-xs text-gray-500">Mau pesan jasa</div>
            </button>
            <button
              type="button"
              @click="form.role = 'creator'"
              :class="[
                'p-3 rounded-lg border-2 text-center transition-colors',
                form.role === 'creator' ? 'border-brand-600 bg-brand-50 text-brand-800 font-medium' : 'border-gray-200'
              ]"
            >
              <div class="text-2xl mb-1">🎨</div>
              <div class="text-sm">Creator</div>
              <div class="text-xs text-gray-500">Content creator</div>
            </button>
          </div>
        </div>

        <div>
          <label class="label">Nama lengkap</label>
          <input v-model="form.name" type="text" class="input" required minlength="3" />
          <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name[0] }}</p>
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="form.email" type="email" class="input" required />
          <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email[0] }}</p>
        </div>
        <div>
          <label class="label">Nomor HP <span class="text-gray-400 font-normal">(opsional)</span></label>
          <input v-model="form.phone" type="tel" class="input" placeholder="08xx" />
        </div>
        <div>
          <label class="label">Password <span class="text-gray-400 font-normal">(min 8 karakter)</span></label>
          <input v-model="form.password" type="password" class="input" required minlength="8" />
          <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password[0] }}</p>
        </div>
        <div>
          <label class="label">Konfirmasi password</label>
          <input v-model="form.password_confirmation" type="password" class="input" required minlength="8" />
        </div>

        <div v-if="globalError" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {{ globalError }}
        </div>

        <button type="submit" :disabled="auth.loading" class="btn-primary w-full">
          {{ auth.loading ? 'Mendaftar...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <div class="text-center text-sm text-gray-600 mt-6">
        Sudah punya akun?
        <RouterLink to="/login" class="text-brand-700 font-medium hover:underline">
          Login di sini
        </RouterLink>
      </div>
    </div>
  </div>
</template>
