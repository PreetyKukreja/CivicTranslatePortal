import { reactive } from 'vue'

// Shared toast state across the app
const state = reactive({ items: [] })

export function useToast() {
  function toast(msg, type = 'success') {
    const id = Date.now()
    state.items.push({ id, msg, type })
    setTimeout(() => {
      state.items = state.items.filter(t => t.id !== id)
    }, 3200)
  }

  return { toastState: state, toast }
}
