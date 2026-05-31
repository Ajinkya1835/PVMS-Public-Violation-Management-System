/**
 * API smoke tests for all roles. Run: npm run test:api
 */
import dotenv from "dotenv";

dotenv.config();

const BASE = process.env.API_BASE || "http://localhost:5000";
const PASSWORD = "password123";

const ACCOUNTS = [
  { label: "Citizen", email: "citizen@pvms.test", role: "CITIZEN" },
  { label: "Owner", email: "owner@pvms.test", role: "PERMIT_HOLDER" },
  { label: "Officer", email: "officer@pvms.test", role: "OFFICER" },
  { label: "Admin", email: "admin@pvms.test", role: "ADMIN" },
];

async function request(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  return { ok: res.ok, status: res.status, data };
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

function fail(msg) {
  console.log(`  ❌ ${msg}`);
}

async function login(email) {
  const { ok, data } = await request("/api/auth/login", {
    method: "POST",
    body: { email, password: PASSWORD },
  });
  return ok ? data.token : null;
}

async function run() {
  console.log(`\n🧪 PVMS API tests → ${BASE}\n`);

  const health = await request("/health");
  if (health.ok) pass("GET /health");
  else fail("GET /health");

  const pendingLogin = await request("/api/auth/login", {
    method: "POST",
    body: { email: "pending.citizen@pvms.test", password: PASSWORD },
  });
  if (pendingLogin.status === 403) pass("Pending citizen blocked (403)");
  else fail(`Pending citizen should be 403, got ${pendingLogin.status}`);

  const tokens = {};
  for (const acc of ACCOUNTS) {
    const token = await login(acc.email);
    if (token) {
      tokens[acc.role] = token;
      pass(`${acc.label} login (${acc.email})`);
    } else {
      fail(`${acc.label} login failed`);
    }
  }

  if (tokens.CITIZEN) {
    const v = await request("/api/violations", { token: tokens.CITIZEN });
    if (v.ok) pass(`Citizen violations (${(v.data.violations || v.data || []).length || "ok"})`);
    else fail(`Citizen violations → ${v.status}`);
  }

  if (tokens.PERMIT_HOLDER) {
    const p = await request("/api/owner/properties", { token: tokens.PERMIT_HOLDER });
    if (p.ok) pass(`Owner properties (${(p.data.properties || p.data || []).length || "ok"})`);
    else fail(`Owner properties → ${p.status}`);

    const v = await request("/api/owner/violations", { token: tokens.PERMIT_HOLDER });
    if (v.ok) pass("Owner violations list");
    else fail(`Owner violations → ${v.status}`);
  }

  if (tokens.OFFICER) {
    const stats = await request("/api/officer/dashboard-stats", { token: tokens.OFFICER });
    if (stats.ok) pass("Officer dashboard stats");
    else fail(`Officer stats → ${stats.status}`);

    const obj = await request("/api/officer/violations", { token: tokens.OFFICER });
    if (obj.ok) pass(`Officer objected tab (${(obj.data.violations || []).length} items)`);
    else fail(`Officer violations → ${obj.status}`);

    const pc = await request("/api/officer/pending-citizens", { token: tokens.OFFICER });
    if (pc.ok) pass(`Pending citizens (${(pc.data.users || pc.data || []).length})`);
    else fail(`Pending citizens → ${pc.status}`);

    const po = await request("/api/officer/pending-owners", { token: tokens.OFFICER });
    if (po.ok) pass(`Pending owners (${(po.data.users || po.data || []).length})`);
    else fail(`Pending owners → ${po.status}`);

    const pp = await request("/api/officer/pending-properties", { token: tokens.OFFICER });
    if (pp.ok) pass(`Pending properties (${(pp.data.properties || pp.data || []).length})`);
    else fail(`Pending properties → ${pp.status}`);
  }

  if (tokens.ADMIN) {
    const admin = await request("/api/test/admin-only", { token: tokens.ADMIN });
    if (admin.ok) pass("Admin-only route");
    else fail(`Admin route → ${admin.status}`);
  }

  if (tokens.CITIZEN && tokens.OFFICER) {
    const denied = await request("/api/officer/dashboard-stats", { token: tokens.CITIZEN });
    if (denied.status === 403) pass("Citizen blocked from officer route (403)");
    else fail(`Citizen officer access should be 403, got ${denied.status}`);
  }

  console.log("\nDone. Browser: http://localhost:5173/test-info\n");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
