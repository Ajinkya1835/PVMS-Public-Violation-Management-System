# PVMS Case Study

_Date: 2026-01-10_

## Overview
Municipal Property Violation Management System (PVMS) enabling citizens to report violations, owners to respond/pay or object, and officers to review and close cases.

## Architecture
- Frontend: React 19 (Vite), React Router, custom API wrapper, Google Maps JS API integration.
- Backend: Node.js + Express, JWT auth, role-based authorization, Multer for uploads, CSV rule import scripts.
- Database: MongoDB with Mongoose ODM.
- AuthZ roles: CITIZEN, PERMIT_HOLDER (OWNER), OFFICER, ADMIN.

## Key Models
- User: role, approval status, contact.
- Property: owner ref, address/coords, status.
- Violation: reportedBy, relatedProperty, location + GeoJSON, media[], decision snapshot (amount, rule applied, override reason), status, objectionReason.
- ViolationRule: rule metadata for decision engine.
- Payment: violation ref, payer, amount, status, receipt/transaction ids.
- Appeal/Objected flow, Notification, AuditLog, Comment.

## Core Features & Flows
- Citizen reporting: Media upload + geotag; status REPORTED/AUTO_DECIDED.
- Owner portal: Properties/violations listing, accept (auto Payment creation), object (status OBJECTED + objectionReason), exponential fine multiplier 2^(previous count).
- Officer portal: Approvals for users/properties; Objected Violations tab with inline evidence previews, map links, owner history + risk score, Google Maps clustering, confirm/override actions.
- Notifications: DB-backed notices to owners on confirm (payment due) or override (waived).
- Map search: Radius search for violations/properties; officer clustering view for objected cases.

## Implemented Fixes
- ObjectId mismatch: manual string comparison in owner queries.
- Citizen submit button: fixed loading/try-catch.
- Owner pay modal: always visible; auto payment on acceptance.
- Officer objected tab: added tab, fetch, map clustering, previews, risk score, notifications.
- Objection reason: stored and displayed.

## Risk Score Logic (owner)
`riskScore = unpaid*2 + total + repeatTypeBonus`
where repeatTypeBonus adds (count-1) for each repeated violation type.

## Notifications
- Confirm: type PAYMENT_DUE or VIOLATION_STATUS_CHANGED, includes fine amount and link /owner/violations.
- Override: type VIOLATION_STATUS_CHANGED, waived message.

## Mapping
- Google Maps JS API loader utility.
- Officer tab clusters objected violations (coarse lat/lng buckets), label shows cluster size, click pans and highlights list item.

## Payments
- Auto-created on owner acceptance; receipts/transaction ids unique; exponential multiplier for repeat violations.

## Scripts/Utilities
- Rule import from CSV, geo migration, seeding users/violations.

## Potential Enhancements
- Server-side clustering or marker-clusterer lib.
- Email/SMS delivery for notifications.
- Filters/sorting on officer violations.
- Heatmaps and SLA flags for aging objections.

## Ops Notes
- Env: VITE_GOOGLE_MAPS_API_KEY required for maps.
- Start: backend `npm run dev` (or server start), frontend `npm run dev`.
- Media: Multer stores files; URLs used for previews.

## Study Q&A Pointers
- Status flow: REPORTED → AWAITING_OWNER → OBJECTED → CLOSED/PAID; payments created on owner acceptance; officer confirm leaves CLOSED with payment-due notice.
- Fine calculation: base fine × 2^(previous violations).
- Objection: stored in objectionReason; officer confirm/override.
- Map: clustering labels count; clicking marker highlights list.
- Security: JWT + role middleware; indexes on status/relatedProperty/createdAt; GeoJSON index.
