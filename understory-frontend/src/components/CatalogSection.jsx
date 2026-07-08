import { COLORS } from "../constants/colors";
import { CATEGORY_META } from "../constants/products";
import { ProductCard } from "./ProductCard";

export function CatalogSection({ filteredProducts, category, setCategory, likes, onLike, onAdd, onProductClick }) {
  return (
    <section id="catalog" style={{ maxWidth: 1080, margin: "0 auto", padding: "1.5rem 1.25rem 3rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.3rem", margin: 0 }}>Everything</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["All", ...Object.keys(CATEGORY_META)].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "0.35rem 0.8rem", borderRadius: 999, fontSize: "0.8rem", cursor: "pointer",
                border: `1px solid ${category === c ? COLORS.ink : COLORS.line}`,
                background: category === c ? COLORS.ink : "transparent",
                color: category === c ? COLORS.bg : COLORS.inkSoft,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.2rem" }}>
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} liked={!!likes[p.id]} onLike={() => onLike(p)} onAdd={() => onAdd(p)} onProductClick={() => onProductClick(p)} />
        ))}
      </div>
    </section>
  );
}
