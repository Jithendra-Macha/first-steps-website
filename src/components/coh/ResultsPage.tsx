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
function FilterSidebar({ open, onToggle, count, filters, onFiltersChange }: {
  open: boolean; onToggle: () => void; count: number;
  filters: FilterState; onFiltersChange: (f: FilterState) => void;
}) {
  const t = useThemeColors();
  const { priceRange, selectedStars, selectedAmenities, dealsOnly, duration, guests, neighborhoods, bookingType } = filters;

  const setPriceRange = (v: [number, number]) => onFiltersChange({ ...filters, priceRange: v });
  const setDealsOnly = (v: boolean) => onFiltersChange({ ...filters, dealsOnly: v });
  const setDuration = (v: string | null) => onFiltersChange({ ...filters, duration: v });
  const setGuests = (v: number) => onFiltersChange({ ...filters, guests: v });
  const setBookingType = (v: string | null) => onFiltersChange({ ...filters, bookingType: v });

  const toggleStar = (s: number) => {
    const n = new Set(selectedStars);
    n.has(s) ? n.delete(s) : n.add(s);
    onFiltersChange({ ...filters, selectedStars: n });
  };
  const toggleAmenity = (a: string) => {
    const n = new Set(selectedAmenities);
    n.has(a) ? n.delete(a) : n.add(a);
    onFiltersChange({ ...filters, selectedAmenities: n });
  };
  const toggleNeighborhood = (nb: string) => {
    const n = new Set(neighborhoods);
    n.has(nb) ? n.delete(nb) : n.add(nb);
    onFiltersChange({ ...filters, neighborhoods: n });
  };

  const amenities = ["WiFi", "Pool", "Spa", "Gym", "Rooftop", "Bar", "City View", "Parking", "Room Service", "Jacuzzi", "Breakfast", "AC"];
  const neighborhoodList = ["Midtown", "Chelsea", "Upper West", "Upper East", "Tribeca", "Gramercy", "Meatpacking"];
  const durationOptions = [
    { value: "2h", label: "2 hours", icon: "⚡" },
    { value: "4h", label: "4 hours", icon: "☀️" },
    { value: "6h", label: "6 hours", icon: "🌤" },
    { value: "8h", label: "8 hours", icon: "🌙" },
    { value: "12h", label: "12 hours", icon: "🌜" },
  ];
  const bookingTypes = [
    { value: "instant", label: "Instant Book", icon: "⚡", desc: "Confirmed in seconds" },
    { value: "request", label: "On Request", icon: "📩", desc: "Usually within 1 hour" },
    { value: "cancel", label: "Free Cancel", icon: "✓", desc: "Cancel anytime" },
  ];

  const activeCount = selectedStars.size + selectedAmenities.size + neighborhoods.size
    + (dealsOnly ? 1 : 0) + (duration ? 1 : 0) + (guests > 1 ? 1 : 0) + (bookingType ? 1 : 0);

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
        width: open ? 280 : 0,
        minWidth: open ? 280 : 0,
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

          {/* ── Price Range ── */}
          <FilterSection icon="💰" title="Price Range">
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
          </FilterSection>

          {/* ── Duration ── */}
          <FilterSection icon="⏱" title="Duration">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {durationOptions.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDuration(duration === d.value ? null : d.value)}
                  style={{
                    padding: "8px 12px", borderRadius: 10,
                    border: duration === d.value ? `2px solid ${A}` : `1.5px solid ${BRD}`,
                    background: duration === d.value ? "#fff5f0" : "#fff",
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 5,
                    transition: "all .15s",
                  }}
                >
                  <span style={{ fontSize: ".75rem" }}>{d.icon}</span>
                  <span style={{
                    fontSize: ".68rem", fontWeight: 700,
                    color: duration === d.value ? A : NAVY,
                  }}>{d.label}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Guests ── */}
          <FilterSection icon="👥" title="Guests">
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#f8f8f8", borderRadius: 12, padding: "8px 14px",
              border: `1px solid ${BRD}`,
            }}>
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: `1.5px solid ${guests > 1 ? A : "#ddd"}`,
                  background: guests > 1 ? "#fff5f0" : "#fff",
                  color: guests > 1 ? A : "#ccc",
                  fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "inherit", transition: "all .15s",
                }}
              >−</button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: NAVY }}>{guests}</div>
                <div style={{ fontSize: ".58rem", color: SEC, marginTop: -2 }}>{guests === 1 ? "guest" : "guests"}</div>
              </div>
              <button
                onClick={() => setGuests(Math.min(6, guests + 1))}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: `1.5px solid ${A}`,
                  background: "#fff5f0",
                  color: A,
                  fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "inherit", transition: "all .15s",
                }}
              >+</button>
            </div>
          </FilterSection>

          {/* ── Star Rating ── */}
          <FilterSection icon="⭐" title="Star Rating">
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
          </FilterSection>

          {/* ── Booking Type ── */}
          <FilterSection icon="📋" title="Booking Type">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {bookingTypes.map(bt => (
                <button
                  key={bt.value}
                  onClick={() => setBookingType(bookingType === bt.value ? null : bt.value)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 10,
                    border: bookingType === bt.value ? `2px solid ${A}` : `1.5px solid ${BRD}`,
                    background: bookingType === bt.value ? "linear-gradient(135deg, #fff5f0, #ffe8dd)" : "#fff",
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 10,
                    transition: "all .15s", textAlign: "left",
                  }}
                >
                  <span style={{
                    fontSize: "1rem", width: 32, height: 32, borderRadius: 8,
                    background: bookingType === bt.value ? `${A}15` : "#f5f5f5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>{bt.icon}</span>
                  <div>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: bookingType === bt.value ? A : NAVY }}>{bt.label}</div>
                    <div style={{ fontSize: ".58rem", color: SEC }}>{bt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Deals toggle ── */}
          <FilterSection icon="🔥" title="Special Offers">
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
              <span style={{ fontSize: "1.1rem" }}>🏷️</span>
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
          </FilterSection>

          {/* ── Amenities ── */}
          <FilterSection icon="🏨" title="Amenities">
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
          </FilterSection>

          {/* ── Neighborhood ── */}
          <FilterSection icon="📍" title="Neighborhood">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {neighborhoodList.map(nb => (
                <button
                  key={nb}
                  onClick={() => toggleNeighborhood(nb)}
                  style={{
                    padding: "6px 12px", borderRadius: 20,
                    border: neighborhoods.has(nb) ? `1.5px solid ${A}` : `1px solid #e8e8e8`,
                    background: neighborhoods.has(nb) ? "#fff5f0" : "#fafafa",
                    color: neighborhoods.has(nb) ? A : "#777",
                    fontSize: ".68rem", fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all .15s",
                  }}
                >
                  {nb}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Clear all */}
          {activeCount > 0 && (
            <button
              onClick={() => onFiltersChange(defaultFilters())}
              style={{
                width: "100%", padding: "10px", borderRadius: 10,
                background: "transparent", border: `1.5px solid ${BRD}`,
                color: SEC, fontSize: ".72rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                marginTop: 8,
              }}
            >
              Clear all filters ({activeCount})
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Filter Section wrapper ── */
function FilterSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex", alignItems: "center", gap: 6, width: "100%",
          background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
          padding: "0 0 8px", marginBottom: expanded ? 8 : 0,
          borderBottom: expanded ? "none" : `1px solid #f0f0f0`,
        }}
      >
        <span style={{ fontSize: ".85rem" }}>{icon}</span>
        <span style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, flex: 1, textAlign: "left" }}>{title}</span>
        <span style={{
          fontSize: ".65rem", color: SEC, transition: "transform .2s",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        }}>▾</span>
      </button>
      {expanded && children}
    </div>
  );
}

/* ── Quick Filter Pills (horizontal scrollable bar) ── */
const QUICK_FILTERS = [
  { key: "best_rated", icon: "🏆", label: "Best Rated" },
  { key: "best_deals", icon: "🔥", label: "Best Deals" },
  { key: "luxury", icon: "⭐", label: "4 & 5-Star" },
  { key: "couples", icon: "💑", label: "Couples" },
  { key: "pools", icon: "🏊", label: "Best Pools" },
  { key: "spa", icon: "🧘", label: "Spa & Wellness" },
  { key: "city_view", icon: "🌃", label: "City Views" },
  { key: "new", icon: "✨", label: "New Hotels" },
  { key: "rooftop", icon: "🌇", label: "Rooftop Bar" },
  { key: "business", icon: "💼", label: "Business Ready" },
  { key: "romantic", icon: "❤️", label: "Romance" },
  { key: "free_cancel", icon: "✓", label: "Free Cancel" },
];

function QuickFilterBar({ active, onToggle }: { active: Set<string>; onToggle: (k: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => { checkScroll(); }, []);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          style={{
            position: "absolute", left: 0, zIndex: 5,
            width: 28, height: 28, borderRadius: "50%",
            background: "#fff", border: "1px solid #e8e8e8",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: ".7rem", color: NAVY,
          }}
        >‹</button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          display: "flex", gap: 8, overflowX: "auto",
          scrollbarWidth: "none", msOverflowStyle: "none",
          padding: "0 4px",
          flex: 1,
        }}
      >
        {QUICK_FILTERS.map(f => {
          const isActive = active.has(f.key);
          return (
            <button
              key={f.key}
              onClick={() => onToggle(f.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px",
                borderRadius: 24,
                border: isActive ? `2px solid ${A}` : "1.5px solid #e4e4e4",
                background: isActive ? "linear-gradient(135deg, #fff5f0, #ffe8dd)" : "#fff",
                color: isActive ? A : NAVY,
                fontSize: ".72rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap", flexShrink: 0,
                transition: "all .2s cubic-bezier(.4,0,.2,1)",
                boxShadow: isActive ? `0 2px 8px rgba(255,77,0,.15)` : "none",
              }}
            >
              <span style={{ fontSize: ".8rem" }}>{f.icon}</span>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          style={{
            position: "absolute", right: 0, zIndex: 5,
            width: 28, height: 28, borderRadius: "50%",
            background: "#fff", border: "1px solid #e8e8e8",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: ".7rem", color: NAVY,
          }}
        >›</button>
      )}

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* ── Sort Dropdown ── */
function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useThemeColors();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    { value: "rec", label: "Popularity", icon: "📈" },
    { value: "rating", label: "Top Review", icon: "⭐" },
    { value: "price_asc", label: "Price: Low → High", icon: "💰" },
    { value: "price_desc", label: "Price: High → Low", icon: "💎" },
  ];

  const current = options.find(o => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 10,
          border: `1.5px solid ${t.border}`, background: t.bgCard,
          cursor: "pointer", fontFamily: "inherit",
          fontSize: ".74rem", fontWeight: 700, color: t.navy,
          transition: "all .15s",
        }}
      >
        Sort by: <span style={{ color: A }}>{current.label}</span>
        <span style={{
          fontSize: ".6rem", transition: "transform .2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>▾</span>
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            background: t.bgCard, borderRadius: 14,
            boxShadow: `0 12px 40px ${t.shadow}`, border: `1px solid ${t.border}`,
            zIndex: 999, minWidth: 200, overflow: "hidden",
            padding: "6px",
          }}>
            {options.map(o => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "none",
                  background: value === o.value ? "#fff5f0" : "transparent",
                  color: value === o.value ? A : t.text,
                  fontSize: ".76rem", fontWeight: value === o.value ? 800 : 500,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "all .1s",
                  textAlign: "left",
                }}
                onMouseEnter={e => { if (value !== o.value) e.currentTarget.style.background = "#f8f8f8"; }}
                onMouseLeave={e => { if (value !== o.value) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: ".85rem" }}>{o.icon}</span>
                {o.label}
                {value === o.value && <span style={{ marginLeft: "auto", fontSize: ".7rem" }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Filter State ── */
interface FilterState {
  priceRange: [number, number];
  selectedStars: Set<number>;
  selectedAmenities: Set<string>;
  dealsOnly: boolean;
  duration: string | null;
  guests: number;
  neighborhoods: Set<string>;
  bookingType: string | null;
  quickFilters: Set<string>;
}

function defaultFilters(): FilterState {
  return {
    priceRange: [10, 40],
    selectedStars: new Set(),
    selectedAmenities: new Set(),
    dealsOnly: false,
    duration: null,
    guests: 1,
    neighborhoods: new Set(),
    bookingType: null,
    quickFilters: new Set(),
  };
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

/* ── Hotel Card (Redesigned) ── */
function HotelCard({ hotel: h, isActive, onClick, index, compareMode, isCompared, onCompare, onBookClick }: {
  hotel: Hotel; isActive: boolean; onClick: () => void; index: number;
  compareMode: boolean; isCompared: boolean; onCompare: () => void; onBookClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  const [fav, setFav] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const lit = isActive || hov;

  const tagStyles: Record<string, { color: string; bg: string }> = {
    g: { color: "#0a7c4e", bg: "#edf7f0" },
    b: { color: "#1565c0", bg: "#eef4fd" },
    o: { color: A, bg: "#fff3ee" },
    n: { color: "#6d4c00", bg: "#fff8e1" },
    y: { color: "#7b1fa2", bg: "#f3e5f5" },
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        marginBottom: 14,
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        boxShadow: lit
          ? "0 12px 40px rgba(13,31,56,.12), 0 4px 12px rgba(0,0,0,.06)"
          : "0 2px 8px rgba(0,0,0,.04), 0 0 0 1px rgba(0,0,0,.03)",
        border: isCompared ? `2px solid ${A}` : isActive ? `2px solid ${A}` : "1px solid transparent",
        transform: lit ? "translateY(-3px)" : "none",
        position: "relative",
      }}
    >
      {/* Compare checkbox */}
      {compareMode && (
        <button
          onClick={e => { e.stopPropagation(); onCompare(); }}
          style={{
            position: "absolute", top: 12, left: 12, zIndex: 10,
            width: 26, height: 26, borderRadius: 8,
            background: isCompared ? A : "rgba(255,255,255,.95)",
            border: isCompared ? "none" : "2px solid rgba(255,255,255,.6)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: ".72rem", fontWeight: 800,
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            transition: "all .15s",
          }}
        >
          {isCompared && "✓"}
        </button>
      )}

      {/* ── Image Section ── */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: h.photoBg,
          transform: hov ? "scale(1.06)" : "scale(1)",
          transition: "transform .8s cubic-bezier(.25,.46,.45,.94)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,.15) 0%, transparent 40%, rgba(0,0,0,.55) 100%)",
        }} />

        {/* Top bar: stars + fav */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 3,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          padding: "12px 12px 0",
        }}>
          <div style={{
            display: "flex", gap: 2, padding: "4px 8px",
            background: "rgba(0,0,0,.35)", borderRadius: 8,
            backdropFilter: "blur(8px)",
          }}>
            {Array.from({ length: h.stars }).map((_, i) => (
              <span key={i} style={{ fontSize: ".6rem", color: "#ffd700" }}>★</span>
            ))}
          </div>
          <button
            onClick={e => { e.stopPropagation(); setFav(!fav); }}
            style={{
              width: 34, height: 34,
              background: fav ? A : "rgba(255,255,255,.2)",
              border: fav ? "none" : "1.5px solid rgba(255,255,255,.4)",
              borderRadius: "50%",
              fontSize: ".9rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: fav ? "#fff" : "rgba(255,255,255,.9)",
              backdropFilter: "blur(8px)",
              transition: "all .2s",
              boxShadow: fav ? `0 4px 12px rgba(255,77,0,.4)` : "0 2px 8px rgba(0,0,0,.15)",
            }}
          >
            {fav ? "♥" : "♡"}
          </button>
        </div>

        {/* Bottom overlay: availability + gallery dots */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          padding: "0 12px 10px",
        }}>
          {h.avail !== "yes" ? (
            <div style={{
              background: h.avail === "hot"
                ? "linear-gradient(135deg, #ff4d00, #ff6b35)"
                : "linear-gradient(135deg, #f59e0b, #fbbf24)",
              color: h.avail === "hot" ? "#fff" : "#1a1a1a",
              fontSize: ".62rem", fontWeight: 800,
              padding: "5px 10px", borderRadius: 8,
              letterSpacing: ".02em",
              boxShadow: "0 2px 10px rgba(0,0,0,.2)",
            }}>
              {h.availTxt}
            </div>
          ) : <div />}
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: i === 0 ? 16 : 6, height: 6, borderRadius: 10,
                background: i === 0 ? "#fff" : "rgba(255,255,255,.45)",
                transition: "all .2s",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div style={{ padding: "14px 16px 12px" }}>
        {/* Row 1: Name + Price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: ".95rem", fontWeight: 800, color: NAVY,
              margin: 0, lineHeight: 1.25, letterSpacing: "-.02em",
            }}>{h.name}</h3>
            <p style={{
              fontSize: ".72rem", color: "#8a8a8a", margin: "4px 0 0",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {h.addr}
            </p>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            {h.discount && (
              <span style={{
                background: "linear-gradient(135deg, #ff6b35, #ff4d00)",
                color: "#fff", fontSize: ".58rem", fontWeight: 800,
                padding: "3px 9px", borderRadius: 6,
                letterSpacing: ".03em",
              }}>
                {h.discount}
              </span>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              {h.origRate && (
                <span style={{ fontSize: ".72rem", color: "#c0c0c0", textDecoration: "line-through" }}>${h.origRate}</span>
              )}
              <span style={{
                fontSize: "1.5rem", fontWeight: 900, color: NAVY,
                letterSpacing: "-.04em", lineHeight: 1,
              }}>
                ${h.rate}
              </span>
            </div>
            <span style={{ fontSize: ".6rem", color: "#a0a0a0", fontWeight: 500 }}>per hour</span>
          </div>
        </div>

        {/* Row 2: Rating + Tags */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 12,
          flexWrap: "wrap",
        }}>
          <div style={{
            background: h.rating >= 4.8
              ? "linear-gradient(135deg, #059669, #10b981)"
              : "linear-gradient(135deg, #2563eb, #3b82f6)",
            color: "#fff", fontSize: ".7rem", fontWeight: 800,
            padding: "4px 10px", borderRadius: 8,
            display: "flex", alignItems: "center", gap: 4,
            boxShadow: h.rating >= 4.8
              ? "0 2px 8px rgba(5,150,105,.25)"
              : "0 2px 8px rgba(37,99,235,.2)",
          }}>
            {h.rating}
            <span style={{ fontSize: ".56rem", fontWeight: 500, opacity: .75 }}>/ 5</span>
          </div>
          <span style={{ fontSize: ".7rem", color: "#999", fontWeight: 500 }}>
            {h.reviews.toLocaleString()} reviews
          </span>
          {h.tags.length > 0 && (
            <div style={{ width: 1, height: 14, background: "#eee" }} />
          )}
          {h.tags.slice(0, 3).map(([type, label]) => {
            const st = tagStyles[type] || { color: "#666", bg: "#f5f5f5" };
            return (
              <span key={label} style={{
                fontSize: ".62rem", fontWeight: 700, color: st.color,
                background: st.bg, padding: "3px 10px", borderRadius: 6,
                letterSpacing: ".01em",
              }}>
                {label}
              </span>
            );
          })}
        </div>

        {/* Amenities preview */}
        <div style={{
          display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap",
        }}>
          {h.amenities.slice(0, 4).map(a => (
            <span key={a} style={{
              fontSize: ".6rem", color: "#888", fontWeight: 500,
              padding: "3px 8px", borderRadius: 6,
              background: "#f7f7f7",
              border: "1px solid #f0f0f0",
            }}>
              {a}
            </span>
          ))}
          {h.amenities.length > 4 && (
            <span style={{
              fontSize: ".6rem", color: A, fontWeight: 700,
              padding: "3px 8px", borderRadius: 6,
              background: "#fff5f0",
            }}>
              +{h.amenities.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px 12px",
        borderTop: `1px solid ${lit ? "#fde8dc" : "#f5f5f5"}`,
        background: lit ? "linear-gradient(135deg, #fffaf7, #fff5f0)" : "#fafafa",
        transition: "all .25s",
      }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: ".64rem", color: "#aaa", fontWeight: 600, marginRight: 2 }}>Slots</span>
          {TIME_SLOTS.map((slot, i) => (
            <button
              key={slot}
              onClick={e => { e.stopPropagation(); setSelectedSlot(i); }}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "none",
                background: selectedSlot === i
                  ? `linear-gradient(135deg, ${A}, #ff6b35)`
                  : "#fff",
                color: selectedSlot === i ? "#fff" : "#888",
                fontSize: ".64rem",
                fontWeight: selectedSlot === i ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .15s",
                boxShadow: selectedSlot === i
                  ? `0 2px 8px rgba(255,77,0,.25)`
                  : "0 1px 3px rgba(0,0,0,.06)",
              }}
            >
              {slot}
            </button>
          ))}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onBookClick?.(); }}
          style={{
            height: 34, padding: "0 22px",
            fontSize: ".72rem", fontWeight: 800,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${NAVY}, #1a3558)`,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: ".02em",
            transition: "all .2s",
            boxShadow: lit ? "0 4px 14px rgba(13,31,56,.3)" : "0 2px 8px rgba(13,31,56,.15)",
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          Book now →
        </button>
      </div>
    </div>
  );
}

/* ── Interactive Mapbox Panel ── */
const MAPBOX_TOKEN = "pk.eyJ1Ijoiaml0aGVuZHJhbWFjaGEiLCJhIjoiY21sc2E5YTNvMDN6ZDNjcHpoZnR3M20ydSJ9.EXkOsQuxBxKS_BUo0xLPLQ";

function MapPanel({ hotels, activeIdx, onPin, onHotelClick }: { hotels: Hotel[]; activeIdx: number | null; onPin: (i: number) => void; onHotelClick?: (hotel: Hotel) => void }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const onPinRef = useRef(onPin);
  const onHotelClickRef = useRef(onHotelClick);
  onPinRef.current = onPin;
  onHotelClickRef.current = onHotelClick;

  // Resize map when container size changes (e.g. filter sidebar toggle)
  useEffect(() => {
    if (!mapContainer.current || !map.current) return;
    const observer = new ResizeObserver(() => {
      map.current?.resize();
    });
    observer.observe(mapContainer.current);
    return () => observer.disconnect();
  });

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
    popupRef.current?.remove();
    popupRef.current = null;

    let pinClickedRecently = false;

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

      // Click pin → show persistent popup + select
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        pinClickedRecently = true;
        setTimeout(() => { pinClickedRecently = false; }, 200);

        onPinRef.current(i);

        // Remove existing popups (both hover and click)
        hoverPopupRef.current?.remove();
        hoverPopupRef.current = null;
        popupRef.current?.remove();
        popupRef.current = null;

        // Delay popup creation slightly to avoid race with map click and re-render
        setTimeout(() => {
          if (!map.current) return;

          const popupContent = document.createElement("div");
          popupContent.style.cssText = "font-family:system-ui,-apple-system,sans-serif;padding:4px 0;";
          popupContent.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <div style="width:52px;height:52px;border-radius:10px;background:${h.photoBg};flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.15);"></div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:800;font-size:.85rem;color:${NAVY};line-height:1.25;margin-bottom:2px;">${h.name}</div>
                <div style="font-size:.68rem;color:#888;display:flex;align-items:center;gap:3px;">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  ${h.addr}
                </div>
              </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:${h.rating >= 4.7 ? "#0a7c4e" : "#1565c0"};color:#fff;font-size:.7rem;font-weight:800;padding:3px 8px;border-radius:6px;">${h.rating}</span>
                <span style="color:#f5a623;font-size:.65rem;letter-spacing:-1px;">${"★".repeat(h.stars)}</span>
              </div>
              <div style="text-align:right;">
                ${h.origRate ? `<span style="font-size:.68rem;color:#bbb;text-decoration:line-through;margin-right:3px;">$${h.origRate}</span>` : ""}
                <span style="font-size:1.2rem;font-weight:900;color:${NAVY};letter-spacing:-.02em;">$${h.rate}</span>
                <span style="font-size:.62rem;color:#999;margin-left:1px;">/hr</span>
              </div>
            </div>
          `;

          const viewBtn = document.createElement("button");
          viewBtn.textContent = "View Hotel →";
          viewBtn.style.cssText = `
            width:100%;padding:10px 0;border:none;border-radius:10px;
            background:${NAVY};color:#fff;font-size:.78rem;font-weight:700;
            cursor:pointer;font-family:inherit;letter-spacing:.01em;
            transition:background .15s,transform .1s;
            box-shadow:0 2px 8px rgba(13,31,56,.25);
          `;
          viewBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            onHotelClickRef.current?.(h);
          });
          viewBtn.addEventListener("mouseenter", () => {
            viewBtn.style.background = "#1a3558";
            viewBtn.style.transform = "scale(1.02)";
          });
          viewBtn.addEventListener("mouseleave", () => {
            viewBtn.style.background = NAVY;
            viewBtn.style.transform = "scale(1)";
          });
          popupContent.appendChild(viewBtn);

          popupRef.current = new mapboxgl.Popup({
            offset: 35,
            closeButton: true,
            closeOnClick: false,
            maxWidth: "280px",
            className: "hotel-map-popup",
          })
            .setLngLat([h.lng, h.lat])
            .setDOMContent(popupContent)
            .addTo(map.current!);
        }, 50);
      });

      // Hover → lightweight tooltip with name + price
      el.addEventListener("mouseenter", () => {
        // Don't show hover if a click popup is already open for this hotel
        if (popupRef.current) return;
        hoverPopupRef.current?.remove();
        hoverPopupRef.current = new mapboxgl.Popup({
          offset: 35,
          closeButton: false,
          closeOnClick: false,
          maxWidth: "220px",
          className: "hotel-hover-tooltip",
        })
          .setLngLat([h.lng, h.lat])
          .setHTML(`
            <div style="font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div style="font-weight:800;font-size:.78rem;color:${NAVY};line-height:1.2;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${h.name}</div>
              <div style="flex-shrink:0;display:flex;align-items:baseline;gap:2px;">
                ${h.origRate ? `<span style="font-size:.6rem;color:#bbb;text-decoration:line-through;">$${h.origRate}</span>` : ""}
                <span style="font-size:.95rem;font-weight:900;color:${NAVY};">$${h.rate}</span>
                <span style="font-size:.55rem;color:#999;">/hr</span>
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      el.addEventListener("mouseleave", () => {
        hoverPopupRef.current?.remove();
        hoverPopupRef.current = null;
      });

      markersRef.current.push(marker);
    });

    // Close popup when clicking on map (not on a pin)
    const closePopup = () => {
      if (pinClickedRecently) return;
      popupRef.current?.remove();
      popupRef.current = null;
    };
    map.current.on("click", closePopup);

    return () => {
      map.current?.off("click", closePopup);
    };
  }, [hotels]);

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
    <div style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0 }}>
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
        .hotel-hover-tooltip .mapboxgl-popup-content {
          border-radius: 10px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,.15) !important;
          border: 1px solid #eee !important;
          pointer-events: none !important;
        }
        .hotel-hover-tooltip .mapboxgl-popup-tip {
          border-top-color: #fff !important;
        }
        .hotel-map-popup .mapboxgl-popup-content {
          border-radius: 16px !important;
          padding: 14px 16px !important;
          box-shadow: 0 12px 40px rgba(0,0,0,.22) !important;
          border: 1px solid #eee !important;
        }
        .hotel-map-popup .mapboxgl-popup-close-button {
          font-size: 18px !important;
          color: #999 !important;
          right: 8px !important;
          top: 6px !important;
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          transition: all .15s !important;
        }
        .hotel-map-popup .mapboxgl-popup-close-button:hover {
          background: #f0f0f0 !important;
          color: #333 !important;
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
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const t = useThemeColors();

  const toggleCompare = (id: number) => {
    setCompareIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); }
      else if (n.size < 3) { n.add(id); }
      return n;
    });
  };

  const toggleQuickFilter = (key: string) => {
    setFilters(prev => {
      const n = new Set(prev.quickFilters);
      n.has(key) ? n.delete(key) : n.add(key);
      return { ...prev, quickFilters: n };
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
        display: "flex", flexDirection: "column",
        background: t.bgCard,
        borderBottom: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        {/* Top row: info + sort */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 24px 6px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: ".8rem", color: t.textSecondary }}>
              Hourly hotels in <span style={{ fontWeight: 800, color: t.navy }}>{query}</span>
              <span style={{ marginLeft: 6, fontSize: ".7rem", color: SEC }}>· {sorted.length} results</span>
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
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {/* Quick filter pills */}
        <div style={{ padding: "6px 24px 10px" }}>
          <QuickFilterBar active={filters.quickFilters} onToggle={toggleQuickFilter} />
        </div>
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, position: "relative", gap: 0 }}>
        {/* Filter Sidebar */}
        {view !== "map" && (
          <FilterSidebar open={filtersOpen} onToggle={() => setFiltersOpen(!filtersOpen)} count={sorted.length} filters={filters} onFiltersChange={setFilters} />
        )}

        {/* Results list */}
        {view !== "map" && (
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 16px 14px 20px",
            paddingBottom: comparedHotels.length > 0 ? 80 : 14,
            borderRight: view === "split" ? `1px solid ${t.border}` : "none",
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
            onHotelClick={onHotelClick ? (hotel) => onHotelClick(hotel) : undefined}
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
