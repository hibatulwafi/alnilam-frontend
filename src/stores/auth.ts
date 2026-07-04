import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import type { User, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isCreator = computed(() => user.value?.role === 'creator')
  const isClient = computed(() => user.value?.role === 'client')

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await api.get<{ user: User }>('/auth/me')
      user.value = data.user
    } catch {
      logout()
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('auth_token', data.token)
    } finally {
      loading.value = false
    }
  }

  async function register(payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: 'client' | 'creator'
    phone?: string
  }) {
    loading.value = true
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', payload)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('auth_token', data.token)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) await api.post('/auth/logout')
    } catch { /* ignore */ }
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isCreator,
    isClient,
    fetchMe,
    login,
    register,
    logout,
  }
})
