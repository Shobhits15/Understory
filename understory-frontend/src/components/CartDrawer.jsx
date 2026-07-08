import { X, Plus, Minus } from "lucide-react";
import { COLORS } from "../constants/colors";
import { CATEGORY_META } from "../constants/products";
import { imageUrl } from "../utils/productUtils";

export function CartDrawer({ cartItems, cartTotal, crossSell, checkoutNote, onClose, onChangeQty, onAddCrossSell, onCheckout }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 30, background: "rgba(32,43,34,0.35)" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "min(380px, 100%)", background: COLORS.bg, borderLeft: `1px solid ${COLORS.line}`, animation: "drawerIn 0.25s ease", padding: "1.25rem", overflowY: "auto", boxSizing: "border-box" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.2rem", margin: 0 }}>Your cart</h3>
          <button onClick={onClose} aria-label="Close cart" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p style={{ color: COLORS.inkSoft }}>Empty for now. Add something you like from the shop.</p>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cartItems.map((item) => {
                const meta = CATEGORY_META[item.category];
                return (
                  <div key={item.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`, overflow: "hidden" }}>
                      <img src={imageUrl(item)} alt={item.name} onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem", color: COLORS.inkSoft }}>${item.price}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button onClick={() => onChangeQty(item.id, -1)} style={{ border: `1px solid ${COLORS.line}`, background: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.85rem", minWidth: 14, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => onChangeQty(item.id, 1)} style={{ border: `1px solid ${COLORS.line}`, background: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {crossSell && (
              <div style={{ marginTop: "1.25rem", padding: "0.9rem", background: COLORS.plumSoft, borderRadius: 12 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", color: COLORS.plum, marginBottom: "0.4rem" }}>PAIRS WELL WITH</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "0.85rem" }}>{crossSell.name} · ${crossSell.price}</div>
                  <button onClick={() => onAddCrossSell(crossSell)} style={{ fontSize: "0.75rem", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: COLORS.plum }}>
                    Add
                  </button>
                </div>
              </div>
            )}
            <div style={{ marginTop: "1.4rem", paddingTop: "1rem", borderTop: `1px solid ${COLORS.line}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: COLORS.inkSoft }}>Subtotal</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} style={{ width: "100%", marginTop: "1rem", padding: "0.8rem", borderRadius: 10, background: COLORS.ink, color: COLORS.bg, border: "none", cursor: "pointer" }}>
              Checkout
            </button>
            {checkoutNote && (
              <p style={{ fontSize: "0.75rem", color: COLORS.inkSoft, marginTop: "0.6rem" }}>
                This demo stops here — the taste model and recommendations above it are real and running.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
