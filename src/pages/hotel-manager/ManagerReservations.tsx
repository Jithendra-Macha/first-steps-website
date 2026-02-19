import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Eye } from "lucide-react";
import { RESERVATIONS, type Reservation } from "@/data/hotelManagerMockData";

const TABS: { label: string; value: Reservation["status"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Checked In", value: "checked-in" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No-Show", value: "no-show" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "hsla(217, 91%, 60%, 0.15)", text: "hsl(217, 91%, 65%)" },
  "checked-in": { bg: "hsla(142, 71%, 45%, 0.15)", text: "hsl(142, 71%, 55%)" },
  completed: { bg: "hsla(0, 0%, 50%, 0.1)", text: "hsl(0, 0%, 55%)" },
  pending: { bg: "hsla(38, 92%, 50%, 0.15)", text: "hsl(38, 92%, 60%)" },
  cancelled: { bg: "hsla(0, 70%, 50%, 0.12)", text: "hsl(0, 70%, 60%)" },
  "no-show": { bg: "hsla(0, 70%, 50%, 0.2)", text: "hsl(0, 70%, 55%)" },
  refunded: { bg: "hsla(270, 60%, 50%, 0.15)", text: "hsl(270, 60%, 65%)" },
};

export default function ManagerReservations() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [noShowModal, setNoShowModal] = useState<Reservation | null>(null);
  const [detailModal, setDetailModal] = useState<Reservation | null>(null);

  const filtered = RESERVATIONS.filter(r => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    if (search && !r.guestName.toLowerCase().includes(search.toLowerCase()) && !r.bookingId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const canMarkNoShow = (r: Reservation) => {
    if (r.status !== "confirmed") return false;
    const checkInTime = new Date(r.checkIn);
    return checkInTime <= new Date();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Reservations</h1>
        <p className="text-sm text-muted-foreground mt-1">{RESERVATIONS.length} total reservations</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {TABS.map(tab => {
          const count = tab.value === "all" ? RESERVATIONS.length : RESERVATIONS.filter(r => r.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                activeTab === tab.value
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-muted-foreground border-transparent hover:bg-accent"
              }`}
            >
              {tab.label} <span className="ml-1 opacity-50">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or booking ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-muted/50 border-border text-foreground text-sm placeholder:text-muted-foreground" />
      </div>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground text-[11px]">Booking ID</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Guest</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Room</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Date</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Time Slot</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Amount</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Status</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.id} className="border-border/50 hover:bg-accent/50">
                <TableCell className="text-[11px] text-muted-foreground font-mono">{r.bookingId}</TableCell>
                <TableCell className="text-xs text-foreground/70">{r.guestName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.roomType}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.checkIn}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.timeSlot}</TableCell>
                <TableCell className="text-xs text-foreground/70">₹{r.amount.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_COLORS[r.status]?.bg, color: STATUS_COLORS[r.status]?.text }}>
                    {r.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailModal(r)}>
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    {canMarkNoShow(r) && (
                      <Button size="sm" className="h-7 text-[10px] px-2" style={{ background: "hsla(0, 70%, 50%, 0.15)", color: "hsl(0, 70%, 60%)", border: "1px solid hsla(0, 70%, 50%, 0.25)" }} onClick={() => setNoShowModal(r)}>
                        <AlertTriangle className="h-3 w-3 mr-1" />No-Show
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">No reservations found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* No-Show Confirmation Modal */}
      <Dialog open={!!noShowModal} onOpenChange={() => setNoShowModal(null)}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Mark as No-Show
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action has consequences. Please review carefully.
            </DialogDescription>
          </DialogHeader>
          {noShowModal && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg p-3 bg-destructive/5 border border-destructive/15">
                <p className="text-xs text-foreground/60"><strong>Guest:</strong> {noShowModal.guestName}</p>
                <p className="text-xs text-foreground/60"><strong>Booking:</strong> {noShowModal.bookingId}</p>
                <p className="text-xs text-foreground/60"><strong>Room:</strong> {noShowModal.roomType}</p>
                <p className="text-xs text-foreground/60"><strong>Time:</strong> {noShowModal.timeSlot}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground/70">What will happen:</p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">• The reservation status will change to "No-Show"</li>
                  <li className="flex items-start gap-2">• The guest will be charged the full amount (₹{noShowModal.amount.toLocaleString("en-IN")})</li>
                  <li className="flex items-start gap-2">• A no-show flag will be added to the guest's profile</li>
                  <li className="flex items-start gap-2">• The room will be released back to availability</li>
                  <li className="flex items-start gap-2">• The guest will receive an automated notification</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setNoShowModal(null)}>Cancel</Button>
            <Button className="bg-destructive text-destructive-foreground" onClick={() => setNoShowModal(null)}>Confirm No-Show</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-md">
          <DialogHeader><DialogTitle>Reservation Details</DialogTitle></DialogHeader>
          {detailModal && (
            <div className="space-y-3 py-2 text-xs">
              {[
                ["Booking ID", detailModal.bookingId],
                ["Guest", detailModal.guestName],
                ["Email", detailModal.guestEmail],
                ["Phone", detailModal.guestPhone],
                ["Room Type", detailModal.roomType],
                ["Check-in", detailModal.checkIn],
                ["Time Slot", detailModal.timeSlot],
                ["Guests", String(detailModal.guests)],
                ["Amount", `₹${detailModal.amount.toLocaleString("en-IN")}`],
                ["Payment", detailModal.paymentMethod],
                ["Status", detailModal.status],
                ["Booked On", new Date(detailModal.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground/70 text-right">{v}</span>
                </div>
              ))}
              {detailModal.specialRequests && (
                <div className="rounded-lg p-2.5 mt-2 bg-muted/50">
                  <p className="text-muted-foreground text-[10px] mb-1">Special Requests</p>
                  <p className="text-foreground/60">{detailModal.specialRequests}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter><Button variant="ghost" className="text-muted-foreground" onClick={() => setDetailModal(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
