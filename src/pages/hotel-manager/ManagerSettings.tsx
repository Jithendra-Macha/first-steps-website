import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HOTEL_INFO } from "@/data/hotelManagerMockData";

export default function ManagerSettings() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="profile" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">Profile</TabsTrigger>
          <TabsTrigger value="bank" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">Bank Details</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">Notification Prefs</TabsTrigger>
          <TabsTrigger value="staff" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">Staff Logins</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold text-primary-foreground" style={{ background: "hsl(200, 60%, 45%)" }}>
                  {HOTEL_INFO.manager.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{HOTEL_INFO.manager.name}</p>
                  <p className="text-xs text-muted-foreground">Hotel Manager</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: HOTEL_INFO.manager.name },
                  { label: "Email", value: HOTEL_INFO.manager.email },
                  { label: "Phone", value: HOTEL_INFO.manager.phone },
                  { label: "Role", value: "Hotel Manager" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-muted-foreground mb-1.5 block">{f.label}</label>
                    <Input defaultValue={f.value} className="bg-muted/50 border-border text-sm" />
                  </div>
                ))}
              </div>
              <Button className="text-primary-foreground bg-primary">Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              {[
                { label: "Account Holder Name", value: "Rajesh Menon" },
                { label: "Bank Name", value: "HDFC Bank" },
                { label: "Account Number", value: "•••• •••• •••• 4521" },
                { label: "IFSC Code", value: "HDFC0001234" },
                { label: "UPI ID", value: "rajesh@hdfcbank" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-muted-foreground mb-1.5 block">{f.label}</label>
                  <Input defaultValue={f.value} className="bg-muted/50 border-border text-sm" />
                </div>
              ))}
              <Button className="text-primary-foreground bg-primary">Update Bank Details</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              {[
                { label: "New Bookings", desc: "Get notified when a guest makes a reservation", default: true },
                { label: "Cancellations", desc: "Alert when a booking is cancelled", default: true },
                { label: "No-Shows", desc: "Alert when a guest doesn't check in", default: true },
                { label: "Reviews", desc: "Notify when a new review is posted", default: true },
                { label: "Payouts", desc: "Confirm when payouts are processed", default: true },
                { label: "System Updates", desc: "Platform announcements and updates", default: false },
                { label: "Marketing Tips", desc: "Suggestions to improve your listing", default: false },
              ].map(pref => (
                <div key={pref.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/70">{pref.label}</p>
                    <p className="text-[11px] text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked={pref.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground">Manage staff members who can access the dashboard with limited permissions.</p>
              {[
                { name: "Priya Nair", email: "priya@grandresidency.in", role: "Front Desk", active: true },
                { name: "Arun Kumar", email: "arun@grandresidency.in", role: "Housekeeping Manager", active: true },
                { name: "Sita Devi", email: "sita@grandresidency.in", role: "Revenue Manager", active: false },
              ].map(staff => (
                <div key={staff.email} className="flex items-center justify-between rounded-lg p-3 bg-muted/30 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground">
                      {staff.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/70">{staff.name}</p>
                      <p className="text-[10px] text-muted-foreground">{staff.email} · {staff.role}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={staff.active} />
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-border text-muted-foreground hover:text-foreground text-xs">
                + Invite Staff Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
