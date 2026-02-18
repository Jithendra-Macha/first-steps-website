import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Btn, useIsMobile } from "@/components/coh/SharedComponents";

const A = "#ff4d00";
const NAVY = "#0d1f38";
const SEC = "#888";
const BRD = "#e8e8e8";

interface Reservation {
  id: string;
  hotel_name: string;
  hotel_image: string | null;
  hotel_address: string | null;
  room_type: string;
  check_in_date: string;
  time_slot: string | null;
  guests: number;
  total_price: number;
  status: "upcoming" | "past" | "cancelled";
  booking_id: string;
  created_at: string;
}

export default function ReservationsPage({ onBack, onSearch }: { onBack: () => void; onSearch: (q: string) => void }) {
  const { user } = useAuth();
  const mob = useIsMobile();
  const [tab, setTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("reservations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReservations((data as Reservation[]) || []);
        setLoading(false);
      });
  }, [user]);

  const filtered = reservations.filter(r => r.status === tab);

  const handleCancel = async (id: string) => {
    await supabase.from("reservations").update({ status: "cancelled" as any }).eq("id", id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" as const } : r));
  };

  const tabs = [
    { key: "upcoming" as const, label: "Upcoming", icon: "📅" },
    { key: "past" as const, label: "Past", icon: "✅" },
    { key: "cancelled" as const, label: "Cancelled", icon: "❌" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY}, #1a3a60)`, padding: mob ? "20px 4%" : "32px 5%", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: ".78rem", fontWeight: 600, marginBottom: 16 }}>← Back</button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, margin: 0 }}>My <span style={{ color: A }}>Reservations</span></h1>
          <p style={{ fontSize: ".78rem", opacity: .7, marginTop: 4, marginBottom: 0 }}>{reservations.length} total booking{reservations.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: mob ? "20px 4%" : "32px 5%" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: tab === t.key ? A : "#fff", color: tab === t.key ? "#fff" : NAVY,
              border: tab === t.key ? "none" : `1.5px solid ${BRD}`, borderRadius: 12, padding: "10px 20px",
              fontSize: ".8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}>
              {t.icon} {t.label} ({reservations.filter(r => r.status === t.key).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: SEC }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>
              {tab === "upcoming" ? "📅" : tab === "past" ? "✅" : "❌"}
            </div>
            <h3 style={{ color: NAVY, fontWeight: 800, marginBottom: 8 }}>No {tab} bookings</h3>
            <p style={{ color: SEC, fontSize: ".82rem", marginBottom: 20 }}>
              {tab === "upcoming" ? "Time to plan your next hourly escape!" : tab === "past" ? "Your completed bookings will appear here" : "No cancelled bookings yet"}
            </p>
            {tab === "upcoming" && (
              <Btn onClick={() => onSearch("Manhattan")} style={{ height: 40, padding: "0 24px", fontSize: ".82rem" }}>
                Browse Hotels
              </Btn>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(r => (
              <div key={r.id} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BRD}`, overflow: "hidden", display: "flex", flexDirection: mob ? "column" : "row" }}>
                <div style={{ width: mob ? "100%" : 180, height: mob ? 140 : "auto", background: `linear-gradient(135deg, ${NAVY}, #1a3a60)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "2rem", flexShrink: 0 }}>
                  🏨
                </div>
                <div style={{ flex: 1, padding: mob ? "16px" : "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <h3 style={{ fontSize: ".95rem", fontWeight: 800, color: NAVY, margin: 0 }}>{r.hotel_name}</h3>
                      {r.hotel_address && <p style={{ fontSize: ".72rem", color: SEC, margin: "2px 0 0" }}>{r.hotel_address}</p>}
                    </div>
                    <span style={{
                      fontSize: ".66rem", fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                      background: r.status === "upcoming" ? "#e3f2e3" : r.status === "past" ? "#f0f0f0" : "#fee",
                      color: r.status === "upcoming" ? "#2e7d32" : r.status === "past" ? SEC : "#c62828",
                    }}>{r.status.toUpperCase()}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                    <div style={{ fontSize: ".74rem", color: SEC }}><strong>Date:</strong> {new Date(r.check_in_date).toLocaleDateString()}</div>
                    {r.time_slot && <div style={{ fontSize: ".74rem", color: SEC }}><strong>Time:</strong> {r.time_slot}</div>}
                    <div style={{ fontSize: ".74rem", color: SEC }}><strong>Room:</strong> {r.room_type}</div>
                    <div style={{ fontSize: ".74rem", color: SEC }}><strong>Guests:</strong> {r.guests}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                    <div>
                      <span style={{ fontSize: ".68rem", color: SEC }}>Booking ID: </span>
                      <span style={{ fontSize: ".74rem", fontWeight: 700, color: NAVY }}>{r.booking_id}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: "1rem", fontWeight: 900, color: NAVY }}>${Number(r.total_price).toFixed(0)}</span>
                      {r.status === "upcoming" && (
                        <button onClick={() => handleCancel(r.id)} style={{ background: "none", border: `1.5px solid #e53935`, color: "#e53935", borderRadius: 8, padding: "6px 14px", fontSize: ".72rem", fontWeight: 700, cursor: "pointer" }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
