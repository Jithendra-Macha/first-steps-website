import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Copy, FileText } from "lucide-react";
import { ROOM_TYPES, AVAILABILITY_SLOTS, SLOT_TEMPLATES, type AvailabilitySlot } from "@/data/hotelManagerMockData";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

function formatHour(h: number) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

export default function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ roomTypeId: "std", startHour: 8, endHour: 12, roomsListed: 1 });

  const dateStr = selectedDate.toISOString().split("T")[0];
  const daySlots = AVAILABILITY_SLOTS.filter(s => s.date === dateStr);

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d);
  };

  const handleCellClick = (roomTypeId: string, hour: number) => {
    const existingSlot = daySlots.find(s => s.roomTypeId === roomTypeId && hour >= s.startHour && hour < s.endHour);
    if (!existingSlot) {
      setNewSlot({ roomTypeId, startHour: hour, endHour: Math.min(hour + 4, 23), roomsListed: 1 });
      setAddModalOpen(true);
    }
  };

  const getWeekDates = () => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Availability Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage room slots and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-border text-muted-foreground text-xs" onClick={() => setTemplateModalOpen(true)}>
            <FileText className="h-3.5 w-3.5 mr-1" />Templates
          </Button>
          <Button size="sm" variant="outline" className="border-border text-muted-foreground text-xs">
            <Copy className="h-3.5 w-3.5 mr-1" />Copy Slots
          </Button>
          <Button size="sm" className="text-xs text-primary-foreground bg-primary" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />Add Slot
          </Button>
        </div>
      </div>

      {/* Date Nav + View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shiftDate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium min-w-[160px] text-center">
            {selectedDate.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shiftDate(1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" className="border-border text-muted-foreground text-xs ml-2" onClick={() => setSelectedDate(new Date())}>Today</Button>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-border">
          {(["day", "week"] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)} className={`px-3 py-1.5 text-xs capitalize transition-colors ${viewMode === v ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* 2D Grid */}
      {viewMode === "day" ? (
        <Card className="border-border bg-card overflow-x-auto">
          <CardContent className="p-0">
            <div className="min-w-[900px]">
              <div className="flex border-b border-border">
                <div className="w-36 shrink-0 p-3 text-xs text-muted-foreground font-medium">Room Type</div>
                {HOURS.map(h => (
                  <div key={h} className="flex-1 p-2 text-center text-[10px] text-muted-foreground/60 border-l border-border/50">
                    {formatHour(h)}
                  </div>
                ))}
              </div>

              {ROOM_TYPES.map(rt => {
                const rtSlots = daySlots.filter(s => s.roomTypeId === rt.id);
                return (
                  <div key={rt.id} className="flex border-b border-border/50">
                    <div className="w-36 shrink-0 p-3">
                      <p className="text-xs font-medium text-foreground/70">{rt.name}</p>
                      <p className="text-[10px] text-muted-foreground">{rt.totalRooms} rooms</p>
                    </div>
                    <div className="flex-1 relative" style={{ minHeight: 60 }}>
                      <div className="flex h-full absolute inset-0">
                        {HOURS.map(h => (
                          <div
                            key={h}
                            className="flex-1 border-l border-border/30 cursor-pointer transition-colors hover:bg-accent/50"
                            onClick={() => handleCellClick(rt.id, h)}
                          />
                        ))}
                      </div>
                      {rtSlots.map(slot => {
                        const left = ((slot.startHour - 6) / 18) * 100;
                        const width = ((slot.endHour - slot.startHour) / 18) * 100;
                        const available = slot.roomsListed - slot.roomsBooked;
                        const fillPct = (slot.roomsBooked / slot.roomsListed) * 100;
                        return (
                          <div
                            key={slot.id}
                            className="absolute top-2 bottom-2 rounded-md flex flex-col justify-center px-2 z-10 cursor-pointer transition-opacity hover:opacity-90"
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              background: fillPct >= 90 ? "hsla(0, 70%, 50%, 0.2)" : fillPct >= 50 ? "hsla(38, 92%, 50%, 0.15)" : "hsla(142, 71%, 45%, 0.15)",
                              border: `1px solid ${fillPct >= 90 ? "hsla(0, 70%, 50%, 0.3)" : fillPct >= 50 ? "hsla(38, 92%, 50%, 0.25)" : "hsla(142, 71%, 45%, 0.25)"}`,
                            }}
                          >
                            <p className="text-[10px] font-medium text-foreground/80">{formatHour(slot.startHour)} – {formatHour(slot.endHour)}</p>
                            <p className="text-[9px] text-muted-foreground">{slot.roomsBooked}/{slot.roomsListed} booked · {available} avail</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card overflow-x-auto">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {getWeekDates().map(d => {
                const ds = d.toISOString().split("T")[0];
                const slots = AVAILABILITY_SLOTS.filter(s => s.date === ds);
                const isToday = ds === new Date().toISOString().split("T")[0];
                return (
                  <div key={ds} className={`rounded-lg p-3 cursor-pointer transition-colors border ${isToday ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"}`} onClick={() => { setSelectedDate(d); setViewMode("day"); }}>
                    <p className="text-[10px] text-muted-foreground">{d.toLocaleDateString("en-IN", { weekday: "short" })}</p>
                    <p className="text-sm font-medium text-foreground/70">{d.getDate()}</p>
                    <div className="mt-2 space-y-1">
                      {slots.length > 0 ? (
                        <>
                          <p className="text-[10px] text-muted-foreground">{slots.length} slots</p>
                          <p className="text-[10px] text-muted-foreground/60">{slots.reduce((s, sl) => s + sl.roomsBooked, 0)} booked</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-muted-foreground/50">No slots</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "hsla(142, 71%, 45%, 0.2)" }} />Available (&lt;50%)</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "hsla(38, 92%, 50%, 0.2)" }} />Filling (50-90%)</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "hsla(0, 70%, 50%, 0.25)" }} />Almost Full (&gt;90%)</span>
      </div>

      {/* Add Slot Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-md">
          <DialogHeader><DialogTitle>Add Availability Slot</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Room Type</label>
              <Select value={newSlot.roomTypeId} onValueChange={v => setNewSlot({ ...newSlot, roomTypeId: v })}>
                <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map(rt => <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Start Hour</label>
                <Select value={String(newSlot.startHour)} onValueChange={v => setNewSlot({ ...newSlot, startHour: Number(v) })}>
                  <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-48">
                    {HOURS.map(h => <SelectItem key={h} value={String(h)}>{formatHour(h)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">End Hour</label>
                <Select value={String(newSlot.endHour)} onValueChange={v => setNewSlot({ ...newSlot, endHour: Number(v) })}>
                  <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-48">
                    {HOURS.filter(h => h > newSlot.startHour).map(h => <SelectItem key={h} value={String(h)}>{formatHour(h)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Rooms to List</label>
              <Input type="number" min={1} max={20} value={newSlot.roomsListed} onChange={e => setNewSlot({ ...newSlot, roomsListed: Number(e.target.value) })} className="bg-muted/50 border-border" />
            </div>
            <p className="text-[11px] text-muted-foreground/60">Date: {selectedDate.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button className="text-primary-foreground bg-primary" onClick={() => setAddModalOpen(false)}>Add Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Modal */}
      <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-md">
          <DialogHeader><DialogTitle>Slot Templates</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {SLOT_TEMPLATES.map(t => (
              <div key={t.id} className="rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent/50 bg-muted/30 border border-border">
                <p className="text-sm font-medium text-foreground/70">{t.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{t.slots.length} slots configured</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.slots.map((s, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {ROOM_TYPES.find(r => r.id === s.roomTypeId)?.name.split(" ")[0]} {formatHour(s.startHour)}-{formatHour(s.endHour)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setTemplateModalOpen(false)}>Close</Button>
            <Button className="text-primary-foreground bg-primary">Apply Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
