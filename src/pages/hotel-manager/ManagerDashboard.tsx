import { CalendarCheck, DollarSign, Users, TrendingUp, ArrowUpRight, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useManagerListing, useHotelReservations, useAvailabilitySlots, useHotelReviews } from "@/hooks/useHotelData";
import { HOTEL_INFO, MANAGER_KPIS, TODAY_TIMELINE, RECENT_ACTIVITY, ROOM_TYPES, AVAILABILITY_SLOTS } from "@/data/hotelManagerMockData";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // Real data hooks
  const { data: listing, isLoading: listingLoading } = useManagerListing();
  const { data: dbReservations } = useHotelReservations(listing?.id);
  const { data: dbSlots } = useAvailabilitySlots(listing?.id, today);
  const { data: dbReviews } = useHotelReviews(listing?.id);

  // Use real data if available, fall back to mock
  const hasRealData = !!listing;
  const hotelName = listing?.hotel_name || HOTEL_INFO.name;
  const managerName = listing?.contact_person_name?.split(" ")[0] || HOTEL_INFO.manager.name.split(" ")[0];

  // Compute KPIs from real data or use mock
  const todayReservations = dbReservations?.filter(r => r.check_in_date === today) || [];
  const todayBookings = hasRealData ? todayReservations.length : MANAGER_KPIS.todayBookings;
  const todayRevenue = hasRealData ? todayReservations.reduce((s, r) => s + Number(r.total_price), 0) : MANAGER_KPIS.todayRevenue;
  const totalReviews = hasRealData ? (dbReviews?.length || 0) : HOTEL_INFO.totalReviews;
  const avgRating = hasRealData
    ? (dbReviews && dbReviews.length > 0 ? (dbReviews.reduce((s, r) => s + r.rating, 0) / dbReviews.length).toFixed(1) : "N/A")
    : MANAGER_KPIS.avgRating;

  // Room types from listing or mock
  const roomTypes = hasRealData && listing?.room_types
    ? (listing.room_types as any[]).map((rt: any, i: number) => ({ id: rt.id || `rt-${i}`, name: rt.name || rt.type, ...rt }))
    : ROOM_TYPES;

  // Availability slots
  const todaySlots = hasRealData && dbSlots ? dbSlots : AVAILABILITY_SLOTS.filter(s => s.date === today);

  const KPI_CARDS = [
    { title: "Today's Bookings", value: todayBookings, icon: CalendarCheck, accent: "hsl(217, 91%, 60%)", sub: `${hasRealData ? todayReservations.filter(r => r.status === 'upcoming').length : MANAGER_KPIS.pendingCheckIns} pending check-ins` },
    { title: "Today's Revenue", value: `₹${todayRevenue.toLocaleString("en-IN")}`, icon: DollarSign, accent: "hsl(142, 71%, 45%)", sub: "Across all room types" },
    { title: "Occupancy Rate", value: `${MANAGER_KPIS.occupancyRate}%`, icon: TrendingUp, accent: "hsl(38, 92%, 50%)", sub: `${hasRealData ? (dbReservations?.filter(r => r.status === 'upcoming').length || 0) : MANAGER_KPIS.activeGuests} active guests` },
    { title: "Avg Rating", value: avgRating, icon: Star, accent: "hsl(270, 60%, 60%)", sub: `${totalReviews} total reviews` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {managerName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening at {hotelName} today</p>
        {!hasRealData && !listingLoading && (
          <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
            ⚠️ No listing found — showing demo data. <button onClick={() => navigate("/manager/listing")} className="underline">Create your listing</button>
          </p>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, i) => (
          <Card key={i} className="border-border bg-card text-card-foreground">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.accent}20` }}>
                  <kpi.icon className="h-5 w-5" style={{ color: kpi.accent }} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-500">
                  <ArrowUpRight className="h-3 w-3" />+12%
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.title}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate("/manager/availability")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-primary/10 text-primary border border-primary/20">
          <Clock className="h-3.5 w-3.5" />Manage Availability
        </button>
        <button onClick={() => navigate("/manager/reservations")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors" style={{ background: "hsla(217, 91%, 60%, 0.12)", color: "hsl(217, 91%, 65%)", border: "1px solid hsla(217, 91%, 60%, 0.2)" }}>
          <CalendarCheck className="h-3.5 w-3.5" />View Reservations
          <Badge className="h-5 min-w-5 text-[10px] border-0 text-primary-foreground bg-primary">
            {hasRealData ? todayReservations.filter(r => r.status === 'upcoming').length : MANAGER_KPIS.pendingCheckIns}
          </Badge>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Timeline */}
        <Card className="lg:col-span-2 border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Today's Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {TODAY_TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-[11px] text-muted-foreground/60 w-16 shrink-0 pt-0.5">{item.time}</span>
                <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{
                  background: item.type === "vip" ? "hsl(38, 92%, 50%)" : item.type === "check-out" ? "hsl(0, 70%, 55%)" : item.type === "housekeeping" ? "hsl(270, 60%, 55%)" : "hsl(142, 71%, 45%)"
                }} />
                <p className="text-xs text-foreground/70">{item.event}</p>
                {item.type === "vip" && <Badge className="text-[9px] h-4 border-0 ml-auto" style={{ background: "hsla(38, 92%, 50%, 0.2)", color: "hsl(38, 92%, 60%)" }}>VIP</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
            {RECENT_ACTIVITY.map(a => (
              <div key={a.id} className="flex gap-3 items-start">
                <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(217, 91%, 60%)" }} />
                <div>
                  <p className="text-xs text-foreground/70 leading-relaxed">{a.action}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{new Date(a.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Today's Slot Overview */}
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Today's Availability Snapshot</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {roomTypes.map((rt: any) => {
              const slots = todaySlots.filter((s: any) => (s.roomTypeId || s.room_type_id) === rt.id);
              const totalListed = slots.reduce((s: number, sl: any) => s + (sl.roomsListed || sl.rooms_listed || 0), 0);
              const totalBooked = slots.reduce((s: number, sl: any) => s + (sl.roomsBooked || sl.rooms_booked || 0), 0);
              return (
                <div key={rt.id} className="rounded-lg p-3 bg-muted/50 border border-border">
                  <p className="text-xs font-medium text-foreground/70">{rt.name}</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{totalBooked}/{totalListed}</span>
                    <span className="text-[10px] text-muted-foreground mb-0.5">booked</span>
                  </div>
                  <div className="h-1.5 rounded-full mt-2 overflow-hidden bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${totalListed > 0 ? (totalBooked / totalListed) * 100 : 0}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{slots.length} active slots</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
