import { useState, useEffect, useRef } from "react";
import cohLogo from "@/assets/logo-coh.jpeg";
import { Btn, useIsMobile, useThemeColors } from "./SharedComponents";
import { HOTELS } from "@/data/hotels";
import type { Hotel } from "@/data/hotels";
export type { Hotel };
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay, isToday } from "date-fns";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const BLK = "#0a0a0a";
const SEC = "#888";
const BRD = "#e8e8e8";

/* ── Nav Date Picker ── */
function NavDatePicker({ selectedDate, onSelect }: { selectedDate: Date; onSelect: (d: Date) => void }) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startOfMonth(selectedDate));
  const ref = useRef<HTMLDivElement>(null);
  const t = useThemeColors();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(viewMonth)), end: endOfWeek(endOfMonth(viewMonth)) });
  const today = startOfDay(new Date());

  const label = isToday(selectedDate) ? "Today" : format(selectedDate, "MMM d");

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "0 14px", height: "100%",
          background: "transparent", border: "none",
          fontSize: ".76rem", color: "rgba(255,255,255,.65)",
          cursor: "pointer", fontFamily: "inherit",
          transition: "color .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#fff"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.65)"}
      >
        📅 {label}
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
            background: t.bgCard, borderRadius: 16, padding: 16,
            boxShadow: `0 16px 48px ${t.shadow}`, border: `1px solid ${t.border}`,
            zIndex: 999, width: 300,
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <button onClick={() => setViewMonth(subMonths(viewMonth, 1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: t.text, padding: 4 }}>‹</button>
              <span style={{ fontSize: ".82rem", fontWeight: 800, color: t.text }}>{format(viewMonth, "MMMM yyyy")}</span>
              <button onClick={() => setViewMonth(addMonths(viewMonth, 1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: t.text, padding: 4 }}>›</button>
            </div>
            {/* Weekday headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: ".6rem", fontWeight: 700, color: t.textSecondary, padding: "4px 0" }}>{d}</div>
              ))}
            </div>
            {/* Days */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {days.map(day => {
                const inMonth = isSameMonth(day, viewMonth);
                const selected = isSameDay(day, selectedDate);
                const past = isBefore(day, today);
                const todayDay = isSameDay(day, today);
                return (
                  <button
                    key={day.toISOString()}
                    disabled={past && !todayDay}
                    onClick={() => { onSelect(day); setOpen(false); }}
                    style={{
                      width: "100%", aspectRatio: "1", borderRadius: 10,
                      border: selected ? `2px solid ${A}` : "none",
                      background: selected ? A : todayDay ? (t.dark ? "#2a2a2a" : "#f0f0f0") : "transparent",
                      color: selected ? "#fff" : !inMonth || (past && !todayDay) ? t.textMuted : t.text,
                      fontSize: ".75rem", fontWeight: selected || todayDay ? 700 : 400,
                      cursor: past && !todayDay ? "default" : "pointer",
                      opacity: past && !todayDay ? 0.4 : 1,
                      fontFamily: "inherit",
                      transition: "all .1s",
                    }}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
            {/* Quick pick */}
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <button onClick={() => { onSelect(today); setOpen(false); }}
                style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: `1px solid ${t.border}`, background: isToday(selectedDate) ? A : "transparent", color: isToday(selectedDate) ? "#fff" : t.text, fontSize: ".7rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Today
              </button>
              <button onClick={() => { onSelect(new Date(today.getTime() + 86400000)); setOpen(false); }}
                style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontSize: ".7rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Tomorrow
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Time Slots ── */
const TIME_SLOTS = ["6am–12pm", "11am–5pm", "1pm–7pm", "5pm–11pm"];

/* ── Filter Sidebar ── */
function FilterSidebar({ open, onToggle, count }: { open: boolean; onToggle: () => void; count: number }) {
  const t = useThemeColors();
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 40]);
  const [selectedStars, setSelectedStars] = useState<Set<number>>(new Set());
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [dealsOnly, setDealsOnly] = useState(false);

  const toggleStar = (s: number) => setSelectedStars(prev => {
    const n = new Set(prev);
    n.has(s) ? n.delete(s) : n.add(s);
    return n;
  });
  const toggleAmenity = (a: string) => setSelectedAmenities(prev => {
    const n = new Set(prev);
    n.has(a) ? n.delete(a) : n.add(a);
    return n;
  });

  const amenities = ["WiFi", "Pool", "Spa", "Gym", "Rooftop", "Bar", "City View", "Parking", "Room Service"];
  const activeCount = selectedStars.size + selectedAmenities.size + (dealsOnly ? 1 : 0);

  return (
    <>
      {/* Collapsed tab */}
      {!open && (
        <button
          onClick={onToggle}
          style={{
            position: "absolute", left: 0, top: 80,
            background: NAVY, color: "#fff",
            border: "none", borderRadius: "0 12px 12px 0",
            padding: "12px 10px", cursor: "pointer",
            writingMode: "vertical-rl", textOrientation: "mixed",
            fontSize: ".72rem", fontWeight: 700, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
            zIndex: 50, boxShadow: "4px 0 16px rgba(0,0,0,.1)",
            transition: "all .2s",
          }}
        >
          ⚙ Filters
          {activeCount > 0 && (
            <span style={{
              background: A, width: 18, height: 18, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: ".6rem", fontWeight: 800, writingMode: "horizontal-tb",
            }}>{activeCount}</span>
          )}
        </button>
      )}

      {/* Expanded sidebar */}
      <div style={{
        width: open ? 260 : 0,
        minWidth: open ? 260 : 0,
        overflow: "hidden",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        borderRight: open ? `1px solid ${t.border}` : "none",
        background: t.bgCard,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "16px 18px", overflowY: "auto", flex: 1 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: ".92rem", fontWeight: 800, color: t.navy }}>Filters</div>
              <div style={{ fontSize: ".65rem", color: t.textSecondary, marginTop: 2 }}>
                <span style={{ fontWeight: 800, color: A }}>{count}</span> hotels match
              </div>
            </div>
            <button onClick={onToggle} style={{
              background: "#f5f5f5", border: "none", width: 28, height: 28,
              borderRadius: 8, cursor: "pointer", fontSize: ".8rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: ".85rem" }}>💰</span> Price Range
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                flex: 1, padding: "8px 10px", borderRadius: 8,
                background: "#f8f8f8", border: `1px solid ${BRD}`,
                fontSize: ".78rem", fontWeight: 700, color: NAVY, textAlign: "center",
              }}>
                ${priceRange[0]}
              </div>
              <span style={{ fontSize: ".7rem", color: SEC }}>to</span>
              <div style={{
                flex: 1, padding: "8px 10px", borderRadius: 8,
                background: "#f8f8f8", border: `1px solid ${BRD}`,
                fontSize: ".78rem", fontWeight: 700, color: NAVY, textAlign: "center",
              }}>
                ${priceRange[1]}
              </div>
              <span style={{ fontSize: ".65rem", color: SEC }}>/hr</span>
            </div>
            {/* Visual price bar */}
            <div style={{ position: "relative", height: 6, background: "#f0f0f0", borderRadius: 3, margin: "0 4px" }}>
              <div style={{
                position: "absolute",
                left: `${((priceRange[0] - 5) / 45) * 100}%`,
                right: `${100 - ((priceRange[1] - 5) / 45) * 100}%`,
                top: 0, bottom: 0,
                background: `linear-gradient(90deg, ${A}, #ff7340)`,
                borderRadius: 3,
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: ".6rem", color: "#ccc" }}>
              <span>$5</span><span>$50</span>
            </div>
          </div>

          {/* Star Rating */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: ".85rem" }}>⭐</span> Star Rating
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => toggleStar(s)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    border: selectedStars.has(s) ? `2px solid ${A}` : `1.5px solid ${BRD}`,
                    background: selectedStars.has(s) ? "#fff5f0" : "#fff",
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    transition: "all .15s",
                  }}
                >
                  <span style={{ fontSize: ".8rem", color: "#ffd700" }}>{"★".repeat(s)}</span>
                  <span style={{
                    fontSize: ".6rem", fontWeight: 700,
                    color: selectedStars.has(s) ? A : SEC,
                  }}>{s} star</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deals toggle */}
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={() => setDealsOnly(!dealsOnly)}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: dealsOnly ? `2px solid ${A}` : `1.5px solid ${BRD}`,
                background: dealsOnly
                  ? "linear-gradient(135deg, #fff5f0, #ffe8dd)"
                  : "#fff",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 10,
                transition: "all .15s",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>🔥</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: ".76rem", fontWeight: 700, color: dealsOnly ? A : NAVY }}>Deals Only</div>
                <div style={{ fontSize: ".6rem", color: SEC }}>Show discounted hotels</div>
              </div>
              <div style={{
                marginLeft: "auto",
                width: 36, height: 20, borderRadius: 10,
                background: dealsOnly ? A : "#ddd",
                position: "relative", transition: "background .2s",
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 2,
                  left: dealsOnly ? 18 : 2,
                  transition: "left .2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                }} />
              </div>
            </button>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: ".85rem" }}>🏨</span> Amenities
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {amenities.map(a => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  style={{
                    padding: "6px 12px", borderRadius: 20,
                    border: selectedAmenities.has(a) ? `1.5px solid ${A}` : `1px solid #e8e8e8`,
                    background: selectedAmenities.has(a) ? "#fff5f0" : "#fafafa",
                    color: selectedAmenities.has(a) ? A : "#777",
                    fontSize: ".68rem", fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all .15s",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {activeCount > 0 && (
            <button
              onClick={() => { setSelectedStars(new Set()); setSelectedAmenities(new Set()); setDealsOnly(false); }}
              style={{
                width: "100%", padding: "10px", borderRadius: 10,
                background: "transparent", border: `1.5px solid ${BRD}`,
                color: SEC, fontSize: ".72rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Compare Tray ── */
function CompareTray({ hotels, onRemove, onClear }: { hotels: Hotel[]; onRemove: (id: number) => void; onClear: () => void }) {
  if (hotels.length === 0) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: NAVY, color: "#fff",
      padding: "12px 24px",
      display: "flex", alignItems: "center", gap: 16,
      zIndex: 300,
      boxShadow: "0 -4px 24px rgba(0,0,0,.2)",
      animation: "slideUp .3s ease-out",
    }}>
      <div style={{ fontSize: ".72rem", fontWeight: 700, opacity: .7, flexShrink: 0 }}>
        Compare ({hotels.length}/3)
      </div>

      <div style={{ display: "flex", gap: 10, flex: 1, overflow: "auto" }}>
        {hotels.map(h => (
          <div key={h.id} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,.1)", borderRadius: 10,
            padding: "6px 12px", flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: h.photoBg, flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: ".72rem", fontWeight: 700 }}>{h.name}</div>
              <div style={{ fontSize: ".62rem", opacity: .6 }}>${h.rate}/hr · {h.rating}★</div>
            </div>
            <button
              onClick={() => onRemove(h.id)}
              style={{
                background: "rgba(255,255,255,.15)", border: "none",
                color: "#fff", width: 20, height: 20, borderRadius: "50%",
                fontSize: ".6rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={onClear} style={{
          background: "rgba(255,255,255,.15)", border: "none",
          color: "#fff", padding: "8px 16px", borderRadius: 8,
          fontSize: ".72rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>Clear</button>
        <button style={{
          background: A, border: "none", color: "#fff",
          padding: "8px 20px", borderRadius: 8,
          fontSize: ".72rem", fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 4px 12px rgba(255,77,0,.4)`,
        }}>Compare Now →</button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Hotel Card (kept identical) ── */
function HotelCard({ hotel: h, isActive, onClick, index, compareMode, isCompared, onCompare, onBookClick }: {
  hotel: Hotel; isActive: boolean; onClick: () => void; index: number;
  compareMode: boolean; isCompared: boolean; onCompare: () => void; onBookClick?: () => void;
}) {
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
        border: isCompared ? `2px solid ${A}` : isActive ? `2px solid ${A}` : `1px solid ${lit ? "#e0e0e0" : "#f0f0f0"}`,
        transform: lit ? "translateY(-2px)" : "none",
        position: "relative",
      }}
    >
      {/* Compare checkbox */}
      {compareMode && (
        <button
          onClick={e => { e.stopPropagation(); onCompare(); }}
          style={{
            position: "absolute", top: 10, left: 10, zIndex: 10,
            width: 24, height: 24, borderRadius: 6,
            background: isCompared ? A : "rgba(255,255,255,.9)",
            border: isCompared ? `2px solid ${A}` : "2px solid #ddd",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: ".7rem", fontWeight: 800,
            backdropFilter: "blur(4px)",
            transition: "all .15s",
          }}
        >
          {isCompared && "✓"}
        </button>
      )}

      {/* Top section: Image + Info side by side */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Image with overlay content */}
        <div style={{ width: "100%", minHeight: 160, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: h.photoBg,
            transform: hov ? "scale(1.08)" : "scale(1)",
            transition: "transform .6s cubic-bezier(.4,0,.2,1)",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, transparent 40%, rgba(0,0,0,.5) 100%)" }} />

          {/* Stars on image */}
          <div style={{ position: "absolute", top: 10, left: compareMode ? 38 : 10, zIndex: 3, display: "flex", gap: 1 }}>
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
        }}
          onClick={e => { e.stopPropagation(); onBookClick?.(); }}
        >
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
export default function ResultsPage({ query, onGoHome, onSearch, onHotelClick }: { query: string; onGoHome: () => void; onSearch: (q: string) => void; onHotelClick?: (hotel: Hotel) => void }) {
  const [sort, setSort] = useState("rec");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [city, setCity] = useState(query);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const mob = useIsMobile();
  const [view, setView] = useState<"split" | "list" | "map">(mob ? "list" : "split");
  const [filtersOpen, setFiltersOpen] = useState(!mob);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<number>>(new Set());
  const t = useThemeColors();

  const toggleCompare = (id: number) => {
    setCompareIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); }
      else if (n.size < 3) { n.add(id); }
      return n;
    });
  };

  const sorted = [...HOTELS].sort((a, b) => {
    if (sort === "price_asc") return a.rate - b.rate;
    if (sort === "price_desc") return b.rate - a.rate;
    if (sort === "rating") return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const comparedHotels = sorted.filter(h => compareIds.has(h.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: t.bgPage }}>
      {/* Nav */}
      <nav style={{
        background: NAVY,
        display: "flex", alignItems: "center",
        padding: mob ? "0 12px" : "0 24px", height: mob ? 48 : 54,
        gap: mob ? 8 : 16, flexShrink: 0,
      }}>
        <div onClick={onGoHome} style={{ fontSize: "1.05rem", fontWeight: 900, cursor: "pointer", flexShrink: 0, letterSpacing: "-.02em", color: "#fff" }}>coupleofhours<span style={{ color: A }}>.com</span></div>

        {/* Search bar */}
        {!mob && (
        <div style={{
          flex: 1, maxWidth: 500,
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
          <NavDatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
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
        )}

        {/* Compare toggle */}
        <button
          onClick={() => { setCompareMode(!compareMode); if (compareMode) setCompareIds(new Set()); }}
          style={{
            height: 32, padding: "0 14px", borderRadius: 8,
            background: compareMode ? A : "rgba(255,255,255,.1)",
            border: "none", color: "#fff",
            fontSize: ".74rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all .15s",
          }}
        >
          {compareMode ? "✓ Comparing" : "⚖ Compare"}
        </button>

        {/* View toggles */}
        {!mob && <div style={{ display: "flex", gap: 2, marginLeft: 4, background: "rgba(255,255,255,.1)", borderRadius: 8, padding: 2 }}>
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
        </div>}

        {/* Right nav */}
        <div style={{ display: "flex", alignItems: "center", gap: mob ? ".6rem" : "1.4rem", marginLeft: "auto" }}>
          {!mob && ["Help", "List Property"].map(l => (
            <a key={l} style={{ fontSize: ".76rem", color: "rgba(255,255,255,.55)", cursor: "pointer", fontWeight: 500, transition: "color .15s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "#fff"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,.55)"}
            >{l}</a>
          ))}
          <Btn variant="ghost" style={{ height: 32, padding: "0 14px", fontSize: ".74rem", borderRadius: 8 }}>Sign In</Btn>
        </div>
      </nav>

      {/* Results header strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px",
        background: t.bgCard,
        borderBottom: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: ".8rem", color: t.textSecondary }}>
            Hourly hotels in <span style={{ fontWeight: 800, color: t.navy }}>{query}</span>
          </div>
          {compareMode && (
            <span style={{
              background: t.dark ? "rgba(255,77,0,.15)" : "#fff5f0", color: A,
              fontSize: ".65rem", fontWeight: 700,
              padding: "3px 10px", borderRadius: 6,
            }}>
              Select up to 3 hotels to compare
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: ".7rem", color: t.textSecondary }}>Sort:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              border: `1px solid ${t.border}`, background: t.bgCard,
              fontSize: ".74rem", fontWeight: 700, color: t.navy,
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
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, position: "relative" }}>
        {/* Filter Sidebar */}
        {view !== "map" && (
          <FilterSidebar open={filtersOpen} onToggle={() => setFiltersOpen(!filtersOpen)} count={sorted.length} />
        )}

        {/* Results list */}
        {view !== "map" && (
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 20px",
            paddingBottom: comparedHotels.length > 0 ? 80 : 14,
          }}>
            {sorted.map((h, i) => (
              <HotelCard
                key={h.id}
                hotel={h}
                isActive={activeIdx === i}
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                index={i}
                compareMode={compareMode}
                isCompared={compareIds.has(h.id)}
                onCompare={() => toggleCompare(h.id)}
                onBookClick={() => onHotelClick?.(h)}
              />
            ))}
          </div>
        )}

        {/* Map - hide on mobile list view */}
        {view !== "list" && !mob && (
          <MapPanel
            hotels={sorted}
            activeIdx={activeIdx}
            onPin={i => setActiveIdx(activeIdx === i ? null : i)}
          />
        )}
      </div>

      {/* Compare Tray */}
      <CompareTray
        hotels={comparedHotels}
        onRemove={id => setCompareIds(prev => { const n = new Set(prev); n.delete(id); return n; })}
        onClear={() => setCompareIds(new Set())}
      />
    </div>
  );
}
