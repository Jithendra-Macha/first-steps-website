import { useState, useEffect, useRef, useMemo } from "react";
import { searchLocations, getTypeIcon, getStateDisplay, type USLocation } from "@/data/usLocations";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay } from "date-fns";
import cohLogo from "@/assets/logo-coh.jpeg";

/* ── Color tokens ── */
const A = "#ff4d00";
const NAVY = "#0d1f38";
const BLK = "#0a0a0a";
const SEC = "#888";
const BRD = "#e8e8e8";

/* ── Theme-aware colors hook ── */
export function useThemeColors() {
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return {
    dark,
    bg: dark ? "#0d0d0d" : "#fafafa",
    bgPage: dark ? "#080808" : "#f8f8f8",
    bgCard: dark ? "#161616" : "#fff",
    bgInput: dark ? "#1e1e1e" : "#fff",
    text: dark ? "#e8e8e8" : "#0a0a0a",
    textSecondary: dark ? "#999" : "#888",
    textMuted: dark ? "#666" : "#bbb",
    border: dark ? "#2a2a2a" : "#e8e8e8",
    navy: dark ? "#e8e8e8" : "#0d1f38",
    navBg: dark ? "rgba(13,13,13,.97)" : "rgba(255,255,255,.97)",
    navBgSolid: dark ? "#0d0d0d" : "#fff",
    cardHover: dark ? "#1e1e1e" : "#f8f8f8",
    shadow: dark ? "rgba(0,0,0,.4)" : "rgba(0,0,0,.07)",
    dropdownBg: dark ? "#161616" : "#fff",
    accent: A,
  };
}

/* ── Mobile hook ── */
export function useIsMobile(bp = 768) {
  const [m, setM] = useState(window.innerWidth < bp);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

/* ── Shared Button ── */
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "ghost" | "outline";
}

export function Btn({ children, variant = "accent", style = {}, ...rest }: BtnProps) {
  const t = useThemeColors();
  const base: React.CSSProperties = {
    border: "none", borderRadius: 10, fontFamily: "inherit", cursor: "pointer",
    fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "all .15s",
  };
  const vars: Record<string, React.CSSProperties> = {
    accent: { background: A, color: "#fff" },
    ghost: { background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.9)", border: "1px solid rgba(255,255,255,.2)" },
    outline: { background: "transparent", color: t.text, border: `1.5px solid ${t.border}` },
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
  const t = useThemeColors();
  return (
    <div style={{ marginBottom: "1.6rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div>
        <h2 style={{ fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 900, color: t.navy, letterSpacing: "-.04em", lineHeight: 1.1 }}>
          {title} <span style={{ color: A }}>{accent}</span>
        </h2>
        {sub && <p style={{ fontSize: ".82rem", color: t.textSecondary, marginTop: ".4rem" }}>{sub}</p>}
      </div>
      {link && <a onClick={onLink} style={{ fontSize: ".78rem", fontWeight: 700, color: A, cursor: "pointer", flexShrink: 0 }}>{link}</a>}
    </div>
  );
}

/* ── Nav ── */
export function Nav({ onSearch, onAuthClick, onProfileClick, onReservationsClick, onListPropertyClick, user, onSignOut }: {
  onSearch: (q: string) => void;
  onAuthClick?: () => void;
  onProfileClick?: () => void;
  onReservationsClick?: () => void;
  onListPropertyClick?: () => void;
  user?: any;
  onSignOut?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mob = useIsMobile();
  const t = useThemeColors();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const h = () => setUserMenuOpen(false);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [userMenuOpen]);

  const userDropdown = (
    <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: t.dropdownBg, borderRadius: 16, boxShadow: `0 12px 40px ${t.shadow}`, border: `1px solid ${t.border}`, minWidth: 200, zIndex: 400, overflow: "hidden" }}>
      {user ? (
        <>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: ".8rem", fontWeight: 700, color: t.navy }}>{user.email}</div>
          </div>
          <button onClick={onProfileClick} style={{ width: "100%", background: "none", border: "none", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: ".82rem", color: t.text, textAlign: "left" }}
            onMouseEnter={e => (e.currentTarget.style.background = t.cardHover)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: "1rem" }}>👤</span> My Profile
          </button>
          <button onClick={onReservationsClick} style={{ width: "100%", background: "none", border: "none", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: ".82rem", color: t.text, textAlign: "left" }}
            onMouseEnter={e => (e.currentTarget.style.background = t.cardHover)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: "1rem" }}>📋</span> My Reservations
          </button>
          <div style={{ borderTop: `1px solid ${t.border}` }}>
            <button onClick={onSignOut} style={{ width: "100%", background: "none", border: "none", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: ".82rem", color: "#e53935", textAlign: "left" }}
              onMouseEnter={e => (e.currentTarget.style.background = t.dark ? "#2a1515" : "#fff5f5")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontSize: "1rem" }}>🚪</span> Sign Out
            </button>
          </div>
        </>
      ) : (
        <>
          <button onClick={onAuthClick} style={{ width: "100%", background: "none", border: "none", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: ".82rem", color: t.text, textAlign: "left" }}
            onMouseEnter={e => (e.currentTarget.style.background = t.cardHover)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: "1rem" }}>👤</span> Log in
          </button>
          <button onClick={onReservationsClick} style={{ width: "100%", background: "none", border: "none", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: ".82rem", color: t.text, textAlign: "left" }}
            onMouseEnter={e => (e.currentTarget.style.background = t.cardHover)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: "1rem" }}>📋</span> My reservations
          </button>
        </>
      )}
    </div>
  );

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 200, background: scrolled ? t.navBg : t.navBgSolid, backdropFilter: "blur(14px)", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: mob ? "0 4%" : "0 5%", height: mob ? 52 : 62, boxShadow: scrolled ? `0 2px 20px ${t.shadow}` : "none", transition: "box-shadow .25s" }}>
      <div style={{ fontSize: mob ? "1rem" : "1.15rem", fontWeight: 900, letterSpacing: "-.02em", cursor: "pointer", color: t.text }}>coupleofhours<span style={{ color: A }}>.com</span></div>
      {mob ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggleBtn />
            <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ background: t.dark ? "#1e1e1e" : "#f0f0f0", border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: t.text }}>
                {user ? (user.email?.[0] || "U").toUpperCase() : "👤"}
              </button>
              {userMenuOpen && userDropdown}
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: 6, color: t.text }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
          {menuOpen && (
            <div style={{ position: "absolute", top: 52, left: 0, right: 0, background: t.navBgSolid, borderBottom: `1px solid ${t.border}`, padding: "12px 4%", display: "flex", flexDirection: "column", gap: 12, boxShadow: `0 8px 24px ${t.shadow}`, zIndex: 300 }}>
              {[{ label: "Explore Hotels", action: undefined }, { label: "List Your Property", action: onListPropertyClick }, { label: "Help", action: undefined }].map(l => (
                <a key={l.label} onClick={l.action} style={{ fontSize: ".82rem", fontWeight: 500, color: t.textSecondary, cursor: "pointer", padding: "6px 0" }}>{l.label}</a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {[{ label: "Explore Hotels", action: undefined }, { label: "List Your Property", action: onListPropertyClick }, { label: "Help", action: undefined }].map(l => (
            <a key={l.label} onClick={l.action} style={{ fontSize: ".8rem", fontWeight: 500, color: t.textSecondary, cursor: "pointer", transition: "color .15s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = t.text} onMouseLeave={e => (e.target as HTMLElement).style.color = t.textSecondary}>{l.label}</a>
          ))}
          <ThemeToggleBtn />
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ background: t.dark ? "#1e1e1e" : "#f0f0f0", border: `1.5px solid ${t.border}`, height: 40, borderRadius: 24, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "0 12px 0 6px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: user ? A : (t.dark ? "#666" : "#ccc"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 700, color: "#fff" }}>
                {user ? (user.email?.[0] || "U").toUpperCase() : "👤"}
              </div>
              <span style={{ fontSize: "1rem", color: t.text }}>☰</span>
            </button>
            {userMenuOpen && userDropdown}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Theme Toggle Button ── */
function ThemeToggleBtn() {
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("coh-theme", next ? "dark" : "light");
  };
  return (
    <button onClick={toggle} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", padding: 4 }} title={dark ? "Light mode" : "Dark mode"}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

/* ── SVG Location Icons ── */
function LocationIcon({ type, color }: { type: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    borough: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-4h6v4" /><path d="M9 10h1" /><path d="M14 10h1" /><path d="M9 14h1" /><path d="M14 14h1" />
      </svg>
    ),
    city: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
      </svg>
    ),
    neighborhood: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V11l4-4 4 4v10" /><path d="M15 21V7l4-4v18" /><path d="M9 21v-3h-2v3" />
      </svg>
    ),
    county: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    village: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M4 21V10l8-7 8 7v11" /><path d="M10 21v-5h4v5" />
      </svg>
    ),
    region: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  };
  return <>{icons[type] || icons.county}</>;
}

/* ── Mapbox Geocoding ── */
const MAPBOX_TOKEN = "pk.eyJ1Ijoiaml0aGVuZHJhbWFjaGEiLCJhIjoiY21sc2E5YTNvMDN6ZDNjcHpoZnR3M20ydSJ9.EXkOsQuxBxKS_BUo0xLPLQ";

interface GeocodedPlace {
  id: string;
  name: string;
  fullAddress: string;
  lat: number;
  lng: number;
  type: string; // "address", "poi", "place", "neighborhood", etc.
}

function useGeocodeSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<GeocodedPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `access_token=${MAPBOX_TOKEN}&country=us&types=address,poi,place,neighborhood&limit=5&autocomplete=true`
        );
        const data = await res.json();
        const places: GeocodedPlace[] = (data.features || []).map((f: any) => ({
          id: f.id,
          name: f.text,
          fullAddress: f.place_name,
          lat: f.center[1],
          lng: f.center[0],
          type: f.place_type?.[0] || "place",
        }));
        setSuggestions(places);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  return { suggestions, loading };
}

/* ── Location Dropdown ── */
function LocationDropdown({ value, onChange, onSelect }: { value: string; onChange: (v: string) => void; onSelect: (loc: USLocation) => void }) {
  const [open, setOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchLocations(value), [value]);
  const { suggestions: geoSuggestions, loading: geoLoading } = useGeocodeSuggestions(value);
  const mob = useIsMobile();
  const t = useThemeColors();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, USLocation[]>();
    results.forEach(loc => {
      const arr = map.get(loc.state) || [];
      arr.push(loc);
      map.set(loc.state, arr);
    });
    return map;
  }, [results]);

  const hasContent = results.length > 0 || geoSuggestions.length > 0 || (value.trim().length > 3);

  // Featured location cards with gradient themes & metadata
  const featuredData: Record<string, { gradient: string; hotels: number; from: number; emoji: string; tag?: string }> = {
    "Manhattan": { gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)", hotels: 48, from: 39, emoji: "🏙️", tag: "MOST BOOKED" },
    "Brooklyn": { gradient: "linear-gradient(135deg, #2d1b69, #11998e)", hotels: 32, from: 29, emoji: "🌉", tag: "TRENDING" },
    "Queens": { gradient: "linear-gradient(135deg, #c94b4b, #4b134f)", hotels: 18, from: 25, emoji: "✈️" },
    "The Bronx": { gradient: "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)", hotels: 12, from: 22, emoji: "🏟️" },
    "Staten Island": { gradient: "linear-gradient(135deg, #134e5e, #71b280)", hotels: 8, from: 19, emoji: "⛴️" },
    "Jersey City": { gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", hotels: 22, from: 27, emoji: "🌃", tag: "NEW" },
    "Hoboken": { gradient: "linear-gradient(135deg, #373b44, #4286f4)", hotels: 14, from: 24, emoji: "🚂" },
    "Newark": { gradient: "linear-gradient(135deg, #1f1c2c, #928dab)", hotels: 16, from: 21, emoji: "🛫" },
  };

  const isSearching = value.trim().length > 0;

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={e => {
          if (e.key === "Enter" && value.trim()) setOpen(false);
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Where are you going?"
        style={{ border: "none", outline: "none", fontSize: "1rem", color: t.dark ? "#eee" : "#111", width: "100%", background: "transparent", fontFamily: "'Nunito Sans', system-ui, sans-serif" }}
      />
      {open && hasContent && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998 }} onClick={() => setOpen(false)} />
      )}
      {open && hasContent && (
        <div style={{
          position: mob ? "fixed" : "absolute",
          top: mob ? "auto" : "calc(100% + 8px)",
          bottom: mob ? 0 : "auto",
          left: mob ? 0 : -24,
          right: mob ? 0 : "auto",
          width: mob ? "100%" : 340,
          background: t.dark ? "#151515" : "#fff",
          borderRadius: mob ? "16px 16px 0 0" : 12,
          boxShadow: t.dark
            ? "0 8px 32px rgba(0,0,0,.5)"
            : "0 8px 32px rgba(0,0,0,.1)",
          zIndex: 9999,
          maxHeight: mob ? "55vh" : 320,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          fontFamily: "'Nunito Sans', system-ui, sans-serif",
        }}>
          <style>{`
            .loc-row { transition: background .12s; cursor: pointer; }
            .loc-row:hover { background: ${t.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.03)'} !important; }
          `}</style>

          {mob && <div style={{ width: 32, height: 3, borderRadius: 2, background: t.dark ? "#333" : "#ddd", margin: "6px auto 0", flexShrink: 0 }} />}

          <div style={{ overflowY: "auto", flex: 1 }}>
            {/* Default: simple list */}
            {!isSearching && (
              <div style={{ padding: "6px 0" }}>
                {["Manhattan", "Brooklyn", "Queens", "Jersey City", "Hoboken", "The Bronx", "Staten Island", "Newark"].map(name => {
                  const fd = featuredData[name];
                  if (!fd) return null;
                  return (
                    <div
                      key={name} className="loc-row"
                      onClick={() => {
                        const loc = results.find(r => r.name === name);
                        if (loc) { onChange(`${name}, ${loc.state}`); onSelect(loc); setOpen(false); }
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", justifyContent: "flex-start" }}
                    >
                      <span style={{ fontSize: "1rem", width: 24, textAlign: "center", flexShrink: 0 }}>{fd.emoji}</span>
                      <span style={{ fontSize: ".92rem", fontWeight: 600, color: t.text, flex: 1, textAlign: "left" }}>{name}</span>
                      {fd.tag && (
                        <span style={{
                          fontSize: ".46rem", fontWeight: 800, color: "#fff",
                          background: fd.tag === "TRENDING" ? "#8b5cf6" : fd.tag === "NEW" ? "#10b981" : A,
                          padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: ".03em",
                        }}>{fd.tag}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Search: geocoded addresses */}
            {isSearching && value.trim().length >= 3 && (geoSuggestions.length > 0 || geoLoading) && (
              <div style={{ padding: "6px 0" }}>
                {geoLoading && (
                  <div style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: A, animation: "locPulse .8s infinite" }} />
                    <span style={{ fontSize: ".6rem", color: t.dark ? "#555" : "#aaa" }}>Searching...</span>
                  </div>
                )}
                {geoSuggestions.map(place => (
                  <div key={place.id} className="loc-row" onClick={() => { onChange(place.fullAddress); setOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.dark ? "#555" : "#bbb"} strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".75rem", color: t.text }}>{place.name}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Search: predefined matches */}
            {isSearching && Array.from(grouped.entries()).map(([state, locs]) => {
              const stateInfo = getStateDisplay(state);
              return (
                <div key={state}>
                  <div style={{ padding: "6px 14px 3px", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: ".65rem" }}>{stateInfo.icon}</span>
                    <span style={{ fontSize: ".52rem", fontWeight: 800, color: t.dark ? "#444" : "#bbb", textTransform: "uppercase", letterSpacing: ".1em" }}>{stateInfo.name}</span>
                    <div style={{ flex: 1, height: 1, background: t.dark ? "#222" : "#f0f0f0" }} />
                  </div>
                  {locs.map(loc => {
                    const fd = featuredData[loc.name];
                    return (
                      <div key={`${loc.name}-${loc.state}`} className="loc-row"
                        onClick={() => { onChange(`${loc.name}, ${loc.state}`); onSelect(loc); setOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px" }}>
                        <span style={{ fontSize: ".85rem", width: 22, textAlign: "center" }}>{fd?.emoji || "📍"}</span>
                        <span style={{ flex: 1, fontSize: ".78rem", fontWeight: 600, color: t.text }}>{loc.name}</span>
                        {fd && <span style={{ fontSize: ".6rem", fontWeight: 700, color: "#4ade80" }}>${fd.from}/hr</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Empty */}
            {results.length === 0 && geoSuggestions.length === 0 && value.trim().length >= 3 && !geoLoading && (
              <div style={{ padding: "20px 14px", textAlign: "center" }}>
                <div style={{ fontSize: ".8rem", color: t.dark ? "#555" : "#999" }}>No destinations found</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Single-Date Calendar ── */
function HeroCalendar({ selected, onSelect, onClose }: { selected: Date | null; onSelect: (d: Date) => void; onClose: () => void }) {
  const [baseMonth, setBaseMonth] = useState(() => selected ? startOfMonth(selected) : startOfMonth(new Date()));
  const today = startOfDay(new Date());
  const mob = useIsMobile();
  const t = useThemeColors();

  const getDayColor = (day: Date) => {
    const dow = day.getDay();
    if (dow === 5 || dow === 6 || dow === 0) return { bg: "#ffe4a0", color: "#8a6d00" };
    return { bg: "#b8f0c8", color: "#1a6e30" };
  };

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: mob ? "fixed" : "absolute",
      top: mob ? "auto" : "calc(100% + 8px)",
      bottom: mob ? 0 : "auto",
      left: mob ? 0 : "auto",
      right: mob ? 0 : 0,
    background: t.bgCard, borderRadius: mob ? "20px 20px 0 0" : 16,
    boxShadow: `0 16px 50px ${t.shadow}`, border: `1px solid ${t.border}`,
    padding: "20px 24px 16px", zIndex: 9999,
    width: mob ? "100%" : 320,
    }}>
      {mob && <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd", margin: "0 auto 12px" }} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setBaseMonth(m => subMonths(m, 1)); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "4px 8px", borderRadius: 6 }}>‹</button>
        <span style={{ fontSize: ".95rem", fontWeight: 700, color: NAVY }}>{format(baseMonth, "MMMM yyyy")}</span>
        <button onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setBaseMonth(m => addMonths(m, 1)); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "4px 8px", borderRadius: 6 }}>›</button>
      </div>

      <div>
        {(() => {
          const mStart = startOfMonth(baseMonth);
          const mEnd = endOfMonth(baseMonth);
          const calStart = startOfWeek(mStart);
          const calEnd = endOfWeek(mEnd);
          const days = eachDayOfInterval({ start: calStart, end: calEnd });
          return (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, di) => (
                  <div key={di} style={{ textAlign: "center", fontSize: ".7rem", fontWeight: 700, color: "#999", padding: "4px 0" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {days.map((day, di) => {
                  const inMonth = isSameMonth(day, baseMonth);
                  const isPast = isBefore(day, today);
                  const isSelected = selected && isSameDay(day, selected);
                  const isToday = isSameDay(day, today);
                  const { bg, color: textColor } = getDayColor(day);
                  if (!inMonth) return <div key={di} />;
                  return (
                    <button key={di} disabled={isPast} onClick={() => { onSelect(day); onClose(); }}
                      style={{
                        width: "100%", aspectRatio: "1",
                        border: isSelected ? `2px solid ${NAVY}` : "none", borderRadius: 8,
                        background: isSelected ? NAVY : isPast ? "#f5f5f5" : bg,
                        color: isSelected ? "#fff" : isPast ? "#ccc" : textColor,
                        fontSize: ".82rem", fontWeight: isToday || isSelected ? 800 : 600,
                        cursor: isPast ? "default" : "pointer", transition: "transform .1s", position: "relative",
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

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BRD}`, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "#b8f0c8", display: "inline-block" }} />
          <span style={{ fontSize: ".7rem", fontWeight: 600, color: "#1a6e30" }}>Cheaper</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "#ffe4a0", display: "inline-block" }} />
          <span style={{ fontSize: ".7rem", fontWeight: 600, color: "#8a6d00" }}>Average</span>
        </div>
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
  const mob = useIsMobile();

  return (
    <div style={{ background: "radial-gradient(ellipse at 65% -10%,#1a2a42 0%,#0d1f38 50%,#081526 100%)", padding: mob ? "3rem 5% 3.5rem" : "5rem 8% 6rem", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .04, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
      <div style={{ position: "absolute", top: "-60px", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,77,0,.06)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "15%", width: 300, height: 300, borderRadius: "50%", background: "rgba(30,80,180,.12)", filter: "blur(60px)", pointerEvents: "none" }} />

      <h1 style={{ fontSize: "clamp(1.6rem,5.5vw,3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-.04em", marginBottom: "1.1rem", position: "relative" }}>
        Find hourly hotel rooms{!mob && <br />}
        {mob ? " " : ""}<span style={{ background: "linear-gradient(90deg,#ff7340,#ff4d00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>across New York & New Jersey</span>
      </h1>
      <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: "clamp(.85rem,2.2vw,1.2rem)", color: "rgba(255,255,255,.72)", marginBottom: mob ? "1.6rem" : "2.4rem", lineHeight: 1.7, position: "relative" }}>
        Pay only for the hours you need — perfect for layovers, day stays,{!mob && <br />}business meetings & couple escapes.
      </p>

      {/* search bar */}
      <div style={{ maxWidth: 860, margin: "0 auto 1.4rem", position: "relative", zIndex: 100 }}>
        <div style={{
          background: "#fff", borderRadius: 14,
          display: "flex",
          flexDirection: mob ? "column" : "row",
          alignItems: mob ? "stretch" : "center",
          boxShadow: "0 12px 48px rgba(0,0,0,.28)",
          height: mob ? "auto" : 58,
          position: "relative",
        }}>
          {/* Location */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: mob ? "10px 16px" : "0 18px", gap: 10, height: mob ? "auto" : "100%", minWidth: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#999", letterSpacing: ".08em", lineHeight: 1, marginBottom: 3, textTransform: "uppercase" }}>LOCATION</div>
              <LocationDropdown value={city} onChange={setCity} onSelect={(loc) => setCity(`${loc.name}, ${loc.state}`)} />
            </div>
          </div>

          {mob ? <div style={{ height: 1, background: BRD }} /> : <div style={{ width: 1, alignSelf: "stretch", background: BRD, flexShrink: 0 }} />}

          {/* Date + Duration */}
          <div style={{ display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "stretch" : "center", height: mob ? "auto" : "100%" }}>
            <div onClick={() => setCalOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 9, padding: mob ? "10px 16px" : "0 18px", minWidth: mob ? 0 : 170, cursor: "pointer", height: mob ? "auto" : "100%", flexShrink: 0, background: calOpen ? "#f9f9f9" : "transparent", position: "relative" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={date ? A : "#bbb"} strokeWidth="2" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <div>
                <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#999", letterSpacing: ".08em", lineHeight: 1, marginBottom: 3, textTransform: "uppercase" }}>CHECK-IN</div>
                <div style={{ fontSize: ".84rem", fontWeight: date ? 700 : 400, color: date ? "#111" : "#999", lineHeight: 1 }}>{fmtDate(date)}</div>
              </div>
              {calOpen && <HeroCalendar selected={date} onSelect={setDate} onClose={() => setCalOpen(false)} />}
            </div>

            {mob ? <div style={{ height: 1, background: BRD }} /> : <div style={{ width: 1, alignSelf: "stretch", background: BRD, flexShrink: 0 }} />}

            <div style={{ position: "relative", flexShrink: 0 }}>
              <div onClick={() => setHoursOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 9, padding: mob ? "10px 16px" : "0 16px", minWidth: mob ? 0 : 130, cursor: "pointer", height: mob ? "auto" : 58, background: hoursOpen ? "#f9f9f9" : "transparent" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <div>
                  <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#999", letterSpacing: ".08em", lineHeight: 1, marginBottom: 3, textTransform: "uppercase" }}>DURATION</div>
                  <div style={{ fontSize: ".84rem", fontWeight: 700, color: "#111", lineHeight: 1 }}>{hours} Hours</div>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
              {hoursOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: mob ? 0 : "auto", minWidth: mob ? "auto" : 160, background: "#fff", borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.14)", border: `1px solid ${BRD}`, overflow: "hidden", zIndex: 9999 }}>
                  {HOUR_OPTIONS.map(opt => (
                    <div key={opt} onClick={() => { setHours(opt); setHoursOpen(false); }} style={{ padding: "10px 16px", fontSize: ".84rem", fontWeight: hours === opt ? 700 : 400, color: hours === opt ? A : "#333", background: hours === opt ? "#fff8f5" : "#fff", cursor: "pointer" }}>{opt} Hours</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={() => onSearch(city || "Manhattan")} style={{
            background: A, color: "#fff", border: "none",
            height: mob ? 48 : "100%",
            padding: mob ? "0" : "0 30px",
            fontSize: ".9rem", fontWeight: 700, fontFamily: "inherit", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            borderRadius: mob ? "0 0 14px 14px" : "0 14px 14px 0",
            transition: "background .15s",
          }} onMouseEnter={e => e.currentTarget.style.background = "#e03d00"} onMouseLeave={e => e.currentTarget.style.background = A}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Search
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", fontWeight: 500 }}>Popular:</span>
        {pills.slice(0, mob ? 3 : 5).map(p => (
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
  const mob = useIsMobile();
  const t = useThemeColors();
  const items = [
    { icon: "✅", text: "Instant Confirmation" },
    { icon: "💳", text: "No Credit Card Hold" },
    { icon: "🛡️", text: "Free Cancellation" },
    { icon: "🏨", text: "Payment at the Hotel" },
  ];
  return (
    <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: mob ? "flex-start" : "center", gap: mob ? "1.2rem" : "2.5rem", padding: mob ? ".85rem 5%" : "1.1rem 8%", flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      {items.map(ti => (
        <div key={ti.text} style={{ display: "flex", alignItems: "center", gap: ".5rem", whiteSpace: "nowrap", flexShrink: 0, background: "hsl(var(--secondary))", padding: ".45rem .9rem", borderRadius: "2rem" }}>
          <span style={{ fontSize: mob ? "1.05rem" : "1.25rem" }}>{ti.icon}</span>
          <span style={{ fontSize: mob ? ".85rem" : "1rem", fontWeight: 800, color: "hsl(var(--foreground))", letterSpacing: "-.01em" }}>{ti.text}</span>
        </div>
      ))}
    </div>
  );
}
