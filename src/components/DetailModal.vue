<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal__header">
        <div>
          <div class="req-id">{{ request.id }}</div>
          <div class="modal__title">{{ request.title }}</div>
        </div>
        <button class="modal__close" @click="$emit('close')">✕</button>
      </div>

      <div class="modal__body">
        <div class="meta-grid">
          <div class="meta-item">
            <div class="meta-label">Status</div>
            <StatusBadge :status="request.status" />
          </div>
          <div class="meta-item">
            <div class="meta-label">Priority</div>
            <PriorityBadge :priority="request.priority" />
          </div>
          <div class="meta-item">
            <div class="meta-label">Languages</div>
            <div class="meta-value">
              {{ request.sourceLanguage }}
              <span class="lang-arrow">→</span>
              {{ request.targetLanguage }}
            </div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Requested By</div>
            <div class="meta-value">{{ request.createdBy }}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Date Created</div>
            <div class="meta-value">{{ request.createdAt }}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Last Updated</div>
            <div class="meta-value">{{ request.updatedAt }}</div>
          </div>
        </div>

        <div class="section-label">Description</div>
        <p class="description">{{ request.description }}</p>

        <!-- Admin: Status Update -->
        <template v-if="auth.isAdmin">
          <div class="admin-section">
            <div class="section-label">
              Update Status
              <span class="admin-only">Admin Only</span>
            </div>
            <div class="status-btns">
              <button
                class="status-btn"
                :disabled="updating || request.status === 'pending'"
                @click="changeStatus('pending')"
              >Pending</button>
              <button
                class="status-btn status-btn--progress"
                :disabled="updating || request.status === 'in-progress'"
                @click="changeStatus('in-progress')"
              >In Progress</button>
              <button
                class="status-btn status-btn--completed"
                :disabled="updating || request.status === 'completed'"
                @click="changeStatus('completed')"
              >Completed</button>
            </div>
          </div>
        </template>
      </div>

      <div class="modal__footer">
        <button
          v-if="auth.isAdmin"
          class="btn btn--danger"
          :disabled="deleting"
          @click="handleDelete"
        >
          {{ deleting ? 'Deleting...' : '🗑 Delete Request' }}
        </button>
        <div v-else />
        <button class="btn btn--outline" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import { useAuthStore } from '@/store/auth.js'
import { useRequestsStore } from '@/store/requests.js'

const props = defineProps({
  request: { type: Object, required: true }
})
const emit = defineEmits(['close', 'updated', 'deleted'])

const auth = useAuthStore()
const requestsStore = useRequestsStore()

const updating = ref(false)
const deleting = ref(false)

async function changeStatus(status) {
  updating.value = true
  try {
    const updated = await requestsStore.updateStatus(props.request.id, status)
    emit('updated', updated)
  } finally {
    updating.value = false
  }
}

async function handleDelete() {
  if (!confirm('Delete this translation request permanently?')) return
  deleting.value = true
  try {
    await requestsStore.deleteRequest(props.request.id)
    emit('deleted')
    emit('close')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal {
  background: #fff; border-radius: 14px;
  box-shadow: var(--shadow-lg);
  width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto;
}
.modal__header {
  padding: 22px 24px 16px; border-bottom: 1px solid var(--border);
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
}
.req-id { font-size: 12px; font-family: monospace; color: var(--text-muted); margin-bottom: 4px; }
.modal__title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; }
.modal__close {
  width: 30px; height: 30px; border-radius: 6px; border: none;
  background: var(--bg); cursor: pointer; font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); transition: all 0.15s; flex-shrink: 0;
}
.modal__close:hover { background: var(--border); }
.modal__body { padding: 22px 24px; }
.modal__footer {
  padding: 16px 24px; border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
}
.meta-grid { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
.meta-item { display: flex; flex-direction: column; gap: 4px; }
.meta-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); }
.meta-value { font-size: 13.5px; font-weight: 600; color: var(--text-primary); }
.lang-arrow { color: var(--teal, #0F766E); margin: 0 4px; }
.section-label {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
.description { font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; }
.admin-section { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }
.admin-only {
  display: inline-flex; align-items: center;
  font-size: 11px; font-weight: 600; color: var(--teal, #0F766E);
  background: #F0FDFA; border: 1px solid #CCFBF1;
  padding: 2px 8px; border-radius: 4px;
}
.status-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.status-btn {
  padding: 6px 14px; border-radius: 7px; border: 1px solid var(--border);
  background: transparent; font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
  color: var(--text-secondary);
}
.status-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.status-btn--progress { background: #DBEAFE; color: #1D4ED8; border-color: #BFDBFE; }
.status-btn--completed { background: #D1FAE5; color: #065F46; border-color: #A7F3D0; }
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; border: none; transition: all 0.15s;
}
.btn--outline { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.btn--outline:hover { background: var(--bg); }
.btn--danger { background: #FEE2E2; color: #DC2626; }
.btn--danger:hover { background: #FECACA; }
.btn--danger:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
