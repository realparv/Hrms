# 🏢 Enterprise HRMS — Multi-Tenant HR Management System

A full-stack, production-ready **SaaS HRMS** built with **Django REST Framework** (backend) and **Next.js 16** (frontend). Supports multi-tenant organisation management with three distinct roles: **Super Admin**, **Admin (Organisation Owner)**, and **Employee**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [1 · Clone the Repository](#1--clone-the-repository)
  - [2 · Backend Setup (Django)](#2--backend-setup-django)
  - [3 · Frontend Setup (Next.js)](#3--frontend-setup-nextjs)
- [Running the Application](#-running-the-application)
- [Default Credentials](#-default-credentials)
- [API Overview](#-api-overview)
- [User Roles & Flows](#-user-roles--flows)
- [Environment Variables](#-environment-variables)
- [Docker (Optional)](#-docker-optional)
- [Contributing](#-contributing)

---

## 🛠 Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| **Backend** | Python 3.10+, Django 5.2, Django REST Framework |
| **Database**| PostgreSQL 15                                   |
| **Auth**    | JWT (PyJWT)                                     |
| **Frontend**| Next.js 16, React 19, TypeScript                |
| **Styling** | Tailwind CSS v4                                 |
| **State**   | Zustand                                         |
| **HTTP**    | Axios                                           |
| **Icons**   | Lucide React                                    |
| **Themes**  | next-themes (light / dark)                      |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│              Next.js 16 (localhost:3000)                 │
└────────────────────────┬────────────────────────────────┘
                         │ Axios / REST
┌────────────────────────▼────────────────────────────────┐
│            Django REST Framework (localhost:8000)        │
│                                                         │
│  /api/auth/      – Login · Register · Logout            │
│  /api/saas/      – Organisation Signup · List           │
│  /api/employees/ – Employee CRUD                        │
└────────────────────────┬────────────────────────────────┘
                         │ psycopg2
┌────────────────────────▼────────────────────────────────┐
│                  PostgreSQL (port 5432)                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
Hrms/
├── backend/                    # Django API
│   ├── apps/
│   │   ├── authentication/     # User model, JWT auth, serializers
│   │   ├── employees/          # Employee management
│   │   └── tenants/            # Organisation / SaaS subscription
│   ├── config/
│   │   └── settings/
│   │       └── base.py         # Main Django settings
│   ├── core/                   # Shared utilities & base models
│   ├── requirements/
│   │   └── base.txt            # Python dependencies
│   ├── manage.py
│   └── .env.example            # ← copy to .env
│
├── frontend/                   # Next.js App
│   ├── app/
│   │   ├── (auth)/             # login / signup pages
│   │   └── (dashboard)/        # protected dashboard pages
│   ├── features/
│   │   └── auth/               # auth service, store, types
│   ├── shared/
│   │   ├── components/         # Sidebar, ThemeToggle, UI primitives
│   │   └── providers/          # ThemeProvider
│   ├── lib/api/                # Axios client + interceptors
│   ├── package.json
│   └── .env.example            # ← copy to .env.local
│
├── docker-compose.yml          # PostgreSQL + Redis containers
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed on your machine:

| Tool | Minimum Version | Install Guide |
|------|----------------|---------------|
| **Python** | 3.10+ | https://www.python.org/downloads/ |
| **Node.js** | 18+ | https://nodejs.org/ |
| **npm** | 9+ | Bundled with Node.js |
| **PostgreSQL** | 14+ | https://www.postgresql.org/download/ |
| **Git** | 2.x | https://git-scm.com/ |

> **Optional:** Docker & Docker Compose if you want to run PostgreSQL via container instead of installing it locally.

---

## 🚀 Installation & Setup

### 1 · Clone the Repository

```bash
git clone https://github.com/realparv/Hrms.git
cd Hrms
```

---

### 2 · Backend Setup (Django)

#### a) Create & activate a virtual environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows
```

#### b) Install Python dependencies

```bash
pip install --upgrade pip
pip install django djangorestframework PyJWT psycopg2-binary django-cors-headers
```

> Or if a `requirements.txt` exists at the root of `requirements/`:
> ```bash
> pip install -r requirements/base.txt
> ```

#### c) Set up environment variables

```bash
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
DJANGO_SECRET_KEY=your-very-secret-key
DEBUG=True
DB_NAME=hrms_db
DB_USER=postgres
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
```

#### d) Create the PostgreSQL database

```bash
# Connect to PostgreSQL (as postgres superuser)
psql -U postgres

# Inside the psql shell:
CREATE DATABASE hrms_db;
\q
```

#### e) Run migrations

```bash
python manage.py migrate
```

#### f) Create a Super Admin user

```bash
python manage.py shell -c "
from apps.authentication.models import User
User.objects.filter(email='superadmin@mail.com').delete()
User.objects.create_user(
    email='superadmin@mail.com',
    password='password',
    role='SUPER_ADMIN',
    is_staff=True,
    is_superuser=True
)
print('Super Admin created')
"
```

---

### 3 · Frontend Setup (Next.js)

#### a) Navigate to the frontend directory

```bash
cd ../frontend     # from backend/ directory
# or
cd Hrms/frontend   # from project root
```

#### b) Install Node dependencies

```bash
npm install
```

> `node_modules/` is included in this repository so you can alternatively skip this step if already present.

#### c) Set up environment variables

```bash
cp .env.example .env.local
```

The default `.env.local` already points to the local backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/
```

---

## ▶️ Running the Application

### Start the Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

The Django API will be available at: `http://localhost:8000`

### Start the Frontend

Open a **new terminal** window:

```bash
cd frontend
npm run dev
```

The Next.js app will be available at: `http://localhost:3000`

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `superadmin@mail.com` | `password` |
| **Admin** | Register via `/signup/organization` | — |
| **Employee** | Register via `/signup` | — |

---

## 🌐 API Overview

Base URL: `http://localhost:8000/api/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `auth/login/` | ❌ | Login and receive JWT tokens |
| `POST` | `auth/register/` | ❌ | Register a new employee user |
| `POST` | `auth/logout/` | ✅ | Logout and invalidate refresh token |
| `POST` | `saas/organizations/signup/` | ❌ | Register a new organisation (Admin) |
| `GET`  | `saas/organizations/` | ❌ | List all active organisations |
| `GET`  | `employees/` | ✅ | List employees in the organisation |

---

## 👥 User Roles & Flows

### Super Admin
- Login at `/login`
- Automatically redirected to `/super-admin` dashboard
- Global overview of all organisations, users, and MRR

### Admin (Organisation Owner)
1. Register organisation at `/signup/organization`
2. Fill in Company Name, Workspace URL, and Admin profile
3. Login at `/login` → redirected to main dashboard

### Employee
1. Sign up at `/signup`
2. Select organisation from the dropdown
3. Login at `/login` → redirected to main dashboard

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DJANGO_SECRET_KEY` | — | Django secret key (keep secret!) |
| `DEBUG` | `True` | Set to `False` in production |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated allowed hosts |
| `DB_NAME` | `hrms_db` | PostgreSQL database name |
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | — | PostgreSQL password |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/` | Backend API base URL |

---

## 🐳 Docker (Optional)

If you prefer to run PostgreSQL via Docker instead of a local installation:

```bash
# From project root
docker compose up -d db
```

This starts a PostgreSQL container on port **5433** (to avoid conflicts with local installations). Update `backend/.env` accordingly:

```env
DB_PORT=5433
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

> Built with ❤️ as a multi-tenant SaaS HRMS platform.
