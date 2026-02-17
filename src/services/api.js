import axios from 'axios'

// ─── Axios Instance ──────────────────────────────────────────────────────────
// In development: requests proxy through Vite to http://localhost:3001 (JSON Server)
// In production:  set VITE_API_BASE_URL in your .env file
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach auth token if present (extend for real auth)
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ────────────────────────────────────────────────────
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── API Methods ─────────────────────────────────────────────────────────────

/**
 * When using the mock (no JSON Server), these methods simulate
 * async REST operations with fake delays.
 * Swap USE_MOCK to false once JSON Server is running.
 */
const USE_MOCK = true

let _mockData = [
  { id: 'TRQ-001', title: 'Patient Consent Form — Cardiology', sourceLanguage: 'English', targetLanguage: 'Spanish', status: 'completed', priority: 'high', description: 'Translate patient consent form for cardiac catheterization procedure into Spanish for Houston General Hospital.', createdBy: 'Maria Santos', createdAt: '2025-01-12', updatedAt: '2025-01-14' },
  { id: 'TRQ-002', title: 'Public Health Advisory — COVID-19 Booster', sourceLanguage: 'English', targetLanguage: 'Mandarin', status: 'in-progress', priority: 'high', description: 'Urgent translation of public health advisory bulletin from the CDC regarding updated booster guidelines.', createdBy: 'John Webber', createdAt: '2025-01-13', updatedAt: '2025-01-13' },
  { id: 'TRQ-003', title: 'Municipal Zoning Ordinance Update', sourceLanguage: 'English', targetLanguage: 'Vietnamese', status: 'pending', priority: 'medium', description: 'Translation of Section 12 amendments to the City of San Jose municipal zoning code for community distribution.', createdBy: 'Alice Park', createdAt: '2025-01-15', updatedAt: '2025-01-15' },
  { id: 'TRQ-004', title: 'Immigration Legal Aid Guide', sourceLanguage: 'English', targetLanguage: 'Arabic', status: 'pending', priority: 'high', description: 'Comprehensive guide for legal aid services covering asylum application processes, required documentation, and timeline expectations.', createdBy: 'David Kim', createdAt: '2025-01-15', updatedAt: '2025-01-15' },
  { id: 'TRQ-005', title: 'School Enrollment Package 2025', sourceLanguage: 'English', targetLanguage: 'Haitian Creole', status: 'in-progress', priority: 'medium', description: 'K-12 enrollment forms, parent handbook, and emergency contact documents for Miami-Dade County School District.', createdBy: 'Rosa Fernandez', createdAt: '2025-01-16', updatedAt: '2025-01-16' },
  { id: 'TRQ-006', title: 'Pharmacy Instructions — Insulin Protocol', sourceLanguage: 'English', targetLanguage: 'Portuguese', status: 'completed', priority: 'high', description: 'Medication instruction sheet for insulin management protocol to be distributed to diabetic patients at community clinics.', createdBy: 'Thomas Liu', createdAt: '2025-01-10', updatedAt: '2025-01-11' },
  { id: 'TRQ-007', title: 'Benefits Enrollment Notice — Medicare', sourceLanguage: 'English', targetLanguage: 'Korean', status: 'pending', priority: 'low', description: 'Annual Medicare benefits enrollment notice including plan comparison tables and deadline information for 2025.', createdBy: 'James Bell', createdAt: '2025-01-17', updatedAt: '2025-01-17' },
  { id: 'TRQ-008', title: 'Court Notice — Child Custody Hearing', sourceLanguage: 'Spanish', targetLanguage: 'English', status: 'completed', priority: 'high', description: 'Official court notice requiring certified translation for child custody proceedings in Family Court, Case #FCT-2025-0047.', createdBy: 'Linda Torres', createdAt: '2025-01-09', updatedAt: '2025-01-10' },
]
let _idCounter = _mockData.length + 1
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

// ─── Exported API ─────────────────────────────────────────────────────────────
const api = {
  /** GET /requests */
  async getRequests() {
    if (USE_MOCK) {
      await delay()
      return [..._mockData]
    }
    const { data } = await http.get('/requests')
    return data
  },

  /** POST /requests */
  async createRequest(payload) {
    if (USE_MOCK) {
      await delay(400)
      const newReq = {
        id: `TRQ-${String(_idCounter++).padStart(3, '0')}`,
        ...payload,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      }
      _mockData.unshift(newReq)
      return { ...newReq }
    }
    const { data } = await http.post('/requests', {
      ...payload,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    })
    return data
  },

  /** PATCH /requests/:id */
  async updateStatus(id, status) {
    if (USE_MOCK) {
      await delay(300)
      const req = _mockData.find(r => r.id === id)
      if (!req) throw new Error('Not found')
      req.status = status
      req.updatedAt = new Date().toISOString().slice(0, 10)
      return { ...req }
    }
    const { data } = await http.patch(`/requests/${id}`, {
      status,
      updatedAt: new Date().toISOString().slice(0, 10)
    })
    return data
  },

  /** DELETE /requests/:id */
  async deleteRequest(id) {
    if (USE_MOCK) {
      await delay(300)
      _mockData = _mockData.filter(r => r.id !== id)
      return { success: true }
    }
    await http.delete(`/requests/${id}`)
    return { success: true }
  }
}

export default api
