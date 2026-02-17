<template>
  <span class="badge" :class="cls">{{ priority }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: String,
    required: true
  }
})

const cls = computed(() => ({
  high:   'badge--high',
  medium: 'badge--medium',
  low:    'badge--low',
}[props.priority] || ''))
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}
.badge--high   { background: #FEE2E2; color: #B91C1C; }
.badge--medium { background: #FEF3C7; color: #B45309; }
.badge--low    { background: #F0FDF4; color: #166534; }
</style>
