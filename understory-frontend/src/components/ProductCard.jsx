import { Heart } from "lucide-react";
import { COLORS } from "../constants/colors";
import { CATEGORY_META } from "../constants/products";

export function ProductCard({ product, liked, onLike, onAdd, onProductClick, reason }) {
  const meta = CATEGORY_META[product.category];
  const Icon = meta.icon;
  return (
    <div
      onClick={onProductClick}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1)`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", height: 140, background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: "3.5rem" }}>
        {product.image.startsWith("http") ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : (
          <div style={{ display: "flex" }}>{product.image}</div>
        )}
        {product.image.startsWith("http") && (
          <div style={{ position: "absolute", inset: 0, display: "none", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`, fontSize: "3.5rem" }}>
            {product.image.includes("vase") ? "🏺" : product.image.includes("bowl") ? "🥣" : "📦"}
          </div>
        )}
        <div style={{ position: "absolute", top: 10, left: 10, width: 26, height: 26, borderRadius: "50%", background: "rgba(32,43,34,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} color="#fff" />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          aria-label={liked ? "Unlike" : "Like"}
          style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transform: liked ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }}
        >
          <Heart size={15} color={liked ? "#E85D75" : COLORS.inkSoft} fill={liked ? "#E85D75" : "none"} />
        </button>
      </div>
      <div style={{ padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
        <div style={{ fontSize: "0.7rem", color: COLORS.inkSoft, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.03em" }}>
          {product.category.toUpperCase()}
        </div>
        <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>{product.name}</div>
        {reason && reason.length > 0 && (
          <div style={{ fontSize: "0.72rem", color: COLORS.gold }}>Matches your love of {reason.join(" & ")}</div>
        )}
        <div style={{ marginTop: "auto", paddingTop: "0.6rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>₹{product.price}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            style={{ fontSize: "0.78rem", padding: "0.4rem 0.7rem", borderRadius: 8, background: COLORS.ink, color: COLORS.bg, border: "none", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
