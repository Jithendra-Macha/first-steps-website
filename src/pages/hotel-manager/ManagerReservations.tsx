import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Eye } from "lucide-react";
import { useHotelReservations, useManagerListing, useUpdateReservationStatus } from "@/hooks/useHotelData";

const TABS = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  upcoming: { bg: "hsla(217, 91%, 60%, 0.15)", text: "hsl(217, 91%, 65%)" },
  past: { bg: "hsla(0, 0%, 50%, 0.1)", text: "hsl(0, 0%, 55%)" },
  cancelled: { bg: "hsla(0, 70%, 50%, 0.12)", text: "hsl(0, 70%, 60%)" },
};

export default function ManagerReservations() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [detailModal, setDetailModal] = useState<any>(null);
  const { data: listing } = useManagerListing();
  const { data: reservations = [], isLoading } = useHotelReservations(listing?.id);
  const updateStatus = useUpdateReservationStatus();

  const filtered = reservations.filter((r: any) => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    const name = r.guest_name || r.hotel_name || "";
    if (search && !name.toLowerCase().includes(search.toLowerCase()) && !r.booking_id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Reservations</h1>
        <p className="text-sm text-muted-foreground mt-1">{reservations.length} total reservations</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {TABS.map(tab => {
          const count = tab.value === "all" ? reservations.length : reservations.filter((r: any) => r.status === tab.value).length;
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
              <TableHead className="text-muted-foreground text-[11px]">Commission</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Status</TableHead>
              <TableHead className="text-muted-foreground text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">No reservations found</TableCell></TableRow>
            ) : filtered.map((r: any) => (
              <TableRow key={r.id} className="border-border/50 hover:bg-accent/50">
                <TableCell className="text-[11px] text-muted-foreground font-mono">{r.booking_id}</TableCell>
                <TableCell className="text-xs text-foreground/70">{r.guest_name || "Registered User"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.room_type}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(r.check_in_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.time_slot || "—"}</TableCell>
                <TableCell className="text-xs text-foreground/70">${Number(r.total_price).toFixed(0)}</TableCell>
                <TableCell className="text-xs text-amber-500">-${Number(r.platform_commission || 5).toFixed(0)}</TableCell>
                <TableCell>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_COLORS[r.status]?.bg, color: STATUS_COLORS[r.status]?.text }}>
                    {r.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailModal(r)}>
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-md">
          <DialogHeader><DialogTitle>Reservation Details</DialogTitle></DialogHeader>
          {detailModal && (
            <div className="space-y-3 py-2 text-xs">
              {[
                ["Booking ID", detailModal.booking_id],
                ["Guest", detailModal.guest_name || "Registered User"],
                ["Email", detailModal.guest_email || "—"],
                ["Phone", detailModal.guest_phone || "—"],
                ["Room Type", detailModal.room_type],
                ["Check-in", new Date(detailModal.check_in_date).toLocaleDateString()],
                ["Time Slot", detailModal.time_slot || "—"],
                ["Guests", String(detailModal.guests)],
                ["Amount", `$${Number(detailModal.total_price).toFixed(0)}`],
                ["Platform Commission", `$${Number(detailModal.platform_commission || 5).toFixed(0)}`],
                ["Net Earnings", `$${(Number(detailModal.total_price) - Number(detailModal.platform_commission || 5)).toFixed(0)}`],
                ["Status", detailModal.status],
                ["Booked On", new Date(detailModal.created_at).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground/70 text-right">{v}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            {detailModal?.status === "upcoming" && (
              <Button variant="destructive" size="sm" onClick={() => {
                updateStatus.mutate({ id: detailModal.id, status: "cancelled" });
                setDetailModal(null);
              }}>Cancel Reservation</Button>
            )}
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setDetailModal(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
