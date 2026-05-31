# Database Setup Guide

PVMS uses **MongoDB**. You can use the **included database files** (fastest), **Docker**, or **MongoDB Atlas**.

---

## Quick path (recommended for new users)

```bash
# 1. Start local MongoDB
npm run db:up

# 2. Copy env and set local URI
cp backend/.env.example backend/.env
# Edit backend/.env → MONGO_URI=mongodb://localhost:27017/pvms

# 3. Import included demo database files
npm run db:import

# 4. Start app
npm run dev:backend
npm run dev:frontend
```

Demo logins: see [TESTING.md](TESTING.md) (`password123`).

---

## Included database files

All JSON files live in **`database/data/`**:

- `users.json` — accounts for every role
- `properties.json` — shops, industry, residence, pending approval
- `violations.json` — reported, objected, closed, etc.
- `notifications.json` — sample alerts

Full details: [database/README.md](../database/README.md).

---

## MongoDB Atlas (cloud)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a **free M0 cluster**.
3. **Database Access** → Add user (remember username/password).
4. **Network Access** → Add IP Address → your IP or `0.0.0.0/0` (dev only).
5. **Database** → Connect → Drivers → copy connection string.
6. Replace `<password>` and set database name to `pvms`:

   ```env
   MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/pvms?retryWrites=true&w=majority
   ```

7. Run `npm run db:import`.

### Atlas on Windows

If you see `querySrv ECONNREFUSED`, switch to the **standard connection string** (non-SRV) from Atlas → Connect → Drivers, or use local Docker MongoDB instead.

---

## Local MongoDB without Docker

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Start the `mongod` service.
3. Set `MONGO_URI=mongodb://localhost:27017/pvms` in `backend/.env`.
4. Run `npm run db:import`.

---

## Verify connection

```bash
cd backend
npm run dev
```

You should see `MongoDB connected` in the terminal.

Or open: http://localhost:5000/health

---

## Reset demo data

```bash
npm run db:import
```

Re-imports JSON files (removes and recreates demo users, properties, and violations).

---

## Collections created

| Collection | Purpose |
|------------|---------|
| `users` | Login accounts and roles |
| `properties` | Permit-holder properties |
| `violations` | Citizen reports |
| `payments` | Fines and receipts |
| `notifications` | In-app messages |
| `violationrules` | After running `importRules.js` |

See [ARCHITECTURE.md](ARCHITECTURE.md) for the data model.
