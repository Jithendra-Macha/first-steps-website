import { useState, useEffect } from "react";
import { SectionHeader, Btn, useIsMobile, useThemeColors } from "./SharedComponents";
import { DEALS_DATA, ZONE_DATA, OCC_DATA, WHY_CARDS } from "@/data/hotels";
import cohLogo from "@/assets/logo-coh.jpeg";

import manhattanImg from "@/assets/zones/manhattan.jpg";
import brooklynImg from "@/assets/zones/brooklyn.jpg";
import queensImg from "@/assets/zones/queens.jpg";
import bronxImg from "@/assets/zones/bronx.jpg";
import newjerseyImg from "@/assets/zones/newjersey.jpg";

const zoneImages: Record<string, string> = {
  manhattan: manhattanImg,
  brooklyn: brooklynImg,
  queens: queensImg,
  bronx: bronxImg,
  newjersey: newjerseyImg,
};

const A = "#ff4d00";
const NAVY = "#0d1f38";
const BLK = "#0a0a0a";
const SEC = "#888";
const BRD = "#e8e8e8";

/* ── Deal Card ── */
function DealCard({ deal: d, onSearch }: { deal: typeof DEALS_DATA[0]; onSearch: (q: string) => void }) {
  const [hov, setHov] = useState(false);
  const [timer, setTimer] = useState({ h: d.h, m: d.m });
  useEffect(() => { const id = setInterval(() => setTimer(p => p.m > 0 ? { ...p, m: p.m - 1 } : { h: p.h - 1, m: 59 }), 60000); return () => clearInterval(id); }, []);
  return (
    <div onClick={() => onSearch(d.location)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer", minHeight: 240, display: "flex", flexDirection: "column", justifyContent: "flex-end", transform: hov ? "translateY(-5px) scale(1.015)" : "none", boxShadow: hov ? "0 18px 48px rgba(0,0,0,.2)" : "0 2px 8px rgba(0,0,0,.07)", transition: "all .28s cubic-bezier(.25,.46,.45,.94)" }}>
      <div style={{ position: "absolute", inset: 0, background: d.bg, transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .5s ease" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,.08) 0%,transparent 38%,rgba(0,0,0,.74) 100%)" }} />
      <div style={{ position: "absolute", top: 12, left: 12, background: A, color: "#fff", fontSize: ".58rem", fontWeight: 800, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".06em", zIndex: 2 }}>{d.badge}</div>
      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.48)", color: "#fff", fontSize: ".62rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(6px)", zIndex: 2, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: A, display: "inline-block" }} />
        {timer.h}h {String(timer.m).padStart(2, "0")}m left
      </div>
      <div style={{ position: "relative", zIndex: 2, padding: "14px" }}>
        <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.6)", marginBottom: 2 }}>📍 {d.location}</div>
        <div style={{ fontSize: ".92rem", fontWeight: 800, color: "#fff", marginBottom: 7, lineHeight: 1.2 }}>{d.name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: ".66rem", color: "rgba(255,255,255,.5)", textDecoration: "line-through", marginRight: 6 }}>${d.origRate}/hr</span>
            <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", letterSpacing: "-.03em" }}>${d.rate}<span style={{ fontSize: ".68rem", fontWeight: 400, color: "rgba(255,255,255,.65)" }}>/hr</span></span>
          </div>
          <div style={{ background: "rgba(255,255,255,.15)", color: "rgba(255,255,255,.9)", fontSize: ".6rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, backdropFilter: "blur(4px)" }}>⭐ {d.rating} · {d.reviews} reviews</div>
        </div>
      </div>
    </div>
  );
}

export function DealsSection({ onSearch }: { onSearch: (q: string) => void }) {
  const [tab, setTab] = useState("All");
  const mob = useIsMobile();
  const t = useThemeColors();
  const tabs = ["All", "Manhattan", "Brooklyn", "Queens", "The Bronx", "New Jersey"];
  return (
    <section style={{ padding: mob ? "2rem 5%" : "3rem 8%", background: t.bg }}>
      <SectionHeader title="🔥 Deals of the" accent="Day" sub="Limited-time prices — refreshed every 24 hours" link="View all deals →" onLink={() => onSearch("Manhattan")} />
      <div style={{ display: "flex", gap: 8, marginBottom: "1.2rem", flexWrap: "wrap", overflowX: mob ? "auto" : "visible" }}>
        {tabs.map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{ padding: "5px 16px", borderRadius: 20, fontSize: ".74rem", fontWeight: 600, border: `1.5px solid ${tab === tb ? t.text : t.border}`, background: tab === tb ? t.text : t.bgCard, color: tab === tb ? (t.dark ? "#111" : "#fff") : t.textSecondary, cursor: "pointer", fontFamily: "inherit", transition: "all .16s", whiteSpace: "nowrap", flexShrink: 0 }}>{tb}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(4,1fr)", gap: 14 }}>
        {DEALS_DATA.slice(0, mob ? 2 : 4).map(d => <DealCard key={d.id} deal={d} onSearch={onSearch} />)}
      </div>
    </section>
  );
}

/* ── Zone Card ── */
function ZoneCard({ zone: z, onSearch }: { zone: typeof ZONE_DATA[0]; onSearch: (q: string) => void }) {
  const [hov, setHov] = useState(false);
  const img = zoneImages[z.key];
  return (
    <div onClick={() => onSearch(z.name + ", New York")} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 18, overflow: "hidden", cursor: "pointer", position: "relative", height: 220, transform: hov ? "translateY(-6px) scale(1.02)" : "none", boxShadow: hov ? "0 22px 52px rgba(0,0,0,.24)" : "0 2px 8px rgba(0,0,0,.06)", transition: "all .28s cubic-bezier(.25,.46,.45,.94)" }}>
      {img ? (
        <img src={img} alt={z.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.08)" : "scale(1)", transition: "transform .5s ease" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: z.bg, transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .35s ease" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,.04) 0%,transparent 35%,rgba(0,0,0,.58) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px 16px", zIndex: 3 }}>
        <span style={{ fontSize: "1.4rem", display: "block", marginBottom: 4 }}>{z.emoji}</span>
        <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,.4)" }}>{z.name}</div>
        <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.68)", marginTop: 2 }}>{z.count} hotels</div>
      </div>
      <div style={{ position: "absolute", top: 14, right: 14, zIndex: 3, background: "rgba(255,255,255,.18)", color: "#fff", fontSize: ".62rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(6px)", opacity: hov ? 1 : 0, transition: "all .2s" }}>Explore →</div>
    </div>
  );
}

export function ZonesSection({ onSearch }: { onSearch: (q: string) => void }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  return (
    <section style={{ padding: mob ? "2rem 5%" : "3rem 8%", background: t.bgCard }}>
      <SectionHeader title="Browse by" accent="Neighborhood" link="All areas →" onLink={() => onSearch("New York")} />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(5,1fr)", gap: mob ? 10 : 14 }}>
        {ZONE_DATA.slice(0, mob ? 4 : 5).map(z => <ZoneCard key={z.key} zone={z} onSearch={onSearch} />)}
      </div>
    </section>
  );
}

/* ── Why Section ── */
export function WhySection() {
  const [hrs, setHrs] = useState(4);
  const mob = useIsMobile();
  const t = useThemeColors();
  const RATE = 28, total = hrs * RATE, saving = 280 - total, pct = ((hrs - 2) / 10) * 78 + 12;
  return (
    <section style={{ padding: mob ? "3rem 5%" : "4.5rem 8% 4rem", background: t.bgCard }}>
      <div style={{ textAlign: "center", marginBottom: mob ? "2rem" : "3rem" }}>
        <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: A, marginBottom: ".8rem" }}>The smarter way to stay</div>
        <h2 style={{ fontSize: "clamp(1.9rem,3.8vw,2.8rem)", fontWeight: 900, color: t.navy, letterSpacing: "-.04em", lineHeight: 1.1, marginBottom: ".9rem" }}>Pay for hours,<br />not the whole night</h2>
        <p style={{ fontSize: ".96rem", color: t.textSecondary, maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>A full hotel night costs $280+ in New York. With CoupleOfHours, you only pay for the time you actually use.</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: mob ? 14 : 28, marginBottom: mob ? "2rem" : "3.5rem", flexWrap: "wrap", flexDirection: mob ? "column" : "row" }}>
        <div style={{ background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 18, padding: "24px 26px", width: mob ? "100%" : 268 }}>
          <div style={{ fontSize: ".68rem", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Traditional hotel night</div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-.05em", color: "#c0392b", textDecoration: "line-through", opacity: .65, lineHeight: 1, marginBottom: 6 }}>$280<span style={{ fontSize: ".78rem", fontWeight: 400, color: t.textMuted, textDecoration: "none" }}>/night</span></div>
          <div style={{ fontSize: ".74rem", color: t.textSecondary, marginBottom: 12 }}>Paying for 14+ hours you don't use</div>
          <div style={{ background: t.border, borderRadius: 6, height: 7 }}><div style={{ height: "100%", borderRadius: 6, background: "#c0392b", width: "20%" }} /></div>
          <div style={{ fontSize: ".64rem", color: t.textMuted, marginTop: 5 }}>14 hours unused 😔</div>
        </div>
        {!mob && <div style={{ fontSize: ".76rem", fontWeight: 800, color: t.textMuted, letterSpacing: ".12em" }}>VS</div>}
        <div style={{ background: t.bgCard, border: `2px solid ${A}`, borderRadius: 18, padding: "28px 26px", width: mob ? "100%" : 268, position: "relative", boxShadow: `0 8px 36px rgba(255,77,0,.14)` }}>
          <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: A, color: "#fff", fontSize: ".6rem", fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: ".06em", whiteSpace: "nowrap" }}>✨ Smarter</div>
          <div style={{ fontSize: ".68rem", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>CoupleOfHours</div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-.05em", color: t.navy, lineHeight: 1, marginBottom: 6 }}>${total}<span style={{ fontSize: ".78rem", fontWeight: 400, color: t.textMuted }}>/stay</span></div>
          <div style={{ fontSize: ".74rem", color: t.textSecondary, marginBottom: 12 }}>Only pay for the hours you need</div>
          <div style={{ background: t.border, borderRadius: 6, height: 7, marginBottom: 5 }}><div style={{ height: "100%", borderRadius: 6, background: A, width: `${pct}%`, transition: "width .4s ease" }} /></div>
          <div style={{ fontSize: ".64rem", color: t.textMuted, marginBottom: 10 }}>{hrs}h · {hrs <= 3 ? "quick visit" : hrs <= 6 ? "perfect stay" : "extended stay"}</div>
          {saving > 0 && <div style={{ background: t.dark ? "#0a2e1a" : "#e8f8f0", color: "#0a7c4e", fontSize: ".72rem", fontWeight: 700, padding: "6px 12px", borderRadius: 8, marginBottom: 14, textAlign: "center" }}>Save ${saving} vs a full night</div>}
          <div style={{ fontSize: ".65rem", color: t.textMuted, marginBottom: 5 }}>Adjust hours:</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: ".64rem", color: t.textMuted, fontWeight: 600 }}>2h</span>
            <input type="range" min="2" max="12" value={hrs} onChange={e => setHrs(+e.target.value)} style={{ flex: 1, accentColor: A }} />
            <span style={{ fontSize: ".64rem", color: t.textMuted, fontWeight: 600 }}>12h</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", gap: mob ? 10 : 16 }}>
        {WHY_CARDS.map((v, i) => (
          <WhyCard key={i} card={v} />
        ))}
      </div>
    </section>
  );
}

function WhyCard({ card: v }: { card: typeof WHY_CARDS[0] }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: t.bgCard, border: `1.5px solid ${hov ? t.border : (t.dark ? t.border : "#f0f0f0")}`, borderRadius: 16, padding: "22px 20px", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? `0 8px 28px ${t.shadow}` : "none", transition: "all .2s" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: v.ibg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: "1.4rem" }}>{v.icon}</div>
      <div style={{ fontSize: ".95rem", fontWeight: 800, color: t.navy, marginBottom: 6, lineHeight: 1.3 }}>{v.title}</div>
      <div style={{ fontSize: ".77rem", color: t.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{v.desc}</div>
      <div style={{ fontSize: ".74rem", color: t.textSecondary, paddingTop: 10, borderTop: `1px solid ${t.dark ? t.border : "#f0f0f0"}` }}>{v.stat}</div>
    </div>
  );
}

/* ── Airports ── */
export function AirportsSection({ onSearch }: { onSearch: (q: string) => void }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  const airports = [
    { code: "JFK", name: "John F. Kennedy International", sub: "Jamaica, Queens, New York", hotels: 22, from: "$12/hr", drive: "5 min drive" },
    { code: "LGA", name: "LaGuardia Airport", sub: "East Elmhurst, Queens", hotels: 18, from: "$14/hr", drive: "3 min drive" },
    { code: "EWR", name: "Newark Liberty International", sub: "Newark, New Jersey", hotels: 15, from: "$10/hr", drive: "4 min drive" },
  ];
  return (
    <section style={{ padding: mob ? "2rem 5%" : "3rem 8%", background: t.bg }}>
      <SectionHeader title="Hotels Near" accent="Airports" link="All airport hotels →" onLink={() => onSearch("Near Airport")} />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)", gap: 14 }}>
        {airports.map(a => (
          <AirportCard key={a.code} airport={a} onSearch={onSearch} />
        ))}
      </div>
    </section>
  );
}

function AirportCard({ airport: a, onSearch }: { airport: { code: string; name: string; sub: string; hotels: number; from: string; drive: string }; onSearch: (q: string) => void }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  return (
    <div onClick={() => onSearch(`Near ${a.code}`)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: t.bgCard, border: `1.5px solid ${hov ? t.border : t.border}`, borderRadius: 16, padding: "1.4rem 1.6rem", cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? `0 8px 28px ${t.shadow}` : "none", transition: "all .2s", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "radial-gradient(circle at top right,rgba(255,77,0,.07),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ fontSize: "2.1rem", fontWeight: 900, color: A, letterSpacing: "-.04em", lineHeight: 1, marginBottom: ".4rem" }}>{a.code}</div>
      <div style={{ fontSize: ".9rem", fontWeight: 700, color: t.text, marginBottom: ".2rem" }}>{a.name}</div>
      <div style={{ fontSize: ".72rem", color: t.textSecondary, marginBottom: ".9rem" }}>{a.sub}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {[`${a.hotels} hotels`, a.from, a.drive].map((p, i) => (
          <span key={p} style={{ fontSize: ".64rem", fontWeight: 600, background: i === 0 ? (t.dark ? "#2a1a10" : "#fff2ee") : (t.dark ? "#1a3a5c" : "#f2f2f2"), color: i === 0 ? A : t.textSecondary, padding: "3px 9px", borderRadius: 20 }}>{p}</span>
        ))}
      </div>
    </div>
  );
}

/* ── NJ Section ── */
export function NJSection({ onSearch }: { onSearch: (q: string) => void }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  const areas = [
    { area: "Hoboken", sub: "NJ · NYC Skyline Views", hotels: 11, from: "$15/hr", bg: "linear-gradient(135deg,#0a1e35,#0f2d50)" },
    { area: "Jersey City", sub: "NJ · Near PATH Train", hotels: 14, from: "$13/hr", bg: "linear-gradient(135deg,#0d2210,#123018)" },
    { area: "Newark", sub: "NJ · Near EWR Airport", hotels: 9, from: "$10/hr", bg: "linear-gradient(135deg,#160820,#2e1060)" },
  ];
  return (
    <section style={{ padding: mob ? "2rem 5%" : "3rem 8%", background: t.bgCard }}>
      <SectionHeader title="Hotels in" accent="New Jersey" link="All NJ hotels →" onLink={() => onSearch("New Jersey")} />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)", gap: 14 }}>
        {areas.map(a => (
          <NJCard key={a.area} area={a} onSearch={onSearch} />
        ))}
      </div>
    </section>
  );
}

function NJCard({ area: a, onSearch }: { area: { area: string; sub: string; hotels: number; from: string; bg: string }; onSearch: (q: string) => void }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  return (
    <div onClick={() => onSearch(a.area + ", NJ")} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 16, overflow: "hidden", border: `1.5px solid ${t.border}`, cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? `0 8px 28px ${t.shadow}` : "none", transition: "all .2s" }}>
      <div style={{ height: 120, background: a.bg }} />
      <div style={{ padding: "1rem 1.1rem .9rem", background: t.bgCard }}>
        <div style={{ fontSize: "1rem", fontWeight: 800, color: t.text, marginBottom: ".2rem" }}>{a.area}</div>
        <div style={{ fontSize: ".7rem", color: t.textSecondary, marginBottom: ".7rem" }}>{a.sub}</div>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
          <span style={{ fontSize: ".7rem", fontWeight: 700, background: t.dark ? "#1a3a5c" : "#f2f2f2", color: t.text, padding: "2px 9px", borderRadius: 20 }}>{a.hotels} hotels</span>
          <span style={{ fontSize: ".7rem", fontWeight: 700, color: A }}>From {a.from}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Occasions ── */
export function OccasionsSection({ onSearch }: { onSearch: (q: string) => void }) {
  const [tab, setTab] = useState("💑 All");
  const mob = useIsMobile();
  const t = useThemeColors();
  const tabs = ["💑 All", "💑 Couples", "✈️ Layover", "💼 Business", "🎂 Celebration"];
  return (
    <section style={{ padding: mob ? "2rem 5%" : "3rem 8%", background: t.bg }}>
      <SectionHeader title="Perfect for Every" accent="Occasion" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.4rem" }}>
        {tabs.map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: ".74rem", fontWeight: 600, border: `1.5px solid ${tab === tb ? t.text : t.border}`, background: tab === tb ? t.text : t.bgCard, color: tab === tb ? (t.dark ? "#0d1f38" : "#fff") : t.textSecondary, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", flexShrink: 0 }}>{tb}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", gap: mob ? 10 : 14 }}>
        {OCC_DATA.map(o => (
          <OccasionCard key={o.label} occ={o} onSearch={onSearch} />
        ))}
      </div>
    </section>
  );
}

function OccasionCard({ occ: o, onSearch }: { occ: typeof OCC_DATA[0]; onSearch: (q: string) => void }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  return (
    <div onClick={() => onSearch("Manhattan")} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: t.bgCard, border: `1.5px solid ${hov ? t.border : (t.dark ? t.border : BRD)}`, borderRadius: 16, padding: "1.4rem 1.2rem", display: "flex", flexDirection: "column", gap: ".5rem", cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? `0 8px 24px ${t.shadow}` : "none", transition: "all .2s" }}>
      <span style={{ fontSize: "1.9rem", lineHeight: 1 }}>{o.emoji}</span>
      <div style={{ fontSize: ".9rem", fontWeight: 800, color: t.text, lineHeight: 1.2 }}>{o.label}</div>
      <div style={{ fontSize: ".72rem", color: t.textSecondary, lineHeight: 1.55 }}>{o.desc}</div>
    </div>
  );
}

/* ── How It Works ── */
export function HowItWorks() {
  const mob = useIsMobile();
  const t = useThemeColors();
  const steps = [
    { n: "01", icon: "🔍", title: "Search", desc: "Enter a neighborhood in NY or NJ, pick a date and check-in time." },
    { n: "02", icon: "⏱️", title: "Choose Hours", desc: "Select 2, 3, 4, 6, 8 or 12 hours. Pay only for the time you use." },
    { n: "03", icon: "✅", title: "Instant Booking", desc: "Confirm your room in seconds. No credit card hold on arrival." },
    { n: "04", icon: "🏨", title: "Check In & Enjoy", desc: "Walk in, check in, use all hotel amenities. Leave when done." },
  ];
  return (
    <section style={{ padding: mob ? "2rem 5%" : "3rem 8%", background: t.bgCard }}>
      <SectionHeader title="How it" accent="works" />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden" }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ padding: mob ? "1.2rem" : "1.8rem 1.6rem", borderRight: mob ? (i % 2 === 0 ? `1px solid ${t.border}` : "none") : (i < 3 ? `1px solid ${t.border}` : "none"), borderBottom: mob && i < 2 ? `1px solid ${t.border}` : "none" }}>
            <div style={{ fontSize: ".7rem", fontWeight: 800, color: A, letterSpacing: ".1em", marginBottom: ".7rem" }}>{s.n}</div>
            <div style={{ fontSize: "1.8rem", marginBottom: ".6rem" }}>{s.icon}</div>
            <div style={{ fontSize: ".96rem", fontWeight: 800, color: t.text, marginBottom: ".4rem" }}>{s.title}</div>
            <div style={{ fontSize: ".76rem", color: t.textSecondary, lineHeight: 1.65 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Stats ── */
export function Stats() {
  const mob = useIsMobile();
  const t = useThemeColors();
  return (
    <div style={{ background: t.bgCard, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: mob ? "1rem" : 0, alignItems: "center", justifyContent: "center", padding: mob ? "1.6rem 5%" : "2.4rem 8%", textAlign: "center" }}>
      {[["150+", "Partner Hotels"], ["NY + NJ", "Currently Available"], ["40K+", "Bookings Completed"], ["4.8★", "Average Guest Rating"]].map(([n, l]) => (
        <div key={n} style={{ textAlign: "center" }}>
          <div style={{ fontSize: mob ? "1.5rem" : "2rem", fontWeight: 900, color: t.text, letterSpacing: "-.04em", lineHeight: 1 }}>{n}</div>
          <div style={{ fontSize: ".72rem", color: t.textSecondary, fontWeight: 500, marginTop: ".3rem" }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Footer ── */
export function Footer() {
  const mob = useIsMobile();
  const cols = [
    { title: "Explore NY", links: ["Manhattan Hotels", "Brooklyn Hotels", "Queens Hotels", "The Bronx Hotels", "Staten Island"] },
    { title: "Airports & NJ", links: ["Hotels Near JFK", "Hotels Near LGA", "Hotels Near EWR", "Jersey City Hotels", "Hoboken Hotels"] },
    { title: "Company", links: ["About Us", "List Your Hotel", "Privacy Policy", "Terms of Service", "Contact Us"] },
  ];
  return (
    <footer style={{ background: BLK, color: "rgba(255,255,255,.6)", padding: mob ? "2rem 5% 1.5rem" : "3.5rem 8% 2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1.6fr 1fr 1fr 1fr", gap: mob ? "1.5rem" : "2.5rem", marginBottom: mob ? "1.5rem" : "2.5rem" }}>
        <div>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", marginBottom: ".6rem" }}>coupleofhours<span style={{ color: A }}>.com</span></div>
          <p style={{ fontSize: ".76rem", lineHeight: 1.68, maxWidth: 240, marginBottom: "1rem" }}>Hourly hotel bookings across New York & New Jersey. Flexible, private, instant — pay only for the time you need.</p>
          <div style={{ display: "flex", gap: 6 }}>
            {["🔒 SSL Secured", "🇺🇸 New York · NJ"].map(b => (
              <span key={b} style={{ fontSize: ".62rem", background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.65)", padding: "3px 10px", borderRadius: 4, border: "1px solid rgba(255,255,255,.1)" }}>{b}</span>
            ))}
          </div>
        </div>
        {(mob ? cols.slice(0, 2) : cols).map(col => (
          <div key={col.title}>
            <div style={{ fontSize: ".7rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: ".9rem" }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {col.links.map(l => (
                <a key={l} style={{ fontSize: ".76rem", color: "rgba(255,255,255,.52)", cursor: "pointer", transition: "color .15s" }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,.9)"} onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,.52)"}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "1.4rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: ".72rem", color: "rgba(255,255,255,.3)", flexWrap: "wrap", gap: 8 }}>
        <span>© 2025 CoupleOfHours.com — All rights reserved.</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy Policy", "Terms", "Cookies"].map(l => (
            <a key={l} style={{ cursor: "pointer" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
