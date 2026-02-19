import { Building2, Users, CalendarCheck, DollarSign, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  MOCK_HOTELS, MOCK_CUSTOMERS, MOCK_RESERVATIONS, MOCK_REVIEWS,
  MONTHLY_RESERVATIONS, MONTHLY_REGISTRATIONS, RESERVATION_STATUS_DATA, MONTHLY_REVENUE,
  MOCK_ACTIVITY
} from "@/data/adminMockData";

const KPI_CARDS = [
  {
    title: "Total Hotels",
    value: MOCK_HOTELS.length,
    sub: `${MOCK_HOTELS.filter(h => h.status === "live").length} Active · ${MOCK_HOTELS.filter(h => h.status === "pending").length} Pending`,
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
    value: MOCK_RESERVATIONS.length,
    sub: `${MOCK_RESERVATIONS.filter(r => r.status === "confirmed").length} Ongoing · ${MOCK_RESERVATIONS.filter(r => r.status === "cancelled").length} Cancelled`,
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

export default function DashboardOverview() {
  const navigate = useNavigate();
  const pendingCount = MOCK_HOTELS.filter(h => h.status === "pending").length;
  const flaggedReviews = MOCK_REVIEWS.filter(r => r.status === "flagged").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Platform overview and recent activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, i) => (
          <Card key={i} className="border-white/8 bg-white/[0.03] text-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.accent}20` }}>
                  <kpi.icon className="h-5 w-5" style={{ color: kpi.accent }} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{kpi.value}</div>
                <p className="text-xs text-white/40 mt-0.5">{kpi.title}</p>
                <p className="text-[11px] text-white/25 mt-1">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button size="sm" className="bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25" onClick={() => navigate("/admin/hotels/pending")}>
          <Clock className="h-3.5 w-3.5 mr-1.5" />Pending Approvals
          <Badge className="ml-2 h-5 min-w-5 bg-amber-500 text-white border-0 text-[10px]">{pendingCount}</Badge>
        </Button>
        <Button size="sm" className="bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25" onClick={() => navigate("/admin/hotels")}>
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />Reported Hotels
          <Badge className="ml-2 h-5 min-w-5 bg-red-500 text-white border-0 text-[10px]">2</Badge>
        </Button>
        <Button size="sm" className="bg-purple-500/15 text-purple-400 border border-purple-500/20 hover:bg-purple-500/25" onClick={() => navigate("/admin/reviews")}>
          <Flag className="h-3.5 w-3.5 mr-1.5" />Flagged Reviews
          <Badge className="ml-2 h-5 min-w-5 bg-purple-500 text-white border-0 text-[10px]">{flaggedReviews}</Badge>
        </Button>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Reservations Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_RESERVATIONS}>
                <CartesianGrid stroke="hsla(0,0%,100%,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(217, 91%, 60%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Hotel Registrations / Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_REGISTRATIONS}>
                <CartesianGrid stroke="hsla(0,0%,100%,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Reservation Breakdown</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={RESERVATION_STATUS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {RESERVATION_STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {RESERVATION_STATUS_DATA.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-white/50">
                <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />{d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </Card>

        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Revenue Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(270, 60%, 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(270, 60%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsla(0,0%,100%,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(220,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(270, 60%, 60%)" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[280px] overflow-y-auto">
            {MOCK_ACTIVITY.map(a => (
              <div key={a.id} className="flex gap-3 items-start">
                <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ background: "hsl(217, 91%, 60%)" }} />
                <div className="min-w-0">
                  <p className="text-xs text-white/70 leading-relaxed">{a.action}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{new Date(a.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
