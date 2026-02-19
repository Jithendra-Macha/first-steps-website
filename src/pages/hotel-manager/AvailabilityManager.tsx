import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Copy, FileText } from "lucide-react";
import { ROOM_TYPES, AVAILABILITY_SLOTS, SLOT_TEMPLATES, type AvailabilitySlot } from "@/data/hotelManagerMockData";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6AM - 11PM

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
          <p className="text-sm text-white/40 mt-1">Manage room slots and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-white/10 text-white/50 text-xs" onClick={() => setTemplateModalOpen(true)}>
            <FileText className="h-3.5 w-3.5 mr-1" />Templates
          </Button>
          <Button size="sm" variant="outline" className="border-white/10 text-white/50 text-xs">
            <Copy className="h-3.5 w-3.5 mr-1" />Copy Slots
          </Button>
          <Button size="sm" className="text-xs text-white" style={{ background: "hsl(18, 100%, 50%)" }} onClick={() => setAddModalOpen(true)}>
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
          <Button size="sm" variant="outline" className="border-white/10 text-white/50 text-xs ml-2" onClick={() => setSelectedDate(new Date())}>Today</Button>
        </div>
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid hsla(0,0%,100%,0.1)" }}>
          {(["day", "week"] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)} className="px-3 py-1.5 text-xs capitalize transition-colors" style={{ background: viewMode === v ? "hsla(18, 100%, 50%, 0.15)" : "transparent", color: viewMode === v ? "hsl(18, 100%, 60%)" : "hsla(0,0%,100%,0.4)" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* 2D Grid */}
      {viewMode === "day" ? (
        <Card className="border-white/8 bg-white/[0.03] overflow-x-auto">
          <CardContent className="p-0">
            <div className="min-w-[900px]">
              {/* Header row with hours */}
              <div className="flex border-b" style={{ borderColor: "hsla(0,0%,100%,0.06)" }}>
                <div className="w-36 shrink-0 p-3 text-xs text-white/30 font-medium">Room Type</div>
                {HOURS.map(h => (
                  <div key={h} className="flex-1 p-2 text-center text-[10px] text-white/25 border-l" style={{ borderColor: "hsla(0,0%,100%,0.04)" }}>
                    {formatHour(h)}
                  </div>
                ))}
              </div>

              {/* Room type rows */}
              {ROOM_TYPES.map(rt => {
                const rtSlots = daySlots.filter(s => s.roomTypeId === rt.id);
                return (
                  <div key={rt.id} className="flex border-b" style={{ borderColor: "hsla(0,0%,100%,0.04)" }}>
                    <div className="w-36 shrink-0 p-3">
                      <p className="text-xs font-medium text-white/70">{rt.name}</p>
                      <p className="text-[10px] text-white/25">{rt.totalRooms} rooms</p>
                    </div>
                    <div className="flex-1 relative" style={{ minHeight: 60 }}>
                      {/* Grid cells */}
                      <div className="flex h-full absolute inset-0">
                        {HOURS.map(h => (
                          <div
                            key={h}
                            className="flex-1 border-l cursor-pointer transition-colors hover:bg-white/[0.03]"
                            style={{ borderColor: "hsla(0,0%,100%,0.04)" }}
                            onClick={() => handleCellClick(rt.id, h)}
                          />
                        ))}
                      </div>
                      {/* Slot blocks */}
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
                            <p className="text-[10px] font-medium text-white/80">{formatHour(slot.startHour)} – {formatHour(slot.endHour)}</p>
                            <p className="text-[9px] text-white/45">{slot.roomsBooked}/{slot.roomsListed} booked · {available} avail</p>
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
        /* Week View */
        <Card className="border-white/8 bg-white/[0.03] overflow-x-auto">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {getWeekDates().map(d => {
                const ds = d.toISOString().split("T")[0];
                const slots = AVAILABILITY_SLOTS.filter(s => s.date === ds);
                const isToday = ds === new Date().toISOString().split("T")[0];
                return (
                  <div key={ds} className="rounded-lg p-3 cursor-pointer transition-colors" style={{ background: isToday ? "hsla(18, 100%, 50%, 0.08)" : "hsla(0,0%,100%,0.02)", border: `1px solid ${isToday ? "hsla(18, 100%, 50%, 0.2)" : "hsla(0,0%,100%,0.05)"}` }} onClick={() => { setSelectedDate(d); setViewMode("day"); }}>
                    <p className="text-[10px] text-white/30">{d.toLocaleDateString("en-IN", { weekday: "short" })}</p>
                    <p className="text-sm font-medium text-white/70">{d.getDate()}</p>
                    <div className="mt-2 space-y-1">
                      {slots.length > 0 ? (
                        <>
                          <p className="text-[10px] text-white/40">{slots.length} slots</p>
                          <p className="text-[10px] text-white/25">{slots.reduce((s, sl) => s + sl.roomsBooked, 0)} booked</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-white/20">No slots</p>
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
      <div className="flex items-center gap-4 text-[11px] text-white/40">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "hsla(142, 71%, 45%, 0.2)" }} />Available (&lt;50%)</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "hsla(38, 92%, 50%, 0.2)" }} />Filling (50-90%)</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: "hsla(0, 70%, 50%, 0.25)" }} />Almost Full (&gt;90%)</span>
      </div>

      {/* Add Slot Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-[hsl(225,28%,12%)] border-white/10 text-white max-w-md">
          <DialogHeader><DialogTitle className="text-white">Add Availability Slot</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Room Type</label>
              <Select value={newSlot.roomTypeId} onValueChange={v => setNewSlot({ ...newSlot, roomTypeId: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[hsl(225,28%,15%)] border-white/10">
                  {ROOM_TYPES.map(rt => <SelectItem key={rt.id} value={rt.id} className="text-white">{rt.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Start Hour</label>
                <Select value={String(newSlot.startHour)} onValueChange={v => setNewSlot({ ...newSlot, startHour: Number(v) })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[hsl(225,28%,15%)] border-white/10 max-h-48">
                    {HOURS.map(h => <SelectItem key={h} value={String(h)} className="text-white">{formatHour(h)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">End Hour</label>
                <Select value={String(newSlot.endHour)} onValueChange={v => setNewSlot({ ...newSlot, endHour: Number(v) })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[hsl(225,28%,15%)] border-white/10 max-h-48">
                    {HOURS.filter(h => h > newSlot.startHour).map(h => <SelectItem key={h} value={String(h)} className="text-white">{formatHour(h)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Rooms to List</label>
              <Input type="number" min={1} max={20} value={newSlot.roomsListed} onChange={e => setNewSlot({ ...newSlot, roomsListed: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
            </div>
            <p className="text-[11px] text-white/25">Date: {selectedDate.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-white/50" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button className="text-white" style={{ background: "hsl(18, 100%, 50%)" }} onClick={() => setAddModalOpen(false)}>Add Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Modal */}
      <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
        <DialogContent className="bg-[hsl(225,28%,12%)] border-white/10 text-white max-w-md">
          <DialogHeader><DialogTitle className="text-white">Slot Templates</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {SLOT_TEMPLATES.map(t => (
              <div key={t.id} className="rounded-lg p-3 cursor-pointer transition-colors hover:bg-white/[0.05]" style={{ background: "hsla(0,0%,100%,0.03)", border: "1px solid hsla(0,0%,100%,0.06)" }}>
                <p className="text-sm font-medium text-white/70">{t.name}</p>
                <p className="text-[11px] text-white/30 mt-1">{t.slots.length} slots configured</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.slots.map((s, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "hsla(0,0%,100%,0.05)" }}>
                      {ROOM_TYPES.find(r => r.id === s.roomTypeId)?.name.split(" ")[0]} {formatHour(s.startHour)}-{formatHour(s.endHour)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-white/50" onClick={() => setTemplateModalOpen(false)}>Close</Button>
            <Button className="text-white" style={{ background: "hsl(18, 100%, 50%)" }}>Apply Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
