import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Download, MoreHorizontal, Eye, Check, Pause, Ban, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAllListings, useUpdateListing } from "@/hooks/useHotelData";
import { MOCK_HOTELS, STATUS_CONFIG, type AdminHotel, type HotelStatus } from "@/data/adminMockData";
import { useToast } from "@/hooks/use-toast";

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  if (!cfg) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: cfg.bg, color: cfg.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export default function HotelsAll() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 25;

  const { data: dbListings, isLoading } = useAllListings();
  const updateListing = useUpdateListing();

  const hasRealData = (dbListings?.length || 0) > 0;

  // Map DB listings to a common format
  const hotels = hasRealData
    ? dbListings!.map(l => ({
        id: l.id,
        name: l.hotel_name,
        location: l.street_address,
        city: l.city,
        owner: l.contact_person_name || "Unknown",
        ownerEmail: l.hotel_email,
        ownerPhone: l.hotel_phone,
        category: "Hotel" as any,
        listingDate: l.created_at.split("T")[0],
        totalRooms: Array.isArray(l.room_types) ? (l.room_types as any[]).reduce((s: number, rt: any) => s + (rt.totalRooms || rt.count || 0), 0) : 0,
        status: l.status as HotelStatus,
        rating: 0,
        reviews: 0,
        revenue: 0,
        description: l.hotel_description || "",
        amenities: [] as string[],
        photos: l.photos?.length || 0,
      }))
    : MOCK_HOTELS;

  let filtered = hotels.filter(h => {
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.owner.toLowerCase().includes(search.toLowerCase()) && !h.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && h.status !== statusFilter) return false;
    if (categoryFilter !== "all" && h.category !== categoryFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleStatusChange = async (id: string, newStatus: string, name: string) => {
    if (hasRealData) {
      try {
        await updateListing.mutateAsync({ id, updates: { status: newStatus } });
        toast({ title: "Status Updated", description: `${name} is now ${newStatus}.` });
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Demo Mode", description: "This action requires real data." });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>All Hotels</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} properties {!hasRealData && "(demo data)"}</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Download className="h-3.5 w-3.5" />Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by name, owner, city..." className="pl-8 h-8 text-xs" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          {!hasRealData && (
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
                <SelectItem value="Boutique">Boutique</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Resort">Resort</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground text-[11px] font-medium">Hotel Name</TableHead>
              <TableHead className="text-muted-foreground text-[11px] font-medium">Location</TableHead>
              <TableHead className="text-muted-foreground text-[11px] font-medium">Owner</TableHead>
              <TableHead className="text-muted-foreground text-[11px] font-medium">Rooms</TableHead>
              <TableHead className="text-muted-foreground text-[11px] font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground text-[11px] font-medium">Rating</TableHead>
              <TableHead className="text-muted-foreground text-[11px] font-medium w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(h => (
              <TableRow key={h.id} className="border-border hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/admin/hotels/${h.id}`)}>
                <TableCell className="text-sm font-medium">{h.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{h.city}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{h.owner}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{h.totalRooms}</TableCell>
                <TableCell><StatusBadge status={h.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{h.rating > 0 ? `⭐ ${h.rating}` : "—"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={e => { e.stopPropagation(); navigate(`/admin/hotels/${h.id}`); }}><Eye className="h-3.5 w-3.5 mr-2" />View Details</DropdownMenuItem>
                      {h.status === "pending" && <DropdownMenuItem onClick={e => { e.stopPropagation(); handleStatusChange(h.id, "live", h.name); }}><Check className="h-3.5 w-3.5 mr-2" />Approve</DropdownMenuItem>}
                      <DropdownMenuItem onClick={e => { e.stopPropagation(); handleStatusChange(h.id, "on_hold", h.name); }}><Pause className="h-3.5 w-3.5 mr-2" />Put On Hold</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={e => { e.stopPropagation(); handleStatusChange(h.id, "suspended", h.name); }} className="text-destructive"><Ban className="h-3.5 w-3.5 mr-2" />Suspend</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-[11px] text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-7 text-xs" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export { StatusBadge };
