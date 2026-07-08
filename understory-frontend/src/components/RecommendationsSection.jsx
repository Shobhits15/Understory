import { Sparkles } from "lucide-react";
import { COLORS } from "../constants/colors";
import { ProductCard } from "./ProductCard";
import { topSharedTags } from "../utils/productUtils";

export function RecommendationsSection({ recommendations, topTagName, likes, profile, profileVersion, onLike, onAdd, onProductClick }) {
  return (
    <section id="recs" style={{ maxWidth: 1080, margin: "0 auto", padding: "1.5rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <Sparkles size={18} color={COLORS.gold} />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.3rem", margin: 0 }}>
          {topTagName ? `Because you're drawn to ${topTagName}` : "Start here"}
        </h2>
      </div>
      {recommendations.length === 0 ? (
        <p style={{ color: COLORS.inkSoft }}>Tap the heart on a few pieces below and this row starts filling in.</p>
      ) : (
        <div key={profileVersion} className="rec-anim" style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {recommendations.map((p) => (
            <div key={p.id} style={{ minWidth: 220, maxWidth: 220 }}>
              <ProductCard product={p} liked={!!likes[p.id]} onLike={() => onLike(p)} onAdd={() => onAdd(p)} onProductClick={() => onProductClick(p)} reason={topSharedTags(p, profile)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
