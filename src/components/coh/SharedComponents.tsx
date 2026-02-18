import { useState, useEffect, useRef, useMemo } from "react";
import { searchLocations, getTypeIcon, type USLocation } from "@/data/usLocations";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay } from "date-fns";

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
/* ── Location Dropdown ── */
function LocationDropdown({ value, onChange, onSelect }: { value: string; onChange: (v: string) => void; onSelect: (loc: USLocation) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchLocations(value), [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: ".66rem", color: "#bbb", fontWeight: 600, lineHeight: 1, marginBottom: 2 }}>LOCATION</div>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="City, neighborhood or hotel..."
        style={{ border: "none", outline: "none", fontSize: ".88rem", color: "#111", width: "100%", background: "transparent" }}
      />
      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 12px)", left: -18, width: 360, background: "#fff", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,.18)", border: `1px solid ${BRD}`, overflow: "hidden", zIndex: 999 }}>
          <div style={{ padding: "10px 14px 6px", fontSize: ".65rem", fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: ".06em" }}>
            {value.trim() ? "Results" : "Popular Destinations"}
          </div>
          {results.map((loc, i) => (
            <div
              key={`${loc.name}-${loc.state}-${i}`}
              onClick={() => { onChange(`${loc.name}, ${loc.state}`); onSelect(loc); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", transition: "background .1s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f8f8f8")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: "1rem", width: 28, textAlign: "center" }}>{getTypeIcon(loc.type)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: ".84rem", fontWeight: 600, color: "#111" }}>{loc.name}</div>
                <div style={{ fontSize: ".7rem", color: "#999" }}>{loc.type.charAt(0).toUpperCase() + loc.type.slice(1)} · {loc.state}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Single-Date Calendar (Kayak-inspired) ── */
function HeroCalendar({ selected, onSelect, onClose }: { selected: Date | null; onSelect: (d: Date) => void; onClose: () => void }) {
  const [baseMonth, setBaseMonth] = useState(() => selected ? startOfMonth(selected) : startOfMonth(new Date()));
  const today = startOfDay(new Date());

  const getDayColor = (day: Date) => {
    const dow = day.getDay();
    if (dow === 5 || dow === 6) return { bg: "#ffe4a0", color: "#8a6d00" }; // weekend = higher
    if (dow === 0) return { bg: "#ffe4a0", color: "#8a6d00" };
    return { bg: "#b8f0c8", color: "#1a6e30" }; // weekday = cheaper
  };

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 16, boxShadow: "0 16px 50px rgba(0,0,0,.2)", border: `1px solid ${BRD}`, padding: "20px 24px 16px", zIndex: 999, width: 320 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setBaseMonth(m => subMonths(m, 1)); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "4px 8px", borderRadius: 6 }}>‹</button>
        <span style={{ fontSize: ".95rem", fontWeight: 700, color: NAVY }}>{format(baseMonth, "MMMM yyyy")}</span>
        <button onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setBaseMonth(m => addMonths(m, 1)); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "4px 8px", borderRadius: 6 }}>›</button>
      </div>

      {/* month grid */}
      <div>
        {(() => {
          const mStart = startOfMonth(baseMonth);
          const mEnd = endOfMonth(baseMonth);
          const calStart = startOfWeek(mStart);
          const calEnd = endOfWeek(mEnd);
          const days = eachDayOfInterval({ start: calStart, end: calEnd });

          return (
            <>
              {/* day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, di) => (
                  <div key={di} style={{ textAlign: "center", fontSize: ".7rem", fontWeight: 700, color: "#999", padding: "4px 0" }}>{d}</div>
                ))}
              </div>
              {/* day cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {days.map((day, di) => {
                  const inMonth = isSameMonth(day, baseMonth);
                  const isPast = isBefore(day, today);
                  const isSelected = selected && isSameDay(day, selected);
                  const isToday = isSameDay(day, today);
                  const { bg, color: textColor } = getDayColor(day);

                  if (!inMonth) return <div key={di} />;

                  return (
                    <button
                      key={di}
                      disabled={isPast}
                      onClick={() => { onSelect(day); onClose(); }}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        border: isSelected ? `2px solid ${NAVY}` : "none",
                        borderRadius: 8,
                        background: isSelected ? NAVY : isPast ? "#f5f5f5" : bg,
                        color: isSelected ? "#fff" : isPast ? "#ccc" : textColor,
                        fontSize: ".82rem",
                        fontWeight: isToday || isSelected ? 800 : 600,
                        cursor: isPast ? "default" : "pointer",
                        transition: "transform .1s",
                        position: "relative",
                      }}
                      onMouseEnter={e => { if (!isPast) e.currentTarget.style.transform = "scale(1.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {format(day, "d")}
                      {isToday && !isSelected && (
                        <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: A }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

      {/* legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BRD}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "#b8f0c8", display: "inline-block" }} />
          <span style={{ fontSize: ".7rem", fontWeight: 600, color: "#1a6e30" }}>Cheaper</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "#ffe4a0", display: "inline-block" }} />
          <span style={{ fontSize: ".7rem", fontWeight: 600, color: "#8a6d00" }}>Average</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: ".68rem", color: "#999" }}>Based on average hourly rates</span>
      </div>
    </div>
  );
}

/* ── Hero ── */
export function Hero({ onSearch }: { onSearch: (q: string) => void }) {
  const [city, setCity] = useState("");
  const [hours, setHours] = useState("4");
  const [hoursOpen, setHoursOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const HOUR_OPTIONS = ["4", "5", "6", "8", "10", "12"];
  const pills = ["Near JFK Airport", "Manhattan Midtown", "Brooklyn Heights", "Jersey City", "Upper East Side"];
  const fmtDate = (d: Date | null) => d ? format(d, "EEE M/d") : "Select date";

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
            <LocationDropdown value={city} onChange={setCity} onSelect={(loc) => setCity(`${loc.name}, ${loc.state}`)} />
          </div>

          <div style={{ width: 1, alignSelf: "stretch", background: BRD, flexShrink: 0 }} />

          <div onClick={() => setCalOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 18px", minWidth: 170, cursor: "pointer", height: "100%", flexShrink: 0, background: calOpen ? "#f9f9f9" : "transparent", position: "relative" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={date ? A : "#bbb"} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <div>
              <div style={{ fontSize: ".66rem", color: "#bbb", fontWeight: 600, lineHeight: 1, marginBottom: 2 }}>CHECK-IN</div>
              <div style={{ fontSize: ".84rem", fontWeight: date ? 700 : 400, color: date ? "#111" : "#bbb", lineHeight: 1 }}>{fmtDate(date)}</div>
            </div>
            {calOpen && <HeroCalendar selected={date} onSelect={setDate} onClose={() => setCalOpen(false)} />}
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
