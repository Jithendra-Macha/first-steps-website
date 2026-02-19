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
        <p className="text-sm text-white/40 mt-1">Manage your profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-white/5 border border-white/8">
          <TabsTrigger value="profile" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40">Profile</TabsTrigger>
          <TabsTrigger value="bank" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40">Bank Details</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40">Notification Prefs</TabsTrigger>
          <TabsTrigger value="staff" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40">Staff Logins</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-white/8 bg-white/[0.03] text-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: "hsl(200, 60%, 45%)" }}>
                  {HOTEL_INFO.manager.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{HOTEL_INFO.manager.name}</p>
                  <p className="text-xs text-white/40">Hotel Manager</p>
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
                    <label className="text-xs text-white/35 mb-1.5 block">{f.label}</label>
                    <Input defaultValue={f.value} className="bg-white/5 border-white/10 text-white text-sm" />
                  </div>
                ))}
              </div>
              <Button className="text-white" style={{ background: "hsl(18, 100%, 50%)" }}>Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card className="border-white/8 bg-white/[0.03] text-white">
            <CardContent className="p-6 space-y-4">
              {[
                { label: "Account Holder Name", value: "Rajesh Menon" },
                { label: "Bank Name", value: "HDFC Bank" },
                { label: "Account Number", value: "•••• •••• •••• 4521" },
                { label: "IFSC Code", value: "HDFC0001234" },
                { label: "UPI ID", value: "rajesh@hdfcbank" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-white/35 mb-1.5 block">{f.label}</label>
                  <Input defaultValue={f.value} className="bg-white/5 border-white/10 text-white text-sm" />
                </div>
              ))}
              <Button className="text-white" style={{ background: "hsl(18, 100%, 50%)" }}>Update Bank Details</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-white/8 bg-white/[0.03] text-white">
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
                    <p className="text-sm text-white/70">{pref.label}</p>
                    <p className="text-[11px] text-white/30">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked={pref.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card className="border-white/8 bg-white/[0.03] text-white">
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-white/40">Manage staff members who can access the dashboard with limited permissions.</p>
              {[
                { name: "Priya Nair", email: "priya@grandresidency.in", role: "Front Desk", active: true },
                { name: "Arun Kumar", email: "arun@grandresidency.in", role: "Housekeeping Manager", active: true },
                { name: "Sita Devi", email: "sita@grandresidency.in", role: "Revenue Manager", active: false },
              ].map(staff => (
                <div key={staff.email} className="flex items-center justify-between rounded-lg p-3" style={{ background: "hsla(0,0%,100%,0.03)", border: "1px solid hsla(0,0%,100%,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "hsl(225, 25%, 20%)" }}>
                      {staff.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/70">{staff.name}</p>
                      <p className="text-[10px] text-white/30">{staff.email} · {staff.role}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={staff.active} />
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-white/10 text-white/30 hover:text-white/50 text-xs">
                + Invite Staff Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
