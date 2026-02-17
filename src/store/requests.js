import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api.js'
import { useToast } from '@/composables/useToast.js'

export const useRequestsStore = defineStore('requests', () => {
  const { toast } = useToast()

  const requests = ref([])
  const loading  = ref(false)
  const error    = ref(null)

  // ── Computed stats ──────────────────────────────────────────────────
  const stats = computed(() => ({
    total:      requests.value.length,
    pending:    requests.value.filter(r => r.status === 'pending').length,
    inProgress: requests.value.filter(r => r.status === 'in-progress').length,
    completed:  requests.value.filter(r => r.status === 'completed').length,
  }))

  // ── Actions ─────────────────────────────────────────────────────────
  async function fetchRequests() {
    loading.value = true
    error.value   = null
    try {
      requests.value = await api.getRequests()
    } catch (e) {
      error.value = 'Failed to load requests.'
      toast('Failed to load requests', 'error')
    } finally {
      loading.value = false
    }
  }

  async function createRequest(payload) {
    try {
      const newReq = await api.createRequest(payload)
      requests.value.unshift(newReq)
      toast('Translation request created successfully!')
      return newReq
    } catch (e) {
      toast('Failed to create request. Please try again.', 'error')
      throw e
    }
  }

  async function updateStatus(id, status) {
    try {
      const updated = await api.updateStatus(id, status)
      const idx = requests.value.findIndex(r => r.id === id)
      if (idx !== -1) requests.value[idx] = updated
      toast(`Status updated to "${status}"`)
      return updated
    } catch (e) {
      toast('Failed to update status', 'error')
      throw e
    }
  }

  async function deleteRequest(id) {
    try {
      await api.deleteRequest(id)
      requests.value = requests.value.filter(r => r.id !== id)
      toast('Request deleted successfully.')
    } catch (e) {
      toast('Failed to delete request', 'error')
      throw e
    }
  }

  return {
    requests,
    loading,
    error,
    stats,
    fetchRequests,
    createRequest,
    updateStatus,
    deleteRequest
  }
})
