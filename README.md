# PVMS — Public Violation Management System

A full-stack municipal portal for reporting property violations, managing permit-holder responses, and officer review workflows.

**Repository:** [github.com/Ajinkya1835/omlette](https://github.com/Ajinkya1835/omlette)

---

## What is PVMS?

PVMS helps municipalities coordinate:

| Role | What they do |
|------|----------------|
| **Citizen** | Report violations with location and photos |
| **Permit holder (owner)** | Manage properties, accept fines, or object to violations |
| **Officer** | Approve registrations, review objections, confirm or waive fines |
| **Admin** | System-level API access (optional) |

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) (Atlas or local)
- [Google Maps API key](https://developers.google.com/maps) (for map features)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` (MongoDB URI, JWT secret) and `frontend/.env` (Maps API key).

### 3. Load demo data (optional)

```bash
npm run seed:demo
```

### 4. Run the application

**Terminal 1 — API**

```bash
npm run dev:backend
```

**Terminal 2 — Web portal**

```bash
npm run dev:frontend
```

Open **http://localhost:5173**

| Service | URL |
|---------|-----|
| Portal | http://localhost:5173 |
| API | http://localhost:5000 |
| Health check | http://localhost:5000/health |
| Test accounts (dev) | http://localhost:5173/test-info |

---

## Documentation

| Document | Description |
|----------|-------------|
| [User Manual](docs/USER-MANUAL.md) | Step-by-step guide for citizens, owners, and officers |
| [Features](docs/FEATURES.md) | Feature list and workflows |
| [Setup Guide](docs/SETUP.md) | Detailed installation and configuration |
| [Testing](docs/TESTING.md) | Demo accounts, seed data, API tests |
| [Architecture](docs/ARCHITECTURE.md) | Technical overview and data model |

---

## Project structure

```
pvms/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── scripts/    # seed, import, maintenance
│   └── uploads/        # violation media (local)
├── frontend/         # React 19 + Vite
│   └── src/
│       ├── pages/      # Citizen, Owner, Officer portals
│       └── components/
└── docs/             # User & developer documentation
```

---

## NPM scripts (from project root)

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start API with nodemon |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run seed:demo` | Load test users and sample violations |
| `npm run test:api` | Run API smoke tests (backend must be running) |
| `npm run build:frontend` | Production build of the portal |

---

## Tech stack

- **Frontend:** React 19, Vite, React Router, Google Maps JS API
- **Backend:** Node.js, Express 5, JWT, Multer, Mongoose
- **Database:** MongoDB

---

## Demo login (after `seed:demo`)

**Password for all:** `password123`

| Role | Email |
|------|-------|
| Citizen | `citizen@pvms.test` |
| Owner | `owner@pvms.test` |
| Officer | `officer@pvms.test` |

See [docs/TESTING.md](docs/TESTING.md) for the full account list and scenarios.

---

## License

MIT — see [LICENSE](LICENSE).
