# PVMS Features

## Authentication & roles

- Secure login with JWT (7-day token).
- Roles: **CITIZEN**, **PERMIT_HOLDER**, **OFFICER**, **ADMIN**.
- Registration approval workflow for citizens and owners.
- Role-based routes on frontend and API middleware on backend.

---

## Citizen features

- Multi-step violation report with media upload (images/video).
- Geotagged location (latitude/longitude + GeoJSON).
- Automated decision engine: matches violation rules, sets fine amount.
- Dashboard of all reports with status badges.
- Nearby property map search.

---

## Owner (permit holder) features

- Property CRUD with permit number, ward, zone, validity dates.
- Violation inbox per owned property.
- **Accept violation** → auto-creates payment record.
- **Object violation** → stores `objectionReason`, sends case to officer.
- Exponential fine multiplier for repeat violations: `base × 2^(previous count)`.
- Owner risk score (officer view): unpaid weight + repeat-type bonus.
- In-app notifications (payment due, status changes).

---

## Officer features

- Dashboard statistics.
- Pending queues: citizens, owners, properties.
- Approve / reject users and properties.
- **Objected violations** tab with:
  - Evidence previews
  - Google Maps clustering
  - Owner history and risk score
  - Confirm or override with notifications
- Map radius search for violations and properties.

---

## Payments

- Created automatically when owner accepts a violation.
- Unique transaction IDs and receipt support.
- Statuses: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED.

---

## Maps & geospatial

- Google Maps integration (picker, views, search).
- GeoJSON indexes for radius and cluster queries.
- Officer-side coarse clustering for objected cases.

---

## Data & compliance

- Immutable **decision snapshot** on each violation (rule, amount, act/section).
- Audit-friendly status state machine.
- Violation rules importable from CSV (`backend/rules.csv`).

---

## Developer utilities

| Script | Purpose |
|--------|---------|
| `npm run seed:demo` | Test users + sample properties/violations |
| `npm run test:api` | API smoke tests per role |
| `importRules.js` | Load violation rules from CSV |
| `syncIndexes.js` | Ensure MongoDB indexes |

See [ARCHITECTURE.md](ARCHITECTURE.md) for technical detail.
