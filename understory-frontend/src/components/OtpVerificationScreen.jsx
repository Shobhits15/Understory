import { COLORS } from "../constants/colors";
import { GlobalStyle } from "./GlobalStyle";
import { useState } from "react";

export function OtpVerificationScreen({ email, otpExpiryMinutes, error, busy, onVerify, onResendOtp, onBack }) {
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      await onResendOtp();
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'Inter', sans-serif", color: COLORS.ink }}>
      <GlobalStyle />
      <div className="pop-anim" style={{ width: "min(380px, 100%)", background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: "1.75rem" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.5rem", marginBottom: "0.3rem" }}>Verify Your Email</div>
        <p style={{ color: COLORS.inkSoft, fontSize: "0.88rem", marginTop: 0, marginBottom: "1.4rem" }}>
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below to complete your registration.
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", color: COLORS.inkSoft, display: "block", marginBottom: "0.4rem" }}>Verification Code</label>
            <input
              className="u-input"
              placeholder="000000"
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              autoComplete="off"
            />
          </div>

          {error && <p style={{ color: COLORS.danger, fontSize: "0.82rem", margin: 0 }}>{error}</p>}

          <p style={{ fontSize: "0.78rem", color: COLORS.inkSoft, margin: 0 }}>
            Code expires in <strong>{otpExpiryMinutes} minutes</strong>
          </p>

          <button
            onClick={() => onVerify(email, otp)}
            disabled={busy || otp.length !== 6}
            style={{
              padding: "0.7rem",
              borderRadius: 8,
              background: otp.length === 6 && !busy ? COLORS.ink : COLORS.line,
              color: COLORS.bg,
              border: "none",
              cursor: otp.length === 6 && !busy ? "pointer" : "default",
              opacity: otp.length === 6 && !busy ? 1 : 0.5,
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            {busy ? "Verifying…" : "Verify Email"}
          </button>

          <button
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || busy}
            style={{
              padding: "0.6rem",
              borderRadius: 8,
              background: "transparent",
              border: `1px solid ${resendCooldown > 0 ? COLORS.line : COLORS.ink}`,
              color: resendCooldown > 0 ? COLORS.inkSoft : COLORS.ink,
              cursor: resendCooldown > 0 ? "default" : "pointer",
              fontSize: "0.85rem",
            }}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
          </button>

          <button
            onClick={onBack}
            style={{
              padding: "0.6rem",
              borderRadius: 8,
              background: "transparent",
              border: `1px solid ${COLORS.line}`,
              color: COLORS.inkSoft,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Back to Sign Up
          </button>
        </div>

        <p style={{ fontSize: "0.72rem", color: COLORS.inkSoft, marginTop: "1.2rem", marginBottom: 0 }}>
          Didn't receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
