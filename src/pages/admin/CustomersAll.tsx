import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoreHorizontal, Eye, Flag, Ban, Mail, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MOCK_CUSTOMERS, STATUS_CONFIG } from "@/data/adminMockData";
import { StatusBadge } from "./HotelsAll";

export default function CustomersAll() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 25;

  const filtered = MOCK_CUSTOMERS.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>All Customers</h1>
        <p className="text-xs text-white/40 mt-0.5">{filtered.length} customers</p>
      </div>

      <Card className="border-white/8 bg-white/[0.03]">
        <CardContent className="p-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            <Input placeholder="Search by name, email..." className="pl-8 h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] h-8 text-xs bg-white/5 border-white/10 text-white/70"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-white/8 bg-white/[0.03] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px]">ID</TableHead>
              <TableHead className="text-white/40 text-[11px]">Name</TableHead>
              <TableHead className="text-white/40 text-[11px]">Email</TableHead>
              <TableHead className="text-white/40 text-[11px]">Country</TableHead>
              <TableHead className="text-white/40 text-[11px]">Reservations</TableHead>
              <TableHead className="text-white/40 text-[11px]">Total Spent</TableHead>
              <TableHead className="text-white/40 text-[11px]">Status</TableHead>
              <TableHead className="text-white/40 text-[11px] w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(c => (
              <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.03] cursor-pointer" onClick={() => navigate(`/admin/customers/${c.id}`)}>
                <TableCell className="text-[11px] text-white/30 font-mono">{c.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-blue-500/20 text-blue-400">{c.avatar}</div>
                    <span className="text-sm text-white/90">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-white/40">{c.email}</TableCell>
                <TableCell className="text-xs text-white/50">{c.country}</TableCell>
                <TableCell className="text-xs text-white/50">{c.totalReservations}</TableCell>
                <TableCell className="text-xs text-white/70">${c.totalSpent.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/30 hover:text-white/70"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={e => { e.stopPropagation(); navigate(`/admin/customers/${c.id}`); }}><Eye className="h-3.5 w-3.5 mr-2" />View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={e => e.stopPropagation()}><Flag className="h-3.5 w-3.5 mr-2" />Flag Account</DropdownMenuItem>
                      <DropdownMenuItem onClick={e => e.stopPropagation()}><Key className="h-3.5 w-3.5 mr-2" />Reset Password</DropdownMenuItem>
                      <DropdownMenuItem onClick={e => e.stopPropagation()}><Mail className="h-3.5 w-3.5 mr-2" />Contact</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={e => e.stopPropagation()} className="text-red-400"><Ban className="h-3.5 w-3.5 mr-2" />Suspend</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <span className="text-[11px] text-white/30">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-7 text-xs text-white/50" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-white/50" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
