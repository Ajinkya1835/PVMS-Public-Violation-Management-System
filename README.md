# PVMS — Public Violation Management System

[![CI](https://github.com/Ajinkya1835/PVMS-Public-Violation-Management-System/actions/workflows/ci.yml/badge.svg)](https://github.com/Ajinkya1835/PVMS-Public-Violation-Management-System/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A full-stack **municipal portal** where citizens report property violations, permit holders respond or pay fines, and officers approve accounts and resolve objections — with maps, automated fine calculation, and payments.

**Multi-role · Real-world domain · Maps & geodata · Batteries included** — demo data, Docker MongoDB, and CI all ship in the box.

---

## Contents

- [Try it in 2 minutes](#try-it-in-2-minutes)
- [Screenshots](#screenshots)
- [Roles](#roles)
- [Quick start](#quick-start)
- [Documentation](#documentation)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Deploy & CI](#deploy--ci)
- [Contributing](#contributing)
- [Author](#author)

---

## Try it in 2 minutes

```bash
git clone https://github.com/Ajinkya1835/PVMS-Public-Violation-Management-System.git
cd PVMS-Public-Violation-Management-System
npm run install:all
npm run db:up && npm run db:import
npm run dev:backend    # terminal 1
npm run dev:frontend   # terminal 2
```

Open **http://localhost:5173/test-info** for one-click demo logins across all roles.

> A hosted live demo isn't up yet — see [docs/DEPLOY.md](docs/DEPLOY.md) to deploy your own in a few minutes (Vercel + Render + Atlas, all free tier).

---

## Roles

| Role | What they do |
|------|----------------|
| **Citizen** | Report violations with location and photos |
| **Permit holder (owner)** | Manage properties, accept fines, or object |
| **Officer** | Approve registrations, review objections, confirm/waive fines |
| **Admin** | System-level API access |

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (optional, for local MongoDB)
- [Google Maps API key](https://developers.google.com/maps) (for maps)

### Install

```bash
git clone https://github.com/Ajinkya1835/PVMS-Public-Violation-Management-System.git
cd PVMS-Public-Violation-Management-System
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Database (included JSON demo data)

```bash
npm run db:up          # Docker MongoDB → localhost:27017
npm run db:import      # loads database/data/*.json
```

Set `MONGO_URI=mongodb://localhost:27017/pvms` in `backend/.env`. Using Atlas or another host instead? See [docs/DATABASE.md](docs/DATABASE.md).

### Run

```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
```

| Service | URL |
|---------|-----|
| Portal | http://localhost:5173 |
| Test logins (dev) | http://localhost:5173/test-info |
| API health | http://localhost:5000/health |

**Demo password:** `password123` for every seeded account — full list in [docs/TESTING.md](docs/TESTING.md).

---

## Documentation

| Document | Description |
|----------|-------------|
| [User Manual](docs/USER-MANUAL.md) | Walkthroughs for citizens, owners, officers |
| [Features](docs/FEATURES.md) | Full feature list and workflows |
| [Setup](docs/SETUP.md) | Installation, environment variables |
| [Database](docs/DATABASE.md) | MongoDB setup + bundled demo JSON |
| [Deploy](docs/DEPLOY.md) | Vercel + Render + Atlas, step by step |
| [Testing](docs/TESTING.md) | Demo accounts & API smoke tests |
| [Architecture](docs/ARCHITECTURE.md) | Data models, API map, status machine |

---

## Tech stack

React 19 · Vite 7 · React Router 7 · Express 5 · MongoDB (Mongoose) · JWT · Google Maps JavaScript API · Multer

```
┌─────────────┐     HTTPS/JSON      ┌─────────────┐     Mongoose     ┌──────────┐
│  React SPA  │ ◄─────────────────► │ Express API │ ◄──────────────► │ MongoDB  │
│  (Vite)     │      JWT auth       │  (Node.js)  │                  │  Atlas   │
└─────────────┘                     └─────────────┘                  └──────────┘
       │                                    │
       └── Google Maps JS API               └── Multer → uploads/
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for data models, the violation status machine, and the fine calculation formula.

---

## Project structure

```
├── backend/           # Express API
├── frontend/          # React portal
├── database/data/     # Demo JSON (users, properties, violations)
├── docs/              # Guides + screenshots
└── .github/workflows/ # CI on every push
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | API (nodemon) |
| `npm run dev:frontend` | Portal (Vite) |
| `npm run db:up` / `db:down` | Local MongoDB (Docker) |
| `npm run db:import` | Import `database/data/*.json` |
| `npm run seed:demo` | Same demo data via script |
| `npm run test:api` | API smoke tests |
| `npm run build:frontend` | Production build |

---

## Deploy & CI

- **CI:** GitHub Actions runs a MongoDB service container, `db:import`, API tests, and a frontend production build on every push to `main`.
- **Deploy:** step-by-step guide in [docs/DEPLOY.md](docs/DEPLOY.md) — Vercel (frontend) + Render (API) + Atlas (database), all on free tiers.

---

## Contributing

Issues and PRs are welcome. If you spot a bug or want to propose a feature, open an issue first so we can discuss the approach before you put in the work.

---

## Author

Built by **Ajinkya Yadav** — AI & ML Engineering student, Software Engineer Intern at MetaGrad Labs.

[![GitHub](https://img.shields.io/badge/-Ajinkya1835-000000?style=flat-square&logo=github&logoColor=white)](https://github.com/Ajinkya1835)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-000000?style=flat-square&logo=linkedin&logoColor=0A66C2)](https://www.linkedin.com/in/ajinkya-yadav-70b3671a6)

If this project was useful or interesting, a ⭐ on the repo and a follow help a lot.

---

## License

MIT — see [LICENSE](LICENSE).
