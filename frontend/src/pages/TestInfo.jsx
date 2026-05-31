import { useNavigate } from "react-router-dom";
import apiRequest from "../api/api.js";
import "./AuthPages.css";

const TEST_PASSWORD = "password123";

const ACCOUNTS = [
  { role: "CITIZEN", label: "Citizen", email: "citizen@pvms.test", path: "/citizen" },
  { role: "PERMIT_HOLDER", label: "Owner", email: "owner@pvms.test", path: "/owner" },
  { role: "PERMIT_HOLDER", label: "Owner 2", email: "owner2@pvms.test", path: "/owner" },
  { role: "OFFICER", label: "Officer", email: "officer@pvms.test", path: "/officer" },
];

const PENDING = [
  { email: "pending.citizen@pvms.test", note: "Officer → approve citizen" },
  { email: "pending.owner@pvms.test", note: "Officer → approve owner" },
];

const DEMO_SCENARIOS = [
  "AWAITING_OWNER — owner can accept fine / create payment",
  "OBJECTED — officer Objected tab + map cluster",
  "REPORTED — citizen sees open report",
  "CLOSED — paid history on owner side",
  "PENDING property PVMS-DEMO-PENDING — officer approvals",
];

export default function TestInfo({ onLogin }) {
  const navigate = useNavigate();

  const quickLogin = async (account) => {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: account.email, password: TEST_PASSWORD }),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    if (onLogin) onLogin(data.user);
    navigate(account.path);
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: 720 }}>
        <div className="auth-card">
          <div className="auth-header">
            <h1>🧪 PVMS Test Access</h1>
            <p>Development-only test accounts and demo data</p>
          </div>

          <p style={{ marginBottom: 12 }}>
            <strong>Shared password:</strong> <code>password123</code>
          </p>

          <h3 style={{ marginBottom: 8 }}>One-click login</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="btn btn-primary"
                onClick={() => quickLogin(acc)}
              >
                {acc.label}
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: 8 }}>Accounts table</h3>
          <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse", marginBottom: 20 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ padding: 8 }}>Role</th>
                <th style={{ padding: 8 }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((a) => (
                <tr key={a.email} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: 8 }}>{a.label}</td>
                  <td style={{ padding: 8 }}><code>{a.email}</code></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginBottom: 8 }}>Pending (cannot login)</h3>
          <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
            {PENDING.map((p) => (
              <li key={p.email}>
                <code>{p.email}</code> — {p.note}
              </li>
            ))}
          </ul>

          <h3 style={{ marginBottom: 8 }}>Demo scenarios in DB</h3>
          <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
            {DEMO_SCENARIOS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
            Full guides: see <code>docs/USER-MANUAL.md</code> and <code>docs/TESTING.md</code> in the repository.
          </p>

          <button type="button" className="link-button" onClick={() => navigate("/login")}>
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
