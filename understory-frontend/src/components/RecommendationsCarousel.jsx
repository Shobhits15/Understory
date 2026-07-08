import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { COLORS } from "../constants/colors";
import { getHybridRecommendations } from "../api/recommendations";

/**
 * AI-powered recommendations carousel showing suggestions for a product
 */
export function RecommendationsCarousel({ userId, productId, onProductClick }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);
  const scrollContainerRef = null;

  useEffect(() => {
    if (!userId || !productId) return;

    setLoading(true);
    setError(null);

    getHybridRecommendations(userId, productId, 8)
      .then((recs) => {
        setRecommendations(recs);
      })
      .catch((err) => {
        setError(err.message || "Failed to load recommendations");
      })
      .finally(() => setLoading(false));
  }, [userId, productId]);

  const scroll = (direction) => {
    if (!scrollContainerRef) return;
    const amount = 300;
    if (direction === "left") {
      scrollContainerRef.scrollLeft -= amount;
    } else {
      scrollContainerRef.scrollLeft += amount;
    }
  };

  if (!userId || !productId) return null;

  return (
    <div
      style={{
        margin: "2rem 0",
        padding: "1.5rem",
        background: COLORS.bgMuted,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.1rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          🤖 AI Recommendations
          {loading && <Loader size={16} className="spin-animate" />}
        </h3>
        {recommendations.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() => scroll("left")}
              style={{
                background: COLORS.bg,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 6,
                padding: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.accent;
                e.currentTarget.style.color = COLORS.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.bg;
                e.currentTarget.style.color = "inherit";
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              style={{
                background: COLORS.bg,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 6,
                padding: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.accent;
                e.currentTarget.style.color = COLORS.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.bg;
                e.currentTarget.style.color = "inherit";
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(255, 107, 107, 0.1)",
            borderRadius: 8,
            color: "#FF6B6B",
            fontSize: "0.9rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: COLORS.inkSoft,
          }}
        >
          Training AI models and calculating personalized recommendations...
        </div>
      )}

      {!loading && recommendations.length === 0 && !error && (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: COLORS.inkSoft,
          }}
        >
          No recommendations available yet.
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div
          ref={scrollContainerRef}
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            scrollBehavior: "smooth",
            paddingBottom: "0.5rem",
          }}
        >
          {recommendations.map((rec) => (
            <div
              key={rec.productId}
              onClick={() => onProductClick?.(rec)}
              style={{
                minWidth: "200px",
                background: COLORS.bg,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 16px rgba(0, 0, 0, 0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  background: COLORS.bgMuted,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={rec.imageUrl}
                  alt={rec.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200/cccccc/000000?text=${rec.brand}`;
                  }}
                />
                {rec.score > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: COLORS.accent,
                      color: COLORS.bg,
                      borderRadius: 4,
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {(rec.score * 100).toFixed(0)}%
                  </div>
                )}
              </div>
              <div style={{ padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: COLORS.inkSoft }}>
                  {rec.brand}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    marginBottom: "0.5rem",
                  }}
                >
                  {rec.name}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: COLORS.accent }}>
                  ₹{rec.price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animate {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
