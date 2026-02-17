# 🌐 CivicTranslate Portal

> Translation Request Management Dashboard for government and healthcare organizations.

![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat&logo=tailwindcss)
![Pinia](https://img.shields.io/badge/Pinia-2.x-F7D336?style=flat)

---

## Overview

CivicTranslate Portal is a professional Translation Request Management Dashboard. It allows clients to submit translation requests and administrators to track, manage, and update their status — built for government agencies and healthcare providers handling critical multilingual document workflows.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | Pinia |
| Routing | Vue Router 4 |
| HTTP Client | Axios |
| Mock Backend | JSON Server |

---

## Features

- 🔐 **Role-based auth** — Admin and Client roles with different UI access
- 📋 **Request dashboard** — Full table with status badges, priority indicators, language pairs
- 🔍 **Debounced search** — Search across title, ID, requester, languages
- 🎛 **Filters** — Filter by status and priority
- ✚ **Create requests** — Modal form with full validation
- ✏️ **Status updates** — Admin can change request status (Pending → In Progress → Completed)
- 🗑 **Delete requests** — Admin-only with confirmation
- 💀 **Loading skeletons** — Shimmer animation while data loads
- 🔔 **Toast notifications** — Action feedback system

---

## Project Structure

```
src/
├── main.js                  # App entry point
├── App.vue                  # Root component
├── assets/
│   └── main.css             # Global styles
├── router/
│   └── index.js             # Vue Router config
├── store/
│   ├── auth.js              # Pinia auth store
│   └── requests.js          # Pinia requests store
├── services/
│   └── api.js               # Axios API service layer
├── components/
│   ├── AppSidebar.vue        # Left navigation sidebar
│   ├── AppTopbar.vue         # Top header bar
│   ├── StatusBadge.vue       # Status indicator badge
│   ├── PriorityBadge.vue     # Priority indicator badge
│   ├── SkeletonRows.vue      # Table loading skeleton
│   ├── ToastContainer.vue    # Toast notification system
│   ├── CreateRequestModal.vue # New request form modal
│   └── DetailModal.vue       # Request detail & edit modal
└── views/
    ├── LoginView.vue         # Authentication screen
    └── DashboardView.vue     # Main dashboard
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the mock API (JSON Server)
```bash
npm run mock-api
# Runs on http://localhost:3001
```

### 3. Run the frontend (in a new terminal)
```bash
npm run dev
# Runs on http://localhost:5173
```

### 4. Login
- Select **Admin** or **Client** role
- Click **Sign In** (no real credentials needed in demo mode)

---

## API Endpoints (JSON Server)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/requests` | Fetch all requests |
| POST | `/requests` | Create new request |
| PATCH | `/requests/:id` | Update request status |
| DELETE | `/requests/:id` | Delete a request |

---

## Build for Production

```bash
npm run build
# Output in /dist
```

---

## Vue Concepts Demonstrated

- `ref()` and `reactive()` for local and global reactivity
- `computed()` for derived filtering and stats
- `watch()` for debounced search
- `onMounted()` for data fetching lifecycle
- Reusable component architecture
- Props and emits for component communication
- Vue Router with navigation guards
- Pinia stores for state management
- Axios interceptors for API calls
