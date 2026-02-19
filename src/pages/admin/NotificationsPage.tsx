import { useState } from "react";
import { Bell, Hotel, Flag, Star, Users, AlertTriangle, CreditCard, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_NOTIFICATIONS } from "@/data/adminMockData";

const ICON_MAP: Record<string, React.ElementType> = {
  hotel_registration: Hotel,
  hotel_flagged: Flag,
  review_reported: Star,
  account_flagged: Users,
  no_show: AlertTriangle,
  payment_dispute: CreditCard,
};

const COLOR_MAP: Record<string, string> = {
  hotel_registration: "hsl(217, 91%, 60%)",
  hotel_flagged: "hsl(0, 84%, 60%)",
  review_reported: "hsl(270, 60%, 60%)",
  account_flagged: "hsl(38, 92%, 50%)",
  no_show: "hsl(0, 84%, 60%)",
  payment_dispute: "hsl(38, 92%, 50%)",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Notifications</h1>
          <p className="text-xs text-white/40 mt-0.5">{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <Button size="sm" variant="outline" className="border-white/10 text-white/50 gap-1.5" onClick={markAllRead}>
            <Check className="h-3.5 w-3.5" />Mark All Read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const Icon = ICON_MAP[n.type] || Bell;
          const color = COLOR_MAP[n.type] || "hsl(217, 91%, 60%)";
          return (
            <Card key={n.id} className={`border-white/8 transition-colors ${n.read ? "bg-white/[0.02]" : "bg-white/[0.05]"}`}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? "text-white/50" : "text-white/90"}`}>{n.message}</p>
                  <p className="text-[11px] text-white/25 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <Button size="sm" variant="ghost" className="text-[11px] text-white/30 hover:text-white/60 h-7" onClick={() => markRead(n.id)}>
                    Mark read
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
