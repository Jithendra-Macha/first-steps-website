import { useState, useEffect, useRef } from "react";
import cohLogo from "@/assets/logo-coh.jpeg";
import { Btn, useIsMobile } from "./SharedComponents";
import type { Hotel } from "@/data/hotels";
import { HOTELS } from "@/data/hotels";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const SEC = "#888";
const BRD = "#e8e8e8";

/* ── Tax rates by state ── */
function getTaxInfo(hotelAddr: string): { taxRate: number; taxFlatFee: number; stateName: string } {
  const addr = hotelAddr.toLowerCase();
  // NJ properties
  if (addr.includes("jersey") || addr.includes(", nj")) {
    return { taxRate: 11.625, taxFlatFee: 2.00, stateName: "NJ" };
  }
  // Default: NY
  return { taxRate: 14.75, taxFlatFee: 3.50, stateName: "NY" };
}

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

/* ── Booking data export ── */
export interface BookingData {
  hotel: Hotel;
  slot: typeof SLOT_OFFERS[number];
  room: typeof ROOM_TYPES[number];
  rooms: number;
  guest: { name: string; email: string; phone: string; special: string };
  total: number;
  bookingId: string;
  date: string;
  taxAmount?: number;
  taxRate?: number;
  taxFlatFee?: number;
  subtotal?: number;
  serviceFee?: number;
}

/* ── Booking Form Modal ── */
function BookingModal({ hotel, slot, room, rooms, onClose, onConfirm }: {
  hotel: Hotel; slot: typeof SLOT_OFFERS[number]; room: typeof ROOM_TYPES[number];
  rooms: number; onClose: () => void; onConfirm: (data: BookingData) => void;
}) {
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=processing
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [special, setSpecial] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = room.price * 6 * rooms;
  const serviceFee = Math.round(total * 0.08);
  const taxInfo = getTaxInfo(hotel.addr);
  const taxAmount = parseFloat((total * taxInfo.taxRate / 100 + taxInfo.taxFlatFee).toFixed(2));
  const grandTotal = total + serviceFee + taxAmount;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email is required";
    if (!phone.trim() || phone.length < 7) e.phone = "Valid phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!cardNum.trim() || cardNum.replace(/\s/g, "").length < 16) e.cardNum = "Valid card number required";
    if (!cardExp.trim() || !cardExp.includes("/")) e.cardExp = "Valid expiry required (MM/YY)";
    if (!cardCvc.trim() || cardCvc.length < 3) e.cardCvc = "Valid CVC required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    setStep(3);
    // Simulate payment processing
    setTimeout(() => {
      const bookingId = "COH-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const today = new Date();
      onConfirm({
        hotel,
        slot,
        room,
        rooms,
        guest: { name, email, phone, special },
        total: grandTotal,
        bookingId,
        date: today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        taxAmount,
        taxRate: taxInfo.taxRate,
        taxFlatFee: taxInfo.taxFlatFee,
        subtotal: total,
        serviceFee,
      });
    }, 2500);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: errors[field] ? `2px solid #e53935` : `1.5px solid ${BRD}`,
    fontSize: ".82rem", fontFamily: "inherit", outline: "none",
    transition: "border-color .15s",
    background: "#fff",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 24,
        maxWidth: 520, width: "100%",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,.2)",
        animation: "modalIn .3s ease-out",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${NAVY}, #1a3a60)`,
          padding: "24px 28px", borderRadius: "24px 24px 0 0",
          color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: ".68rem", fontWeight: 600, opacity: .6, marginBottom: 4 }}>COMPLETING RESERVATION</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{hotel.name}</div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,.15)", border: "none",
              color: "#fff", width: 32, height: 32, borderRadius: "50%",
              cursor: "pointer", fontSize: ".9rem",
            }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div style={{ background: "rgba(255,255,255,.1)", padding: "6px 12px", borderRadius: 8, fontSize: ".72rem" }}>
              {slot.emoji} {slot.time}
            </div>
            <div style={{ background: "rgba(255,255,255,.1)", padding: "6px 12px", borderRadius: 8, fontSize: ".72rem" }}>
              {room.icon} {room.name}
            </div>
            <div style={{ background: "rgba(255,255,255,.1)", padding: "6px 12px", borderRadius: 8, fontSize: ".72rem" }}>
              🚪 {rooms} room{rooms > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", padding: "16px 28px", gap: 8 }}>
          {["Guest Details", "Payment", "Confirm"].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                height: 4, borderRadius: 2, marginBottom: 6,
                background: step > i + 1 ? "#0a7c4e" : step === i + 1 ? A : "#e8e8e8",
                transition: "background .3s",
              }} />
              <span style={{
                fontSize: ".64rem", fontWeight: 700,
                color: step === i + 1 ? A : step > i + 1 ? "#0a7c4e" : SEC,
              }}>
                {step > i + 1 ? "✓ " : ""}{s}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 28px 28px" }}>
          {/* Step 1: Guest Details */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, display: "block", marginBottom: 6 }}>Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputStyle("name")} />
                {errors.name && <span style={{ fontSize: ".62rem", color: "#e53935", marginTop: 4, display: "block" }}>{errors.name}</span>}
              </div>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, display: "block", marginBottom: 6 }}>Email Address *</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" type="email" style={inputStyle("email")} />
                {errors.email && <span style={{ fontSize: ".62rem", color: "#e53935", marginTop: 4, display: "block" }}>{errors.email}</span>}
              </div>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, display: "block", marginBottom: 6 }}>Phone Number *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" type="tel" style={inputStyle("phone")} />
                {errors.phone && <span style={{ fontSize: ".62rem", color: "#e53935", marginTop: 4, display: "block" }}>{errors.phone}</span>}
              </div>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, display: "block", marginBottom: 6 }}>Special Requests <span style={{ fontWeight: 400, color: SEC }}>(optional)</span></label>
                <textarea value={special} onChange={e => setSpecial(e.target.value)} placeholder="Early check-in, extra pillows, etc." rows={3}
                  style={{ ...inputStyle("special"), resize: "vertical" }} />
              </div>
              <button onClick={() => { if (validateStep1()) setStep(2); }} style={{
                width: "100%", height: 48, marginTop: 4,
                background: `linear-gradient(135deg, ${A}, #ff6b35)`,
                border: "none", borderRadius: 12, color: "#fff",
                fontSize: ".88rem", fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                boxShadow: `0 6px 20px rgba(255,77,0,.3)`,
              }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Order summary */}
              <div style={{
                background: "#f8f8f8", borderRadius: 14, padding: "16px 18px",
              }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 10 }}>Order Summary</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: ".76rem", color: "#555" }}>
                  <span>{room.name} × {rooms} room{rooms > 1 ? "s" : ""} × 6hrs</span>
                  <span style={{ fontWeight: 700 }}>${total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: ".76rem", color: "#555" }}>
                  <span>Service fee</span>
                  <span style={{ fontWeight: 700 }}>${serviceFee}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: ".76rem", color: "#555" }}>
                  <span>Tax ({taxInfo.stateName} {taxInfo.taxRate}% + ${taxInfo.taxFlatFee.toFixed(2)} fee)</span>
                  <span style={{ fontWeight: 700 }}>${taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ height: 1, background: BRD, margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem", fontWeight: 900, color: NAVY }}>
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, display: "block", marginBottom: 6 }}>Card Number</label>
                <input value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} style={inputStyle("cardNum")} />
                {errors.cardNum && <span style={{ fontSize: ".62rem", color: "#e53935", marginTop: 4, display: "block" }}>{errors.cardNum}</span>}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, display: "block", marginBottom: 6 }}>Expiry</label>
                  <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="12/28" maxLength={5} style={inputStyle("cardExp")} />
                  {errors.cardExp && <span style={{ fontSize: ".62rem", color: "#e53935", marginTop: 4, display: "block" }}>{errors.cardExp}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, display: "block", marginBottom: 6 }}>CVC</label>
                  <input value={cardCvc} onChange={e => setCardCvc(e.target.value)} placeholder="123" maxLength={4} type="password" style={inputStyle("cardCvc")} />
                  {errors.cardCvc && <span style={{ fontSize: ".62rem", color: "#e53935", marginTop: 4, display: "block" }}>{errors.cardCvc}</span>}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                <span style={{ fontSize: ".9rem" }}>🔒</span>
                <span style={{ fontSize: ".66rem", color: "#166534" }}>Your payment is encrypted and secure. We never store card details.</span>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, height: 48, borderRadius: 12,
                  border: `1.5px solid ${BRD}`, background: "#fff",
                  fontSize: ".82rem", fontWeight: 700, color: NAVY,
                  cursor: "pointer", fontFamily: "inherit",
                }}>← Back</button>
                <button onClick={handleSubmit} style={{
                  flex: 2, height: 48, borderRadius: 12,
                  background: `linear-gradient(135deg, ${A}, #ff6b35)`,
                  border: "none", color: "#fff",
                  fontSize: ".88rem", fontWeight: 800,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: `0 6px 20px rgba(255,77,0,.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  🔒 Pay ${grandTotal.toFixed(2)} & Reserve
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                border: `4px solid ${BRD}`,
                borderTopColor: A,
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }} />
              <div style={{ fontSize: "1rem", fontWeight: 800, color: NAVY }}>Processing your reservation...</div>
              <div style={{ fontSize: ".76rem", color: SEC, marginTop: 6 }}>Securing your room and confirming availability</div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes modalIn {
            from { transform: translateY(30px) scale(.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ── Confirmation Page ── */
export function ConfirmationPage({ booking, onHome }: { booking: BookingData; onHome: () => void }) {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        background: "#fff", borderBottom: `1px solid ${BRD}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 58,
      }}>
        <div onClick={onHome} style={{ fontSize: "1.05rem", fontWeight: 900, cursor: "pointer", letterSpacing: "-.02em", color: NAVY }}>coupleofhours<span style={{ color: A }}>.com</span></div>
        <button onClick={onHome} style={{
          background: "#f5f5f5", border: "none", borderRadius: 10,
          padding: "0 16px", height: 36, cursor: "pointer",
          fontSize: ".76rem", fontWeight: 600, color: NAVY, fontFamily: "inherit",
        }}>← Back to Home</button>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 5%" }}>
        {/* Success header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #0a7c4e, #0d9060)",
            margin: "0 auto 20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 30px rgba(10,124,78,.3)",
            animation: "popIn .5s ease-out",
          }}>
            <span style={{ fontSize: "2rem", color: "#fff" }}>✓</span>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: NAVY, letterSpacing: "-.03em", margin: "0 0 8px" }}>
            Booking Confirmed! 🎉
          </h1>
          <p style={{ fontSize: ".88rem", color: SEC, margin: 0 }}>
            Your reservation has been confirmed. Check your email for details.
          </p>
          <div style={{
            display: "inline-block", marginTop: 14,
            background: "#fff5f0", border: `1px solid #fde8dc`,
            padding: "8px 20px", borderRadius: 10,
          }}>
            <span style={{ fontSize: ".72rem", color: SEC }}>Booking ID: </span>
            <span style={{ fontSize: ".88rem", fontWeight: 900, color: A, letterSpacing: ".05em" }}>{booking.bookingId}</span>
          </div>
        </div>

        {/* Booking card */}
        <div style={{
          background: "#fff", borderRadius: 20, overflow: "hidden",
          border: `1px solid ${BRD}`,
          boxShadow: "0 4px 24px rgba(0,0,0,.06)",
        }}>
          {/* Hotel banner */}
          <div style={{
            background: booking.hotel.photoBg,
            height: 140, position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.6), transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 20, color: "#fff", zIndex: 2 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                {Array.from({ length: booking.hotel.stars }).map((_, i) => (
                  <span key={i} style={{ fontSize: ".6rem", color: "#ffd700" }}>★</span>
                ))}
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900 }}>{booking.hotel.name}</div>
              <div style={{ fontSize: ".72rem", opacity: .8, marginTop: 2 }}>📍 {booking.hotel.addr}</div>
            </div>
          </div>

          {/* Details grid */}
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: "#f8f8f8", padding: "14px 16px", borderRadius: 12 }}>
                <div style={{ fontSize: ".62rem", fontWeight: 600, color: SEC, marginBottom: 4 }}>📅 DATE</div>
                <div style={{ fontSize: ".82rem", fontWeight: 700, color: NAVY }}>{booking.date}</div>
              </div>
              <div style={{ background: "#f8f8f8", padding: "14px 16px", borderRadius: 12 }}>
                <div style={{ fontSize: ".62rem", fontWeight: 600, color: SEC, marginBottom: 4 }}>{booking.slot.emoji} TIME SLOT</div>
                <div style={{ fontSize: ".82rem", fontWeight: 700, color: NAVY }}>{booking.slot.time}</div>
              </div>
              <div style={{ background: "#f8f8f8", padding: "14px 16px", borderRadius: 12 }}>
                <div style={{ fontSize: ".62rem", fontWeight: 600, color: SEC, marginBottom: 4 }}>{booking.room.icon} ROOM TYPE</div>
                <div style={{ fontSize: ".82rem", fontWeight: 700, color: NAVY }}>{booking.room.name}</div>
              </div>
              <div style={{ background: "#f8f8f8", padding: "14px 16px", borderRadius: 12 }}>
                <div style={{ fontSize: ".62rem", fontWeight: 600, color: SEC, marginBottom: 4 }}>🚪 ROOMS</div>
                <div style={{ fontSize: ".82rem", fontWeight: 700, color: NAVY }}>{booking.rooms} room{booking.rooms > 1 ? "s" : ""}</div>
              </div>
            </div>

            {/* Guest info */}
            <div style={{
              padding: "16px 18px", borderRadius: 14,
              border: `1px solid #f0f0f0`,
              marginBottom: 20,
            }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                onClick={() => setShowDetails(!showDetails)}>
                Guest Information
                <span style={{ color: SEC, transform: showDetails ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
              </div>
              {showDetails && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".76rem" }}>
                    <span style={{ color: SEC }}>Name</span>
                    <span style={{ fontWeight: 700, color: NAVY }}>{booking.guest.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".76rem" }}>
                    <span style={{ color: SEC }}>Email</span>
                    <span style={{ fontWeight: 700, color: NAVY }}>{booking.guest.email}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".76rem" }}>
                    <span style={{ color: SEC }}>Phone</span>
                    <span style={{ fontWeight: 700, color: NAVY }}>{booking.guest.phone}</span>
                  </div>
                  {booking.guest.special && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".76rem" }}>
                      <span style={{ color: SEC }}>Special requests</span>
                      <span style={{ fontWeight: 600, color: NAVY, maxWidth: 200, textAlign: "right" }}>{booking.guest.special}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div style={{
              padding: "16px 20px", borderRadius: 14,
              background: "#f8f8f8", marginBottom: 14,
            }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginBottom: 10 }}>Price Breakdown</div>
              {booking.subtotal !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: ".74rem", color: "#555" }}>
                  <span>{booking.room.name} × {booking.rooms} room{booking.rooms > 1 ? "s" : ""}</span>
                  <span style={{ fontWeight: 600 }}>${booking.subtotal}</span>
                </div>
              )}
              {booking.serviceFee !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: ".74rem", color: "#555" }}>
                  <span>Service fee</span>
                  <span style={{ fontWeight: 600 }}>${booking.serviceFee}</span>
                </div>
              )}
              {booking.taxAmount !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: ".74rem", color: "#555" }}>
                  <span>Tax ({booking.taxRate}% + ${booking.taxFlatFee?.toFixed(2)} fee)</span>
                  <span style={{ fontWeight: 600 }}>${booking.taxAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 20px", borderRadius: 14,
              background: `linear-gradient(135deg, ${NAVY}, #1a3a60)`,
              color: "#fff",
            }}>
              <div>
                <div style={{ fontSize: ".68rem", opacity: .6 }}>TOTAL PAID</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-.03em" }}>${booking.total.toFixed(2)}</div>
              </div>
              <div style={{
                background: "rgba(10,124,78,.8)", padding: "6px 14px",
                borderRadius: 8, fontSize: ".72rem", fontWeight: 800,
              }}>✓ Paid</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button style={{
            flex: 1, height: 48, borderRadius: 14,
            border: `1.5px solid ${BRD}`, background: "#fff",
            fontSize: ".82rem", fontWeight: 700, color: NAVY,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            🖨️ Print Confirmation
          </button>
          <button style={{
            flex: 1, height: 48, borderRadius: 14,
            border: `1.5px solid ${BRD}`, background: "#fff",
            fontSize: ".82rem", fontWeight: 700, color: NAVY,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            📧 Email Receipt
          </button>
        </div>

        {/* What's next */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 28px",
          border: `1px solid ${BRD}`, marginTop: 24,
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>
            What happens <span style={{ color: A }}>next?</span>
          </h3>
          {[
            { icon: "📧", title: "Check your email", desc: "Confirmation and check-in instructions have been sent to " + booking.guest.email },
            { icon: "🏨", title: "Arrive at the hotel", desc: `Show your booking ID (${booking.bookingId}) at the front desk for express check-in` },
            { icon: "🔑", title: "Enjoy your stay", desc: `Your ${booking.room.name} will be ready at ${booking.slot.time.split("–")[0].trim()}` },
            { icon: "✅", title: "Check out", desc: `Simply leave the key at the front desk when your time slot ends at ${booking.slot.time.split("–")[1].trim()}` },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, padding: "12px 0",
              borderBottom: i < 3 ? `1px solid #f5f5f5` : "none",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#f8f8f8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", flexShrink: 0,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: ".8rem", fontWeight: 700, color: NAVY }}>{s.title}</div>
                <div style={{ fontSize: ".7rem", color: SEC, lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Book another */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={onHome} style={{
            background: `linear-gradient(135deg, ${A}, #ff6b35)`,
            border: "none", borderRadius: 14, color: "#fff",
            padding: "14px 36px", fontSize: ".88rem", fontWeight: 800,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: `0 8px 24px rgba(255,77,0,.3)`,
          }}>
            Book Another Stay →
          </button>
          <p style={{ fontSize: ".7rem", color: SEC, marginTop: 10 }}>
            Thank you for choosing couple.ofhours ❤️
          </p>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0); }
          50% { transform: scale(1.2); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

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
function BookingCard({ hotel, selectedSlot, onSlotChange, selectedRoom, onRoomChange, rooms, onRoomsChange, onReserve }: {
  hotel: Hotel; selectedSlot: number; onSlotChange: (i: number) => void;
  selectedRoom: number; onRoomChange: (i: number) => void;
  rooms: number; onRoomsChange: (n: number) => void;
  onReserve: () => void;
}) {
  const room = ROOM_TYPES[selectedRoom];
  const total = room.price * 6 * rooms;

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
          <span style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-.03em" }}>${room.price}</span>
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
          vs ${room.nightPrice}/night at full price
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

        {/* Room type */}
        <div style={{ fontSize: ".72rem", fontWeight: 700, color: NAVY, marginTop: 18, marginBottom: 10 }}>Select room type</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ROOM_TYPES.map((r, i) => (
            <button key={i} onClick={() => onRoomChange(i)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 12px", borderRadius: 10,
              border: selectedRoom === i ? `2px solid ${A}` : `1.5px solid ${BRD}`,
              background: selectedRoom === i ? "#fff5f0" : "#fff",
              cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
            }}>
              <span>{r.icon}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: selectedRoom === i ? A : NAVY }}>{r.name}</div>
              </div>
              <span style={{ fontSize: ".76rem", fontWeight: 800, color: selectedRoom === i ? A : NAVY }}>${r.price}/hr</span>
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
            <button onClick={() => onRoomsChange(Math.max(1, rooms - 1))} style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${BRD}`, background: "#fff",
              fontSize: ".9rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: ".9rem", fontWeight: 800, color: NAVY }}>{rooms}</span>
            <button onClick={() => onRoomsChange(Math.min(3, rooms + 1))} style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${BRD}`, background: "#fff",
              fontSize: ".9rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
          </div>
        </div>

        {/* CTA */}
        <button onClick={onReserve} style={{
          width: "100%", height: 50, marginTop: 16,
          background: `linear-gradient(135deg, ${A}, #ff6b35)`,
          border: "none", borderRadius: 14,
          color: "#fff", fontSize: ".92rem", fontWeight: 800,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 8px 24px rgba(255,77,0,.3)`,
          transition: "all .2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          Reserve Now — ${total}
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
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
function RoomTypesSection({ hotel, selectedRoom, onSelect }: { hotel: Hotel; selectedRoom: number; onSelect: (i: number) => void }) {
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
            border: selectedRoom === i ? `2px solid ${A}` : expanded === i ? `2px solid ${A}` : `1px solid ${BRD}`,
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
                <button onClick={() => onSelect(i)} style={{
                  background: selectedRoom === i ? "#0a7c4e" : A, border: "none", color: "#fff",
                  padding: "10px 24px", borderRadius: 10,
                  fontSize: ".78rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  marginTop: 4,
                }}>
                  {selectedRoom === i ? "✓ Selected" : "Select this room →"}
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
export default function HotelPage({ hotel, onBack, onBookingComplete }: { hotel: Hotel; onBack: () => void; onBookingComplete?: (booking: BookingData) => void }) {
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [fav, setFav] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const mob = useIsMobile();

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
          <div onClick={onBack} style={{ fontSize: "1.05rem", fontWeight: 900, cursor: "pointer", letterSpacing: "-.02em", color: NAVY }}>coupleofhours<span style={{ color: A }}>.com</span></div>
        </div>

        {/* Section tabs - hide on mobile */}
        {!mob && (
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
        )}

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

        {/* Two column layout */}
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 24 : 30, marginTop: 30 }}>
          {/* Left column */}
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

            <div id="section-rooms">
              <RoomTypesSection hotel={hotel} selectedRoom={selectedRoom} onSelect={setSelectedRoom} />
            </div>

            <div id="section-amenities">
              <AmenitySection hotel={hotel} />
            </div>

            <div id="section-reviews">
              <ReviewsSection />
            </div>

            <div id="section-location">
              <MiniMap hotel={hotel} />
            </div>

            <FAQSection />
          </div>

          {/* Right column: Sticky booking card */}
          <div style={{ width: mob ? "100%" : 360, flexShrink: 0 }}>
            <BookingCard
              hotel={hotel}
              selectedSlot={selectedSlot}
              onSlotChange={setSelectedSlot}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
              rooms={rooms}
              onRoomsChange={setRooms}
              onReserve={() => setShowBookingModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          hotel={hotel}
          slot={SLOT_OFFERS[selectedSlot]}
          room={ROOM_TYPES[selectedRoom]}
          rooms={rooms}
          onClose={() => setShowBookingModal(false)}
          onConfirm={(data) => {
            setShowBookingModal(false);
            onBookingComplete?.(data);
          }}
        />
      )}
    </div>
  );
}