<template>
  <div class="layout">
    <AppSidebar />

    <div class="main">
      <AppTopbar title="Dashboard" />

      <div class="page">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Translation Requests</h1>
            <p class="page-subtitle">Manage and track all translation projects</p>
          </div>
          <button class="btn btn--primary" @click="showCreate = true">
            ✚ New Request
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card stat-card--teal">
            <div class="stat-label">Total Requests</div>
            <div class="stat-value">{{ requestsStore.stats.total }}</div>
            <div class="stat-sub">All time</div>
            <div class="stat-icon">📋</div>
          </div>
          <div class="stat-card stat-card--amber">
            <div class="stat-label">Pending</div>
            <div class="stat-value">{{ requestsStore.stats.pending }}</div>
            <div class="stat-sub">Awaiting assignment</div>
            <div class="stat-icon">⏳</div>
          </div>
          <div class="stat-card stat-card--blue">
            <div class="stat-label">In Progress</div>
            <div class="stat-value">{{ requestsStore.stats.inProgress }}</div>
            <div class="stat-sub">Active translations</div>
            <div class="stat-icon">🔄</div>
          </div>
          <div class="stat-card stat-card--green">
            <div class="stat-label">Completed</div>
            <div class="stat-value">{{ requestsStore.stats.completed }}</div>
            <div class="stat-sub">Delivered</div>
            <div class="stat-icon">✅</div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="card">
          <!-- Toolbar -->
          <div class="toolbar">
            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input
                v-model="searchQuery"
                class="search-input"
                placeholder="Search by title, requester, language..."
              />
            </div>

            <select v-model="statusFilter" class="filter-select">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select v-model="priorityFilter" class="filter-select">
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button v-if="hasActiveFilters" class="btn btn--ghost btn--sm" @click="clearFilters">
              ✕ Clear
            </button>

            <div class="toolbar-right">
              <span v-if="!requestsStore.loading" class="result-count">
                {{ filteredRequests.length }} of {{ requestsStore.requests.length }} requests
              </span>
            </div>
          </div>

          <!-- Table -->
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Title & Languages</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Requested By</th>
                  <th>Date</th>
                  <th style="text-align: right">Actions</th>
                </tr>
              </thead>

              <!-- Loading skeleton -->
              <SkeletonRows v-if="requestsStore.loading" :rows="5" />

              <!-- Empty state -->
              <tbody v-else-if="filteredRequests.length === 0">
                <tr>
                  <td colspan="7">
                    <div class="empty-state">
                      <div class="empty-icon">🌐</div>
                      <div class="empty-title">No requests found</div>
                      <div class="empty-sub">
                        {{ hasActiveFilters
                            ? 'Try adjusting your search or filters'
                            : 'Submit a new translation request to get started' }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>

              <!-- Data rows -->
              <tbody v-else>
                <tr v-for="req in filteredRequests" :key="req.id">
                  <td><span class="req-id">{{ req.id }}</span></td>
                  <td>
                    <div class="req-title">{{ req.title }}</div>
                    <div class="req-langs">
                      {{ req.sourceLanguage }}
                      <span class="lang-arrow">→</span>
                      {{ req.targetLanguage }}
                    </div>
                  </td>
                  <td><StatusBadge :status="req.status" /></td>
                  <td><PriorityBadge :priority="req.priority" /></td>
                  <td class="text-secondary">{{ req.createdBy }}</td>
                  <td class="text-muted text-sm">{{ req.createdAt }}</td>
                  <td>
                    <div style="display: flex; justify-content: flex-end">
                      <button class="btn btn--outline btn--sm" @click="selectedRequest = req">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <Transition name="fade">
      <CreateRequestModal v-if="showCreate" @close="showCreate = false" @created="() => {}" />
    </Transition>

    <Transition name="fade">
      <DetailModal
        v-if="selectedRequest"
        :request="selectedRequest"
        @close="selectedRequest = null"
        @updated="r => selectedRequest = r"
        @deleted="selectedRequest = null"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import SkeletonRows from '@/components/SkeletonRows.vue'
import CreateRequestModal from '@/components/CreateRequestModal.vue'
import DetailModal from '@/components/DetailModal.vue'
import { useRequestsStore } from '@/store/requests.js'
import { useDebounce } from '@/composables/useDebounce.js'

const requestsStore = useRequestsStore()

// UI state
const showCreate     = ref(false)
const selectedRequest = ref(null)

// Filters
const searchQuery   = ref('')
const statusFilter  = ref('')
const priorityFilter = ref('')

const debouncedSearch = useDebounce(searchQuery, 280)

const hasActiveFilters = computed(() =>
  debouncedSearch.value || statusFilter.value || priorityFilter.value
)

// Computed filtered list
const filteredRequests = computed(() => {
  return requestsStore.requests.filter(r => {
    const q = debouncedSearch.value.toLowerCase()
    const matchSearch = !q
      || r.title.toLowerCase().includes(q)
      || r.id.toLowerCase().includes(q)
      || r.createdBy.toLowerCase().includes(q)
      || r.sourceLanguage.toLowerCase().includes(q)
      || r.targetLanguage.toLowerCase().includes(q)

    const matchStatus   = !statusFilter.value   || r.status   === statusFilter.value
    const matchPriority = !priorityFilter.value || r.priority === priorityFilter.value

    return matchSearch && matchStatus && matchPriority
  })
})

function clearFilters() {
  searchQuery.value    = ''
  statusFilter.value   = ''
  priorityFilter.value = ''
}

// Fetch on mount
onMounted(() => {
  requestsStore.fetchRequests()
})
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.main   { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; }
.page   { padding: 28px; flex: 1; }

.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 24px;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px; font-weight: 700;
  color: var(--text-primary); letter-spacing: -0.5px; margin: 0;
}
.page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 3px; }

/* Stats */
.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 24px;
}
.stat-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--radius); padding: 20px;
  box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
}
.stat-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.stat-card--teal::after  { background: #0F766E; }
.stat-card--amber::after { background: #F59E0B; }
.stat-card--blue::after  { background: #3B82F6; }
.stat-card--green::after { background: #10B981; }
.stat-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); margin-top: 6px; letter-spacing: -1px; }
.stat-sub   { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.stat-icon  { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 32px; opacity: 0.1; }

/* Card */
.card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); }

/* Toolbar */
.toolbar {
  padding: 14px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; }
.search-input {
  width: 100%; padding: 7px 12px 7px 32px;
  border: 1px solid var(--border); border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 13.5px;
  background: var(--bg); color: var(--text-primary); transition: border-color 0.15s;
}
.search-input:focus { outline: none; border-color: #0F766E; background: #fff; }
.filter-select {
  padding: 7px 28px 7px 12px; border: 1px solid var(--border);
  border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13.5px;
  background: var(--bg); color: var(--text-secondary); cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center;
}
.filter-select:focus { outline: none; border-color: #0F766E; }
.toolbar-right { margin-left: auto; }
.result-count { font-size: 12.5px; color: var(--text-muted); }

/* Table */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead th {
  padding: 10px 16px; text-align: left;
  font-size: 11px; font-weight: 700; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.5px;
  background: var(--bg); border-bottom: 1px solid var(--border);
}
tbody tr { border-bottom: 1px solid var(--border-light); transition: background 0.1s; }
tbody tr:hover { background: #F0FDFA; }
tbody tr:last-child { border-bottom: none; }
td { padding: 13px 16px; font-size: 13.5px; vertical-align: middle; }

.req-id { font-size: 12px; font-family: monospace; color: var(--text-muted); }
.req-title { font-weight: 600; color: var(--text-primary); font-size: 13.5px; }
.req-langs { font-size: 12px; color: var(--text-secondary); margin-top: 1px; }
.lang-arrow { color: #0F766E; margin: 0 4px; }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 12.5px; }

/* Empty state */
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty-icon  { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
.empty-title { font-size: 15px; font-weight: 600; color: var(--text-secondary); }
.empty-sub   { font-size: 13px; margin-top: 4px; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px;
  font-size: 13.5px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap;
}
.btn--primary { background: #0F766E; color: #fff; }
.btn--primary:hover { background: #0D5C56; }
.btn--outline { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.btn--outline:hover { background: var(--bg); }
.btn--ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.btn--ghost:hover { background: var(--bg); }
.btn--sm { padding: 5px 11px; font-size: 12.5px; }

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
</style>
