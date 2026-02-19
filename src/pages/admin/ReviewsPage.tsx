import { useState } from "react";
import { Search, Eye, Check, EyeOff, Trash2, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MOCK_REVIEWS, STATUS_CONFIG } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";

export default function ReviewsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<typeof MOCK_REVIEWS[0] | null>(null);

  const filtered = MOCK_REVIEWS.filter(r => {
    if (search && !r.customerName.toLowerCase().includes(search.toLowerCase()) && !r.hotelName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  const pendingCount = MOCK_REVIEWS.filter(r => r.status === "pending").length;
  const flaggedCount = MOCK_REVIEWS.filter(r => r.status === "flagged").length;

  const sentimentColor = (s: string) => s === "positive" ? "text-green-400" : s === "negative" ? "text-red-400" : "text-white/40";

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Reviews & Ratings</h1>
        <p className="text-xs text-white/40 mt-0.5">Moderate and manage platform reviews</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Total Reviews</p><p className="text-xl font-bold">{MOCK_REVIEWS.length}</p></CardContent></Card>
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Avg Rating</p><p className="text-xl font-bold">⭐ {avgRating}</p></CardContent></Card>
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Pending</p><p className="text-xl font-bold text-amber-400">{pendingCount}</p></CardContent></Card>
        <Card className="border-white/8 bg-white/[0.03] text-white"><CardContent className="p-4"><p className="text-[11px] text-white/30">Flagged</p><p className="text-xl font-bold text-purple-400">{flaggedCount}</p></CardContent></Card>
      </div>

      <Card className="border-white/8 bg-white/[0.03]">
        <CardContent className="p-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            <Input placeholder="Search reviews..." className="pl-8 h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-8 text-xs bg-white/5 border-white/10 text-white/70"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="removed">Removed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px]">ID</TableHead>
              <TableHead className="text-white/40 text-[11px]">Customer</TableHead>
              <TableHead className="text-white/40 text-[11px]">Hotel</TableHead>
              <TableHead className="text-white/40 text-[11px]">Rating</TableHead>
              <TableHead className="text-white/40 text-[11px]">Review</TableHead>
              <TableHead className="text-white/40 text-[11px]">Sentiment</TableHead>
              <TableHead className="text-white/40 text-[11px]">Status</TableHead>
              <TableHead className="text-white/40 text-[11px] w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, 30).map(r => (
              <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.03]">
                <TableCell className="text-[11px] text-white/30 font-mono">{r.id}</TableCell>
                <TableCell className="text-xs text-white/70">{r.customerName}</TableCell>
                <TableCell className="text-xs text-white/50">{r.hotelName}</TableCell>
                <TableCell className="text-xs">{"⭐".repeat(r.rating)}</TableCell>
                <TableCell className="text-xs text-white/50 max-w-[200px] truncate">{r.text}</TableCell>
                <TableCell><span className={`text-[11px] font-medium capitalize ${sentimentColor(r.sentiment)}`}>{r.sentiment}</span></TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/30 hover:text-white/70"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => setSelectedReview(r)}><Eye className="h-3.5 w-3.5 mr-2" />View Full</DropdownMenuItem>
                      <DropdownMenuItem><Check className="h-3.5 w-3.5 mr-2" />Approve</DropdownMenuItem>
                      <DropdownMenuItem><EyeOff className="h-3.5 w-3.5 mr-2" />Hide</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-400"><Trash2 className="h-3.5 w-3.5 mr-2" />Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Review Detail Modal */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="bg-[hsl(220,28%,12%)] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-lg">Review Details</DialogTitle></DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{selectedReview.customerName}</p>
                  <p className="text-xs text-white/40">{selectedReview.date}</p>
                </div>
                <StatusBadge status={selectedReview.status} />
              </div>
              <div><p className="text-xs text-white/30">Hotel</p><p className="text-sm text-white/80">{selectedReview.hotelName}</p></div>
              <div><p className="text-xs text-white/30">Rating</p><p className="text-sm">{"⭐".repeat(selectedReview.rating)} ({selectedReview.rating}/5)</p></div>
              <div><p className="text-xs text-white/30">Review</p><p className="text-sm text-white/70 leading-relaxed">{selectedReview.text}</p></div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-white/30">Sentiment: <span className={`font-medium capitalize ${sentimentColor(selectedReview.sentiment)}`}>{selectedReview.sentiment}</span></span>
                {selectedReview.reportedCount > 0 && <span className="text-red-400">Reported {selectedReview.reportedCount}x</span>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
