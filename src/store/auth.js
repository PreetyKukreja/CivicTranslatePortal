import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref(null)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  const MOCK_USERS = {
    admin: {
      name: 'Sarah Mitchell',
      role: 'admin',
      email: 'admin@civictranslate.gov',
      initials: 'SM'
    },
    client: {
      name: 'James Whitford',
      role: 'client',
      email: 'j.whitford@county.gov',
      initials: 'JW'
    }
  }

  function login(role) {
    user.value = MOCK_USERS[role]
    router.push({ name: 'Dashboard' })
  }

  function logout() {
    user.value = null
    router.push({ name: 'Login' })
  }

  return { user, isLoggedIn, isAdmin, login, logout }
})
