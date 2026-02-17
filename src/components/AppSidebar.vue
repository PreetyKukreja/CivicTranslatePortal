<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <div class="brand-logo">
        <div class="brand-icon">🌐</div>
        <div>
          <div class="brand-name">CivicTranslate</div>
          <div class="brand-sub">Portal</div>
        </div>
      </div>
    </div>

    <nav class="sidebar__nav">
      <div class="nav-section-label">Navigation</div>

      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        active-class="nav-item--active"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        {{ item.label }}
        <span v-if="item.badge > 0" class="nav-badge">{{ item.badge }}</span>
      </RouterLink>

      <template v-if="auth.isAdmin">
        <div class="nav-section-label" style="margin-top: 12px">Admin</div>
        <RouterLink
          v-for="item in adminItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          active-class="nav-item--active"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>

    <div class="sidebar__footer">
      <div class="user-card">
        <div class="user-avatar">{{ auth.user?.initials }}</div>
        <div>
          <div class="user-name">{{ auth.user?.name }}</div>
          <div class="user-role">{{ auth.isAdmin ? '⭐ Administrator' : 'Client' }}</div>
        </div>
        <button class="logout-btn" title="Sign out" @click="auth.logout()">⏏</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'
import { useRequestsStore } from '@/store/requests.js'

const auth     = useAuthStore()
const requests = useRequestsStore()

const navItems = computed(() => [
  { to: '/', icon: '⊞', label: 'Dashboard', badge: requests.stats.pending },
])

const adminItems = [
  { to: '/analytics', icon: '📊', label: 'Analytics' },
  { to: '/team',      icon: '👥', label: 'Team' },
  { to: '/settings',  icon: '⚙',  label: 'Settings' },
]
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  background: var(--teal-dark, #0D5C56);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  overflow: hidden;
}
.sidebar::before {
  content: '';
  position: absolute;
  top: -60px; right: -40px;
  width: 180px; height: 180px;
  background: rgba(255,255,255,0.04);
  border-radius: 50%;
  pointer-events: none;
}
.sidebar__brand {
  padding: 24px 22px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.brand-logo { display: flex; align-items: center; gap: 10px; }
.brand-icon {
  width: 36px; height: 36px;
  background: #14B8A6;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.brand-name {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: 17px;
  color: #fff; letter-spacing: -0.3px; line-height: 1.2;
}
.brand-sub {
  font-size: 10px; color: rgba(255,255,255,0.5);
  letter-spacing: 0.8px; text-transform: uppercase; margin-top: 1px;
}
.sidebar__nav {
  flex: 1; padding: 16px 12px; overflow-y: auto;
}
.nav-section-label {
  font-size: 10px; font-weight: 600; letter-spacing: 1px;
  text-transform: uppercase; color: rgba(255,255,255,0.35);
  padding: 12px 10px 6px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 7px; cursor: pointer;
  color: rgba(255,255,255,0.65); font-size: 13.5px; font-weight: 500;
  text-decoration: none; transition: all 0.15s ease;
  margin-bottom: 1px; position: relative;
}
.nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
.nav-item--active { background: rgba(255,255,255,0.12); color: #fff; }
.nav-item--active::before {
  content: '';
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 3px; height: 18px; background: #14B8A6;
  border-radius: 0 2px 2px 0;
}
.nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
.nav-badge {
  margin-left: auto; background: #14B8A6; color: #fff;
  font-size: 10px; font-weight: 700; padding: 1px 6px;
  border-radius: 10px; min-width: 18px; text-align: center;
}
.sidebar__footer {
  padding: 16px 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.user-card {
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: 8px;
  background: rgba(255,255,255,0.06);
}
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #14B8A6; display: flex; align-items: center;
  justify-content: center; font-size: 13px; font-weight: 700;
  color: #fff; flex-shrink: 0;
}
.user-name { font-size: 13px; font-weight: 600; color: #fff; }
.user-role { font-size: 11px; color: rgba(255,255,255,0.45); }
.logout-btn {
  margin-left: auto; background: none; border: none;
  color: rgba(255,255,255,0.4); cursor: pointer; font-size: 16px;
  padding: 4px; border-radius: 4px; transition: color 0.15s;
}
.logout-btn:hover { color: rgba(255,255,255,0.8); }
</style>
