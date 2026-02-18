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

/* ── Filter Chips Bar ── */
function FilterChips() {
  const [active, setActive] = useState<Set<string>>(new Set());
  const chips = [
    { icon: "⚙", label: "All filters", special: true },
    { icon: "⏰", label: "Time of arrival" },
    { icon: "⏱", label: "Duration" },
    { icon: "👨‍👩‍👧", label: "Family room" },
    { icon: "🏆", label: "Best Rated" },
    { icon: "💸", label: "Best Deals" },
    { icon: "⭐", label: "4 & 5 Star" },
    { icon: "🛏", label: "King Size Bed" },
    { icon: "🏊", label: "Pool" },
    { icon: "💆", label: "Spa" },
  ];
  const toggle = (l: string) => setActive(prev => {
    const s = new Set(prev);
    s.has(l) ? s.delete(l) : s.add(l);
    return s;
  });

  return (
    <div style={{
      background: "#fff",
      borderBottom: `1px solid ${BRD}`,
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      gap: 8,
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
              height: 36,
              padding: "0 14px",
              borderRadius: 20,
              border: c.special
                ? `1.5px solid ${BLK}`
                : `1.5px solid ${isActive ? A : BRD}`,
              background: isActive ? (c.special ? BLK : "#fff5f0") : "#fff",
              color: isActive ? (c.special ? "#fff" : A) : "#555",
              fontSize: ".76rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              transition: "all .15s",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ fontSize: ".82rem" }}>{c.icon}</span>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Hotel Card (new design with time slots) ── */
function HotelCard({ hotel: h, isActive, onClick }: { hotel: Hotel; isActive: boolean; onClick: () => void }) {
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
        border: `${isActive ? "2px" : "1px"} solid ${isActive ? A : lit ? "#ddd" : BRD}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        marginBottom: 14,
        display: "flex",
        transition: "all .2s",
        boxShadow: lit ? "0 4px 20px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.03)",
      }}
    >
      {/* Image */}
      <div style={{ width: 220, minWidth: 220, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: h.photoBg,
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition: "transform .5s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.1) 0%, transparent 50%, rgba(0,0,0,.35) 100%)" }} />

        {/* Image dots (fake carousel) */}
        <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 3 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: i === 0 ? 16 : 6, height: 6, borderRadius: 10, background: i === 0 ? "#fff" : "rgba(255,255,255,.5)", transition: "all .2s" }} />
          ))}
        </div>

        {/* Brand badge */}
        {h.stars >= 5 && (
          <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 3, background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)", color: "#fff", fontSize: ".58rem", fontWeight: 700, padding: "3px 8px", borderRadius: 4, letterSpacing: ".03em" }}>
            ★ Premium
          </div>
        )}

        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); setFav(!fav); }}
          style={{
            position: "absolute", top: 10, right: 10, zIndex: 3,
            width: 30, height: 30,
            background: "rgba(255,255,255,.9)",
            border: "none", borderRadius: "50%",
            fontSize: ".9rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: fav ? A : "#999",
            boxShadow: "0 2px 8px rgba(0,0,0,.12)",
          }}
        >
          {fav ? "♥" : "♡"}
        </button>
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: "14px 18px", display: "flex", flexDirection: "column" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: ".88rem", fontWeight: 800, color: BLK }}>{h.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: ".64rem", color: "#f5a623" }}>{"★".repeat(h.stars)}</span>
            <span style={{ fontSize: ".7rem", color: SEC }}>{h.addr}</span>
          </div>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              background: h.rating >= 4.7 ? "#0a7c4e" : "#1565c0",
              color: "#fff", fontSize: ".72rem", fontWeight: 800,
              padding: "3px 8px", borderRadius: 6, lineHeight: 1,
            }}>
              {h.rating}
            </div>
            <span style={{ fontSize: ".72rem", color: SEC }}>
              {h.rating >= 4.8 ? "Excellent" : h.rating >= 4.5 ? "Very good" : "Good"} ({h.reviews.toLocaleString()})
            </span>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            {h.tags.slice(0, 2).map(([type, label]) => {
              const styles: Record<string, { color: string; bg: string }> = {
                g: { color: "#0a7c4e", bg: "#e8f5e9" },
                b: { color: "#1565c0", bg: "#e3f2fd" },
                o: { color: A, bg: "#fff1ec" },
              };
              const s = styles[type] || { color: "#555", bg: "#f5f5f5" };
              return (
                <span key={label} style={{ fontSize: ".64rem", fontWeight: 600, color: s.color, background: s.bg, padding: "3px 9px", borderRadius: 4 }}>
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div style={{ marginTop: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          {TIME_SLOTS.slice(0, 3).map((slot, i) => (
            <button
              key={slot}
              onClick={e => { e.stopPropagation(); setSelectedSlot(i); }}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: `1.5px solid ${selectedSlot === i ? A : BRD}`,
                background: selectedSlot === i ? "#fff5f0" : "#fff",
                color: selectedSlot === i ? A : "#555",
                fontSize: ".66rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .15s",
              }}
            >
              {slot}
            </button>
          ))}
          <button style={{
            width: 26, height: 26, borderRadius: "50%",
            border: `1.5px solid ${BRD}`, background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: ".7rem", color: SEC,
          }}>
            ›
          </button>
        </div>
      </div>

      {/* Price column */}
      <div style={{
        width: 150, minWidth: 150, flexShrink: 0,
        padding: "14px 16px",
        display: "flex", flexDirection: "column",
        alignItems: "flex-end", justifyContent: "space-between",
        borderLeft: `1px solid #f0f0f0`,
      }}>
        <div style={{ textAlign: "right" }}>
          {h.discount && (
            <span style={{
              background: A, color: "#fff",
              fontSize: ".62rem", fontWeight: 800,
              padding: "2px 7px", borderRadius: 4,
              display: "inline-block", marginBottom: 6,
            }}>
              {h.discount}
            </span>
          )}
          {h.origRate && (
            <div style={{ fontSize: ".72rem", color: "#bbb", textDecoration: "line-through" }}>
              US${h.origRate}/hr
            </div>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, justifyContent: "flex-end" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, color: BLK, letterSpacing: "-.03em", lineHeight: 1.1 }}>
              US${h.rate}
            </span>
          </div>
          <div style={{ fontSize: ".66rem", color: SEC, marginTop: 2 }}>per hour</div>
        </div>

        <Btn style={{
          width: "100%", height: 34, fontSize: ".74rem",
          borderRadius: 8, marginTop: 8,
        }}>
          View Deal
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

  // Initialize map
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

  // Update markers when hotels change
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    hotels.forEach((h, i) => {
      const el = document.createElement("div");
      el.className = "mapbox-hotel-pin";
      el.innerHTML = `<div class="pin-price" data-idx="${i}">$${h.rate}</div>`;
      el.style.cssText = "cursor:pointer;z-index:1;";

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([h.lng, h.lat])
        .addTo(map.current!);

      el.addEventListener("click", () => onPin(i));

      el.addEventListener("mouseenter", () => {
        popupRef.current?.remove();
        popupRef.current = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false, maxWidth: "220px" })
          .setLngLat([h.lng, h.lat])
          .setHTML(`
            <div style="font-family:system-ui;padding:4px 0;">
              <div style="font-weight:800;font-size:.82rem;color:#0a0a0a;margin-bottom:3px;">${h.name}</div>
              <div style="font-size:.7rem;color:#888;margin-bottom:6px;">${h.addr}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <span style="background:${h.rating >= 4.7 ? "#0a7c4e" : "#1565c0"};color:#fff;font-size:.68rem;font-weight:800;padding:2px 6px;border-radius:4px;">${h.rating}</span>
                <span style="font-size:.68rem;color:#888;">(${h.reviews.toLocaleString()} reviews)</span>
              </div>
              <div style="display:flex;align-items:baseline;gap:4px;">
                ${h.origRate ? `<span style="font-size:.7rem;color:#bbb;text-decoration:line-through;">$${h.origRate}/hr</span>` : ""}
                <span style="font-size:1.1rem;font-weight:900;color:#0a0a0a;">$${h.rate}</span>
                <span style="font-size:.68rem;color:#888;">/hr</span>
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

  // Highlight active pin
  useEffect(() => {
    markersRef.current.forEach((marker, i) => {
      const el = marker.getElement();
      const pin = el.querySelector(".pin-price") as HTMLElement;
      if (!pin) return;
      const isActive = activeIdx === i;
      pin.style.background = isActive ? "#ff4d00" : "#fff";
      pin.style.color = isActive ? "#fff" : "#0a0a0a";
      pin.style.border = isActive ? "2px solid #ff4d00" : "1.5px solid #ddd";
      pin.style.boxShadow = isActive ? "0 4px 14px rgba(255,77,0,.35)" : "0 2px 10px rgba(0,0,0,.18)";
      pin.style.transform = isActive ? "scale(1.2)" : "scale(1)";
      el.style.zIndex = isActive ? "10" : "1";
    });

    // Fly to active hotel
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
      <style>{`
        .pin-price {
          background: #fff;
          color: #0a0a0a;
          font-size: .72rem;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: 8px;
          border: 1.5px solid #ddd;
          box-shadow: 0 2px 10px rgba(0,0,0,.18);
          white-space: nowrap;
          transition: all .2s;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .pin-price:hover {
          background: #ff4d00 !important;
          color: #fff !important;
          border-color: #ff4d00 !important;
          transform: scale(1.15) !important;
        }
        .mapboxgl-popup-content {
          border-radius: 12px !important;
          padding: 12px 14px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,.15) !important;
        }
        .mapboxgl-popup-tip {
          border-top-color: #fff !important;
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

  const sorted = [...HOTELS].sort((a, b) => {
    if (sort === "price_asc") return a.rate - b.rate;
    if (sort === "price_desc") return b.rate - a.rate;
    if (sort === "rating") return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#f7f8fa" }}>
      {/* Nav */}
      <nav style={{
        background: "#fff",
        display: "flex", alignItems: "center",
        padding: "0 20px", height: 56,
        gap: 14, flexShrink: 0,
        borderBottom: `1px solid ${BRD}`,
      }}>
        <div onClick={onGoHome} style={{ fontSize: "1.05rem", fontWeight: 900, cursor: "pointer", flexShrink: 0, letterSpacing: "-.02em" }}>
          couple<span style={{ color: A }}>.</span>ofhours
        </div>

        {/* Search bar */}
        <div style={{
          flex: 1, maxWidth: 520,
          display: "flex", alignItems: "center",
          background: "#f5f5f5", borderRadius: 24,
          height: 38, overflow: "hidden",
          border: `1px solid ${BRD}`,
          marginLeft: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 14px", gap: 8, flex: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch(city)}
              placeholder="Search location..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: BLK, fontSize: ".82rem", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ width: 1, height: 20, background: "#ddd" }} />
          <div style={{ padding: "0 14px", fontSize: ".78rem", color: SEC, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            <span>📅</span> When?
          </div>
          <button
            onClick={() => onSearch(city)}
            style={{
              background: A, border: "none", color: "#fff",
              padding: "0 18px", height: "100%",
              fontWeight: 700, fontSize: ".78rem",
              cursor: "pointer", fontFamily: "inherit",
              borderRadius: "0 24px 24px 0",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            See hotels
          </button>
        </div>

        {/* Right nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", marginLeft: "auto" }}>
          {["Destinations", "How it works", "Help"].map(l => (
            <a key={l} style={{ fontSize: ".78rem", color: SEC, cursor: "pointer", fontWeight: 500 }}>{l}</a>
          ))}
          <Btn style={{ height: 34, padding: "0 16px", fontSize: ".76rem" }}>Sign In</Btn>
        </div>
      </nav>

      {/* Filter chips */}
      <FilterChips />

      {/* Main content area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Results list */}
        <div style={{ flex: "0 0 55%", maxWidth: "55%", overflowY: "auto", padding: "14px 18px" }}>
          {/* Results header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 14,
          }}>
            <div style={{ fontSize: ".82rem", color: SEC }}>
              <span style={{ fontWeight: 400 }}>Day hotels • Hourly hotels in {query}: </span>
              <span style={{ fontWeight: 800, color: BLK }}>{sorted.length}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: ".72rem", color: SEC }}>Sort by:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  border: "none", background: "transparent",
                  fontSize: ".76rem", fontWeight: 700, color: BLK,
                  cursor: "pointer", fontFamily: "inherit", outline: "none",
                }}
              >
                <option value="rec">Popularity</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          {sorted.map((h, i) => (
            <HotelCard
              key={h.id}
              hotel={h}
              isActive={activeIdx === i}
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            />
          ))}
        </div>

        {/* Map */}
        <MapPanel
          hotels={sorted}
          activeIdx={activeIdx}
          onPin={i => setActiveIdx(activeIdx === i ? null : i)}
        />
      </div>
    </div>
  );
}
