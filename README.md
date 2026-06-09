# CareRoute

Intelligent Field Service / Delivery Dispatch Planner

## Project Vision

CareRoute helps logistics managers plan efficient daily routes by combining:
- worker schedules
- client addresses
- map-based route visualization
- optimization logic (planned in upcoming iterations)

## Project Structure

- `backend/` — Node.js (JavaScript) Express API, JWT auth, PostgreSQL + PostGIS, ORM
- `frontend-app/` — React (JavaScript) app with Mapbox integration
- `ml/` — Placeholder for future optimization/ML modules
- `shared/` — Shared resources (schemas, utils, docs)

## Setup

- Dockerized for local development
- Clean, modular architecture
- See `.env.example` for environment variables

## Features (MVP)
- User authentication
- Input client addresses & worker schedules
- Route optimization & map visualization

## Progress Log

### Completed
- Initialized monorepo-style project folders (`backend/`, `frontend-app/`, `ml/`, `shared/`)
- Added root development files: `docker-compose.yml`, `.env.example`, `.gitignore`
- Initialized backend Node.js project and starter Express server (`backend/index.js`)
- Bootstrapped frontend React app
- Added frontend routing and initial pages:
	- dashboard
	- auth
	- input
	- map
- Implemented initial auth UI:
	- login/register forms
	- local auth state via React context + `localStorage`
	- loading state and duplicate-submit prevention for auth forms
- Added backend JWT auth endpoints and PostgreSQL persistence
- Connected frontend client input flows to the backend API
- Added saved client count display to the Input page
- Disabled save submit while the client save request is pending
- Added personalized user greeting on Dashboard page
- Added client count display in the Navbar for quick overview
- Integrated map page with `mapbox-gl`
- Added unit tests for auth form loading behavior
- Resolved frontend dependency/setup issues (`web-vitals`, React version alignment, map library compatibility)
- Added purposeful, maintainable code comments in key frontend/backend files

### In Progress
- Frontend-first MVP completion (UX polish + route protection + improved forms)

### Next Up
- Backend auth endpoints (`/auth/register`, `/auth/login`)
- PostgreSQL + PostGIS integration
- Persist clients/schedules to backend
- Connect frontend auth + input flows to real API responses

## Advanced
- ML/AI route optimization
- Real-time updates
- Mobile responsive UI

## Running the Project (Current)

### Frontend
```bash
cd frontend-app
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Documentation Practice

This README is a living project log and will be updated at each milestone to track:
- what was built
- what is currently in progress
- what comes next

---

See each folder for more details.