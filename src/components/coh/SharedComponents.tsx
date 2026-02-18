import { useState, useEffect } from "react";

/* ── Color tokens ── */
const A = "#ff4d00";
const NAVY = "#0d1f38";
const BLK = "#0a0a0a";
const SEC = "#888";
const BRD = "#e8e8e8";

/* ── Shared Button ── */
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "ghost" | "outline";
}

export function Btn({ children, variant = "accent", style = {}, ...rest }: BtnProps) {
  const base: React.CSSProperties = {
    border: "none", borderRadius: 10, fontFamily: "inherit", cursor: "pointer",
    fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "all .15s",
  };
  const vars: Record<string, React.CSSProperties> = {
    accent: { background: A, color: "#fff" },
    ghost: { background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.9)", border: "1px solid rgba(255,255,255,.2)" },
    outline: { background: "transparent", color: BLK, border: `1.5px solid ${BRD}` },
  };
  return <button style={{ ...base, ...(vars[variant] || vars.accent), ...style }} {...rest}>{children}</button>;
}

/* ── Section Header ── */
interface SectionHeaderProps {
  title: string;
  accent: string;
  sub?: string;
  link?: string;
  onLink?: () => void;
}

export function SectionHeader({ title, accent, sub, link, onLink }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: "1.6rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div>
        <h2 style={{ fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 900, color: NAVY, letterSpacing: "-.04em", lineHeight: 1.1 }}>
          {title} <span style={{ color: A }}>{accent}</span>
        </h2>
        {sub && <p style={{ fontSize: ".82rem", color: SEC, marginTop: ".4rem" }}>{sub}</p>}
      </div>
      {link && <a onClick={onLink} style={{ fontSize: ".78rem", fontWeight: 700, color: A, cursor: "pointer", flexShrink: 0 }}>{link}</a>}
    </div>
  );
}

/* ── Nav ── */
export function Nav({ onSearch }: { onSearch: (q: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 200, background: scrolled ? "rgba(255,255,255,.97)" : "#fff", backdropFilter: "blur(14px)", borderBottom: `1px solid ${BRD}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5%", height: 62, boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.07)" : "none", transition: "box-shadow .25s" }}>
      <div style={{ fontSize: "1.15rem", fontWeight: 900, letterSpacing: "-.02em" }}>couple<span style={{ color: A }}>.</span>ofhours</div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {["Explore Hotels", "List Your Property", "Help"].map(l => (
          <a key={l} style={{ fontSize: ".8rem", fontWeight: 500, color: SEC, cursor: "pointer", transition: "color .15s" }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = BLK} onMouseLeave={e => (e.target as HTMLElement).style.color = SEC}>{l}</a>
        ))}
        <Btn style={{ padding: "0 18px", height: 36, fontSize: ".8rem" }}>Sign In</Btn>
      </div>
    </nav>
  );
}

/* ── Hero ── */
export function Hero({ onSearch }: { onSearch: (q: string) => void }) {
  const [city, setCity] = useState("");
  const [hours, setHours] = useState("4");
  const [hoursOpen, setHoursOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const HOUR_OPTIONS = ["4", "5", "6", "8", "10", "12"];
  const pills = ["Near JFK Airport", "Manhattan Midtown", "Brooklyn Heights", "Jersey City", "Upper East Side"];
  const fmtDate = (d: Date | null) => d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select date";

  return (
    <div style={{ background: "radial-gradient(ellipse at 65% -10%,#1a3060 0%,#0d1f38 50%,#050d1a 100%)", padding: "5rem 5% 6rem", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .04, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
      <div style={{ position: "absolute", top: "-60px", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,77,0,.06)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "15%", width: 300, height: 300, borderRadius: "50%", background: "rgba(30,80,180,.12)", filter: "blur(60px)", pointerEvents: "none" }} />

      <h1 style={{ fontSize: "clamp(2rem,5.5vw,3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-.04em", marginBottom: "1.1rem", position: "relative" }}>
        Find hourly hotel rooms<br />
        <span style={{ background: "linear-gradient(90deg,#ff7340,#ff4d00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>across New York & New Jersey</span>
      </h1>
      <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: "clamp(.95rem,2.2vw,1.2rem)", color: "rgba(255,255,255,.72)", marginBottom: "2.4rem", lineHeight: 1.7, position: "relative" }}>
        Pay only for the hours you need — perfect for layovers, day stays,<br />business meetings & couple escapes.
      </p>

      {/* search bar */}
      <div style={{ maxWidth: 860, margin: "0 auto 1.4rem", position: "relative", zIndex: 100 }}>
        <div style={{ background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", boxShadow: "0 12px 48px rgba(0,0,0,.28)", height: 58, position: "relative" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 18px", gap: 10, height: "100%", minWidth: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: ".66rem", color: "#bbb", fontWeight: 600, lineHeight: 1, marginBottom: 2 }}>LOCATION</div>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="City, neighborhood or hotel..." style={{ border: "none", outline: "none", fontSize: ".88rem", color: "#111", width: "100%", background: "transparent" }} />
            </div>
          </div>

          <div style={{ width: 1, alignSelf: "stretch", background: BRD, flexShrink: 0 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 18px", minWidth: 160, cursor: "pointer", height: "100%", flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={date ? "#ff4d00" : "#bbb"} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <div>
              <div style={{ fontSize: ".66rem", color: "#bbb", fontWeight: 600, lineHeight: 1, marginBottom: 2 }}>CHECK-IN</div>
              <div style={{ fontSize: ".84rem", fontWeight: date ? 700 : 400, color: date ? "#111" : "#bbb", lineHeight: 1 }}>{fmtDate(date)}</div>
            </div>
          </div>

          <div style={{ width: 1, alignSelf: "stretch", background: BRD, flexShrink: 0 }} />

          <div style={{ position: "relative", flexShrink: 0 }}>
            <div onClick={() => setHoursOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 16px", minWidth: 130, cursor: "pointer", height: 58, background: hoursOpen ? "#f9f9f9" : "transparent" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <div>
                <div style={{ fontSize: ".66rem", color: "#bbb", fontWeight: 600, lineHeight: 1, marginBottom: 2 }}>DURATION</div>
                <div style={{ fontSize: ".84rem", fontWeight: 700, color: "#111", lineHeight: 1 }}>{hours} Hours</div>
              </div>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            {hoursOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.14)", border: `1px solid ${BRD}`, overflow: "hidden", zIndex: 999 }}>
                {HOUR_OPTIONS.map(opt => (
                  <div key={opt} onClick={() => { setHours(opt); setHoursOpen(false); }} style={{ padding: "10px 16px", fontSize: ".84rem", fontWeight: hours === opt ? 700 : 400, color: hours === opt ? A : "#333", background: hours === opt ? "#fff8f5" : "#fff", cursor: "pointer" }}>{opt} Hours</div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => onSearch(city || "Manhattan")} style={{ background: A, color: "#fff", border: "none", height: "100%", padding: "0 30px", fontSize: ".9rem", fontWeight: 700, fontFamily: "inherit", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: 8, borderRadius: "0 14px 14px 0", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "#e03d00"} onMouseLeave={e => e.currentTarget.style.background = A}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Search
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", fontWeight: 500 }}>Popular:</span>
        {pills.map(p => (
          <button key={p} onClick={() => onSearch(p)} style={{ background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.16)", color: "rgba(255,255,255,.78)", borderRadius: 20, padding: "5px 14px", fontSize: ".72rem", fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.18)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.09)"; e.currentTarget.style.color = "rgba(255,255,255,.78)"; }}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Trust Row ── */
export function TrustRow() {
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BRD}`, display: "flex", alignItems: "center", justifyContent: "center", gap: "2.5rem", padding: ".9rem 5%", flexWrap: "wrap" }}>
      {["✅ Instant Confirmation", "💳 No Credit Card Hold", "🔒 100% Private & Secure", "🕐 Check-in Any Time", "💰 Best Price Guarantee"].map(t => (
        <div key={t} style={{ fontSize: ".76rem", fontWeight: 500, color: SEC }}>{t}</div>
      ))}
    </div>
  );
}
