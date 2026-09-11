# FinTrack Frontend Authentication Documentation

## Architecture Overview

The Day 30 Authentication system provides a complete end-to-end integration between the React frontend and Django REST Framework (DRF) + SimpleJWT backend.

```text
User Input → Client Validation → authService → Axios Client (apiClient) → DRF Backend
                                                    ↓
                                           JWT Token Storage
                                                    ↓
                                           AuthContext State
                                                    ↓
                                           ProtectedRoute Guard
```

---

## Key Components & Services

### 1. API Client (`src/api/client.ts`)
* Configured with `baseURL: http://127.0.0.1:8000/api`.
* **Request Interceptor**: Injects `Authorization: Bearer <access_token>` header automatically into outgoing requests.
* **Response Interceptor**: Intercepts `401 Unauthorized` responses, invokes `POST /auth/token/refresh/` using stored `refresh` token, updates stored access token, and transparently replays original requests.

### 2. Authentication Service (`src/services/authService.ts`)
* `login(credentials)`: Calls `POST /auth/login/` with `username` and `password`. Returns `{ access, refresh }`.
* `register(credentials)`: Calls `POST /auth/register/` with `username`, `email`, `password`, `password_confirm`, `currency`. Returns user details.
* `logout(refreshToken)`: Calls `POST /auth/logout/` to blacklist refresh token on backend.
* `getProfile()` / `getCurrentUser()`: Calls `GET /auth/profile/` to fetch authenticated user profile details.

### 3. Context Provider (`src/context/AuthContext.tsx`)
* Manages `user`, `isAuthenticated`, `isLoading`, `error`, `fieldErrors`.
* Evaluates auth session on startup using `tokenStorage.hasAccessToken()`.
* Exposes `login()`, `register()`, `logout()`, `clearError()`, `refreshProfile()`.

### 4. Client-Side Validation (`src/utils/validation.ts`)
* `validateLoginForm`: Ensures username/email and password fields are filled and valid.
* `validateRegisterForm`: Validates email syntax, password minimum length (8 characters), and matching password confirmation.

### 5. Error Parser (`src/utils/errorHandler.ts`)
* Extracts clean messages from Django REST Framework error responses (`detail`, `non_field_errors`, field-specific error dictionaries).

### 6. Protected Routes (`src/routes/ProtectedRoute.tsx`)
* Prevents unauthenticated users from accessing `/dashboard`, `/transactions`, `/budgets`, `/categories`, etc.
* Displays a loading spinner while session state is being verified on startup.
* Redirects unauthenticated users to `/login` with location state preserved for post-login redirection.

### 7. Auth Layout Redirect (`src/layouts/AuthLayout.tsx`)
* Prevents authenticated users from viewing `/login` or `/register`, redirecting them immediately to `/dashboard`.
