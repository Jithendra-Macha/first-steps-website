import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MOCK_TRANSACTIONS, MOCK_HOTELS, MONTHLY_REVENUE } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";

const COMMISSION_BY_CATEGORY = [
  { name: "Luxury", value: 35, fill: "hsl(270, 60%, 60%)" },
  { name: "Boutique", value: 25, fill: "hsl(217, 91%, 60%)" },
  { name: "Business", value: 20, fill: "hsl(142, 71%, 45%)" },
  { name: "Budget", value: 12, fill: "hsl(38, 92%, 50%)" },
  { name: "Resort", value: 8, fill: "hsl(0, 84%, 60%)" },
];

const TOP_HOTELS = MOCK_HOTELS.sort((a, b) => b.revenue - a.revenue).slice(0, 10);

export default function FinancialsPage() {
  const totalRevenue = MOCK_TRANSACTIONS.filter(t => t.type === "booking").reduce((s, t) => s + t.amount, 0);
  const totalRefunds = Math.abs(MOCK_TRANSACTIONS.filter(t => t.type === "refund").reduce((s, t) => s + t.amount, 0));
  const commission = Math.round(totalRevenue * 0.12);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Financials</h1>
        <p className="text-xs text-white/40 mt-0.5">Revenue, commissions, and transactions</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Gross Revenue</p><p className="text-xl font-bold">${totalRevenue.toLocaleString()}</p></CardContent></Card>
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Commission</p><p className="text-xl font-bold text-green-400">${commission.toLocaleString()}</p></CardContent></Card>
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Refunds</p><p className="text-xl font-bold text-red-400">${totalRefunds.toLocaleString()}</p></CardContent></Card>
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Pending Payouts</p><p className="text-xl font-bold text-amber-400">$8,400</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Revenue vs Refunds (Monthly)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_REVENUE.map(m => ({ ...m, refunds: Math.round(m.revenue * 0.08) }))}>
                <CartesianGrid stroke="hsla(0,0%,100%,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsla(0,0%,100%,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(220,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="refunds" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Refunds" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Commission by Category</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={COMMISSION_BY_CATEGORY} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {COMMISSION_BY_CATEGORY.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {COMMISSION_BY_CATEGORY.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-white/50">
                <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />{d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Hotels */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Top 10 Revenue Hotels</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TOP_HOTELS.map((h, i) => (
              <div key={h.id} className="flex items-center gap-3">
                <span className="text-[11px] text-white/30 w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="h-5 rounded-full overflow-hidden" style={{ background: "hsla(0,0%,100%,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(h.revenue / TOP_HOTELS[0].revenue) * 100}%`, background: `hsl(${217 + i * 8}, 70%, 55%)` }} />
                  </div>
                </div>
                <span className="text-xs text-white/60 min-w-[100px] truncate">{h.name}</span>
                <span className="text-xs text-white/80 font-mono">${h.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
        <CardHeader><CardTitle className="text-sm text-white/60">Recent Transactions</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px]">ID</TableHead>
              <TableHead className="text-white/40 text-[11px]">Type</TableHead>
              <TableHead className="text-white/40 text-[11px]">Customer</TableHead>
              <TableHead className="text-white/40 text-[11px]">Hotel</TableHead>
              <TableHead className="text-white/40 text-[11px]">Amount</TableHead>
              <TableHead className="text-white/40 text-[11px]">Date</TableHead>
              <TableHead className="text-white/40 text-[11px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TRANSACTIONS.slice(0, 20).map(t => (
              <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.03]">
                <TableCell className="text-[11px] text-white/30 font-mono">{t.id}</TableCell>
                <TableCell><span className={`text-[11px] px-2 py-0.5 rounded capitalize ${t.type === "refund" ? "bg-red-500/10 text-red-400" : t.type === "commission" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>{t.type}</span></TableCell>
                <TableCell className="text-xs text-white/70">{t.customerName}</TableCell>
                <TableCell className="text-xs text-white/50">{t.hotelName}</TableCell>
                <TableCell className={`text-xs font-mono ${t.amount < 0 ? "text-red-400" : "text-white/70"}`}>{t.amount < 0 ? `-$${Math.abs(t.amount)}` : `$${t.amount}`}</TableCell>
                <TableCell className="text-xs text-white/40">{t.date}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
