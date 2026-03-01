# TaskFlow — Task Management System
**Track A: Full-Stack (Node.js Backend + Next.js Frontend)**

---

## Project Structure

```
task-management/
├── backend/              # Node.js + TypeScript + Prisma API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/             # Next.js 14 + TypeScript + Tailwind
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   ├── login/page.tsx
    │   │   │   ├── register/page.tsx
    │   │   │   └── layout.tsx
    │   │   ├── (dashboard)/
    │   │   │   ├── dashboard/page.tsx
    │   │   │   └── layout.tsx
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   ├── TaskCard.tsx
    │   │   ├── TaskModal.tsx
    │   │   └── DeleteModal.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   ├── tasks.ts
    │   │   └── utils.ts
    │   └── types/
    │       └── index.ts
    ├── .env.local.example
    ├── next.config.js
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Runtime | Node.js + TypeScript |
| Backend Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (Access + Refresh Token rotation) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Frontend Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with interceptors for auto token refresh) |
| Toast Notifications | react-hot-toast |

---

## Setup Guide

### Prerequisites
- Node.js v18+
- npm or yarn
- PostgreSQL 13+ running locally (or a cloud instance like Supabase / Railway / Neon)

---

### Backend Setup

```bash
# 1. Navigate to backend
cd task-management/backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env — set your PostgreSQL connection string & JWT secrets

# Example DATABASE_URL formats:
# Local:    postgresql://postgres:yourpassword@localhost:5432/taskflow
# Supabase: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
# Neon:     postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/taskflow?sslmode=require
# Railway:  postgresql://postgres:pass@monorail.proxy.rlwy.net:PORT/railway

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Start the development server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd task-management/frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# .env.local already points to http://localhost:5000

# 4. Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## API Endpoints

### Auth (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login, returns tokens |
| POST | `/auth/refresh` | No | Refresh access token |
| POST | `/auth/logout` | No | Invalidate refresh token |
| GET | `/auth/me` | Yes | Get current user |

---

### Tasks (`/tasks`) — All require `Authorization: Bearer <accessToken>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (paginated, filterable) |
| POST | `/tasks` | Create a task |
| GET | `/tasks/:id` | Get single task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/toggle` | Cycle task status |

**GET /tasks query params:**
```
?page=1&limit=10&status=PENDING&priority=HIGH&search=meeting
```

**Create / Update body:**
```json
{
  "title": "Finish project",
  "description": "Optional details",
  "status": "PENDING",      // PENDING | IN_PROGRESS | COMPLETED
  "priority": "HIGH",       // LOW | MEDIUM | HIGH
  "dueDate": "2025-12-31"   // ISO date string, optional
}
```

**Paginated response:**
```json
{
  "tasks": [...],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## Features

### Backend
- ✅ JWT authentication (Access Token 15min + Refresh Token 7 days)
- ✅ Refresh token rotation (old token invalidated on each refresh)
- ✅ bcrypt password hashing
- ✅ Task CRUD with user ownership enforcement
- ✅ Pagination, filtering by status/priority, search by title
- ✅ Input validation with express-validator
- ✅ Centralized error handling with proper HTTP status codes

### Frontend
- ✅ Login & Registration with client-side validation (Zod)
- ✅ Automatic token refresh via Axios interceptors
- ✅ Protected routes — redirect to login if unauthenticated
- ✅ Task dashboard with stats (total, pending, in-progress, completed)
- ✅ Create, Edit, Delete, Toggle tasks
- ✅ Search (debounced), filter by status & priority
- ✅ Pagination
- ✅ Toast notifications for all actions
- ✅ Fully responsive (mobile + desktop)


## Production Build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm start
```
## Screenshots

### Signup Page
![Signup Page](screenshots/Signup-page.png)

### Login Page
![Login Page](screenshots/Login-page.jpg)

### Dashboard
![Dashboard](screenshots/Dashboard.jpg)

### New Task Card
![New Task Card](screenshots/new-task-card.jpg)
