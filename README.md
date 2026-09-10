# FinTrack — SaaS Finance Tracker React Frontend

## 🚀 Overview

FinTrack Frontend is a modern React application built with TypeScript, Vite, React Router DOM, Axios, and Lucide React icons. It provides a clean, responsive, and financial SaaS dashboard foundation for managing income, expenses, budgets, savings goals, recurring subscriptions, and analytics.

---

## 🛠 Tech Stack & Dependencies

- **Framework**: React 18
- **Build Tooling & Dev Server**: Vite 5
- **Language**: TypeScript 5
- **Routing**: React Router DOM (v6)
- **HTTP & API Client**: Axios with JWT Interceptors & Token Refresh Concurrency Handler
- **Icons & UI System**: Lucide React & Vanilla CSS Design System with dark finance theme palette
- **State Management**: React Context API (`AuthContext`, `GlobalContext`)

---

## 📂 Source Code Architecture

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── client.ts         # Centralized Axios instance with interceptors
│   │   └── endpoints.ts      # Endpoint URL registry matching Django DRF backend
│   │
│   ├── components/
│   │   ├── common/           # Shared components (EmptyState, ErrorMessage, ErrorBoundary, PageHeader)
│   │   ├── layout/           # Header, Sidebar, Footer navigation components
│   │   └── ui/               # Reusable UI primitives (Button, Input, Card, Modal, Badge, LoadingSpinner)
│   │
│   ├── config/
│   │   └── env.ts            # Validated environment configuration loader
│   │
│   ├── context/
│   │   ├── AuthContext.tsx   # User authentication state & token persistence
│   │   └── GlobalContext.tsx # Global loading overlay & toast notification queue
│   │
│   ├── hooks/
│   │   ├── useAuth.ts        # Custom hook for AuthContext
│   │   └── useGlobalUI.ts    # Custom hook for GlobalContext
│   │
│   ├── layouts/
│   │   ├── AppLayout.tsx     # Authenticated application shell with responsive sidebar & topbar
│   │   └── AuthLayout.tsx    # Centered card layout for authentication pages
│   │
│   ├── pages/
│   │   ├── auth/             # Login & Register pages
│   │   ├── dashboard/        # Main Dashboard overview
│   │   ├── transactions/     # Transaction list & management
│   │   ├── categories/       # Category management
│   │   ├── budgets/          # Budget allocation & tracking
│   │   ├── recurring/        # Recurring transactions & schedules
│   │   ├── goals/            # Financial savings goals
│   │   ├── analytics/        # Financial trends & charts
│   │   ├── reports/          # Reports & CSV/PDF export
│   │   ├── notifications/    # Notifications center
│   │   ├── settings/         # User profile & system preferences
│   │   └── NotFoundPage.tsx  # 404 page fallback
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx     # Centralized route definition
│   │   └── ProtectedRoute.tsx# JWT authentication guard
│   │
│   ├── services/             # Endpoint service modules (auth, transactions, categories, budgets, goals, recurring, analytics)
│   ├── types/                # Domain TypeScript type definitions
│   ├── utils/                # Utilities (tokenStorage, helpers)
│   ├── App.tsx               # Root application wrapper with context providers
│   ├── main.tsx              # Application entry point
│   └── index.css             # FinTrack design system stylesheet
│
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── .gitignore                # Git ignored patterns
├── index.html                # HTML document entry
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite build configuration with `@` alias
└── README.md                 # Frontend documentation
```

---

## ⚙️ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to your backend REST API (default: `http://127.0.0.1:8000/api`).

### 3. Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 4. Build Production Bundle
```bash
npm run build
```

---

## 🔒 Authentication Flow Architecture

1. **Login & Token Acquisition**: User posts credentials to `/api/auth/login/`. Upon receiving access & refresh JWT tokens, `tokenStorage` saves them to `localStorage`.
2. **Request Interceptor**: Automatically injects `Authorization: Bearer <access_token>` header on every outgoing API call.
3. **Response Interceptor & Token Refresh**: If an API returns `401 Unauthorized`, the client pauses requests, calls `/api/auth/token/refresh/`, updates the access token, and retries the original request seamlessly.
4. **Route Guarding**: `ProtectedRoute` checks `AuthContext` status. Unauthenticated requests are redirected to `/login`.

---

## 🗺 Application Route Map

| Path | Access Level | Description |
| --- | --- | --- |
| `/login` | Public | User authentication login screen |
| `/register` | Public | New user registration screen |
| `/dashboard` | Protected | Main financial overview & quick metrics |
| `/transactions` | Protected | Income & expense transaction list & filter |
| `/categories` | Protected | Custom category manager |
| `/budgets` | Protected | Category spending budgets & threshold warnings |
| `/recurring` | Protected | Subscription & repeating schedule manager |
| `/goals` | Protected | Savings goal tracker & deadline progress |
| `/analytics` | Protected | Spending breakdown & trends visualizer |
| `/reports` | Protected | Exportable financial statements |
| `/notifications` | Protected | Alert & system notification list |
| `/settings` | Protected | Profile preferences & currency settings |

---

## 💻 Git Commit Workflow & Conventions

This repository strictly follows structured conventional commits:
- `chore`: Infrastructure, dependencies, or tooling configuration
- `feat`: Application feature foundations & module implementations
- `docs`: Documentation updates