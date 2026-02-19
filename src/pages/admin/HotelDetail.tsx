import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone, Star, Pause, Ban, Megaphone, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_HOTELS, MOCK_RESERVATIONS, MOCK_REVIEWS, STATUS_CONFIG } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = MOCK_HOTELS.find(h => h.id === id);

  if (!hotel) {
    return (
      <div className="text-center py-20">
        <p className="text-white/50">Hotel not found</p>
        <Button variant="ghost" className="mt-4 text-blue-400" onClick={() => navigate("/admin/hotels")}>← Back to Hotels</Button>
      </div>
    );
  }

  const hotelReservations = MOCK_RESERVATIONS.filter(r => r.hotelId === hotel.id);
  const hotelReviews = MOCK_REVIEWS.filter(r => r.hotelId === hotel.id);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <Button variant="ghost" size="sm" className="text-white/40 hover:text-white/70 -ml-2" onClick={() => navigate("/admin/hotels")}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back to Hotels
      </Button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{hotel.name}</h1>
            <StatusBadge status={hotel.status} />
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{hotel.location}, {hotel.city}</span>
            <span>{hotel.category}</span>
            <span>⭐ {hotel.rating} ({hotel.reviews} reviews)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" className="bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25"><Pause className="h-3.5 w-3.5 mr-1" />Put On Hold</Button>
          <Button size="sm" className="bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25"><Ban className="h-3.5 w-3.5 mr-1" />Suspend</Button>
          <Button size="sm" variant="outline" className="border-white/10 text-white/50"><Send className="h-3.5 w-3.5 mr-1" />Message Owner</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white/5 border border-white/8">
          <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">Overview</TabsTrigger>
          <TabsTrigger value="reservations" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">Reservations ({hotelReservations.length})</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">Reviews ({hotelReviews.length})</TabsTrigger>
          <TabsTrigger value="financials" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-white/8 bg-white/[0.03] text-white">
              <CardHeader><CardTitle className="text-sm text-white/60">Hotel Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/60">{hotel.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-white/30">Total Rooms:</span> <span className="text-white/70 ml-1">{hotel.totalRooms}</span></div>
                  <div><span className="text-white/30">Listed:</span> <span className="text-white/70 ml-1">{hotel.listingDate}</span></div>
                  <div><span className="text-white/30">Photos:</span> <span className="text-white/70 ml-1">{hotel.photos}</span></div>
                  <div><span className="text-white/30">ID:</span> <span className="text-white/70 ml-1 font-mono">{hotel.id}</span></div>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities.map(a => <span key={a} className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/50">{a}</span>)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/8 bg-white/[0.03] text-white">
              <CardHeader><CardTitle className="text-sm text-white/60">Owner Info</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium text-white/80">{hotel.owner}</p>
                <div className="flex items-center gap-2 text-xs text-white/40"><Mail className="h-3 w-3" />{hotel.ownerEmail}</div>
                <div className="flex items-center gap-2 text-xs text-white/40"><Phone className="h-3 w-3" />{hotel.ownerPhone}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reservations">
          <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  <TableHead className="text-white/40 text-[11px]">ID</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Guest</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Check-in</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Check-out</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Amount</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelReservations.slice(0, 20).map(r => (
                  <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="text-[11px] text-white/30 font-mono">{r.id}</TableCell>
                    <TableCell className="text-xs text-white/70">{r.guestName}</TableCell>
                    <TableCell className="text-xs text-white/50">{r.checkIn}</TableCell>
                    <TableCell className="text-xs text-white/50">{r.checkOut}</TableCell>
                    <TableCell className="text-xs text-white/70">${r.amount}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
                {hotelReservations.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-white/30 py-8">No reservations</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  <TableHead className="text-white/40 text-[11px]">Customer</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Rating</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Review</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Date</TableHead>
                  <TableHead className="text-white/40 text-[11px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelReviews.map(r => (
                  <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="text-xs text-white/70">{r.customerName}</TableCell>
                    <TableCell className="text-xs text-white/50">{"⭐".repeat(r.rating)}</TableCell>
                    <TableCell className="text-xs text-white/50 max-w-[300px] truncate">{r.text}</TableCell>
                    <TableCell className="text-xs text-white/40">{r.date}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-white/8 bg-white/[0.03] text-white">
              <CardContent className="p-5">
                <p className="text-xs text-white/30">Total Revenue</p>
                <p className="text-2xl font-bold mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>${hotel.revenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-white/8 bg-white/[0.03] text-white">
              <CardContent className="p-5">
                <p className="text-xs text-white/30">Commission (12%)</p>
                <p className="text-2xl font-bold mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>${Math.round(hotel.revenue * 0.12).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-white/8 bg-white/[0.03] text-white">
              <CardContent className="p-5">
                <p className="text-xs text-white/30">Reservations</p>
                <p className="text-2xl font-bold mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>{hotelReservations.length}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
