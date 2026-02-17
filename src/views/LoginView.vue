<template>
  <div class="login-screen">
    <!-- Left panel: branding -->
    <div class="login-left">
      <div class="login-brand">
        <h1>Civic<br /><span>Translate</span><br />Portal</h1>
        <p>
          Secure, certified translation management for government agencies
          and healthcare organizations nationwide.
        </p>
        <div class="trust-list">
          <div class="trust-item" v-for="item in trustItems" :key="item">
            <span class="trust-check">✓</span> {{ item }}
          </div>
        </div>
      </div>
    </div>

    <!-- Right panel: form -->
    <div class="login-right">
      <div class="form-wrap">
        <div class="form-icon">🌐</div>
        <div class="form-title">Sign in</div>
        <div class="form-subtitle">Access your translation management dashboard</div>

        <!-- Role selector -->
        <div class="role-tabs">
          <button
            class="role-tab"
            :class="{ 'role-tab--active': selectedRole === 'admin' }"
            @click="selectedRole = 'admin'"
          >⭐ Admin</button>
          <button
            class="role-tab"
            :class="{ 'role-tab--active': selectedRole === 'client' }"
            @click="selectedRole = 'client'"
          >👤 Client</button>
        </div>

        <div class="field">
          <label class="field-label">Email Address</label>
          <input
            v-model="email"
            class="field-input"
            type="email"
            :placeholder="selectedRole === 'admin' ? 'admin@civictranslate.gov' : 'j.whitford@county.gov'"
          />
        </div>

        <div class="field" style="margin-top: 12px">
          <label class="field-label">Password</label>
          <input v-model="password" class="field-input" type="password" placeholder="••••••••" />
        </div>

        <button class="submit-btn" @click="handleLogin">
          Sign in as {{ selectedRole === 'admin' ? 'Administrator' : 'Client' }} →
        </button>

        <div class="demo-hint">
          <strong>🔑 Demo Access</strong>
          Select a role above and click Sign In — no credentials required.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useToast } from '@/composables/useToast.js'

const auth = useAuthStore()
const { toast } = useToast()

const selectedRole = ref('admin')
const email = ref('')
const password = ref('')

const trustItems = [
  'HIPAA-compliant document handling',
  'ADA Title VI compliant workflows',
  '120+ supported languages',
  'Certified human translators',
]

function handleLogin() {
  auth.login(selectedRole.value)
  toast(`Welcome back, ${auth.user.name}!`)
}
</script>

<style scoped>
.login-screen {
  min-height: 100vh;
  background: #0D5C56;
  display: flex; position: relative; overflow: hidden;
}
.login-screen::before {
  content: ''; position: absolute;
  top: -100px; left: -100px;
  width: 400px; height: 400px;
  background: rgba(255,255,255,0.03); border-radius: 50%;
}
.login-screen::after {
  content: ''; position: absolute;
  bottom: -80px; right: -80px;
  width: 300px; height: 300px;
  background: rgba(20, 184, 166, 0.15); border-radius: 50%;
}
.login-left {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 48px; position: relative; z-index: 1;
}
.login-right {
  width: 480px; background: var(--bg, #F8FAFC);
  display: flex; align-items: center; justify-content: center; padding: 48px;
}
.login-brand h1 {
  font-family: 'Playfair Display', serif;
  font-size: 42px; font-weight: 700; color: #fff;
  line-height: 1.1; letter-spacing: -1px;
}
.login-brand h1 span { color: #14B8A6; }
.login-brand p {
  color: rgba(255,255,255,0.6); font-size: 15px;
  margin-top: 16px; max-width: 340px; line-height: 1.6;
}
.trust-list { margin-top: 48px; display: flex; flex-direction: column; gap: 12px; }
.trust-item { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.7); font-size: 13px; }
.trust-check { color: #14B8A6; font-size: 16px; }

.form-wrap { width: 100%; max-width: 360px; }
.form-icon { font-size: 28px; margin-bottom: 8px; }
.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px; font-weight: 700;
  color: var(--text-primary); margin-bottom: 4px;
}
.form-subtitle { font-size: 13.5px; color: var(--text-muted); margin-bottom: 28px; }

.role-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
.role-tab {
  flex: 1; padding: 9px;
  border: 1.5px solid var(--border);
  border-radius: 8px; background: transparent;
  font-family: 'DM Sans', sans-serif; font-size: 13.5px;
  font-weight: 600; cursor: pointer; color: var(--text-secondary);
  transition: all 0.15s;
}
.role-tab--active { border-color: #0F766E; background: #F0FDFA; color: #0F766E; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.field-input {
  padding: 9px 12px; border: 1.5px solid var(--border);
  border-radius: 8px; font-family: 'DM Sans', sans-serif;
  font-size: 14px; background: #fff; color: var(--text-primary);
  transition: border-color 0.15s;
}
.field-input:focus { outline: none; border-color: #0F766E; }

.submit-btn {
  width: 100%; padding: 11px;
  background: #0F766E; color: #fff; border: none;
  border-radius: 9px; font-family: 'DM Sans', sans-serif;
  font-size: 14.5px; font-weight: 700; cursor: pointer;
  margin-top: 20px; transition: background 0.15s; letter-spacing: 0.3px;
}
.submit-btn:hover { background: #0D5C56; }

.demo-hint {
  margin-top: 20px; padding: 12px 14px;
  background: #F0FDFA; border: 1px solid #CCFBF1;
  border-radius: 8px; font-size: 12.5px; color: #0D5C56;
}
.demo-hint strong { display: block; margin-bottom: 4px; }

@media (max-width: 900px) {
  .login-left { display: none; }
  .login-right { width: 100%; }
}
</style>
