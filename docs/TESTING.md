# PVMS Testing Guide

## Demo accounts

**Password for all approved accounts:** `password123`

| Role | Email | Can login? | Portal |
|------|-------|------------|--------|
| Citizen | `citizen@pvms.test` | Yes | `/citizen` |
| Owner | `owner@pvms.test` | Yes | `/owner` |
| Owner 2 | `owner2@pvms.test` | Yes | `/owner` |
| Officer | `officer@pvms.test` | Yes | `/officer` |
| Admin | `admin@pvms.test` | Yes | API only |
| Pending citizen | `pending.citizen@pvms.test` | No (403) | Officer approvals |
| Pending owner | `pending.owner@pvms.test` | No (403) | Officer approvals |

### Legacy accounts (same password)

| Email | Role |
|-------|------|
| `citizen@test.com` | CITIZEN |
| `owner@test.com` | PERMIT_HOLDER |
| `officer@test.com` | OFFICER |

---

## Load demo data

```bash
npm run seed:demo
```

### Seeded properties (`owner@pvms.test`)

| Permit | Name | Status |
|--------|------|--------|
| PVMS-DEMO-001 | Demo Kirana Shop | ACTIVE |
| PVMS-DEMO-002 | Demo Small Industry | ACTIVE |
| PVMS-DEMO-PENDING | Demo Pending Warehouse | PENDING_APPROVAL |

### Seeded violations

| Status | Test focus |
|--------|------------|
| AWAITING_OWNER | Owner accept → payment |
| OBJECTED | Officer objected tab + map |
| REPORTED | Citizen open report |
| CLOSED | Paid history |
| AUTO_DECIDED | Rule engine snapshot |

---

## Browser testing

1. Start backend and frontend (see [SETUP.md](SETUP.md)).
2. Open **http://localhost:5173/test-info** (development only).
3. Use one-click login buttons per role.
4. Walk through [USER-MANUAL.md](USER-MANUAL.md) flows.

### Checklist

- [ ] Citizen — view reports
- [ ] Owner — properties, accept/object violation
- [ ] Officer — approvals, objected tab, confirm/override
- [ ] Pending users visible in officer approval queues

---

## API tests

With backend running on port 5000:

```bash
npm run test:api
```

Covers login per role, citizen/owner/officer endpoints, admin route, and 403 role guards.

---

## Re-seed

Running `seed:demo` again removes and recreates demo users and `[DEMO]` violations.
