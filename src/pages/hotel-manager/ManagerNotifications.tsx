import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BookOpen, Star, Wallet, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { NOTIFICATIONS, type Notification } from "@/data/hotelManagerMockData";
import { useNavigate } from "react-router-dom";

const TYPE_CONFIG: Record<Notification["type"], { icon: React.ElementType; color: string }> = {
  booking: { icon: BookOpen, color: "hsl(217, 91%, 60%)" },
  review: { icon: Star, color: "hsl(38, 92%, 50%)" },
  payout: { icon: Wallet, color: "hsl(142, 71%, 45%)" },
  system: { icon: Info, color: "hsl(270, 60%, 60%)" },
  cancellation: { icon: AlertTriangle, color: "hsl(0, 70%, 55%)" },
  "no-show": { icon: AlertTriangle, color: "hsl(0, 70%, 55%)" },
};

export default function ManagerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Notifications</h1>
          <p className="text-sm text-white/40 mt-1">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button size="sm" variant="outline" className="border-white/10 text-white/50 text-xs" onClick={markAllRead}>
            <CheckCircle className="h-3.5 w-3.5 mr-1" />Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const config = TYPE_CONFIG[n.type];
          const Icon = config.icon;
          return (
            <Card
              key={n.id}
              className={`border-white/8 transition-colors cursor-pointer ${!n.read ? "bg-white/[0.05]" : "bg-white/[0.02]"}`}
              onClick={() => {
                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                if (n.link) navigate(n.link);
              }}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${config.color}15` }}>
                  <Icon className="h-4 w-4" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white/80">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full shrink-0" style={{ background: "hsl(18, 100%, 50%)" }} />}
                  </div>
                  <p className="text-xs text-white/45 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-white/20 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
                <Badge className="text-[9px] border-0 shrink-0" style={{ background: `${config.color}15`, color: config.color }}>{n.type}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
