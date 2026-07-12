# Enterprise HRMS - Frontend

This is the frontend application for the Enterprise Multi-Tenant HRMS, built with Next.js (App Router).

## Architecture & Design System

The frontend utilizes a strict **Feature-Based Architecture**, meaning all components, hooks, state, and services belonging to a specific domain (e.g., `auth`, `employees`) are encapsulated within their respective feature directory.

The UI is designed to be world-class, premium, and minimalistic, taking heavy inspiration from Apple's design language, Linear, and Vercel.

### Key Principles
- **Modularity:** High cohesion within features, low coupling across the application.
- **State Management:** Zustand for global state (auth, themes) and TanStack Query for remote server state (caching, deduping).
- **Aesthetics:** Glassmorphism, soft shadows, micro-animations (Framer Motion), and strict typography.

## Tech Stack
- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** TailwindCSS, Shadcn UI
- **State & Data:** Zustand, TanStack Query, Axios
- **Forms:** React Hook Form, Zod
- **Animations:** Framer Motion

## Folder Structure

```text
frontend/
├── app/              # Next.js App Router (Layouts, Pages, Providers)
├── features/         # Encapsulated feature modules
│   ├── auth/         # (Contains components, hooks, services, store, types for auth)
│   ├── dashboard/
│   ├── employees/
│   └── ...
├── shared/           # Reusable global assets
│   ├── components/   # (UI library, buttons, inputs, layouts)
│   ├── hooks/
│   ├── utils/
│   └── types/
├── lib/              # Global configs (API clients, Axios interceptors, Store setup)
└── public/           # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm (or yarn/pnpm)

### Installation & Startup

1. **Install dependencies:**
   Ensure you are in the `frontend/` directory and run:
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).
