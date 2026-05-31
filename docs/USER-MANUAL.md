# PVMS User Manual

Welcome to the **Public Violation Management System (PVMS)**. This guide explains how to use the portal for each role.

---

## Getting started

1. Open the portal URL provided by your municipality (local dev: **http://localhost:5173**).
2. **New users:** choose **Register** → Citizen or Permit Holder. Accounts require **officer approval** before first login.
3. **Existing users:** enter email and password on the login page.

---

## Citizen guide

### Register

1. Click **Register Here** → **Citizen**.
2. Fill in name, email, password, and contact details.
3. Wait for officer approval, then log in.

### Report a violation

1. Go to **Report Violation** (or dashboard home).
2. Select violation type and describe the issue.
3. Pin the location on the map (required).
4. Upload photos or video as evidence (optional).
5. Submit — status becomes **REPORTED** or **AUTO_DECIDED** if rules match.

### Track your reports

- View all your submissions on the citizen dashboard.
- Statuses include: **REPORTED**, **AWAITING_OWNER**, **OBJECTED**, **CLOSED**, etc.

### Nearby properties

- Use the map tools to see registered properties near a location (read-only).

---

## Permit holder (owner) guide

### Register

1. **Register Here** → **Permit Holder / Owner**.
2. After officer approval, log in to the **Owner portal**.

### Manage properties

1. Open **Properties**.
2. Add a property: name, type (Shop, Industry, Residence, Farm), address, ward, zone, permit dates, map location.
3. New properties may need **officer approval** before becoming **ACTIVE**.

### Handle violations

1. Open **Violations** to see fines linked to your properties.
2. For each violation you can:
   - **Accept** — confirms the fine; a **payment record** is created automatically.
   - **Object** — enter a reason; status becomes **OBJECTED** for officer review.
3. Repeat violations may increase fines (multiplier based on history).

### Profile

- Update contact details under **Profile**.

---

## Officer guide

### Dashboard

- View counts: pending approvals, open violations, objected cases, etc.

### Approvals

Approve or reject:

- **Pending citizens** — new citizen registrations.
- **Pending owners** — new permit-holder registrations.
- **Pending properties** — new or updated property records.

### Objected violations

1. Open the **Objected** tab.
2. Review evidence, map location, owner **risk score**, and objection text.
3. **Confirm** — upholds the fine; owner receives a payment-due notification.
4. **Override** — waives or changes the decision; owner is notified.

### Map tools

- Clustered map of objected cases; click a cluster to highlight the list item.
- Radius search for violations and properties.

---

## Violation status flow (reference)

```
REPORTED → AWAITING_OWNER → (owner accepts → payment) OR (owner objects → OBJECTED)
         → Officer confirm/override → CLOSED
```

---

## Need help?

- **Developers / testers:** [TESTING.md](TESTING.md)
- **Installation:** [SETUP.md](SETUP.md)
- **Feature list:** [FEATURES.md](FEATURES.md)
