import { Building2, Users, CalendarCheck, DollarSign, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useAllListings, useAllReservations, useAllReviews } from "@/hooks/useHotelData";
import {
  MOCK_HOTELS, MOCK_CUSTOMERS, MOCK_RESERVATIONS, MOCK_REVIEWS,
  MONTHLY_RESERVATIONS, MONTHLY_REGISTRATIONS, RESERVATION_STATUS_DATA, MONTHLY_REVENUE,
  MOCK_ACTIVITY
} from "@/data/adminMockData";

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { data: dbListings } = useAllListings();
  const { data: dbReservations } = useAllReservations();
  const { data: dbReviews } = useAllReviews();

  const hasRealData = (dbListings?.length || 0) > 0;

  const totalHotels = hasRealData ? dbListings!.length : MOCK_HOTELS.length;
  const activeHotels = hasRealData ? dbListings!.filter(h => h.status === "live").length : MOCK_HOTELS.filter(h => h.status === "live").length;
  const pendingHotels = hasRealData ? dbListings!.filter(h => h.status === "pending").length : MOCK_HOTELS.filter(h => h.status === "pending").length;
  const totalReservations = (dbReservations?.length || 0) > 0 ? dbReservations!.length : MOCK_RESERVATIONS.length;
  const flaggedReviews = (dbReviews?.length || 0) > 0 ? dbReviews!.filter(r => r.status === "flagged" || r.status === "reported").length : MOCK_REVIEWS.filter(r => r.status === "flagged").length;

  const KPI_CARDS = [
    {
      title: "Total Hotels",
      value: totalHotels,
      sub: `${activeHotels} Active · ${pendingHotels} Pending`,
      icon: Building2,
      change: "+3",
      up: true,
      accent: "hsl(217, 91%, 60%)",
    },
    {
      title: "Total Customers",
      value: MOCK_CUSTOMERS.length,
      sub: `${MOCK_CUSTOMERS.filter(c => c.status === "flagged").length} Flagged`,
      icon: Users,
      change: "+12",
      up: true,
      accent: "hsl(142, 71%, 45%)",
    },
    {
      title: "Reservations",
      value: totalReservations,
      sub: `${(dbReservations || MOCK_RESERVATIONS).filter((r: any) => r.status === "confirmed" || r.status === "upcoming").length} Ongoing`,
      icon: CalendarCheck,
      change: "+8%",
      up: true,
      accent: "hsl(38, 92%, 50%)",
    },
    {
      title: "Revenue (Feb)",
      value: "$92,000",
      sub: "vs $85,000 last month",
      icon: DollarSign,
      change: "+8.2%",
      up: true,
      accent: "hsl(270, 60%, 60%)",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and recent activity</p>
        {!hasRealData && (
          <p className="text-xs text-amber-500 mt-2">⚠️ Showing demo data — real hotel listings will appear once hotels are registered.</p>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, i) => (
          <Card key={i} className="border-border bg-card text-card-foreground">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.accent}20` }}>
                  <kpi.icon className="h-5 w-5" style={{ color: kpi.accent }} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-emerald-500" : "text-destructive"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
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
        <Button size="sm" className="bg-amber-500/15 text-amber-500 border border-amber-500/20 hover:bg-amber-500/25" onClick={() => navigate("/admin/hotels/pending")}>
          <Clock className="h-3.5 w-3.5 mr-1.5" />Pending Approvals
          <Badge className="ml-2 h-5 min-w-5 bg-amber-500 text-white border-0 text-[10px]">{pendingHotels}</Badge>
        </Button>
        <Button size="sm" className="bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/25" onClick={() => navigate("/admin/hotels")}>
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />Reported Hotels
          <Badge className="ml-2 h-5 min-w-5 bg-destructive text-destructive-foreground border-0 text-[10px]">2</Badge>
        </Button>
        <Button size="sm" className="bg-purple-500/15 text-purple-500 border border-purple-500/20 hover:bg-purple-500/25" onClick={() => navigate("/admin/reviews")}>
          <Flag className="h-3.5 w-3.5 mr-1.5" />Flagged Reviews
          <Badge className="ml-2 h-5 min-w-5 bg-purple-500 text-white border-0 text-[10px]">{flaggedReviews}</Badge>
        </Button>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Reservations Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_RESERVATIONS}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(217, 91%, 60%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Hotel Registrations / Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_REGISTRATIONS}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Reservation Breakdown</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={RESERVATION_STATUS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {RESERVATION_STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {RESERVATION_STATUS_DATA.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />{d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Revenue Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(270, 60%, 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(270, 60%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(270, 60%, 60%)" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[280px] overflow-y-auto">
            {MOCK_ACTIVITY.map(a => (
              <div key={a.id} className="flex gap-3 items-start">
                <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(217, 91%, 60%)" }} />
                <div className="min-w-0">
                  <p className="text-xs text-foreground/70 leading-relaxed">{a.action}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{new Date(a.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
