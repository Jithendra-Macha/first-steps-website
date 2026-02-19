import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Flag, Ban, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_CUSTOMERS, MOCK_RESERVATIONS, MOCK_REVIEWS } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = MOCK_CUSTOMERS.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-white/50">Customer not found</p>
        <Button variant="ghost" className="mt-4 text-blue-400" onClick={() => navigate("/admin/customers")}>← Back</Button>
      </div>
    );
  }

  const reservations = MOCK_RESERVATIONS.filter(r => r.guestId === customer.id);
  const reviews = MOCK_REVIEWS.filter(r => r.customerId === customer.id);
  const noShows = reservations.filter(r => r.status === "no_show");

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <Button variant="ghost" size="sm" className="text-white/40 hover:text-white/70 -ml-2" onClick={() => navigate("/admin/customers")}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back to Customers
      </Button>

      {/* Profile Header */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold bg-blue-500/20 text-blue-400">{customer.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{customer.name}</h1>
                <StatusBadge status={customer.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/40">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{customer.country}</span>
                <span>Joined {customer.joinDate}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" className="border-white/10 text-white/50"><Flag className="h-3.5 w-3.5 mr-1" />Flag</Button>
              <Button size="sm" variant="outline" className="border-white/10 text-white/50"><Key className="h-3.5 w-3.5 mr-1" />Reset PW</Button>
              <Button size="sm" className="bg-red-500/15 text-red-400 border border-red-500/20"><Ban className="h-3.5 w-3.5 mr-1" />Suspend</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-white/5">
            <div><p className="text-[11px] text-white/30">Total Reservations</p><p className="text-lg font-bold">{customer.totalReservations}</p></div>
            <div><p className="text-[11px] text-white/30">Total Spent</p><p className="text-lg font-bold">${customer.totalSpent.toLocaleString()}</p></div>
            <div><p className="text-[11px] text-white/30">No-Shows</p><p className={`text-lg font-bold ${customer.noShows > 2 ? "text-red-400" : ""}`}>{customer.noShows}</p></div>
            <div><p className="text-[11px] text-white/30">Last Active</p><p className="text-lg font-bold">{customer.lastActive}</p></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reservations" className="space-y-4">
        <TabsList className="bg-white/5 border border-white/8">
          <TabsTrigger value="reservations" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">Reservations ({reservations.length})</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="noshows" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">No-Shows ({noShows.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations">
          <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  <TableHead className="text-white/40 text-[11px]">ID</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Hotel</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Check-in</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Amount</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map(r => (
                  <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="text-[11px] text-white/30 font-mono">{r.id}</TableCell>
                    <TableCell className="text-xs text-white/70">{r.hotelName}</TableCell>
                    <TableCell className="text-xs text-white/50">{r.checkIn}</TableCell>
                    <TableCell className="text-xs text-white/70">${r.amount}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
                {reservations.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-white/30 py-8">No reservations</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  <TableHead className="text-white/40 text-[11px]">Hotel</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Rating</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Review</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map(r => (
                  <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="text-xs text-white/70">{r.hotelName}</TableCell>
                    <TableCell className="text-xs">{"⭐".repeat(r.rating)}</TableCell>
                    <TableCell className="text-xs text-white/50 max-w-[250px] truncate">{r.text}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
                {reviews.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-white/30 py-8">No reviews</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="noshows">
          {customer.noShows > 2 && (
            <Card className="border-red-500/20 bg-red-500/5 mb-4">
              <CardContent className="p-3 flex items-center gap-2 text-red-400 text-xs">
                <Flag className="h-4 w-4" />Frequent No-Show — Review Account ({customer.noShows} no-shows detected)
              </CardContent>
            </Card>
          )}
          <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  <TableHead className="text-white/40 text-[11px]">Reservation</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Hotel</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Check-in</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noShows.map(r => (
                  <TableRow key={r.id} className="border-white/5">
                    <TableCell className="text-[11px] text-white/30 font-mono">{r.id}</TableCell>
                    <TableCell className="text-xs text-white/70">{r.hotelName}</TableCell>
                    <TableCell className="text-xs text-white/50">{r.checkIn}</TableCell>
                    <TableCell className="text-xs text-red-400">${r.amount}</TableCell>
                  </TableRow>
                ))}
                {noShows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-white/30 py-8">No no-shows</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
