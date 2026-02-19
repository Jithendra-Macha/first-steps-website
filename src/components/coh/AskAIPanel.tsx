import { useState, useRef, useEffect, useCallback } from "react";
import { useThemeColors } from "./SharedComponents";

const A = "#ff4d00";
const NAVY = "#0d1f38";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_SUGGESTIONS = [
  { icon: "🏨", label: "Best hotels near JFK" },
  { icon: "💰", label: "Hotels under $25/hr" },
  { icon: "💑", label: "Best for couples in Manhattan" },
  { icon: "🧳", label: "Layover hotels near airports" },
];

const ASK_AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-ai`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  try {
    const resp = await fetch(ASK_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(err.error || "Something went wrong");
      return;
    }

    if (!resp.body) { onError("No response body"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;

    while (!done) {
      const { done: readerDone, value } = await reader.read();
      if (readerDone) break;
      buffer += decoder.decode(value, { stream: true });

      let nlIdx: number;
      while ((nlIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nlIdx);
        buffer = buffer.slice(nlIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    onError("Network error. Please try again.");
  }
}

export default function AskAIPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = useThemeColors();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    await streamChat({
      messages: allMessages,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      },
      onDone: () => setLoading(false),
      onError: (err) => {
        setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${err}` }]);
        setLoading(false);
      },
    });
  }, [messages, loading]);

  if (!open) return null;

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)",
          animation: "askFadeIn .2s ease",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9999,
        width: "min(460px, 100vw)",
        background: t.dark ? "#0f0f0f" : "#fff",
        display: "flex", flexDirection: "column",
        animation: "askSlideIn .3s cubic-bezier(.16,1,.3,1)",
        boxShadow: "-8px 0 40px rgba(0,0,0,.15)",
        fontFamily: "'Nunito Sans', system-ui, sans-serif",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px",
          borderBottom: `1px solid ${t.dark ? "#222" : "#f0f0f0"}`,
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "1.1rem", color: t.text, padding: 4,
          }}>✕</button>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: t.text }}>
            Ask AI<span style={{ color: A }}>.</span>
          </span>
          <div style={{ flex: 1 }} />
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              style={{
                fontSize: ".72rem", fontWeight: 700, color: t.dark ? "#555" : "#aaa",
                background: "none", border: "none", cursor: "pointer",
              }}
            >New chat</button>
          )}
        </div>

        {/* Messages area */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {isEmpty && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
              <div style={{ fontSize: "2rem", animation: "askPulse 2s infinite" }}>✦</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: t.text, margin: 0 }}>Ask away</h2>
              <p style={{ fontSize: ".88rem", color: t.dark ? "#666" : "#999", margin: 0 }}>
                Your AI concierge for hourly hotels
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}>
              <div style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: msg.role === "user"
                  ? `linear-gradient(135deg, ${NAVY}, #1a3558)`
                  : (t.dark ? "#1a1a1a" : "#f5f5f5"),
                color: msg.role === "user" ? "#fff" : t.text,
                fontSize: ".88rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {msg.content}
                {loading && i === messages.length - 1 && msg.role === "assistant" && (
                  <span style={{ opacity: .5, animation: "askBlink 1s infinite" }}>▊</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick suggestions */}
        {isEmpty && (
          <div style={{ padding: "0 20px 12px", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {QUICK_SUGGESTIONS.map(s => (
              <button
                key={s.label}
                onClick={() => send(s.label)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 20,
                  border: `1.5px solid ${t.dark ? "#333" : "#e8e8e8"}`,
                  background: t.dark ? "#1a1a1a" : "#fff",
                  color: t.text,
                  fontSize: ".78rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all .15s",
                }}
              >
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{
          padding: "12px 20px 16px",
          borderTop: `1px solid ${t.dark ? "#222" : "#f0f0f0"}`,
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "flex-end", gap: 8,
            background: t.dark ? "#1a1a1a" : "#f8f8f8",
            borderRadius: 16,
            padding: "10px 14px",
            border: `1.5px solid ${t.dark ? "#333" : "#e8e8e8"}`,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              placeholder="Ask about hotels, areas, prices..."
              rows={1}
              style={{
                flex: 1, border: "none", outline: "none", resize: "none",
                background: "transparent", color: t.text,
                fontSize: ".88rem", fontFamily: "inherit",
                lineHeight: 1.5, maxHeight: 100,
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: input.trim() ? A : (t.dark ? "#333" : "#ddd"),
                border: "none", cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s", flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p style={{
            fontSize: ".62rem", color: t.dark ? "#444" : "#bbb",
            textAlign: "center", marginTop: 8,
          }}>
            AI-powered · Responses may not always be accurate
          </p>
        </div>
      </div>

      <style>{`
        @keyframes askFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes askSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes askPulse { 0%,100% { opacity: .6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes askBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </>
  );
}
