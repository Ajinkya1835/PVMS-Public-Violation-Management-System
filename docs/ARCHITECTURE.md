# PVMS Architecture

## System overview

```
┌─────────────┐     HTTPS/JSON      ┌─────────────┐     Mongoose     ┌──────────┐
│  React SPA  │ ◄─────────────────► │ Express API │ ◄──────────────► │ MongoDB  │
│  (Vite)     │      JWT auth       │  (Node.js)  │                  │  Atlas   │
└─────────────┘                     └─────────────┘                  └──────────┘
       │                                    │
       └── Google Maps JS API               └── Multer → uploads/
```

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7, React Router 7 |
| Backend | Express 5, JWT, bcrypt, Multer |
| Database | MongoDB, Mongoose 9 |
| Maps | Google Maps JavaScript API |

## Core models

- **User** — role, `approved`, contact fields
- **Property** — owner, geo, permit, status
- **Violation** — reporter, property, media, `decision` snapshot, `status`, `objectionReason`
- **ViolationRule** — rule metadata for decision engine
- **Payment** — violation, payer, amount, status
- **Notification**, **AuditLog**, **Comment**, **Appeal**

## Roles

| Role | API prefix | Frontend route |
|------|------------|----------------|
| CITIZEN | `/api/violations`, `/api/map` | `/citizen` |
| PERMIT_HOLDER | `/api/owner/*` | `/owner` |
| OFFICER | `/api/officer/*` | `/officer` |
| ADMIN | `/api/test/admin-only` | — |

## Violation status machine

`REPORTED` → `AUTO_DECIDED` / `AWAITING_OWNER` → `OBJECTED` | `PAID` / `CLOSED` → `UNDER_REVIEW`

## Fine calculation

`fine = baseAmount × 2^(number of prior violations for same context)`

## Risk score (officer view)

`riskScore = unpaid×2 + totalViolations + repeatTypeBonus`

## Key API groups

| Path | Purpose |
|------|---------|
| `/api/auth` | login, register, verify-token |
| `/api/violations` | CRUD, accept, object |
| `/api/owner` | profile, properties, violations |
| `/api/officer` | approvals, objected, dashboard |
| `/api/map` | search, clusters, nearby |
| `/api/properties` | property listing |
| `/api/rules` | violation rules |
| `/uploads` | static media files |

## Scripts

Located in `backend/src/scripts/` — seeding, rule import, index sync, data validation.

_Last updated: 2026-05-31_
