<template>
  <span class="badge" :class="info.cls">
    <span class="badge-dot" :class="info.dotCls"></span>
    {{ info.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const STATUS_MAP = {
  'pending':     { cls: 'badge--pending',   dotCls: 'dot--amber', label: 'Pending' },
  'in-progress': { cls: 'badge--progress',  dotCls: 'dot--blue',  label: 'In Progress' },
  'completed':   { cls: 'badge--completed', dotCls: 'dot--green', label: 'Completed' },
}

const info = computed(() => STATUS_MAP[props.status] || { cls: '', dotCls: '', label: props.status })
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.badge--pending   { background: #FEF3C7; color: #B45309; }
.badge--progress  { background: #DBEAFE; color: #1D4ED8; }
.badge--completed { background: #D1FAE5; color: #065F46; }
.dot--amber { background: #F59E0B; }
.dot--blue  { background: #3B82F6; }
.dot--green { background: #10B981; }
</style>
