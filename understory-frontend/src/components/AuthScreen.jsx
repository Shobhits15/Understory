import { COLORS } from "../constants/colors";
import { GlobalStyle } from "./GlobalStyle";

export function AuthScreen({ mode, setMode, username, setUsername, email, setEmail, password, setPassword, error, busy, onLogin, onSignup, onGuest }) {
  const isLogin = mode === "login";
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'Inter', sans-serif", color: COLORS.ink }}>
      <GlobalStyle />
      <div className="pop-anim" style={{ width: "min(380px, 100%)", background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "1.75rem" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.5rem", marginBottom: "0.3rem" }}>Understory</div>
        <p style={{ color: COLORS.inkSoft, fontSize: "0.88rem", marginTop: 0, marginBottom: "1.4rem" }}>
          Sign in to keep your taste profile and picks saved between visits.
        </p>
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem" }}>
          <button
            onClick={() => setMode("login")}
            style={{ flex: 1, padding: "0.5rem", borderRadius: 8, cursor: "pointer", border: `1px solid ${isLogin ? COLORS.ink : COLORS.line}`, background: isLogin ? COLORS.ink : "transparent", color: isLogin ? COLORS.bg : COLORS.inkSoft, fontSize: "0.85rem" }}
          >
            Log in
          </button>
          <button
            onClick={() => setMode("signup")}
            style={{ flex: 1, padding: "0.5rem", borderRadius: 8, cursor: "pointer", border: `1px solid ${!isLogin ? COLORS.ink : COLORS.line}`, background: !isLogin ? COLORS.ink : "transparent", color: !isLogin ? COLORS.bg : COLORS.inkSoft, fontSize: "0.85rem" }}
          >
            Sign up
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <input className="u-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          {!isLogin && <input className="u-input" placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />}
          <input className="u-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} />
          {error && <p style={{ color: COLORS.danger, fontSize: "0.82rem", margin: 0 }}>{error}</p>}
          <button
            onClick={isLogin ? onLogin : onSignup}
            disabled={busy}
            style={{ padding: "0.7rem", borderRadius: 8, background: COLORS.ink, color: COLORS.bg, border: "none", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1, fontSize: "0.9rem" }}
          >
            {busy ? "Working…" : isLogin ? "Log in" : "Create account"}
          </button>
          <button onClick={onGuest} style={{ padding: "0.6rem", borderRadius: 8, background: "transparent", border: `1px solid ${COLORS.line}`, color: COLORS.inkSoft, cursor: "pointer", fontSize: "0.85rem" }}>
            Continue as guest
          </button>
        </div>
        <p style={{ fontSize: "0.72rem", color: COLORS.inkSoft, marginTop: "1.2rem", marginBottom: 0 }}>
          Accounts are stored in MySQL via the backend API (passwords are hashed, never stored in plaintext).
        </p>
      </div>
    </div>
  );
}
