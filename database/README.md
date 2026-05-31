# PVMS Database Files

This folder contains **ready-to-import demo data** so new users do not need to build a database from scratch.

## What’s included

| File / folder | Contents |
|---------------|----------|
| `data/users.json` | 10 test users (citizen, owners, officer, admin, pending) |
| `data/properties.json` | 4 demo properties |
| `data/violations.json` | 5 demo violations (all statuses) |
| `data/notifications.json` | Sample notifications |
| `docker-compose.yml` | Local MongoDB 7 (optional, no Atlas needed) |

**Login password for all users:** `password123` (passwords are stored as bcrypt hashes in `users.json`).

---

## Option A — Local MongoDB with Docker (easiest)

### 1. Start MongoDB

```bash
cd database
docker compose up -d
```

### 2. Configure backend

In `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/pvms
JWT_SECRET=your_secret_here
PORT=5000
```

### 3. Import demo data

From project root:

```bash
npm run db:import
```

### 4. Run the app

```bash
npm run dev:backend
npm run dev:frontend
```

---

## Option B — MongoDB Atlas (cloud)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user (username + password).
3. **Network Access** → add your IP (or `0.0.0.0/0` for testing only).
4. **Connect** → Drivers → copy the connection string.
5. Put it in `backend/.env` as `MONGO_URI` (database name: `pvms`).
6. Run `npm run db:import` from project root.

**Windows tip:** If `mongodb+srv://` fails, use the standard `mongodb://` URI with shard hostnames from Atlas.

---

## Option C — Seed script (same data, no JSON files)

```bash
npm run seed:demo
```

Uses the same demo dataset as the JSON import (programmatic seed).

---

## Import commands

| Command | Description |
|---------|-------------|
| `npm run db:import` | Load all JSON files from `database/data/` |
| `npm run seed:demo` | Alternative: seed via Mongoose script |
| `npm run db:up` | Start Docker MongoDB |
| `npm run db:down` | Stop Docker MongoDB |

---

## Editing the database files

- Use **email** and **permitNumber** to link records (not MongoDB ObjectIds).
- After editing JSON, run `npm run db:import` again (replaces demo data).
- To change the demo password, regenerate bcrypt and update `passwordHash` in `users.json`:

  ```bash
  cd backend
  node -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash('yourpassword', 10));"
  ```

---

## Optional: violation rules

```bash
cd backend
node src/scripts/importRules.js
```

Loads rules from `backend/rules.csv` for the automated fine engine.
