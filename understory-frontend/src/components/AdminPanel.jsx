import { useState } from "react";
import { X, Package } from "lucide-react";
import { COLORS } from "../constants/colors";
import { ADMIN_PASSCODE } from "../constants/config";
import { TAG_LABELS, PRODUCTS } from "../constants/products";
import { scoreProduct } from "../utils/productUtils";
import { apiAdminListUsers } from "../api/client";
import { OrderManagement } from "./OrderManagement";

export function AdminPanel({ onClose }) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [showOrderManagement, setShowOrderManagement] = useState(false);

  async function loadUsers(passcode) {
    setLoading(true);
    try {
      const results = await apiAdminListUsers(passcode);
      setUsers(results);
      return true;
    } catch (err) {
      setError(err.message || "Wrong passcode.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth() {
    setError("");
    const ok = await loadUsers(pass);
    if (ok) setAuthed(true);
  }

  if (showOrderManagement && authed) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 40 }}>
        <OrderManagement onClose={() => setShowOrderManagement(false)} />
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(32,43,34,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop-anim"
        style={{ background: COLORS.bg, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "1.5rem", width: "min(640px, 100%)", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.2rem", margin: 0 }}>Admin · Dashboard</h3>
          <button onClick={onClose} aria-label="Close admin panel" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {!authed ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            <p style={{ color: COLORS.inkSoft, fontSize: "0.88rem", margin: 0 }}>Enter the admin passcode to access the admin dashboard.</p>
            <input className="u-input" type="password" placeholder="Admin passcode" value={pass} onChange={(e) => setPass(e.target.value)} />
            {error && <p style={{ color: COLORS.danger, fontSize: "0.82rem", margin: 0 }}>{error}</p>}
            <button onClick={handleAuth} style={{ padding: "0.6rem", borderRadius: 8, background: COLORS.ink, color: COLORS.bg, border: "none", cursor: "pointer" }}>
              Enter
            </button>
            <p style={{ fontSize: "0.7rem", color: COLORS.inkSoft, margin: 0 }}>Demo passcode: {ADMIN_PASSCODE}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", borderBottom: `1px solid ${COLORS.line}`, paddingBottom: "0.75rem" }}>
              <button
                onClick={() => setActiveTab("users")}
                style={{
                  padding: "0.5rem 1rem",
                  borderBottom: `2px solid ${activeTab === "users" ? COLORS.gold : "transparent"}`,
                  background: "none",
                  border: "none",
                  color: activeTab === "users" ? COLORS.gold : COLORS.inkSoft,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
              >
                👥 Users
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                style={{
                  padding: "0.5rem 1rem",
                  borderBottom: `2px solid ${activeTab === "orders" ? COLORS.gold : "transparent"}`,
                  background: "none",
                  border: "none",
                  color: activeTab === "orders" ? COLORS.gold : COLORS.inkSoft,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Package size={16} /> Orders
              </button>
            </div>

            {/* Users Tab */}
            {activeTab === "users" ? (
              loading ? (
                <p style={{ color: COLORS.inkSoft }}>Loading shopper data…</p>
              ) : users.length === 0 ? (
                <p style={{ color: COLORS.inkSoft }}>No signed-up shoppers yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  {users.map((u) => {
                    const uProfile = u.profile || {};
                    const uLikes = u.likes || {};
                    const uCart = u.cart || {};
                    const maxV = Math.max(1, ...Object.values(uProfile));
                    const uTopTags = Object.entries(uProfile)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3);
                    const uRecs = PRODUCTS.filter((p) => !uLikes[p.id])
                      .map((p) => ({ ...p, score: scoreProduct(p, uProfile) }))
                      .filter((p) => p.score > 0.05)
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 2);
                    const cartCountU = Object.values(uCart).reduce((s, q) => s + q, 0);
                    return (
                      <div key={u.username} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "0.9rem" }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                          <div style={{ fontWeight: 500 }}>{u.username}</div>
                          <div style={{ fontSize: "0.72rem", color: COLORS.inkSoft }}>
                            {Object.keys(uLikes).length} liked · {cartCountU} in cart
                          </div>
                        </div>
                        {uTopTags.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                            {uTopTags.map(([t, v]) => (
                              <span key={t} style={{ background: COLORS.goldSoft, color: COLORS.ink, padding: "0.25rem 0.55rem", borderRadius: 999, fontSize: "0.72rem" }}>
                                {TAG_LABELS[t]} {Math.round((v / maxV) * 100)}%
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: "0.78rem", color: COLORS.inkSoft, marginTop: "0.5rem" }}>
                          {uRecs.length > 0 ? `Would recommend: ${uRecs.map((r) => r.name).join(", ")}` : "Not enough signal yet to recommend anything."}
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => loadUsers(pass)}
                    style={{
                      alignSelf: "flex-start",
                      padding: "0.5rem 0.9rem",
                      borderRadius: 8,
                      border: `1px solid ${COLORS.line}`,
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      color: COLORS.inkSoft,
                    }}
                  >
                    Refresh
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={() => setShowOrderManagement(true)}
                style={{
                  padding: "1rem",
                  borderRadius: 8,
                  border: `2px solid ${COLORS.gold}`,
                  background: `${COLORS.gold}15`,
                  color: COLORS.gold,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                  transition: "all 0.2s",
                }}
              >
                📦 Open Order Management
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
