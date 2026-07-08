import { COLORS } from "../constants/colors";
import { TAG_LABELS } from "../constants/products";

export function TasteProfilePanel({ topTags, maxProfileVal, profileVersion }) {
  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: "2rem 1.25rem 1.5rem", display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
      <div>
        <div style={{ color: COLORS.gold, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.08em" }}>LIVE TASTE MODEL</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "2.4rem", lineHeight: 1.08, marginTop: "0.4rem" }}>
          A shop that learns <span style={{ fontStyle: "italic", color: COLORS.forest }}>what grows on you.</span>
        </h1>
        <p style={{ color: COLORS.inkSoft, marginTop: "0.9rem", maxWidth: "38ch" }}>
          Tap the heart on a few pieces below. Understory reads the pattern quietly in the background and starts pointing you toward more of it.
        </p>
      </div>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "1.2rem" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", color: COLORS.inkSoft, marginBottom: "0.7rem" }}>YOUR TASTE, SO FAR</div>
        {topTags.length === 0 ? (
          <p style={{ color: COLORS.inkSoft, fontSize: "0.9rem" }}>Nothing to go on yet — like a few things below and this fills in.</p>
        ) : (
          <div key={profileVersion} className="chip-anim" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {topTags.map(([tag, val]) => {
              const pct = Math.round((val / maxProfileVal) * 100);
              return (
                <span key={tag} style={{ background: COLORS.goldSoft, color: COLORS.ink, padding: "0.35rem 0.7rem", borderRadius: 999, fontSize: "0.8rem", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  {TAG_LABELS[tag]} <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.plum }}>{pct}%</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
