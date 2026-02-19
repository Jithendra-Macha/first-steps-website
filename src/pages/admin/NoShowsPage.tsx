import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_RESERVATIONS, MOCK_CUSTOMERS } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";

export default function NoShowsPage() {
  const noShows = MOCK_RESERVATIONS.filter(r => r.status === "no_show");
  const revenueLost = noShows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>No-Shows Management</h1>
        <p className="text-xs text-white/40 mt-0.5">Track and manage reservation no-shows</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardContent className="p-5">
            <p className="text-xs text-white/30">Total No-Shows</p>
            <p className="text-2xl font-bold mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>{noShows.length}</p>
          </CardContent>
        </Card>
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardContent className="p-5">
            <p className="text-xs text-white/30">Revenue Lost</p>
            <p className="text-2xl font-bold mt-1 text-red-400" style={{ fontFamily: "'Syne', sans-serif" }}>${revenueLost.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-white/8 bg-white/[0.03] text-white">
          <CardContent className="p-5">
            <p className="text-xs text-white/30">Unique Customers</p>
            <p className="text-2xl font-bold mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>{new Set(noShows.map(n => n.guestId)).size}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px]">Customer</TableHead>
              <TableHead className="text-white/40 text-[11px]">Hotel</TableHead>
              <TableHead className="text-white/40 text-[11px]">Check-in</TableHead>
              <TableHead className="text-white/40 text-[11px]">Amount</TableHead>
              <TableHead className="text-white/40 text-[11px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {noShows.map(r => (
              <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.03]">
                <TableCell className="text-xs text-white/70">{r.guestName}</TableCell>
                <TableCell className="text-xs text-white/50">{r.hotelName}</TableCell>
                <TableCell className="text-xs text-white/50">{r.checkIn}</TableCell>
                <TableCell className="text-xs text-red-400">${r.amount}</TableCell>
                <TableCell><StatusBadge status="no_show" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
