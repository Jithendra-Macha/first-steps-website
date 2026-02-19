import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAllReservations } from "@/hooks/useHotelData";
import { MOCK_TRANSACTIONS, MOCK_HOTELS, MONTHLY_REVENUE } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";

const COMMISSION_RATE = 5; // $5 flat per booking

export default function FinancialsPage() {
  const { data: dbReservations = [] } = useAllReservations();
  
  const hasRealData = dbReservations.length > 0;
  
  // Real data calculations
  const realGrossRevenue = dbReservations.reduce((s, r: any) => s + Number(r.total_price || 0), 0);
  const realCommission = dbReservations.reduce((s, r: any) => s + Number(r.platform_commission || COMMISSION_RATE), 0);
  const realRefunds = dbReservations.filter((r: any) => r.status === "cancelled").reduce((s, r: any) => s + Number(r.total_price || 0), 0);

  // Fallback mock data
  const mockGrossRevenue = MOCK_TRANSACTIONS.filter(t => t.type === "booking").reduce((s, t) => s + t.amount, 0);
  const mockRefunds = Math.abs(MOCK_TRANSACTIONS.filter(t => t.type === "refund").reduce((s, t) => s + t.amount, 0));
  const mockCommission = Math.round(mockGrossRevenue * 0.12);

  const totalRevenue = hasRealData ? realGrossRevenue : mockGrossRevenue;
  const commission = hasRealData ? realCommission : mockCommission;
  const totalRefunds = hasRealData ? realRefunds : mockRefunds;

  const COMMISSION_BY_CATEGORY = [
    { name: "Luxury", value: 35, fill: "hsl(270, 60%, 60%)" },
    { name: "Boutique", value: 25, fill: "hsl(217, 91%, 60%)" },
    { name: "Business", value: 20, fill: "hsl(142, 71%, 45%)" },
    { name: "Budget", value: 12, fill: "hsl(38, 92%, 50%)" },
    { name: "Resort", value: 8, fill: "hsl(0, 84%, 60%)" },
  ];

  const TOP_HOTELS = MOCK_HOTELS.sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Financials</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Revenue, commissions, and transactions</p>
        {hasRealData && (
          <p className="text-xs text-emerald-500 mt-1">✅ Showing live data from {dbReservations.length} reservation(s) — $5 flat commission per booking</p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card"><CardContent className="p-4"><p className="text-[11px] text-muted-foreground">Gross Revenue</p><p className="text-xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><p className="text-[11px] text-muted-foreground">Platform Commission</p><p className="text-xl font-bold text-emerald-500">${commission.toLocaleString()}</p><p className="text-[10px] text-muted-foreground/60 mt-0.5">$5 × {dbReservations.length} bookings</p></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><p className="text-[11px] text-muted-foreground">Refunds</p><p className="text-xl font-bold text-destructive">${totalRefunds.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><p className="text-[11px] text-muted-foreground">Hotel Payouts</p><p className="text-xl font-bold text-primary">${(totalRevenue - commission - totalRefunds).toLocaleString()}</p></CardContent></Card>
      </div>

      {/* Real Reservations Table */}
      {hasRealData && (
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Live Reservations & Commission</CardTitle></CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[11px]">Booking ID</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Guest</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Hotel</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Amount</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Commission</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Net to Hotel</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dbReservations.map((r: any) => (
                <TableRow key={r.id} className="border-border/50 hover:bg-accent/50">
                  <TableCell className="text-[11px] text-muted-foreground font-mono">{r.booking_id}</TableCell>
                  <TableCell className="text-xs text-foreground/70">{r.guest_name || "Registered User"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.hotel_name}</TableCell>
                  <TableCell className="text-xs text-foreground/70">${Number(r.total_price).toFixed(0)}</TableCell>
                  <TableCell className="text-xs text-emerald-500 font-medium">${Number(r.platform_commission || 5).toFixed(0)}</TableCell>
                  <TableCell className="text-xs text-foreground/70">${(Number(r.total_price) - Number(r.platform_commission || 5)).toFixed(0)}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      r.status === "upcoming" ? "bg-primary/10 text-primary" :
                      r.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>{r.status}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Revenue vs Refunds (Monthly)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_REVENUE.map(m => ({ ...m, refunds: Math.round(m.revenue * 0.08) }))}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 }} />
                <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="refunds" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Refunds" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Commission by Category</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={COMMISSION_BY_CATEGORY} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {COMMISSION_BY_CATEGORY.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {COMMISSION_BY_CATEGORY.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />{d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Hotels */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Top 10 Revenue Hotels</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TOP_HOTELS.map((h, i) => (
              <div key={h.id} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground/50 w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="h-5 rounded-full overflow-hidden bg-muted/30">
                    <div className="h-full rounded-full" style={{ width: `${(h.revenue / TOP_HOTELS[0].revenue) * 100}%`, background: `hsl(${217 + i * 8}, 70%, 55%)` }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground min-w-[100px] truncate">{h.name}</span>
                <span className="text-xs text-foreground/80 font-mono">${h.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mock Transactions Table */}
      {!hasRealData && (
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Recent Transactions (Demo)</CardTitle></CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[11px]">ID</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Type</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Customer</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Hotel</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Amount</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Date</TableHead>
                <TableHead className="text-muted-foreground text-[11px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TRANSACTIONS.slice(0, 20).map(t => (
                <TableRow key={t.id} className="border-border/50 hover:bg-accent/50">
                  <TableCell className="text-[11px] text-muted-foreground font-mono">{t.id}</TableCell>
                  <TableCell><span className={`text-[11px] px-2 py-0.5 rounded capitalize ${t.type === "refund" ? "bg-destructive/10 text-destructive" : t.type === "commission" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"}`}>{t.type}</span></TableCell>
                  <TableCell className="text-xs text-foreground/70">{t.customerName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.hotelName}</TableCell>
                  <TableCell className={`text-xs font-mono ${t.amount < 0 ? "text-destructive" : "text-foreground/70"}`}>{t.amount < 0 ? `-$${Math.abs(t.amount)}` : `$${t.amount}`}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
