<template>
  <header class="topbar">
    <div class="topbar__title">{{ title }}</div>
    <div class="topbar__divider" />
    <div class="topbar__breadcrumb">CivicTranslate / {{ title }}</div>

    <div class="topbar__right">
      <span v-if="auth.isAdmin" class="admin-badge">⭐ Admin Mode</span>
      <button class="icon-btn" title="Notifications">🔔</button>
      <button class="icon-btn" title="Help">❓</button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.js'
const auth = useAuthStore()

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
})
</script>

<style scoped>
.topbar {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  height: 60px;
  display: flex; align-items: center; gap: 16px;
  position: sticky; top: 0; z-index: 50;
}
.topbar__title { font-size: 16px; font-weight: 600; color: var(--text-primary); }
.topbar__divider { width: 1px; height: 20px; background: var(--border); }
.topbar__breadcrumb { font-size: 13px; color: var(--text-muted); }
.topbar__right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.admin-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: var(--teal, #0F766E);
  background: #F0FDFA; border: 1px solid #CCFBF1;
  padding: 4px 10px; border-radius: 4px;
}
.icon-btn {
  width: 34px; height: 34px; border-radius: 8px;
  border: 1px solid var(--border); background: transparent;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 16px;
  transition: background 0.15s; color: var(--text-secondary);
}
.icon-btn:hover { background: var(--bg); }
</style>
