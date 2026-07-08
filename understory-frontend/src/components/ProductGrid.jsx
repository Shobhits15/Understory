import { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { COLORS } from "../constants/colors";

/**
 * Interactive product grid showing products with AI-generated images
 */
export function ProductGrid({ products = [], onProductClick, onAddToCart }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const getPlaceholderImage = (productId, productName) => {
    // Fallback to a deterministic placeholder if image fails to load
    const hash = productName.split("").reduce((h, c) => h + c.charCodeAt(0), 0);
    const colors = ["FF6B6B", "4ECDC4", "45B7D1", "FFA07A", "98D8C8", "F7DC6F"];
    const bgColor = colors[hash % colors.length];
    return `https://via.placeholder.com/300x300/${bgColor.toLowerCase()}/ffffff?text=${encodeURIComponent(productName.substring(0, 15))}`;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.5rem",
        padding: "1rem",
      }}
    >
      {products.map((product) => (
        <div
          key={product.productId}
          onClick={() => onProductClick?.(product)}
          onMouseEnter={() => setHoveredId(product.productId)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            background: COLORS.bg,
            border: `1px solid ${COLORS.line}`,
            borderRadius: 12,
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s ease",
            transform: hoveredId === product.productId ? "translateY(-8px)" : "translateY(0)",
            boxShadow:
              hoveredId === product.productId
                ? `0 8px 24px rgba(0, 0, 0, 0.15)`
                : `0 2px 8px rgba(0, 0, 0, 0.05)`,
          }}
        >
          {/* Product Image */}
          <div
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              background: COLORS.bgMuted,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={imageErrors[product.productId] ? 
                getPlaceholderImage(product.productId, product.name) : 
                product.imageUrl}
              alt={product.name}
              onError={() => handleImageError(product.productId)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
                transform: hoveredId === product.productId ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* Quick Actions Overlay */}
            {hoveredId === product.productId && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(32, 43, 34, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart?.(product);
                  }}
                  style={{
                    background: COLORS.accent,
                    color: COLORS.bg,
                    border: "none",
                    borderRadius: 8,
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}
                >
                  <ShoppingCart size={18} /> Add
                </button>
                <button
                  style={{
                    background: COLORS.bg,
                    color: COLORS.accent,
                    border: `2px solid ${COLORS.accent}`,
                    borderRadius: 8,
                    padding: "0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Heart size={18} />
                </button>
              </div>
            )}

            {/* Rating Badge */}
            {product.score > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  background: COLORS.accent,
                  color: COLORS.bg,
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {(product.score * 100).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ padding: "1rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: COLORS.inkSoft,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "0.25rem",
                }}
              >
                {product.brand}
              </div>
              <h4
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: COLORS.ink,
                  lineHeight: 1.3,
                }}
              >
                {product.name}
              </h4>
            </div>

            {product.category && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: COLORS.inkSoft,
                  marginBottom: "0.5rem",
                }}
              >
                {product.category}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: `1px solid ${COLORS.line}`,
              }}
            >
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: COLORS.accent,
                }}
              >
                ₹{product.price.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </div>

              {product.scoreType && product.scoreType !== "product" && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    background: COLORS.bgMuted,
                    padding: "0.25rem 0.5rem",
                    borderRadius: 4,
                    color: COLORS.inkSoft,
                    textTransform: "uppercase",
                  }}
                >
                  {product.scoreType}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
