<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal__header">
        <div>
          <div class="modal__title">New Translation Request</div>
          <div class="modal__subtitle">Fill in the details for your translation project</div>
        </div>
        <button class="modal__close" @click="$emit('close')">✕</button>
      </div>

      <div class="modal__body">
        <div class="form-grid">
          <!-- Title -->
          <div class="form-group form-group--full">
            <label class="form-label">Request Title <span class="required">*</span></label>
            <input
              v-model="form.title"
              class="form-input"
              :class="{ 'form-input--error': errors.title }"
              placeholder="e.g. Patient Consent Form — Oncology"
            />
            <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
          </div>

          <!-- Source Language -->
          <div class="form-group">
            <label class="form-label">Source Language <span class="required">*</span></label>
            <select
              v-model="form.sourceLanguage"
              class="form-select"
              :class="{ 'form-input--error': errors.sourceLanguage }"
            >
              <option value="">Select language...</option>
              <option v-for="l in LANGUAGES" :key="l">{{ l }}</option>
            </select>
            <p v-if="errors.sourceLanguage" class="form-error">{{ errors.sourceLanguage }}</p>
          </div>

          <!-- Target Language -->
          <div class="form-group">
            <label class="form-label">Target Language <span class="required">*</span></label>
            <select
              v-model="form.targetLanguage"
              class="form-select"
              :class="{ 'form-input--error': errors.targetLanguage }"
            >
              <option value="">Select language...</option>
              <option v-for="l in LANGUAGES" :key="l">{{ l }}</option>
            </select>
            <p v-if="errors.targetLanguage" class="form-error">{{ errors.targetLanguage }}</p>
          </div>

          <!-- Priority -->
          <div class="form-group">
            <label class="form-label">Priority Level</label>
            <select v-model="form.priority" class="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <!-- Requester -->
          <div class="form-group">
            <label class="form-label">Requester Name</label>
            <input v-model="form.createdBy" class="form-input" placeholder="Your name" />
          </div>

          <!-- Description -->
          <div class="form-group form-group--full">
            <label class="form-label">Description <span class="required">*</span></label>
            <textarea
              v-model="form.description"
              class="form-textarea"
              :class="{ 'form-input--error': errors.description }"
              rows="3"
              placeholder="Provide context about the document, intended audience, and any special requirements..."
            />
            <p v-if="errors.description" class="form-error">{{ errors.description }}</p>
          </div>
        </div>
      </div>

      <div class="modal__footer">
        <button class="btn btn--outline" @click="$emit('close')">Cancel</button>
        <button class="btn btn--primary" :disabled="submitting" @click="handleSubmit">
          {{ submitting ? '⏳ Submitting...' : '✚ Submit Request' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRequestsStore } from '@/store/requests.js'
import { useAuthStore } from '@/store/auth.js'

const emit = defineEmits(['close', 'created'])

const requestsStore = useRequestsStore()
const auth = useAuthStore()

const LANGUAGES = [
  'English','Spanish','Mandarin','Vietnamese','Arabic',
  'Haitian Creole','Korean','Portuguese','French','Tagalog',
  'Russian','Somali','Amharic','Hmong'
]

const form = reactive({
  title: '',
  sourceLanguage: '',
  targetLanguage: '',
  description: '',
  priority: 'medium',
  createdBy: auth.user?.name || ''
})

const errors = reactive({})
const submitting = ref(false)

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.title.trim())           errors.title = 'Title is required'
  if (!form.sourceLanguage)         errors.sourceLanguage = 'Please select a language'
  if (!form.targetLanguage)         errors.targetLanguage = 'Please select a language'
  if (form.sourceLanguage && form.targetLanguage && form.sourceLanguage === form.targetLanguage)
    errors.targetLanguage = 'Must differ from source language'
  if (!form.description.trim())     errors.description = 'Description is required'
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const newReq = await requestsStore.createRequest({ ...form })
    emit('created', newReq)
    emit('close')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal {
  background: #fff; border-radius: 14px;
  box-shadow: var(--shadow-lg);
  width: 100%; max-width: 540px;
  max-height: 90vh; overflow-y: auto;
}
.modal__header {
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal__title {
  font-family: 'Playfair Display', serif;
  font-size: 19px; font-weight: 700;
}
.modal__subtitle { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }
.modal__close {
  width: 30px; height: 30px; border-radius: 6px; border: none;
  background: var(--bg); cursor: pointer; font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); transition: all 0.15s;
}
.modal__close:hover { background: var(--border); }
.modal__body { padding: 22px 24px; }
.modal__footer {
  padding: 16px 24px; border-top: 1px solid var(--border);
  display: flex; justify-content: flex-end; gap: 10px;
}
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group--full { grid-column: 1 / -1; }
.form-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.required { color: #EF4444; margin-left: 2px; }
.form-input, .form-select, .form-textarea {
  padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  background: var(--bg);
  color: var(--text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--teal, #0F766E);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
  background: #fff;
}
.form-input--error { border-color: #EF4444; }
.form-textarea { resize: vertical; min-height: 80px; }
.form-error { font-size: 12px; color: #DC2626; }
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px;
  font-size: 13.5px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; border: none; transition: all 0.15s;
}
.btn--primary { background: var(--teal, #0F766E); color: #fff; }
.btn--primary:hover { background: #0D5C56; }
.btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn--outline { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.btn--outline:hover { background: var(--bg); }
</style>
