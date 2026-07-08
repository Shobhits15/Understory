import { COLORS } from "../constants/colors";

export function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes popIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      .chip-anim { animation: fadeSlideIn 0.45s ease; }
      .rec-anim { animation: fadeSlideIn 0.5s ease; }
      .pop-anim { animation: popIn 0.2s ease; }
      a { color: inherit; text-decoration: none; }
      .u-input {
        width: 100%; box-sizing: border-box; padding: 0.6rem 0.75rem; border-radius: 8px;
        border: 1px solid ${COLORS.line}; background: #fff; font-size: 0.9rem; font-family: 'Inter', sans-serif;
      }
      .u-input:focus { outline: 2px solid ${COLORS.gold}; outline-offset: 1px; }
    `}</style>
  );
}
