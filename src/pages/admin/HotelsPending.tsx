import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllListings, useUpdateListing } from "@/hooks/useHotelData";
import { MOCK_HOTELS } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";
import { useToast } from "@/hooks/use-toast";

export default function HotelsPending() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectCategory, setRejectCategory] = useState("");

  const { data: dbListings } = useAllListings("pending");
  const updateListing = useUpdateListing();

  const hasRealData = (dbListings?.length || 0) > 0;

  const pending = hasRealData
    ? dbListings!.map(l => ({
        id: l.id,
        name: l.hotel_name,
        location: `${l.street_address}, ${l.city}`,
        city: l.city,
        owner: l.contact_person_name || "Unknown",
        ownerEmail: l.hotel_email,
        category: "Hotel",
        listingDate: l.created_at.split("T")[0],
        totalRooms: Array.isArray(l.room_types) ? (l.room_types as any[]).reduce((s: number, rt: any) => s + (rt.totalRooms || rt.count || 0), 0) : 0,
        amenities: [] as string[],
        photos: l.photos?.length || 0,
        status: l.status,
      }))
    : MOCK_HOTELS.filter(h => h.status === "pending");

  const handleApprove = async (id: string, name: string) => {
    if (hasRealData) {
      try {
        await updateListing.mutateAsync({ id, updates: { status: "live" } });
        toast({ title: "Hotel Approved", description: `${name} is now live on the platform.` });
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Hotel Approved", description: `${name} is now live on the platform.` });
    }
  };

  const handleReject = async () => {
    if (hasRealData && selectedId) {
      try {
        await updateListing.mutateAsync({ id: selectedId, updates: { status: "suspended" } });
        toast({ title: "Hotel Rejected", description: "Owner has been notified.", variant: "destructive" });
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Hotel Rejected", description: "Owner has been notified.", variant: "destructive" });
    }
    setRejectOpen(false);
    setSelectedId(null);
    setRejectReason("");
  };

  const daysPending = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Pending Approvals</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{pending.length} hotels awaiting review</p>
      </div>

      {pending.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <Check className="h-12 w-12 mx-auto text-emerald-500/50 mb-3" />
            <p className="text-muted-foreground">All caught up! No pending approvals.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pending.map(h => {
            const days = daysPending(h.listingDate);
            return (
              <Card key={h.id} className="border-border bg-card hover:bg-muted/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/admin/hotels/${h.id}`)}>{h.name}</h3>
                        <StatusBadge status="pending" />
                        <span className={`text-[11px] font-medium ${days > 3 ? "text-destructive" : "text-muted-foreground"}`}>
                          <Clock className="h-3 w-3 inline mr-0.5" />{days}d pending
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{h.location} · {h.category} · {h.totalRooms} rooms</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Owner: {h.owner} · {h.ownerEmail}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {h.amenities.map(a => (
                          <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a}</span>
                        ))}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">📷 {h.photos} photos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/25" onClick={() => handleApprove(h.id, h.name)}>
                        <Check className="h-3.5 w-3.5 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />Request Info
                      </Button>
                      <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => { setSelectedId(h.id); setRejectOpen(true); }}>
                        <X className="h-3.5 w-3.5 mr-1" />Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Listing</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={rejectCategory} onValueChange={setRejectCategory}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="incomplete">Incomplete Information</SelectItem>
                <SelectItem value="policy">Policy Violation</SelectItem>
                <SelectItem value="quality">Quality Standards Not Met</SelectItem>
                <SelectItem value="fraud">Suspected Fraud</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Additional details..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject & Notify Owner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
