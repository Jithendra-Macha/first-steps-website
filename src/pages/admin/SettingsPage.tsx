import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, DollarSign, Ban, Bell, Wrench } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-5 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Platform Settings</h1>
        <p className="text-xs text-white/40 mt-0.5">Configure platform-wide settings</p>
      </div>

      {/* Admin Accounts */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white/70"><Shield className="h-4 w-4" />Admin Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <div>
              <p className="text-sm text-white/80">Admin User</p>
              <p className="text-xs text-white/30">admin@platform.com · Super Admin</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">Active</span>
          </div>
          <Button size="sm" variant="outline" className="border-white/10 text-white/50">+ Add Admin</Button>
        </CardContent>
      </Card>

      {/* Commission */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white/70"><DollarSign className="h-4 w-4" />Commission Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input type="number" defaultValue="12" className="w-24 h-9 bg-white/5 border-white/10 text-white text-sm" />
            <span className="text-sm text-white/50">% platform fee on bookings</span>
            <Button size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
          </div>
        </CardContent>
      </Card>

      {/* Moderation */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white/70"><Bell className="h-4 w-4" />Alert Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Auto-flag hotels with &gt;3 reports</p>
              <p className="text-[11px] text-white/30">Moves hotel to Under Review</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Alert on customer no-show (≥2)</p>
              <p className="text-[11px] text-white/30">Flags account for review</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Auto-hide reviews below 2 stars</p>
              <p className="text-[11px] text-white/30">Requires manual approval</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card className="border-white/8 bg-white/[0.03] text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white/70"><Wrench className="h-4 w-4" />Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Maintenance Mode</p>
              <p className="text-[11px] text-white/30">Disables all bookings and shows maintenance page</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
