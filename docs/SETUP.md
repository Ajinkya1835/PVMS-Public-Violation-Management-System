# PVMS Setup Guide

## Requirements

| Tool | Version |
|------|---------|
| Node.js | 18 or newer |
| npm | 9+ (bundled with Node) |
| MongoDB | Atlas cluster or local 6+ |
| Google Cloud | Maps JavaScript API key (for maps) |

---

## Clone and install

```bash
git clone https://github.com/Ajinkya1835/omlette.git
cd omlette
npm run install:all
```

> The repository root is the `pvms` project folder (backend + frontend + docs).

---

## Backend configuration

1. Copy the example env file:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Set variables in `backend/.env`:

   | Variable | Description |
   |----------|-------------|
   | `PORT` | API port (default `5000`) |
   | `MONGO_URI` | MongoDB connection string |
   | `JWT_SECRET` | Secret for signing tokens |

3. **MongoDB Atlas tip (Windows):** If `mongodb+srv://` fails with `querySrv ECONNREFUSED`, use a standard `mongodb://` URI with explicit shard hostnames (see Atlas → Connect → Drivers).

4. Ensure your IP is whitelisted in Atlas Network Access.

---

## Frontend configuration

```bash
cp frontend/.env.example frontend/.env
```

Set `VITE_GOOGLE_MAPS_API_KEY` to a key with **Maps JavaScript API** enabled.

---

## Database setup

See **[DATABASE.md](DATABASE.md)** for the full guide.

### Included database files (recommended)

```bash
npm run db:up       # Docker MongoDB on localhost:27017
npm run db:import   # Import database/data/*.json
```

Set `MONGO_URI=mongodb://localhost:27017/pvms` in `backend/.env`.

### Alternative: seed script

```bash
npm run seed:demo
```

### Violation rules (optional)

```bash
cd backend
node src/scripts/importRules.js
```

---

## Run locally

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

Verify:

- http://localhost:5000/health → `{ "status": "OK" }`
- http://localhost:5173 → login page

---

## Production build (frontend)

```bash
npm run build:frontend
```

Serve `frontend/dist` with any static host. Set `API_URL` in `frontend/src/config/config.js` production entry to your deployed API.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection failed | Check URI, Atlas IP whitelist, try non-SRV connection string |
| Login 403 pending | Officer must approve account, or use seeded approved users |
| Maps blank | Set `VITE_GOOGLE_MAPS_API_KEY` and enable Maps JavaScript API |
| Port in use | Stop other processes on 5000 / 5173 |

---

## Security notes

- Never commit `.env` files (they are gitignored).
- Rotate `JWT_SECRET` and database credentials for production.
- Restrict CORS and use HTTPS in production deployments.
