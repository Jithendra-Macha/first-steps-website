import { useState, useEffect, useRef } from "react";
import { Btn } from "./SharedComponents";
import type { Hotel } from "@/data/hotels";
import { HOTELS } from "@/data/hotels";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const SEC = "#888";
const BRD = "#e8e8e8";

const MAPBOX_TOKEN = "pk.eyJ1Ijoiaml0aGVuZHJhbWFjaGEiLCJhIjoiY21sc2E5YTNvMDN6ZDNjcHpoZnR3M20ydSJ9.EXkOsQuxBxKS_BUo0xLPLQ";

/* ── Room types for this hotel ── */
const ROOM_TYPES = [
  { name: "Standard Room", sqft: 247, bed: "Double bed", guests: 2, price: 22, nightPrice: 89, icon: "🛏️" },
  { name: "Deluxe Suite", sqft: 420, bed: "King bed", guests: 3, price: 32, nightPrice: 149, icon: "👑" },
  { name: "Premium City View", sqft: 360, bed: "Queen bed", guests: 2, price: 28, nightPrice: 119, icon: "🌃" },
];

/* ── Time slot offers ── */
const SLOT_OFFERS = [
  { time: "6:00 AM – 12:00 PM", label: "Morning", emoji: "🌅", popular: false },
  { time: "11:00 AM – 5:00 PM", label: "Midday", emoji: "☀️", popular: true },
  { time: "1:00 PM – 7:00 PM", label: "Afternoon", emoji: "🌤️", popular: false },
  { time: "5:00 PM – 11:00 PM", label: "Evening", emoji: "🌙", popular: false },
];

/* ── Reviews data ── */
const REVIEWS = [
  { name: "Sarah M.", date: "2 days ago", rating: 5, text: "Absolutely stunning! The room was immaculate and the view of the city was breathtaking. Perfect for our anniversary afternoon.", avatar: "S" },
  { name: "James K.", date: "1 week ago", rating: 4, text: "Great value for a few hours of luxury. Used it as a rest stop during a long layover. WiFi was excellent.", avatar: "J" },
  { name: "Priya R.", date: "2 weeks ago", rating: 5, text: "This is the best-kept secret in NYC. We booked for 4 hours and it felt like a mini vacation. Highly recommend!", avatar: "P" },
  { name: "Michael T.", date: "3 weeks ago", rating: 4, text: "Clean, comfortable, and the staff was incredibly discreet. Will definitely book again for my next business trip.", avatar: "M" },
  { name: "Elena V.", date: "1 month ago", rating: 5, text: "Splurged on the suite and it was worth every penny. The spa access alone made it a steal at this price.", avatar: "E" },
];

/* ── Photo Gallery Grid ── */
function PhotoGallery({ hotel }: { hotel: Hotel }) {
  const [lightbox, setLightbox] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  // Generate gradient variations for gallery
  const photos = [
    { bg: hotel.photoBg, label: "Room View" },
    { bg: `linear-gradient(155deg, ${hotel.photoBg.includes("#0a") ? "#1a2840" : "#0a1628"} 0%, #2a4a7a 50%, #4a7ab0 100%)`, label: "Lobby" },
    { bg: `linear-gradient(155deg, #1a1008 0%, #3a2810 40%, #6a4820 70%, #9a7830 100%)`, label: "Bathroom" },
    { bg: `linear-gradient(155deg, #0a1a28 0%, #1a3a58 40%, #2a5a88 70%, #5a9ac0 100%)`, label: "City View" },
    { bg: `linear-gradient(155deg, #180e20 0%, #2e1a38 40%, #4a2a58 70%, #7a4a88 100%)`, label: "Suite" },
  ];

  return (
    <>
      {/* Mosaic Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gridTemplateRows: "200px 200px",
        gap: 6,
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
      }}>
        {/* Main large photo */}
        <div
          onClick={() => { setActivePhoto(0); setLightbox(true); }}
          style={{
            gridRow: "1 / 3",
            background: photos[0].bg,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.4), transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: 16, left: 16, color: "#fff", zIndex: 2 }}>
            <div style={{ fontSize: ".65rem", fontWeight: 600, opacity: .8, marginBottom: 2 }}>FEATURED</div>
            <div style={{ fontSize: "1rem", fontWeight: 800 }}>{photos[0].label}</div>
          </div>
        </div>

        {/* Small photos */}
        {photos.slice(1, 5).map((p, i) => (
          <div
            key={i}
            onClick={() => { setActivePhoto(i + 1); setLightbox(true); }}
            style={{
              background: p.bg,
              position: "relative",
              overflow: "hidden",
              transition: "transform .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <div style={{ position: "absolute", bottom: 8, left: 10, color: "#fff", fontSize: ".68rem", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>{p.label}</div>
            {i === 3 && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 4,
              }}>
                <span style={{ fontSize: "1.2rem" }}>📸</span>
                <span style={{ color: "#fff", fontSize: ".76rem", fontWeight: 700 }}>See all photos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,.92)", backdropFilter: "blur(20px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 20,
          }}
        >
          <div style={{
            width: "70vw", maxWidth: 900, aspectRatio: "16/10",
            background: photos[activePhoto].bg,
            borderRadius: 16,
          }} />
          <div style={{ display: "flex", gap: 8 }}>
            {photos.map((p, i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setActivePhoto(i); }}
                style={{
                  width: 60, height: 40, borderRadius: 8,
                  background: p.bg,
                  border: activePhoto === i ? `2px solid ${A}` : "2px solid transparent",
                  cursor: "pointer", opacity: activePhoto === i ? 1 : .5,
                  transition: "all .15s",
                }}
              />
            ))}
          </div>
          <button onClick={() => setLightbox(false)} style={{
            position: "absolute", top: 20, right: 24,
            background: "rgba(255,255,255,.1)", border: "none",
            color: "#fff", width: 40, height: 40, borderRadius: "50%",
            fontSize: "1.1rem", cursor: "pointer",
          }}>✕</button>
        </div>
      )}
    </>
  );
}

/* ── Sticky Booking Card ── */
function BookingCard({ hotel, selectedSlot, onSlotChange }: { hotel: Hotel; selectedSlot: number; onSlotChange: (i: number) => void }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: `1px solid ${BRD}`,
      boxShadow: "0 8px 40px rgba(0,0,0,.08)",
      padding: 0,
      position: "sticky",
      top: 80,
      overflow: "hidden",
    }}>
      {/* Price header */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY}, #1a3a60)`,
        padding: "20px 24px",
        color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-.03em" }}>${hotel.rate}</span>
          <span style={{ fontSize: ".82rem", opacity: .7 }}>/ hour</span>
        </div>
        {hotel.origRate && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: ".78rem", textDecoration: "line-through", opacity: .5 }}>${hotel.origRate}/hr</span>
            <span style={{
              background: A, padding: "2px 8px", borderRadius: 6,
              fontSize: ".68rem", fontWeight: 800,
            }}>{hotel.discount}</span>
          </div>
        )}
        <div style={{ fontSize: ".68rem", opacity: .5, marginTop: 4 }}>
          vs ${hotel.origRate || hotel.rate * 3}/night at full price
        </div>
      </div>

      {/* Slot selection */}
      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 12 }}>Choose your time slot</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SLOT_OFFERS.map((slot, i) => (
            <button
              key={i}
              onClick={() => onSlotChange(i)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 12,
                border: selectedSlot === i ? `2px solid ${A}` : `1.5px solid ${BRD}`,
                background: selectedSlot === i ? "#fff5f0" : "#fff",
                cursor: "pointer", fontFamily: "inherit",
                transition: "all .15s",
                position: "relative",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{slot.emoji}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: ".76rem", fontWeight: 700, color: selectedSlot === i ? A : NAVY }}>{slot.label}</div>
                <div style={{ fontSize: ".66rem", color: SEC }}>{slot.time}</div>
              </div>
              {slot.popular && (
                <span style={{
                  background: "linear-gradient(135deg, #ff6b35, #ff4d00)",
                  color: "#fff", fontSize: ".55rem", fontWeight: 800,
                  padding: "2px 7px", borderRadius: 4,
                }}>POPULAR</span>
              )}
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: selectedSlot === i ? `5px solid ${A}` : `2px solid #ddd`,
                transition: "all .15s",
              }} />
            </button>
          ))}
        </div>

        {/* Room count */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 16, padding: "12px 14px",
          background: "#f8f8f8", borderRadius: 12,
        }}>
          <div>
            <div style={{ fontSize: ".76rem", fontWeight: 700, color: NAVY }}>Rooms</div>
            <div style={{ fontSize: ".62rem", color: SEC }}>Max 3 per booking</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${BRD}`, background: "#fff",
              fontSize: ".9rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: ".9rem", fontWeight: 800, color: NAVY }}>1</span>
            <button style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${BRD}`, background: "#fff",
              fontSize: ".9rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
          </div>
        </div>

        {/* CTA */}
        <button style={{
          width: "100%", height: 50, marginTop: 16,
          background: `linear-gradient(135deg, ${A}, #ff6b35)`,
          border: "none", borderRadius: 14,
          color: "#fff", fontSize: ".92rem", fontWeight: 800,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 8px 24px rgba(255,77,0,.3)`,
          transition: "all .2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          Reserve Now — ${hotel.rate * 6}
          <span style={{ fontSize: ".7rem", fontWeight: 500, opacity: .8 }}>for 6hrs</span>
        </button>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: ".62rem", color: SEC }}>
          ✓ Free cancellation · No prepayment needed
        </div>

        {/* Urgency */}
        <div style={{
          marginTop: 14, padding: "10px 14px",
          background: "#fff5f0", borderRadius: 10,
          border: `1px solid #fde8dc`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: ".9rem" }}>👁️</span>
          <div>
            <div style={{ fontSize: ".7rem", fontWeight: 700, color: A }}>12 people viewing now</div>
            <div style={{ fontSize: ".6rem", color: SEC }}>Last booked 14 minutes ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Amenity Grid ── */
function AmenitySection({ hotel }: { hotel: Hotel }) {
  const allAmenities = [
    { icon: "📶", name: "Free WiFi", desc: "High-speed internet" },
    { icon: "🏊", name: "Pool", desc: "Indoor heated pool" },
    { icon: "💆", name: "Spa Access", desc: "Full spa & sauna" },
    { icon: "🏋️", name: "Fitness Center", desc: "24/7 access" },
    { icon: "🍽️", name: "Room Service", desc: "In-room dining" },
    { icon: "🌆", name: "City View", desc: "Panoramic skyline" },
    { icon: "🅿️", name: "Parking", desc: "Valet available" },
    { icon: "🍸", name: "Bar & Lounge", desc: "Rooftop cocktails" },
    { icon: "🛁", name: "Jacuzzi", desc: "In-suite option" },
    { icon: "❄️", name: "Climate Control", desc: "Individual AC" },
    { icon: "📺", name: "Smart TV", desc: "55\" 4K display" },
    { icon: "☕", name: "Mini Bar", desc: "Complimentary drinks" },
  ];

  return (
    <div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>
        What's included <span style={{ color: A }}>with your stay</span>
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {allAmenities.slice(0, 9).map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px", borderRadius: 12,
            background: "#fafafa",
            border: `1px solid #f0f0f0`,
            transition: "all .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff5f0"; e.currentTarget.style.borderColor = "#fde8dc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f0f0f0"; }}
          >
            <span style={{ fontSize: "1.2rem" }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: ".74rem", fontWeight: 700, color: NAVY }}>{a.name}</div>
              <div style={{ fontSize: ".6rem", color: SEC }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Room Types Section ── */
function RoomTypesSection({ hotel }: { hotel: Hotel }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>
        Available <span style={{ color: A }}>room types</span>
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ROOM_TYPES.map((room, i) => (
          <div key={i} style={{
            borderRadius: 16, overflow: "hidden",
            border: expanded === i ? `2px solid ${A}` : `1px solid ${BRD}`,
            background: "#fff",
            transition: "all .2s",
          }}>
            <div
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 20px", cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{room.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".86rem", fontWeight: 800, color: NAVY }}>{room.name}</div>
                <div style={{ fontSize: ".68rem", color: SEC, display: "flex", gap: 8, marginTop: 3 }}>
                  <span>{room.sqft} sq ft</span>
                  <span>·</span>
                  <span>{room.bed}</span>
                  <span>·</span>
                  <span>Up to {room.guests} guests</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: NAVY }}>${room.price}<span style={{ fontSize: ".65rem", fontWeight: 500, color: SEC }}>/hr</span></div>
                <div style={{ fontSize: ".6rem", color: "#ccc", textDecoration: "line-through" }}>${room.nightPrice}/night</div>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: expanded === i ? A : "#f0f0f0",
                color: expanded === i ? "#fff" : "#999",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".8rem", transition: "all .15s",
                transform: expanded === i ? "rotate(180deg)" : "none",
              }}>▾</div>
            </div>
            {expanded === i && (
              <div style={{
                padding: "0 20px 16px",
                borderTop: `1px solid #f0f0f0`,
              }}>
                <div style={{ display: "flex", gap: 8, padding: "12px 0", flexWrap: "wrap" }}>
                  {["WiFi", "AC", "Smart TV", "Mini Bar", "Safe", "Iron", "Hair Dryer", room.bed].map(a => (
                    <span key={a} style={{
                      padding: "4px 10px", borderRadius: 6,
                      background: "#f5f5f5", fontSize: ".64rem",
                      fontWeight: 600, color: "#666",
                    }}>{a}</span>
                  ))}
                </div>
                <button style={{
                  background: A, border: "none", color: "#fff",
                  padding: "10px 24px", borderRadius: 10,
                  fontSize: ".78rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  marginTop: 4,
                }}>
                  Select this room →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Reviews Section ── */
function ReviewsSection() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY }}>
          Guest <span style={{ color: A }}>reviews</span>
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            background: "linear-gradient(135deg, #0a7c4e, #0d9060)",
            color: "#fff", padding: "4px 10px", borderRadius: 8,
            fontSize: ".82rem", fontWeight: 900,
          }}>4.7</div>
          <div>
            <div style={{ fontSize: ".74rem", fontWeight: 700, color: NAVY }}>Excellent</div>
            <div style={{ fontSize: ".6rem", color: SEC }}>Based on 2,841 reviews</div>
          </div>
        </div>
      </div>

      {/* Rating breakdown */}
      <div style={{
        display: "flex", gap: 16, marginBottom: 20,
        padding: "14px 18px", background: "#fafafa", borderRadius: 14,
      }}>
        {[
          { label: "Cleanliness", score: 4.9 },
          { label: "Location", score: 4.8 },
          { label: "Value", score: 4.5 },
          { label: "Service", score: 4.7 },
        ].map(r => (
          <div key={r.label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: NAVY }}>{r.score}</div>
            <div style={{ fontSize: ".62rem", color: SEC, marginTop: 2 }}>{r.label}</div>
            <div style={{
              height: 4, borderRadius: 2, background: "#e8e8e8", marginTop: 6,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${(r.score / 5) * 100}%`,
                background: r.score >= 4.7 ? "#0a7c4e" : A,
                borderRadius: 2,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Review cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {REVIEWS.slice(0, 3).map((r, i) => (
          <div key={i} style={{
            padding: "16px 18px", borderRadius: 14,
            border: `1px solid #f0f0f0`, background: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `linear-gradient(135deg, ${NAVY}, #2a4a7a)`,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".82rem", fontWeight: 800,
              }}>{r.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".78rem", fontWeight: 700, color: NAVY }}>{r.name}</div>
                <div style={{ fontSize: ".62rem", color: SEC }}>{r.date}</div>
              </div>
              <div style={{ color: "#ffd700", fontSize: ".7rem", letterSpacing: 1 }}>
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>
            </div>
            <p style={{ fontSize: ".76rem", color: "#555", lineHeight: 1.6, margin: 0 }}>{r.text}</p>
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 12, padding: "10px 20px", borderRadius: 10,
        border: `1.5px solid ${BRD}`, background: "#fff",
        color: NAVY, fontSize: ".74rem", fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        width: "100%",
      }}>
        Read all 2,841 reviews →
      </button>
    </div>
  );
}

/* ── Mini Map ── */
function MiniMap({ hotel }: { hotel: Hotel }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [hotel.lng, hotel.lat],
      zoom: 14.5,
      interactive: false,
    });

    const el = document.createElement("div");
    el.innerHTML = `<div style="background:${A};color:#fff;font-weight:800;font-size:.7rem;padding:6px 12px;border-radius:10px;box-shadow:0 4px 12px rgba(255,77,0,.4);font-family:system-ui;">📍 ${hotel.name}</div>`;
    new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([hotel.lng, hotel.lat])
      .addTo(map.current);

    return () => { map.current?.remove(); map.current = null; };
  }, [hotel]);

  return (
    <div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>
        Location <span style={{ color: A }}>& nearby</span>
      </h3>
      <div style={{
        borderRadius: 16, overflow: "hidden", height: 240,
        border: `1px solid ${BRD}`,
      }}>
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        {[
          { icon: "🚇", label: "Subway", dist: "2 min walk" },
          { icon: "🏛️", label: "Central Park", dist: "8 min walk" },
          { icon: "✈️", label: "JFK Airport", dist: "45 min drive" },
          { icon: "🍕", label: "Restaurants", dist: "1 min walk" },
        ].map(n => (
          <div key={n.label} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 12px", borderRadius: 10,
            background: "#fafafa", border: `1px solid #f0f0f0`,
            flex: "1 1 auto", minWidth: 140,
          }}>
            <span style={{ fontSize: "1rem" }}>{n.icon}</span>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: 700, color: NAVY }}>{n.label}</div>
              <div style={{ fontSize: ".6rem", color: SEC }}>{n.dist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FAQ Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 12, overflow: "hidden",
      border: `1px solid ${open ? "#fde8dc" : "#f0f0f0"}`,
      background: open ? "#fffaf7" : "#fff",
      marginBottom: 8,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", border: "none", background: "transparent",
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: ".82rem", fontWeight: 700, color: open ? A : NAVY, textAlign: "left" }}>{q}</span>
        <span style={{
          fontSize: ".8rem", color: open ? A : SEC,
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform .2s",
        }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 14px" }}>
          <p style={{ fontSize: ".76rem", color: "#666", lineHeight: 1.7, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

/* ── FAQ Section ── */
function FAQSection() {
  const faqs = [
    { q: "How does hourly booking work?", a: "Simply choose your preferred time slot, select a room type, and book. You'll receive instant confirmation. Check in at the start of your slot and check out at the end." },
    { q: "Is it really private and discreet?", a: "Yes — your booking is 100% private. We don't share any information with third parties. Check-in is seamless and no one will know the nature of your booking." },
    { q: "Can I extend my stay?", a: "Yes! You can extend your stay in hourly increments subject to availability. Just contact the front desk during your stay." },
    { q: "What's the cancellation policy?", a: "Free cancellation up to 2 hours before your check-in time. No questions asked, full refund guaranteed." },
  ];
  return (
    <div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>
        Frequently asked <span style={{ color: A }}>questions</span>
      </h3>
      {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
    </div>
  );
}

/* ── Main Hotel Page ── */
export default function HotelPage({ hotel, onBack }: { hotel: Hotel; onBack: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [fav, setFav] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "rooms", label: "Rooms & Rates" },
    { id: "amenities", label: "Amenities" },
    { id: "reviews", label: "Reviews" },
    { id: "location", label: "Location" },
  ];

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(255,255,255,.97)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${BRD}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 58,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{
            background: "#f5f5f5", border: "none", borderRadius: 10,
            width: 36, height: 36, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: ".9rem",
          }}>←</button>
          <div onClick={onBack} style={{ fontSize: "1.05rem", fontWeight: 900, cursor: "pointer", letterSpacing: "-.02em", color: NAVY }}>
            couple<span style={{ color: A }}>.</span>ofhours
          </div>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(s.id);
                document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                padding: "6px 14px", borderRadius: 8,
                border: "none",
                background: activeSection === s.id ? "#fff5f0" : "transparent",
                color: activeSection === s.id ? A : SEC,
                fontSize: ".74rem", fontWeight: activeSection === s.id ? 700 : 500,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all .15s",
              }}
            >{s.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setFav(!fav)}
            style={{
              background: fav ? "#fff5f0" : "#f5f5f5",
              border: fav ? `1.5px solid ${A}` : "none",
              borderRadius: 10, width: 36, height: 36,
              cursor: "pointer", fontSize: ".9rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: fav ? A : "#bbb",
            }}
          >{fav ? "♥" : "♡"}</button>
          <button style={{
            background: "#f5f5f5", border: "none", borderRadius: 10,
            padding: "0 14px", height: 36, cursor: "pointer",
            fontSize: ".74rem", fontWeight: 600, color: SEC, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            ↗ Share
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 5% 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: ".7rem", color: SEC, marginBottom: 14, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ cursor: "pointer", color: A }} onClick={onBack}>Hotels</span>
          <span>›</span>
          <span>New York</span>
          <span>›</span>
          <span>{hotel.addr.split(",").pop()?.trim()}</span>
          <span>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{hotel.name}</span>
        </div>

        {/* Hotel title */}
        <div id="section-overview" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <span key={i} style={{ fontSize: ".8rem", color: "#ffd700" }}>★</span>
              ))}
            </div>
            {hotel.discount && (
              <span style={{
                background: `linear-gradient(135deg, ${A}, #ff6b35)`,
                color: "#fff", fontSize: ".62rem", fontWeight: 800,
                padding: "3px 10px", borderRadius: 6,
              }}>Save {hotel.discount}</span>
            )}
          </div>
          <h1 style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 900, color: NAVY, letterSpacing: "-.03em",
            margin: 0, lineHeight: 1.15,
          }}>{hotel.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <div style={{
              background: hotel.rating >= 4.8 ? "linear-gradient(135deg, #0a7c4e, #0d9060)" : "linear-gradient(135deg, #1565c0, #1e88e5)",
              color: "#fff", fontSize: ".74rem", fontWeight: 800,
              padding: "4px 10px", borderRadius: 8,
            }}>{hotel.rating}/5</div>
            <span style={{ fontSize: ".76rem", color: SEC }}>{hotel.reviews.toLocaleString()} reviews</span>
            <span style={{ color: BRD }}>|</span>
            <span style={{ fontSize: ".76rem", color: SEC, display: "flex", alignItems: "center", gap: 4 }}>
              📍 {hotel.addr}
            </span>
          </div>
        </div>

        {/* Photo Gallery */}
        <PhotoGallery hotel={hotel} />

        {/* Two column layout: Content + Booking card */}
        <div style={{ display: "flex", gap: 30, marginTop: 30 }}>
          {/* Left column: Content */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 40 }}>
            {/* Highlights */}
            <div style={{
              display: "flex", gap: 12,
              padding: "20px 24px", borderRadius: 16,
              background: "#fff", border: `1px solid ${BRD}`,
            }}>
              {[
                { icon: "🍕", title: "Foodies' HQ", desc: "Incredible in-house Italian restaurant with handmade pasta" },
                { icon: "✨", title: "Must-See", desc: "A day in New York like you've never experienced before" },
                { icon: "🔒", title: "100% Private", desc: "Discreet check-in — your booking is completely private" },
              ].map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.3rem", flexShrink: 0, marginTop: 2 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontSize: ".78rem", fontWeight: 800, color: NAVY }}>{h.title}</div>
                    <div style={{ fontSize: ".66rem", color: SEC, lineHeight: 1.5, marginTop: 2 }}>{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY, marginBottom: 12 }}>
                About <span style={{ color: A }}>this hotel</span>
              </h3>
              <p style={{ fontSize: ".82rem", color: "#555", lineHeight: 1.8, margin: 0 }}>
                Experience the iconic {hotel.name} like never before — by the hour. Located at {hotel.addr},
                this {hotel.stars}-star property offers the same world-class amenities as overnight guests, but
                at a fraction of the cost. Perfect for couples seeking a romantic escape, business travelers
                needing a private meeting space, or anyone looking for a few hours of luxury in the heart of the city.
              </p>
              <p style={{ fontSize: ".82rem", color: "#555", lineHeight: 1.8, margin: "12px 0 0" }}>
                Enjoy access to the full range of hotel amenities including {hotel.amenities.slice(0, 3).join(", ")},
                and more. Every room features premium bedding, a marble bathroom, and stunning views of the Manhattan skyline.
              </p>
            </div>

            {/* Room Types */}
            <div id="section-rooms">
              <RoomTypesSection hotel={hotel} />
            </div>

            {/* Amenities */}
            <div id="section-amenities">
              <AmenitySection hotel={hotel} />
            </div>

            {/* Reviews */}
            <div id="section-reviews">
              <ReviewsSection />
            </div>

            {/* Location */}
            <div id="section-location">
              <MiniMap hotel={hotel} />
            </div>

            {/* FAQ */}
            <FAQSection />
          </div>

          {/* Right column: Sticky booking card */}
          <div style={{ width: 360, flexShrink: 0 }}>
            <BookingCard hotel={hotel} selectedSlot={selectedSlot} onSlotChange={setSelectedSlot} />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div style={{
        display: "none", // Hidden on desktop, would show on mobile
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: `1px solid ${BRD}`,
        padding: "12px 5%",
        boxShadow: "0 -4px 20px rgba(0,0,0,.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 900, color: NAVY }}>${hotel.rate}<span style={{ fontSize: ".7rem", color: SEC }}>/hr</span></div>
            <div style={{ fontSize: ".65rem", color: SEC }}>{SLOT_OFFERS[selectedSlot].time}</div>
          </div>
          <button style={{
            background: A, border: "none", color: "#fff",
            padding: "12px 28px", borderRadius: 12,
            fontSize: ".85rem", fontWeight: 800,
            cursor: "pointer", fontFamily: "inherit",
          }}>Reserve Now</button>
        </div>
      </div>
    </div>
  );
}