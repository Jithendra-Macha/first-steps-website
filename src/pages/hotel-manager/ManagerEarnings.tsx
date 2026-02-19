import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { EARNINGS, MONTHLY_REVENUE_CHART } from "@/data/hotelManagerMockData";

export default function ManagerEarnings() {
  const totalGross = EARNINGS.reduce((s, e) => s + e.grossRevenue, 0);
  const totalNet = EARNINGS.reduce((s, e) => s + e.netPayout, 0);
  const totalFees = EARNINGS.reduce((s, e) => s + e.platformFee, 0);

  const KPIS = [
    { title: "Total Revenue", value: `₹${totalGross.toLocaleString("en-IN")}`, icon: DollarSign, accent: "hsl(142, 71%, 45%)" },
    { title: "Net Payout", value: `₹${totalNet.toLocaleString("en-IN")}`, icon: Wallet, accent: "hsl(217, 91%, 60%)" },
    { title: "Platform Fees", value: `₹${totalFees.toLocaleString("en-IN")}`, icon: TrendingUp, accent: "hsl(38, 92%, 50%)" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Earnings</h1>
          <p className="text-sm text-white/40 mt-1">Revenue breakdown and payout history</p>
        </div>
        <Button size="sm" variant="outline" className="border-white/10 text-white/50 text-xs">
          <Download className="h-3.5 w-3.5 mr-1" />Download Statement
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {KPIS.map((kpi, i) => (
          <Card key={i} className="border-white/8 bg-white/[0.03] text-white">
            <CardContent className="p-5">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.accent}20` }}>
                <kpi.icon className="h-5 w-5" style={{ color: kpi.accent }} />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{kpi.value}</div>
                <p className="text-xs text-white/40 mt-0.5">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Revenue vs Net Payout</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY_REVENUE_CHART}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsla(0,0%,100%,0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "hsla(0,0%,100%,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsla(0,0%,100%,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "hsl(225,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(142, 71%, 45%)" fill="url(#revGrad2)" strokeWidth={2} name="Gross Revenue" />
              <Area type="monotone" dataKey="payout" stroke="hsl(217, 91%, 60%)" fill="url(#payGrad)" strokeWidth={2} name="Net Payout" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Payout History</CardTitle></CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px]">Month</TableHead>
              <TableHead className="text-white/40 text-[11px]">Gross Revenue</TableHead>
              <TableHead className="text-white/40 text-[11px]">Platform Fee</TableHead>
              <TableHead className="text-white/40 text-[11px]">Taxes</TableHead>
              <TableHead className="text-white/40 text-[11px]">Net Payout</TableHead>
              <TableHead className="text-white/40 text-[11px]">Status</TableHead>
              <TableHead className="text-white/40 text-[11px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EARNINGS.map(e => (
              <TableRow key={e.id} className="border-white/5 hover:bg-white/[0.03]">
                <TableCell className="text-xs text-white/70">{e.month}</TableCell>
                <TableCell className="text-xs text-white/60">₹{e.grossRevenue.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs text-white/40">₹{e.platformFee.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs text-white/40">₹{e.taxes.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs text-white/70 font-medium">₹{e.netPayout.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                    background: e.status === "paid" ? "hsla(142, 71%, 45%, 0.15)" : e.status === "processing" ? "hsla(217, 91%, 60%, 0.15)" : "hsla(38, 92%, 50%, 0.15)",
                    color: e.status === "paid" ? "hsl(142, 71%, 55%)" : e.status === "processing" ? "hsl(217, 91%, 65%)" : "hsl(38, 92%, 60%)",
                  }}>{e.status}</span>
                </TableCell>
                <TableCell>
                  {e.status === "paid" && (
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white/30"><Download className="h-3 w-3 mr-1" />Receipt</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
