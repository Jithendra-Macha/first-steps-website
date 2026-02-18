import { useState, useEffect, useRef } from "react";
import { Btn } from "./SharedComponents";
import { HOTELS } from "@/data/hotels";
import type { Hotel } from "@/data/hotels";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const BLK = "#0a0a0a";
const SEC = "#888";
const BRD = "#e8e8e8";

/* ── Time Slots ── */
const TIME_SLOTS = ["6am–12pm", "11am–5pm", "1pm–7pm", "5pm–11pm"];

/* ── Sticky Filter Bar (unique pill design with count badges) ── */
function FilterBar({ count }: { count: number }) {
  const [active, setActive] = useState<Set<string>>(new Set());
  const chips = [
    { icon: "⚙️", label: "Filters", special: true },
    { icon: "🕐", label: "Check-in time" },
    { icon: "⏱️", label: "Duration" },
    { icon: "🔥", label: "Deals only" },
    { icon: "⭐", label: "4★ & above" },
    { icon: "🏊", label: "Pool" },
    { icon: "💆", label: "Spa" },
    { icon: "🛏️", label: "Suite" },
  ];
  const toggle = (l: string) => setActive(prev => {
    const s = new Set(prev);
    s.has(l) ? s.delete(l) : s.add(l);
    return s;
  });

  return (
    <div style={{
      background: "linear-gradient(to right, #fff, #fefcfb)",
      borderBottom: `1px solid ${BRD}`,
      display: "flex",
      alignItems: "center",
      padding: "8px 24px",
      gap: 7,
      overflowX: "auto",
      flexShrink: 0,
    }}>
      {chips.map(c => {
        const isActive = active.has(c.label);
        return (
          <button
            key={c.label}
            onClick={() => toggle(c.label)}
            style={{
              height: 34,
              padding: c.special ? "0 16px" : "0 13px",
              borderRadius: c.special ? 10 : 20,
              border: c.special
                ? "none"
                : `1.5px solid ${isActive ? A : "#e4e4e4"}`,
              background: c.special
                ? (isActive ? NAVY : NAVY)
                : (isActive ? "#fff5f0" : "#fff"),
              color: c.special
                ? "#fff"
                : (isActive ? A : "#666"),
              fontSize: ".74rem",
              fontWeight: c.special ? 700 : 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              transition: "all .18s",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 5,
              boxShadow: c.special ? "0 2px 8px rgba(13,31,56,.2)" : "none",
            }}
          >
            <span style={{ fontSize: ".78rem" }}>{c.icon}</span>
            {c.label}
            {c.special && active.size > 0 && (
              <span style={{
                background: A, color: "#fff",
                fontSize: ".6rem", fontWeight: 800,
                width: 18, height: 18, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginLeft: 2,
              }}>{active.size}</span>
            )}
          </button>
        );
      })}
      <div style={{ marginLeft: "auto", fontSize: ".72rem", color: SEC, flexShrink: 0, fontWeight: 500 }}>
        <span style={{ fontWeight: 800, color: A }}>{count}</span> hotels found
      </div>
    </div>
  );
}

/* ── Hotel Card (vertical stacked design — unique) ── */
function HotelCard({ hotel: h, isActive, onClick, index }: { hotel: Hotel; isActive: boolean; onClick: () => void; index: number }) {
  const [hov, setHov] = useState(false);
  const [fav, setFav] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const lit = isActive || hov;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        marginBottom: 12,
        transition: "all .25s cubic-bezier(.4,0,.2,1)",
        boxShadow: lit
          ? "0 8px 30px rgba(255,77,0,.1), 0 2px 8px rgba(0,0,0,.06)"
          : "0 1px 3px rgba(0,0,0,.04)",
        border: isActive ? `2px solid ${A}` : `1px solid ${lit ? "#e0e0e0" : "#f0f0f0"}`,
        transform: lit ? "translateY(-2px)" : "none",
      }}
    >
      {/* Top section: Image + Info side by side */}
      <div style={{ display: "flex" }}>
        {/* Image with overlay content */}
        <div style={{ width: 200, minWidth: 200, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: h.photoBg,
            transform: hov ? "scale(1.08)" : "scale(1)",
            transition: "transform .6s cubic-bezier(.4,0,.2,1)",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, transparent 40%, rgba(0,0,0,.5) 100%)" }} />

          {/* Stars on image */}
          <div style={{ position: "absolute", top: 10, left: 10, zIndex: 3, display: "flex", gap: 1 }}>
            {Array.from({ length: h.stars }).map((_, i) => (
              <span key={i} style={{ fontSize: ".55rem", color: "#ffd700", textShadow: "0 1px 3px rgba(0,0,0,.5)" }}>★</span>
            ))}
          </div>

          {/* Fav */}
          <button
            onClick={e => { e.stopPropagation(); setFav(!fav); }}
            style={{
              position: "absolute", top: 8, right: 8, zIndex: 3,
              width: 28, height: 28,
              background: fav ? A : "rgba(255,255,255,.85)",
              border: "none", borderRadius: "50%",
              fontSize: ".8rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: fav ? "#fff" : "#bbb",
              backdropFilter: "blur(4px)",
              transition: "all .2s",
            }}
          >
            {fav ? "♥" : "♡"}
          </button>

          {/* Availability badge on image */}
          {h.avail !== "yes" && (
            <div style={{
              position: "absolute", bottom: 8, left: 8, zIndex: 3,
              background: h.avail === "hot" ? "rgba(255,77,0,.9)" : "rgba(255,200,0,.9)",
              color: h.avail === "hot" ? "#fff" : "#333",
              fontSize: ".58rem", fontWeight: 800,
              padding: "3px 8px", borderRadius: 6,
              backdropFilter: "blur(4px)",
            }}>
              {h.availTxt}
            </div>
          )}

          {/* Image dots */}
          <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 4, zIndex: 3 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: i === 0 ? 14 : 5, height: 5, borderRadius: 10,
                background: i === 0 ? "#fff" : "rgba(255,255,255,.4)",
              }} />
            ))}
          </div>
        </div>

        {/* Info section */}
        <div style={{ flex: 1, padding: "14px 16px 10px", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: ".9rem", fontWeight: 800, color: NAVY, margin: 0, lineHeight: 1.2, letterSpacing: "-.02em" }}>{h.name}</h3>
              <p style={{ fontSize: ".7rem", color: SEC, margin: "3px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={SEC} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {h.addr}
              </p>
            </div>

            {/* Price block */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {h.discount && (
                <span style={{
                  background: "linear-gradient(135deg, #ff6b35, #ff4d00)",
                  color: "#fff", fontSize: ".58rem", fontWeight: 800,
                  padding: "2px 7px", borderRadius: 5,
                  display: "inline-block", marginBottom: 4,
                }}>
                  {h.discount}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, justifyContent: "flex-end" }}>
                {h.origRate && (
                  <span style={{ fontSize: ".68rem", color: "#ccc", textDecoration: "line-through" }}>${h.origRate}</span>
                )}
                <span style={{ fontSize: "1.4rem", fontWeight: 900, color: NAVY, letterSpacing: "-.03em", lineHeight: 1 }}>
                  ${h.rate}
                </span>
              </div>
              <div style={{ fontSize: ".6rem", color: SEC, marginTop: 1 }}>per hour</div>
            </div>
          </div>

          {/* Rating + Tags row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <div style={{
              background: h.rating >= 4.8 ? "linear-gradient(135deg, #0a7c4e, #0d9060)" : "linear-gradient(135deg, #1565c0, #1e88e5)",
              color: "#fff", fontSize: ".68rem", fontWeight: 800,
              padding: "3px 8px", borderRadius: 6, lineHeight: 1,
              display: "flex", alignItems: "center", gap: 3,
            }}>
              {h.rating}
              <span style={{ fontSize: ".56rem", fontWeight: 500, opacity: .8 }}>/ 5</span>
            </div>
            <span style={{ fontSize: ".68rem", color: SEC }}>
              {h.reviews.toLocaleString()} reviews
            </span>
            <div style={{ width: 1, height: 12, background: BRD, margin: "0 2px" }} />
            {h.tags.slice(0, 2).map(([type, label]) => {
              const s: Record<string, { color: string; bg: string }> = {
                g: { color: "#0a7c4e", bg: "#edf7f0" },
                b: { color: "#1565c0", bg: "#eef4fd" },
                o: { color: A, bg: "#fff3ee" },
                n: { color: "#6d4c00", bg: "#fff8e1" },
                y: { color: "#7b1fa2", bg: "#f3e5f5" },
              };
              const st = s[type] || { color: "#666", bg: "#f5f5f5" };
              return (
                <span key={label} style={{ fontSize: ".6rem", fontWeight: 600, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 4 }}>
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar: time slots + book CTA */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px",
        background: lit ? "#fefaf8" : "#fafafa",
        borderTop: `1px solid ${lit ? "#fde8dc" : "#f3f3f3"}`,
        transition: "all .2s",
      }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span style={{ fontSize: ".66rem", color: SEC, marginRight: 4 }}>Slots:</span>
          {TIME_SLOTS.map((slot, i) => (
            <button
              key={slot}
              onClick={e => { e.stopPropagation(); setSelectedSlot(i); }}
              style={{
                padding: "4px 11px",
                borderRadius: 6,
                border: selectedSlot === i ? `1.5px solid ${A}` : `1px solid #e8e8e8`,
                background: selectedSlot === i ? A : "#fff",
                color: selectedSlot === i ? "#fff" : "#777",
                fontSize: ".64rem",
                fontWeight: selectedSlot === i ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .15s",
              }}
            >
              {slot}
            </button>
          ))}
        </div>
        <Btn style={{
          height: 30, padding: "0 18px", fontSize: ".7rem",
          borderRadius: 8, background: NAVY, color: "#fff",
          letterSpacing: ".02em",
        }}>
          Book now →
        </Btn>
      </div>
    </div>
  );
}

/* ── Interactive Mapbox Panel ── */
const MAPBOX_TOKEN = "pk.eyJ1Ijoiaml0aGVuZHJhbWFjaGEiLCJhIjoiY21sc2E5YTNvMDN6ZDNjcHpoZnR3M20ydSJ9.EXkOsQuxBxKS_BUo0xLPLQ";

function MapPanel({ hotels, activeIdx, onPin }: { hotels: Hotel[]; activeIdx: number | null; onPin: (i: number) => void }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.985, 40.748],
      zoom: 12.5,
      pitchWithRotate: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    hotels.forEach((h, i) => {
      const el = document.createElement("div");
      el.className = "mapbox-hotel-pin";
      el.innerHTML = `
        <div class="pin-bubble" data-idx="${i}">
          <span class="pin-rate">$${h.rate}</span>
          <span class="pin-unit">/hr</span>
        </div>
        <div class="pin-tail"></div>
      `;
      el.style.cssText = "cursor:pointer;z-index:1;display:flex;flex-direction:column;align-items:center;";

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([h.lng, h.lat])
        .addTo(map.current!);

      el.addEventListener("click", () => onPin(i));

      el.addEventListener("mouseenter", () => {
        popupRef.current?.remove();
        popupRef.current = new mapboxgl.Popup({ offset: 30, closeButton: false, closeOnClick: false, maxWidth: "240px" })
          .setLngLat([h.lng, h.lat])
          .setHTML(`
            <div style="font-family:system-ui;padding:6px 2px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <div style="width:40px;height:40px;border-radius:8px;background:${h.photoBg};flex-shrink:0;"></div>
                <div>
                  <div style="font-weight:800;font-size:.8rem;color:${NAVY};line-height:1.2;">${h.name}</div>
                  <div style="font-size:.65rem;color:#999;">${h.addr}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:5px;">
                  <span style="background:${h.rating >= 4.7 ? "#0a7c4e" : "#1565c0"};color:#fff;font-size:.64rem;font-weight:800;padding:2px 6px;border-radius:4px;">${h.rating}</span>
                  <span style="color:#f5a623;font-size:.6rem;">${"★".repeat(h.stars)}</span>
                </div>
                <div style="text-align:right;">
                  ${h.origRate ? `<span style="font-size:.65rem;color:#ccc;text-decoration:line-through;">$${h.origRate}</span> ` : ""}
                  <span style="font-size:1rem;font-weight:900;color:${NAVY};">$${h.rate}</span>
                  <span style="font-size:.6rem;color:#999;">/hr</span>
                </div>
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      el.addEventListener("mouseleave", () => {
        popupRef.current?.remove();
      });

      markersRef.current.push(marker);
    });
  }, [hotels, onPin]);

  useEffect(() => {
    markersRef.current.forEach((marker, i) => {
      const el = marker.getElement();
      const pin = el.querySelector(".pin-bubble") as HTMLElement;
      if (!pin) return;
      const isActive = activeIdx === i;
      pin.style.background = isActive ? "linear-gradient(135deg, #ff6b35, #ff4d00)" : "#fff";
      pin.style.color = isActive ? "#fff" : NAVY;
      pin.style.borderColor = isActive ? A : "#e0e0e0";
      pin.style.boxShadow = isActive
        ? "0 6px 20px rgba(255,77,0,.4)"
        : "0 3px 12px rgba(0,0,0,.15)";
      pin.style.transform = isActive ? "scale(1.15)" : "scale(1)";
      el.style.zIndex = isActive ? "10" : "1";

      const tail = el.querySelector(".pin-tail") as HTMLElement;
      if (tail) {
        tail.style.borderTopColor = isActive ? A : "#fff";
      }
    });

    if (activeIdx !== null && hotels[activeIdx] && map.current) {
      map.current.flyTo({
        center: [hotels[activeIdx].lng, hotels[activeIdx].lat],
        zoom: 14,
        duration: 800,
      });
    }
  }, [activeIdx, hotels]);

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Map overlay badge */}
      <div style={{
        position: "absolute", bottom: 16, left: 16,
        background: "rgba(13,31,56,.88)", backdropFilter: "blur(10px)",
        color: "#fff", padding: "8px 14px", borderRadius: 10,
        fontSize: ".7rem", fontWeight: 600,
        display: "flex", alignItems: "center", gap: 6,
        boxShadow: "0 4px 16px rgba(0,0,0,.2)",
      }}>
        <span style={{ fontSize: ".85rem" }}>🗽</span>
        {hotels.length} hotels on map
      </div>

      <style>{`
        .pin-bubble {
          background: #fff;
          color: ${NAVY};
          font-size: .74rem;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: 10px;
          border: 1.5px solid #e0e0e0;
          box-shadow: 0 3px 12px rgba(0,0,0,.15);
          white-space: nowrap;
          transition: all .25s cubic-bezier(.4,0,.2,1);
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: baseline;
          gap: 1px;
        }
        .pin-rate { font-weight: 900; }
        .pin-unit { font-size: .55rem; font-weight: 500; opacity: .6; }
        .pin-tail {
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #fff;
          transition: border-top-color .25s;
        }
        .pin-bubble:hover {
          background: linear-gradient(135deg, #ff6b35, #ff4d00) !important;
          color: #fff !important;
          border-color: ${A} !important;
          transform: scale(1.15) !important;
          box-shadow: 0 6px 20px rgba(255,77,0,.4) !important;
        }
        .mapbox-hotel-pin:hover .pin-tail {
          border-top-color: ${A} !important;
        }
        .mapbox-hotel-pin:hover .pin-unit {
          opacity: 1 !important;
        }
        .mapboxgl-popup-content {
          border-radius: 14px !important;
          padding: 12px 14px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,.18) !important;
          border: 1px solid #f0f0f0 !important;
        }
        .mapboxgl-popup-tip {
          border-top-color: #fff !important;
        }
        .mapboxgl-ctrl-group {
          border-radius: 10px !important;
          box-shadow: 0 2px 12px rgba(0,0,0,.1) !important;
          border: none !important;
          overflow: hidden;
        }
        .mapboxgl-ctrl-group button {
          width: 34px !important;
          height: 34px !important;
        }
      `}</style>
    </div>
  );
}

/* ── Results Page ── */
export default function ResultsPage({ query, onGoHome, onSearch }: { query: string; onGoHome: () => void; onSearch: (q: string) => void }) {
  const [sort, setSort] = useState("rec");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [city, setCity] = useState(query);
  const [view, setView] = useState<"split" | "list" | "map">("split");

  const sorted = [...HOTELS].sort((a, b) => {
    if (sort === "price_asc") return a.rate - b.rate;
    if (sort === "price_desc") return b.rate - a.rate;
    if (sort === "rating") return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#f5f6f8" }}>
      {/* Nav — dark navy branded bar */}
      <nav style={{
        background: NAVY,
        display: "flex", alignItems: "center",
        padding: "0 24px", height: 54,
        gap: 16, flexShrink: 0,
      }}>
        <div onClick={onGoHome} style={{ fontSize: "1.05rem", fontWeight: 900, cursor: "pointer", flexShrink: 0, letterSpacing: "-.02em", color: "#fff" }}>
          couple<span style={{ color: A }}>.</span>ofhours
        </div>

        {/* Search bar — frosted glass on dark */}
        <div style={{
          flex: 1, maxWidth: 540,
          display: "flex", alignItems: "center",
          background: "rgba(255,255,255,.12)",
          borderRadius: 12,
          height: 38, overflow: "hidden",
          border: "1px solid rgba(255,255,255,.15)",
          marginLeft: 20,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 14px", gap: 8, flex: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch(city)}
              placeholder="Search city, neighborhood..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: ".82rem", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.15)" }} />
          <div style={{ padding: "0 14px", fontSize: ".76rem", color: "rgba(255,255,255,.55)", display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            📅 Today
          </div>
          <button
            onClick={() => onSearch(city)}
            style={{
              background: A, border: "none", color: "#fff",
              padding: "0 18px", height: "100%",
              fontWeight: 700, fontSize: ".78rem",
              cursor: "pointer", fontFamily: "inherit",
              borderRadius: "0 12px 12px 0",
              display: "flex", alignItems: "center", gap: 5,
              transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#e04400"}
            onMouseLeave={e => e.currentTarget.style.background = A}
          >
            Search
          </button>
        </div>

        {/* View toggles */}
        <div style={{ display: "flex", gap: 2, marginLeft: 12, background: "rgba(255,255,255,.1)", borderRadius: 8, padding: 2 }}>
          {([["split", "⬒"], ["list", "☰"], ["map", "🗺"]] as const).map(([v, ico]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                width: 32, height: 30,
                borderRadius: 6, border: "none",
                background: view === v ? "rgba(255,255,255,.2)" : "transparent",
                color: view === v ? "#fff" : "rgba(255,255,255,.4)",
                fontSize: ".85rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
              }}
            >
              {ico}
            </button>
          ))}
        </div>

        {/* Right nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.4rem", marginLeft: "auto" }}>
          {["Help", "List Property"].map(l => (
            <a key={l} style={{ fontSize: ".76rem", color: "rgba(255,255,255,.55)", cursor: "pointer", fontWeight: 500, transition: "color .15s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "#fff"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,.55)"}
            >{l}</a>
          ))}
          <Btn variant="ghost" style={{ height: 32, padding: "0 14px", fontSize: ".74rem", borderRadius: 8 }}>Sign In</Btn>
        </div>
      </nav>

      {/* Filter bar */}
      <FilterBar count={sorted.length} />

      {/* Results header strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px",
        background: "#fff",
        borderBottom: `1px solid #f0f0f0`,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: ".8rem", color: SEC }}>
          Hourly hotels in <span style={{ fontWeight: 800, color: NAVY }}>{query}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: ".7rem", color: SEC }}>Sort:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              border: `1px solid ${BRD}`, background: "#fff",
              fontSize: ".74rem", fontWeight: 700, color: NAVY,
              cursor: "pointer", fontFamily: "inherit", outline: "none",
              padding: "4px 8px", borderRadius: 6,
            }}
          >
            <option value="rec">Recommended</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Results list */}
        {view !== "map" && (
          <div style={{
            flex: view === "list" ? 1 : "0 0 52%",
            maxWidth: view === "list" ? "100%" : "52%",
            overflowY: "auto",
            padding: "14px 20px",
          }}>
            {sorted.map((h, i) => (
              <HotelCard
                key={h.id}
                hotel={h}
                isActive={activeIdx === i}
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Map */}
        {view !== "list" && (
          <MapPanel
            hotels={sorted}
            activeIdx={activeIdx}
            onPin={i => setActiveIdx(activeIdx === i ? null : i)}
          />
        )}
      </div>
    </div>
  );
}
