import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_HOTELS } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";
import { useToast } from "@/hooks/use-toast";

export default function HotelsPending() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const pending = MOCK_HOTELS.filter(h => h.status === "pending");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectCategory, setRejectCategory] = useState("");

  const handleApprove = (id: string, name: string) => {
    toast({ title: "Hotel Approved", description: `${name} is now live on the platform.` });
  };

  const handleReject = () => {
    toast({ title: "Hotel Rejected", description: "Owner has been notified.", variant: "destructive" });
    setRejectOpen(false);
    setSelectedId(null);
    setRejectReason("");
  };

  const daysPending = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    return diff;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Pending Approvals</h1>
        <p className="text-xs text-white/40 mt-0.5">{pending.length} hotels awaiting review</p>
      </div>

      {pending.length === 0 ? (
        <Card className="border-white/8 bg-white/[0.03]">
          <CardContent className="p-12 text-center">
            <Check className="h-12 w-12 mx-auto text-green-400/50 mb-3" />
            <p className="text-white/50">All caught up! No pending approvals.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pending.map(h => {
            const days = daysPending(h.listingDate);
            return (
              <Card key={h.id} className="border-white/8 bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white/90 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => navigate(`/admin/hotels/${h.id}`)}>{h.name}</h3>
                        <StatusBadge status="pending" />
                        <span className={`text-[11px] font-medium ${days > 3 ? "text-red-400" : "text-white/30"}`}>
                          <Clock className="h-3 w-3 inline mr-0.5" />{days}d pending
                        </span>
                      </div>
                      <p className="text-xs text-white/40">{h.location}, {h.city} · {h.category} · {h.totalRooms} rooms</p>
                      <p className="text-xs text-white/30 mt-1">Owner: {h.owner} · {h.ownerEmail}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {h.amenities.map(a => (
                          <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{a}</span>
                        ))}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">📷 {h.photos} photos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" className="bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25" onClick={() => handleApprove(h.id, h.name)}>
                        <Check className="h-3.5 w-3.5 mr-1" />Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 text-white/50 hover:text-white/70">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />Request Info
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10" onClick={() => { setSelectedId(h.id); setRejectOpen(true); }}>
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
        <DialogContent className="bg-[hsl(220,28%,12%)] border-white/10 text-white">
          <DialogHeader><DialogTitle>Reject Listing</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={rejectCategory} onValueChange={setRejectCategory}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white/70"><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="incomplete">Incomplete Information</SelectItem>
                <SelectItem value="policy">Policy Violation</SelectItem>
                <SelectItem value="quality">Quality Standards Not Met</SelectItem>
                <SelectItem value="fraud">Suspected Fraud</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Additional details..." className="bg-white/5 border-white/10 text-white placeholder:text-white/30" value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)} className="text-white/50">Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleReject}>Reject & Notify Owner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
