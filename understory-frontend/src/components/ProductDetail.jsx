import { X, ShoppingBag, Heart } from "lucide-react";
import { COLORS } from "../constants/colors";
import { TAG_LABELS } from "../constants/products";

export function ProductDetail({ product, isLiked, onClose, onLike, onAddToCart }) {
  if (!product) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(32,43,34,0.8)", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.bg,
          borderRadius: 16,
          border: `1px solid ${COLORS.line}`,
          maxWidth: 600,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderBottom: `1px solid ${COLORS.line}`,
            position: "sticky",
            top: 0,
            background: COLORS.bg,
          }}
        >
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.3rem", margin: 0 }}>{product.name}</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Product Image */}
          <div style={{ textAlign: "center", background: `${COLORS.gold}08`, borderRadius: 12, padding: "2rem 1rem", fontSize: "5rem", overflow: "hidden", minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {product.image.startsWith("http") ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) e.target.nextSibling.style.display = "block";
                }}
              />
            ) : (
              <div>{product.image}</div>
            )}
            {product.image.startsWith("http") && (
              <div style={{ display: "none", fontSize: "5rem" }}>📦</div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: COLORS.inkSoft, fontWeight: 600, textTransform: "uppercase" }}>{product.category}</span>
              <span style={{ fontSize: "1.5rem", fontWeight: 600, color: COLORS.gold }}>₹{product.price}</span>
            </div>

            {/* Description */}
            <p style={{ fontSize: "0.95rem", color: COLORS.ink, lineHeight: "1.6", margin: "0 0 1.5rem 0" }}>{product.description}</p>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {Object.entries(product.tags)
                .filter(([_, value]) => value > 0.5)
                .map(([tag, value]) => (
                  <span
                    key={tag}
                    style={{
                      background: `${COLORS.gold}20`,
                      color: COLORS.gold,
                      padding: "0.4rem 0.8rem",
                      borderRadius: 20,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      border: `1px solid ${COLORS.gold}40`,
                    }}
                  >
                    {TAG_LABELS[tag]}
                  </span>
                ))}
            </div>
          </div>

          {/* Features */}
          <div style={{ background: COLORS.line, borderRadius: 12, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.ink, margin: "0 0 0.5rem 0" }}>✨ Product Features</h3>
            {product.id === "p1" && (
              <>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>🎨 Hand-thrown ceramic with custom glaze</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>📐 Dimensions: 8" height × 6" diameter</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>🚚 Free shipping on all orders above ₹500</div>
              </>
            )}
            {product.id === "p2" && (
              <>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>🍽️ Set includes 3 bowls (small, medium, large)</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>🧼 Dishwasher safe and durable</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>📦 Beautifully packaged, ready to gift</div>
              </>
            )}
            {product.id === "p10" && (
              <>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>💚 NASA-approved air purifying plant</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>☀️ Thrives in low to bright light conditions</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>💧 Water only once every 2-3 weeks</div>
              </>
            )}
            {product.description && !product.id.startsWith("p1") && !product.id.startsWith("p2") && !product.id.startsWith("p10") && (
              <>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>✓ Premium quality materials</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>✓ Eco-friendly production</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.inkSoft }}>✓ Lifetime customer support</div>
              </>
            )}
          </div>

          {/* Shipping Info */}
          <div style={{ background: `${COLORS.gold}08`, border: `1px solid ${COLORS.gold}20`, borderRadius: 12, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.gold }}>🚚 Free Shipping</div>
            <div style={{ fontSize: "0.8rem", color: COLORS.inkSoft }}>On orders above ₹500 • Delivery in 3-5 business days</div>
            <div style={{ fontSize: "0.8rem", color: COLORS.inkSoft }}>✓ 30-day returns • ✓ 1-year warranty on defects</div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", paddingTop: "1rem", borderTop: `1px solid ${COLORS.line}` }}>
            <button
              onClick={onLike}
              style={{
                padding: "0.9rem",
                borderRadius: 10,
                border: `2px solid ${isLiked ? COLORS.gold : COLORS.line}`,
                background: isLiked ? `${COLORS.gold}15` : "transparent",
                color: isLiked ? COLORS.gold : COLORS.inkSoft,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
              }}
            >
              <Heart size={18} style={{ fill: isLiked ? COLORS.gold : "none" }} />
              {isLiked ? "Liked" : "Like"}
            </button>
            <button
              onClick={onAddToCart}
              style={{
                padding: "0.9rem",
                borderRadius: 10,
                background: COLORS.ink,
                color: COLORS.bg,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
              }}
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
