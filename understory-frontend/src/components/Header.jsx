import { ShoppingBag, User, LogOut, ShieldCheck, Package } from "lucide-react";
import { COLORS } from "../constants/colors";

export function Header({ isGuest, currentUser, cartCount, onOpenCart, onOpenOrderHistory, onOpenAdmin, onLogout }) {
  return (
    <header style={{ borderBottom: `1px solid ${COLORS.line}`, position: "sticky", top: 0, zIndex: 20, background: COLORS.bg }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", gap: "0.75rem", flexWrap: "wrap" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.4rem" }}>Understory</div>
        <nav style={{ display: "flex", gap: "1.25rem", fontSize: "0.9rem", color: COLORS.inkSoft, alignItems: "center" }}>
          <a href="#recs">Discover</a>
          <a href="#shop">Shop</a>
          <button onClick={onOpenAdmin} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft, fontSize: "0.9rem", padding: 0 }}>
            <ShieldCheck size={15} /> Admin
          </button>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", color: COLORS.inkSoft }}>
            <User size={14} />
            {isGuest ? "Browsing as guest" : currentUser}
          </div>
          {!isGuest && (
            <button
              onClick={onOpenOrderHistory}
              aria-label="View orders"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.75rem", borderRadius: 999, background: `${COLORS.gold}15`, color: COLORS.gold, border: `1px solid ${COLORS.gold}30`, cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, transition: "all 0.2s" }}
              onMouseEnter={(e) => (e.target.style.background = `${COLORS.gold}25`)}
              onMouseLeave={(e) => (e.target.style.background = `${COLORS.gold}15`)}
            >
              <Package size={16} />
              Orders
            </button>
          )}
          <button onClick={onLogout} aria-label="Log out" style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft, display: "flex", alignItems: "center" }}>
            <LogOut size={16} />
          </button>
          <button
            onClick={onOpenCart}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.9rem", borderRadius: 999, background: COLORS.ink, color: COLORS.bg, border: "none", cursor: "pointer" }}
          >
            <ShoppingBag size={16} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem" }}>{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
