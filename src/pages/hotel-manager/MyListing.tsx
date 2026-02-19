import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Plus, Trash2, GripVertical, CheckCircle, PauseCircle, XCircle } from "lucide-react";
import { HOTEL_INFO, ROOM_TYPES } from "@/data/hotelManagerMockData";

export default function MyListing() {
  const [status, setStatus] = useState(HOTEL_INFO.status);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>My Listing</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your hotel's information and settings</p>
        </div>
        <Badge className="text-xs border-0" style={{
          background: status === "live" ? "hsla(142, 71%, 45%, 0.15)" : status === "paused" ? "hsla(38, 92%, 50%, 0.15)" : "hsla(0, 70%, 50%, 0.15)",
          color: status === "live" ? "hsl(142, 71%, 55%)" : status === "paused" ? "hsl(38, 92%, 60%)" : "hsl(0, 70%, 60%)",
        }}>{status.toUpperCase()}</Badge>
      </div>

      <Tabs defaultValue="basic-info" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border flex-wrap h-auto gap-1 p-1">
          {["Basic Info", "Photos", "Room Types", "Amenities", "Policies", "Listing Status"].map(tab => (
            <TabsTrigger key={tab} value={tab.toLowerCase().replace(/\s/g, "-")} className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">{tab}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basic-info">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Hotel Name", value: HOTEL_INFO.name },
                  { label: "Category", value: HOTEL_INFO.category },
                  { label: "Email", value: HOTEL_INFO.email },
                  { label: "Phone", value: HOTEL_INFO.phone },
                  { label: "Website", value: HOTEL_INFO.website },
                  { label: "City", value: HOTEL_INFO.city },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-muted-foreground mb-1.5 block">{f.label}</label>
                    <Input defaultValue={f.value} className="bg-muted/50 border-border text-sm" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Address</label>
                <Input defaultValue={`${HOTEL_INFO.address}, ${HOTEL_INFO.city}, ${HOTEL_INFO.state} ${HOTEL_INFO.zip}`} className="bg-muted/50 border-border text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Tagline</label>
                <Input defaultValue={HOTEL_INFO.tagline} className="bg-muted/50 border-border text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Description</label>
                <Textarea defaultValue={HOTEL_INFO.description} className="bg-muted/50 border-border text-sm min-h-[100px]" />
              </div>
              <Button className="text-primary-foreground bg-primary">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {HOTEL_INFO.photos.map((_, i) => (
                  <div key={i} className="aspect-video rounded-lg relative group overflow-hidden bg-muted/50 border border-border">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40"><Camera className="h-8 w-8" /></div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-white"><GripVertical className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    {i === 0 && <Badge className="absolute top-2 left-2 text-[9px] border-0 bg-foreground/20 text-background">Cover</Badge>}
                  </div>
                ))}
                <div className="aspect-video rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-accent/50 border-2 border-dashed border-border">
                  <div className="text-center">
                    <Plus className="h-6 w-6 text-muted-foreground/40 mx-auto" />
                    <p className="text-[10px] text-muted-foreground mt-1">Add Photo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="room-types">
          <div className="space-y-3">
            {ROOM_TYPES.map(rt => (
              <Card key={rt.id} className="border-border bg-card text-card-foreground">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground/80">{rt.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rt.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground/70">
                        <span>₹{rt.basePrice.toLocaleString("en-IN")}/slot</span>
                        <span>Max {rt.maxGuests} guests</span>
                        <span>{rt.totalRooms} rooms</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-border text-muted-foreground text-xs">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full border-dashed border-border text-muted-foreground hover:text-foreground">
              <Plus className="h-4 w-4 mr-1" />Add Room Type
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="amenities">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {HOTEL_INFO.amenities.map(a => (
                  <span key={a} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />{a}
                  </span>
                ))}
              </div>
              <Button variant="outline" className="mt-4 border-border text-muted-foreground text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />Add Amenity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              {[
                { label: "Check-in Time", value: HOTEL_INFO.policies.checkIn },
                { label: "Check-out Time", value: HOTEL_INFO.policies.checkOut },
                { label: "Age Restriction", value: `${HOTEL_INFO.policies.ageRestriction}+ years` },
                { label: "Smoking Policy", value: HOTEL_INFO.policies.smoking },
                { label: "Pet Policy", value: HOTEL_INFO.policies.pets },
              ].map(p => (
                <div key={p.label}>
                  <label className="text-xs text-muted-foreground mb-1.5 block">{p.label}</label>
                  <Input defaultValue={p.value} className="bg-muted/50 border-border text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Cancellation Policy</label>
                <Textarea defaultValue={HOTEL_INFO.policies.cancellation} className="bg-muted/50 border-border text-sm" />
              </div>
              <Button className="text-primary-foreground bg-primary">Save Policies</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listing-status">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground/70">Current Status</p>
                <p className="text-xs text-muted-foreground mt-1">Your listing is currently <strong className="text-foreground/70">{status}</strong> on the platform.</p>
              </div>
              <div className="flex flex-col gap-3">
                {status !== "live" && (
                  <Button className="text-white" style={{ background: "hsl(142, 71%, 40%)" }} onClick={() => setStatus("live")}>
                    <CheckCircle className="h-4 w-4 mr-2" />Go Live
                  </Button>
                )}
                {status !== "paused" && (
                  <Button variant="outline" className="border-amber-500/20 text-amber-500" onClick={() => setStatus("paused")}>
                    <PauseCircle className="h-4 w-4 mr-2" />Pause Listing
                  </Button>
                )}
                {status !== "delisted" && (
                  <Button variant="outline" className="border-red-500/20 text-red-500" onClick={() => setStatus("delisted")}>
                    <XCircle className="h-4 w-4 mr-2" />Delist Property
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground/60">Listed since {HOTEL_INFO.listingDate}. Changes take effect immediately.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
