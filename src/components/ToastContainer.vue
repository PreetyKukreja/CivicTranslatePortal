<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toastState.items"
        :key="t.id"
        class="toast"
        :class="t.type === 'error' ? 'toast--error' : 'toast--success'"
      >
        <span class="toast-icon">{{ t.type === 'error' ? '⚠️' : '✅' }}</span>
        {{ t.msg }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast.js'
const { toastState } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.toast {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 500;
  min-width: 280px;
}
.toast--success { border-left: 3px solid #10B981; }
.toast--error   { border-left: 3px solid #EF4444; }
.toast-icon { font-size: 16px; }

/* TransitionGroup animations defined in main.css */
.toast-enter-active { animation: slideIn 0.2s ease; }
.toast-leave-active { transition: opacity 0.2s ease; }
.toast-leave-to     { opacity: 0; }
@keyframes slideIn {
  from { transform: translateX(20px); opacity: 0; }
  to   { transform: none; opacity: 1; }
}
</style>
