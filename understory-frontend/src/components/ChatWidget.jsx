import { useState, useRef, useEffect } from "react";
import { API_BASE } from "../api/client";

export default function ChatWidget() {
  const botName = "Understory Assistant";
  const [open, setOpen] = useState(false);
  const [useLive, setUseLive] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, who: "bot", text: `Hi — I'm ${botName}. Ask me anything about the shop!` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const idRef = useRef(2);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const appendMessage = (who, text) => {
    const uid = idRef.current++;
    setMessages((m) => [...m, { id: uid, who, text }]);
  };

  const send = async (text) => {
    if (!text.trim()) return;
    appendMessage("user", text);
    setInput("");
    setError(null);

    if (!useLive) {
      // local mock reply
      setTimeout(() => {
        appendMessage("bot", cannedReply(text));
      }, 600 + Math.random() * 700);
      return;
    }

    // live mode: call backend /api/chat
    setLoading(true);
    appendMessage("bot", "…"); // placeholder while loading
    try {
      const base = (typeof API_BASE === 'string' && API_BASE) ? API_BASE.replace(/\/$/, '') : '';
      const url = base ? `${base}/chat` : "/api/chat";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      // remove the last placeholder
      setMessages((m) => m.filter((msg) => !(msg.who === "bot" && msg.text === "…")));

      if (!res.ok) {
        const txt = await res.text();
        appendMessage("bot", `Error: ${res.status} ${res.statusText} - ${txt}`);
        setError(`Server returned ${res.status}`);
      } else {
        const data = await res.json();
        if (data && data.reply) {
          appendMessage("bot", data.reply);
        } else {
          appendMessage("bot", "Empty reply from server.");
        }
      }
    } catch (err) {
      // remove placeholder and fallback
      setMessages((m) => m.filter((msg) => !(msg.who === "bot" && msg.text === "…")));
      appendMessage("bot", `Network error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cannedReply = (text) => {
    const t = text.toLowerCase();
    if (t.includes("image") || t.includes("photo")) return "Product images load from external sources. If you see a broken image, check console/network for CORS or URL issues.";
    if (t.includes("cart")) return "To add items to cart, click 'Add' on a product card — this demo simulates that flow without a real backend.";
    if (t.includes("hello") || t.includes("hi")) return "Hello — welcome to Understory! Try asking about demo features or how the recommendations work.";
    return "Nice question — this is a mock bot.\nTip: say hello to the developer.\nHere: https://github.com/Shobhits15";
  };

  return (
    <div>
      {/* Floating button */}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 9999,
        }}
      >
        {open && (
          <div
            style={{
              width: 320,
              maxWidth: "calc(100vw - 40px)",
              height: 460,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              borderRadius: 12,
              overflow: "hidden",
              background: "#fff",
              color: "#111",
            }}
          >
            <div style={{ padding: "0.6rem 0.9rem", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>{botName} {useLive ? "(Live)" : "(Demo)"}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={{ fontSize: 12, color: "#555" }}>
                  <input type="checkbox" checked={useLive} onChange={(e) => setUseLive(e.target.checked)} style={{ marginRight: 6 }} />
                  Use live bot
                </label>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  style={{ border: "none", background: "none", cursor: "pointer", padding: 6 }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div ref={scrollRef} style={{ flex: 1, padding: "0.75rem", overflowY: "auto", gap: 8, display: "flex", flexDirection: "column" }}>
              {messages.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: m.who === "bot" ? "flex-start" : "flex-end" }}>
                  <div
                    style={{
                      background: m.who === "bot" ? "#F3F4F6" : "#0F172A",
                      color: m.who === "bot" ? "#111" : "#fff",
                      padding: "0.5rem 0.75rem",
                      borderRadius: 8,
                      maxWidth: "80%",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "0.6rem", borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send(input);
                }}
                placeholder={useLive ? "Type a question for the live assistant..." : "Type a message..."}
                style={{ flex: 1, padding: "0.55rem 0.6rem", borderRadius: 8, border: "1px solid #e6e6e6" }}
                disabled={loading}
              />
              <button
                onClick={() => send(input)}
                style={{ padding: "0.5rem 0.7rem", borderRadius: 8, background: "#0F172A", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
                disabled={loading}
              >
                {loading ? "Sending…" : "Send"}
              </button>
            </div>
            {error && <div style={{ padding: "0.5rem 0.75rem", color: "#B91C1C", fontSize: 12 }}>{error}</div>}
            <div style={{ padding: 8, fontSize: 11, color: "#666", borderTop: "1px solid #f5f5f5" }}>Live mode sends messages to /api/chat (OpenAI). Ensure backend has OPENAI_API_KEY set.</div>
          </div>
        )}

        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Open chat"
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: "#0F172A",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(15,23,42,0.2)",
            }}
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
}
