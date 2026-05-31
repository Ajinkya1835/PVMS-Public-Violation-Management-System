# Deploy PVMS (Live Demo)

Deploy the **frontend** and **backend** separately, then connect them with environment variables.

| Part | Suggested host | Free tier |
|------|----------------|-----------|
| Frontend | [Vercel](https://vercel.com) | Yes |
| Backend API | [Render](https://render.com) | Yes |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) | Yes |

---

## 1. MongoDB Atlas

1. Create a cluster and database user.
2. Whitelist IP `0.0.0.0/0` (or Render’s outbound IPs for production).
3. Copy the connection string → use as `MONGO_URI` (database name: `pvms`).
4. Import demo data locally, or run `npm run db:import` against Atlas once from your machine.

---

## 2. Backend on Render

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service** → connect repo.
3. Settings:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Environment variables:

   | Key | Value |
   |-----|--------|
   | `MONGO_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Long random string |
   | `FRONTEND_URL` | Your Vercel URL (e.g. `https://pvms.vercel.app`) |
   | `PORT` | `5000` (Render sets `PORT` automatically — optional) |

5. Deploy → note API URL, e.g. `https://pvms-api.onrender.com`.

**Or** use the included `render.yaml` blueprint at repo root.

Verify: `https://YOUR-API.onrender.com/health` → `{ "status": "OK" }`

---

## 3. Frontend on Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → import GitHub repo.
2. Settings:
   - **Root directory:** `frontend`
   - **Framework:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Environment variables:

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://YOUR-API.onrender.com` |
   | `VITE_GOOGLE_MAPS_API_KEY` | Your Google Maps key |

4. Deploy → open the Vercel URL.

5. In Google Cloud Console, restrict the Maps key to your Vercel domain.

---

## 4. Post-deploy checklist

- [ ] Login works with demo user (`citizen@pvms.test` / `password123`) after `db:import` on Atlas
- [ ] `FRONTEND_URL` on Render matches Vercel URL exactly (no trailing slash)
- [ ] Maps load (API key + HTTP referrer restrictions)
- [ ] Add live URLs to GitHub README **Live demo** section

---

## 5. GitHub Actions CI

Every push to `main` runs:

- MongoDB service container
- `db:import` + API tests
- Frontend production build

See `.github/workflows/ci.yml`.

---

## Custom domain (optional)

- Vercel: Project → Settings → Domains
- Render: Service → Settings → Custom Domain
- Update `FRONTEND_URL` and Maps API referrer restrictions
