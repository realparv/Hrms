# Enterprise HRMS - Backend

This is the backend application for the Enterprise Multi-Tenant HRMS, built with Python and Django.

## Architecture & Principles

This project strictly follows **Clean Architecture** and **Domain-Driven Design (DDD)**.
The codebase is structured to be highly modular, scalable, and maintainable, capable of supporting thousands of tenants securely.

### Key Principles
- **Separation of Concerns:** APIs, business logic (Services), and data access (Repository/Models) are decoupled.
- **Multi-Tenancy:** Schema-based data isolation using PostgreSQL schemas ensures complete security between different companies.
- **Feature-Based Structure:** All business domains (Authentication, Employees, Payroll, etc.) are isolated within the `apps/` directory.

## Tech Stack
- **Framework:** Python, Django, Django REST Framework (DRF)
- **Database:** PostgreSQL (with schema isolation)
- **Caching & Brokers:** Redis
- **Background Tasks:** Celery, RabbitMQ
- **Real-Time:** Django Channels, WebSockets
- **Authentication:** JWT (JSON Web Tokens) with refresh token rotation and MFA support.

## Folder Structure

```text
backend/
├── config/           # Global settings (base/local/prod), WSGI, ASGI, and Root URLs
├── core/             # Shared utilities, BaseModels, global exceptions, and middlewares
├── apps/             # Independent business modules (domains)
│   ├── authentication/
│   ├── tenants/
│   ├── employees/
│   └── ...
├── requirements/     # Dependency management
└── manage.py
```

## Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL
- Redis
- Docker (optional, for running database services)

### Installation & Startup

1. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

2. **Install core dependencies:**
   *(Note: A full requirements.txt will be generated in later phases)*
   ```bash
   pip install django djangorestframework PyJWT django-tenants psycopg2-binary
   ```

3. **Start the Database Services:**
   Ensure you are in the root directory (where `docker-compose.yml` is) and run:
   ```bash
   docker-compose up -d
   ```

4. **Run Migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate_schemas --shared
   ```

5. **Start the Development Server:**
   ```bash
   python manage.py runserver 8000
   ```
   The API will be available at `http://localhost:8000/api/`.
