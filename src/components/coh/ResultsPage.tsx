import { useState } from "react";
import { Btn } from "./SharedComponents";
import { HOTELS } from "@/data/hotels";
import type { Hotel } from "@/data/hotels";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const BLK = "#0a0a0a";
const SEC = "#888";
const BRD = "#e8e8e8";

/* ── Filter Bar ── */
function FilterBar({ count, sort, onSort }: { count: number; sort: string; onSort: (v: string) => void }) {
  const [active, setActive] = useState(new Set(["⚙ All filters"]));
  const tabs = ["⚙ All filters", "⭐ 4 & 5 Star", "✓ Free Cancel", "💑 Couple Friendly", "💸 Best Deals", "🏊 Pool", "💆 Spa", "⚡ Instant Book"];
  const toggle = (t: string) => setActive(prev => { const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return s; });
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${BRD}`, display: "flex", alignItems: "center", padding: "0 14px", height: 50, gap: 7, flexShrink: 0, overflowX: "auto" }}>
      <span style={{ fontSize: ".82rem", fontWeight: 800, flexShrink: 0 }}>
        <span style={{ background: NAVY, color: "#fff", borderRadius: 6, padding: "2px 7px", fontSize: ".72rem", marginRight: 4 }}>{count}</span>hotels
      </span>
      <div style={{ width: 1, height: 20, background: BRD, flexShrink: 0 }} />
      {tabs.map(t => (
        <button key={t} onClick={() => toggle(t)} style={{ height: 30, padding: "0 11px", borderRadius: 20, border: `1.5px solid ${active.has(t) ? BLK : BRD}`, background: active.has(t) ? BLK : "#fff", color: active.has(t) ? "#fff" : SEC, fontSize: ".68rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all .14s", flexShrink: 0 }}>{t}</button>
      ))}
      <div style={{ marginLeft: "auto", flexShrink: 0 }}>
        <select value={sort} onChange={e => onSort(e.target.value)} style={{ border: `1px solid ${BRD}`, borderRadius: 7, padding: "5px 10px", fontSize: ".74rem", color: BLK, cursor: "pointer", background: "#fff", fontFamily: "inherit", outline: "none" }}>
          <option value="rec">Recommended</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
}

/* ── Filter Sidebar ── */
function FilterSidebar() {
  const [maxPrice, setMaxPrice] = useState(80);
  const [stars, setStars] = useState(new Set(["4★", "5★"]));
  const [amens, setAmens] = useState(new Set(["WiFi", "AC"]));
  const Pill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{ padding: "4px 11px", borderRadius: 20, fontSize: ".68rem", fontWeight: 600, border: `1.5px solid ${active ? NAVY : BRD}`, background: active ? NAVY : "#fff", color: active ? "#fff" : SEC, cursor: "pointer", fontFamily: "inherit", transition: "all .14s" }}>{label}</button>
  );
  return (
    <aside style={{ width: 240, minWidth: 240, borderRight: `1px solid ${BRD}`, overflowY: "auto", background: "#fff", flexShrink: 0 }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontWeight: 700, fontSize: ".82rem" }}>Filters</span>
          <button onClick={() => { setMaxPrice(80); setStars(new Set(["4★", "5★"])); setAmens(new Set(["WiFi", "AC"])); }} style={{ fontSize: ".68rem", color: SEC, background: "none", border: "none", cursor: "pointer" }}>Clear all</button>
        </div>
        <div style={{ marginBottom: "1.2rem" }}>
          <div style={{ fontSize: ".74rem", fontWeight: 700, marginBottom: ".4rem" }}>Price — <span style={{ color: A }}>up to ${maxPrice}/hr</span></div>
          <input type="range" min="5" max="120" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: "100%", accentColor: A }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".62rem", color: SEC, marginTop: 3 }}><span>$5</span><span>$120+</span></div>
        </div>
        <div style={{ marginBottom: "1.2rem" }}>
          <div style={{ fontSize: ".74rem", fontWeight: 700, marginBottom: ".5rem" }}>Hotel Class</div>
          <div style={{ display: "flex", gap: 5 }}>
            {["3★", "4★", "5★"].map(v => <Pill key={v} label={v} active={stars.has(v)} onClick={() => { const s = new Set(stars); s.has(v) ? s.delete(v) : s.add(v); setStars(s); }} />)}
          </div>
        </div>
        <div style={{ marginBottom: "1.2rem" }}>
          <div style={{ fontSize: ".74rem", fontWeight: 700, marginBottom: ".5rem" }}>Neighborhood</div>
          {[["Midtown", 12], ["Chelsea", 5], ["Upper East Side", 4], ["Financial District", 6]].map(([n, c]) => (
            <label key={n as string} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked={n === "Midtown"} style={{ accentColor: A, width: 14, height: 14 }} />
              <span style={{ flex: 1, fontSize: ".74rem" }}>{n}</span>
              <span style={{ fontSize: ".64rem", color: SEC, background: "#f2f2f2", borderRadius: 10, padding: "1px 6px" }}>{c}</span>
            </label>
          ))}
        </div>
        <div>
          <div style={{ fontSize: ".74rem", fontWeight: 700, marginBottom: ".5rem" }}>Amenities</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {["WiFi", "AC", "Pool", "Spa", "Gym", "Bar", "Rooftop"].map(v => <Pill key={v} label={v} active={amens.has(v)} onClick={() => { const s = new Set(amens); s.has(v) ? s.delete(v) : s.add(v); setAmens(s); }} />)}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Hotel Card ── */
function HotelCard({ hotel: h, isActive, onClick }: { hotel: Hotel; isActive: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const [fav, setFav] = useState(false);
  const lit = isActive || hov;
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", background: "#fff", border: `${isActive ? "2px" : "1px"} solid ${isActive ? A : lit ? "#c8c8c8" : BRD}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", marginBottom: 11, minHeight: 180, transform: hov && !isActive ? "translateY(-2px)" : "none", boxShadow: lit ? "0 8px 32px rgba(0,0,0,.1)" : "0 1px 3px rgba(0,0,0,.04)", transition: "all .22s" }}>
      <div style={{ width: 200, minWidth: 200, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: h.photoBg, transform: hov ? "scale(1.07)" : "scale(1)", transition: "transform .5s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,.18) 0%,transparent 40%,rgba(0,0,0,.32) 100%)" }} />
        {h.discount && <div style={{ position: "absolute", top: 10, left: 10, zIndex: 3, background: A, color: "#fff", fontSize: ".55rem", fontWeight: 800, padding: "3px 9px", borderRadius: 20 }}>{h.discount}</div>}
        {h.featured && <div style={{ position: "absolute", top: 10, left: 10, zIndex: 3, background: "#f5a623", color: "#fff", fontSize: ".55rem", fontWeight: 800, padding: "3px 9px", borderRadius: 20 }}>⭐ Top Pick</div>}
        <button onClick={e => { e.stopPropagation(); setFav(!fav); }} style={{ position: "absolute", top: 10, right: 10, zIndex: 3, width: 28, height: 28, background: "rgba(255,255,255,.88)", border: "none", borderRadius: "50%", fontSize: ".88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: fav ? A : "#555" }}>{fav ? "♥" : "♡"}</button>
      </div>
      <div style={{ flex: 1, padding: "13px 15px 11px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #f0f0f0" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
            <span style={{ fontSize: ".62rem", color: "#f5a623" }}>{"★".repeat(h.stars)}</span>
            <span style={{ fontSize: ".64rem", color: SEC, paddingLeft: 5, borderLeft: "1px solid #ddd" }}>{h.stars}-Star Hotel</span>
          </div>
          <div style={{ fontSize: ".98rem", fontWeight: 800, color: BLK, lineHeight: 1.25, marginBottom: 3 }}>{h.name}</div>
          <div style={{ fontSize: ".71rem", color: SEC, marginBottom: 7, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {h.addr}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {h.tags.map(([type, label]) => {
              const tc: Record<string, string> = { g: "#0a7c4e", b: "#1565c0", o: A, y: "#c97800", n: "#555" };
              const bc: Record<string, string> = { g: "#e8f5e9", b: "#e3f2fd", o: "#fff1ec", y: "#fffde7", n: "#f5f5f5" };
              return <span key={label} style={{ fontSize: ".62rem", fontWeight: 600, color: tc[type], background: bc[type], padding: "2px 8px", borderRadius: 20 }}>{label}</span>;
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
          {h.amenities.slice(0, 4).map(a => <span key={a} style={{ fontSize: ".64rem", color: SEC, background: "#f2f2f2", padding: "2px 8px", borderRadius: 20 }}>{a}</span>)}
        </div>
      </div>
      <div style={{ width: 160, flexShrink: 0, padding: "13px 14px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: ".72rem", color: h.avail === "hot" ? A : h.avail === "pop" ? "#c97800" : "#0a7c4e", fontWeight: 600, marginBottom: 4 }}>{h.availTxt}</div>
          <div style={{ fontSize: ".72rem", color: SEC, background: "#f2f2f2", padding: "2px 8px", borderRadius: 20, marginBottom: 6 }}>★ {h.rating}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          {h.origRate && <div style={{ fontSize: ".7rem", color: "#bbb", textDecoration: "line-through", marginBottom: 2 }}>${h.origRate}/hr</div>}
          <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "flex-end" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: BLK, letterSpacing: "-.04em", lineHeight: 1 }}>${h.rate}</span>
            <span style={{ fontSize: ".72rem", color: SEC }}>/hr</span>
          </div>
          <Btn style={{ width: "100%", height: 34, fontSize: ".76rem", marginTop: 6, borderRadius: 8 }}>Book Now →</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── Map Panel ── */
function MapPanel({ hotels, activeIdx, onPin }: { hotels: Hotel[]; activeIdx: number | null; onPin: (i: number) => void }) {
  return (
    <div style={{ flex: 1, background: "#e8edf2", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 45%,rgba(30,80,160,.08) 0%,transparent 70%)" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .12 }} viewBox="0 0 400 600">
        <path d="M120,80 L180,60 L220,70 L240,120 L260,140 L250,200 L200,220 L180,280 L160,320 L140,360 L130,400 L120,380 L100,340 L90,280 L100,200 L110,140 Z" fill="#1a2744" />
        <path d="M240,200 L300,180 L340,200 L350,260 L330,300 L300,320 L270,300 L260,260 Z" fill="#1a2744" />
      </svg>
      {hotels.slice(0, 8).map((h, i) => {
        const px = [52, 36, 18, 86, 55, 37, 69, 96][i];
        const py = [26, 49, 9, 32, 68, 80, 74, 15][i];
        const active = activeIdx === i;
        return (
          <div key={h.id} onClick={() => onPin(i)} style={{ position: "absolute", left: `${px}%`, top: `${py}%`, cursor: "pointer", zIndex: active ? 10 : 5, transform: active ? "scale(1.15)" : "scale(1)", transition: "all .2s" }}>
            <div style={{ background: active ? A : NAVY, color: "#fff", fontSize: ".62rem", fontWeight: 800, padding: "4px 8px", borderRadius: 20, boxShadow: "0 2px 10px rgba(0,0,0,.3)", whiteSpace: "nowrap", border: active ? `2px solid ${A}` : "2px solid transparent" }}>
              ${h.rate}/hr
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(255,255,255,.9)", borderRadius: 10, padding: "8px 12px", fontSize: ".66rem", fontWeight: 600, color: SEC, backdropFilter: "blur(6px)", boxShadow: "0 2px 12px rgba(0,0,0,.1)" }}>
        📍 Manhattan, New York
      </div>
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {["+", "−"].map(c => (
          <div key={c} style={{ width: 28, height: 28, background: "rgba(255,255,255,.9)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,.12)" }}>{c}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Results Page ── */
export default function ResultsPage({ query, onGoHome, onSearch }: { query: string; onGoHome: () => void; onSearch: (q: string) => void }) {
  const [sort, setSort] = useState("rec");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [city, setCity] = useState(query);
  const sorted = [...HOTELS].sort((a, b) => {
    if (sort === "price_asc") return a.rate - b.rate;
    if (sort === "price_desc") return b.rate - a.rate;
    if (sort === "rating") return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <nav style={{ background: NAVY, display: "flex", alignItems: "center", padding: "0 16px", height: 58, gap: 12, flexShrink: 0 }}>
        <div onClick={onGoHome} style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", cursor: "pointer", flexShrink: 0 }}>
          couple<span style={{ color: A }}>.</span>ofhours
        </div>
        <div style={{ flex: 1, maxWidth: 540, display: "flex", background: "rgba(255,255,255,.12)", borderRadius: 8, border: "1px solid rgba(255,255,255,.18)", overflow: "hidden", height: 38 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 12px", gap: 7 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && onSearch(city)} placeholder="Search location..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: ".82rem" }} />
          </div>
          <button onClick={() => onSearch(city)} style={{ background: A, border: "none", color: "#fff", padding: "0 16px", fontWeight: 700, fontSize: ".76rem", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Search
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.4rem", marginLeft: "auto" }}>
          {["Explore", "Deals"].map(l => <a key={l} style={{ fontSize: ".78rem", color: "rgba(255,255,255,.62)", cursor: "pointer" }}>{l}</a>)}
          <Btn variant="ghost" style={{ height: 34, padding: "0 14px", fontSize: ".76rem" }}>Sign In</Btn>
        </div>
      </nav>
      <FilterBar count={sorted.length} sort={sort} onSort={setSort} />
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 360px", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <FilterSidebar />
        <div style={{ overflowY: "auto", padding: "12px 14px", background: "#f2f3f5" }}>
          <div style={{ fontSize: ".78rem", color: SEC, fontWeight: 500, marginBottom: 10 }}>
            <b style={{ color: BLK }}>{sorted.length} hotels</b> near "{query}"
          </div>
          {sorted.map((h, i) => (
            <HotelCard key={h.id} hotel={h} isActive={activeIdx === i} onClick={() => setActiveIdx(activeIdx === i ? null : i)} />
          ))}
        </div>
        <MapPanel hotels={sorted} activeIdx={activeIdx} onPin={i => setActiveIdx(activeIdx === i ? null : i)} />
      </div>
    </div>
  );
}
