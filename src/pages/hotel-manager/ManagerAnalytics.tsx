import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { HEATMAP_DATA, OCCUPANCY_TREND, ROOM_TYPE_REVENUE, ANALYTICS_INSIGHTS } from "@/data/hotelManagerMockData";
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

export default function ManagerAnalytics() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Analytics</h1>
        <p className="text-sm text-white/40 mt-1">Performance insights and trends</p>
      </div>

      {/* Heatmap */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Occupancy Heatmap (Time of Day vs Day of Week)</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Header */}
            <div className="flex">
              <div className="w-12 shrink-0" />
              {HEATMAP_DATA[0].hours.map(h => (
                <div key={h.hour} className="flex-1 text-center text-[9px] text-white/20">{h.hour > 12 ? `${h.hour - 12}P` : h.hour === 12 ? "12P" : `${h.hour}A`}</div>
              ))}
            </div>
            {/* Rows */}
            {HEATMAP_DATA.map(row => (
              <div key={row.day} className="flex items-center">
                <div className="w-12 shrink-0 text-[10px] text-white/30">{row.day}</div>
                {row.hours.map(h => (
                  <div
                    key={h.hour}
                    className="flex-1 aspect-square rounded-sm mx-[1px]"
                    title={`${row.day} ${h.hour}:00 — ${h.occupancy}%`}
                    style={{
                      background: h.occupancy > 80 ? "hsla(18, 100%, 50%, 0.7)" : h.occupancy > 60 ? "hsla(18, 100%, 50%, 0.4)" : h.occupancy > 40 ? "hsla(18, 100%, 50%, 0.2)" : "hsla(0,0%,100%,0.04)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3 text-[10px] text-white/30">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm" style={{ background: "hsla(0,0%,100%,0.04)" }} />&lt;40%</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm" style={{ background: "hsla(18, 100%, 50%, 0.2)" }} />40-60%</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm" style={{ background: "hsla(18, 100%, 50%, 0.4)" }} />60-80%</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm" style={{ background: "hsla(18, 100%, 50%, 0.7)" }} />&gt;80%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Occupancy Trend */}
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Monthly Occupancy Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={OCCUPANCY_TREND}>
                <defs>
                  <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(18, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(18, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsla(0,0%,100%,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "hsla(0,0%,100%,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsla(0,0%,100%,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "hsl(225,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="occupancy" stroke="hsl(18, 100%, 50%)" fill="url(#occGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Room Type */}
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60">Revenue by Room Type</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ROOM_TYPE_REVENUE}>
                <CartesianGrid stroke="hsla(0,0%,100%,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "hsla(0,0%,100%,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsla(0,0%,100%,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(225,28%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(18, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-white/60 flex items-center gap-2"><Lightbulb className="h-4 w-4" />Auto-Generated Insights</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {ANALYTICS_INSIGHTS.map(insight => (
            <div key={insight.id} className="flex items-start gap-3 rounded-lg p-3" style={{
              background: insight.type === "positive" ? "hsla(142, 71%, 45%, 0.06)" : "hsla(38, 92%, 50%, 0.06)",
              border: `1px solid ${insight.type === "positive" ? "hsla(142, 71%, 45%, 0.12)" : "hsla(38, 92%, 50%, 0.12)"}`,
            }}>
              {insight.type === "positive" ? <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(142, 71%, 55%)" }} /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(38, 92%, 55%)" }} />}
              <p className="text-xs text-white/60">{insight.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
