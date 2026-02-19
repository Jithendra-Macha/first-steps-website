import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarClock, BookOpen, Building2, Star, BarChart3,
  Wallet, Bell, Settings, ChevronRight, Menu, LogOut, Moon, Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HOTEL_INFO, NOTIFICATIONS } from "@/data/hotelManagerMockData";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/manager" },
  { icon: CalendarClock, label: "Availability", path: "/manager/availability" },
  { icon: BookOpen, label: "Reservations", path: "/manager/reservations" },
  { icon: Building2, label: "My Listing", path: "/manager/listing" },
  { icon: Star, label: "Reviews", path: "/manager/reviews" },
  { icon: BarChart3, label: "Analytics", path: "/manager/analytics" },
  { icon: Wallet, label: "Earnings", path: "/manager/earnings" },
  { icon: Bell, label: "Notifications", path: "/manager/notifications" },
  { icon: Settings, label: "Settings", path: "/manager/settings" },
];

export default function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "hsl(225, 25%, 8%)", color: "hsl(0, 0%, 92%)" }}>
      {/* Sidebar */}
      <aside className={cn("flex flex-col border-r transition-all duration-300 shrink-0", collapsed ? "w-[60px]" : "w-[250px]")} style={{ borderColor: "hsla(0,0%,100%,0.08)", background: "hsl(225, 28%, 10%)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b" style={{ borderColor: "hsla(0,0%,100%,0.08)" }}>
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "hsl(18, 100%, 50%)" }}>GR</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{HOTEL_INFO.name}</p>
                <p className="text-[10px] opacity-40 truncate">{HOTEL_INFO.city}</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 shrink-0" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-all",
                collapsed && "justify-center px-0",
                isActive(item.path)
                  ? "text-white" 
                  : "text-white/45 hover:text-white/80 hover:bg-white/5"
              )}
              style={isActive(item.path) ? { background: "hsla(18, 100%, 50%, 0.12)" } : undefined}
            >
              <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive(item.path) && "text-[hsl(18,100%,55%)]")} />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && item.label === "Notifications" && unreadCount > 0 && (
                <Badge className="h-5 min-w-5 flex items-center justify-center text-[10px] border-0 text-white" style={{ background: "hsl(0, 70%, 50%)" }}>{unreadCount}</Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        {!collapsed && (
          <div className="p-3 border-t space-y-1" style={{ borderColor: "hsla(0,0%,100%,0.08)" }}>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "hsl(200, 60%, 45%)" }}>
                {HOTEL_INFO.manager.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{HOTEL_INFO.manager.name}</p>
                <p className="text-[10px] opacity-35 truncate">Hotel Manager</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-white/35 hover:text-white/70" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {dark ? "Light mode" : "Dark mode"}
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-white/35 hover:text-white/70" onClick={() => navigate("/")}>
              <LogOut className="h-3.5 w-3.5" />Exit Dashboard
            </Button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-3 px-6 h-14 border-b shrink-0" style={{ borderColor: "hsla(0,0%,100%,0.08)", background: "hsl(225, 28%, 10%)" }}>
          <h2 className="text-sm font-semibold flex-1" style={{ fontFamily: "'Syne', sans-serif" }}>
            {NAV_ITEMS.find(n => isActive(n.path))?.label || "Dashboard"}
          </h2>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/manager/notifications")}>
            <Bell className="h-4 w-4 text-white/50" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full" style={{ background: "hsl(0, 70%, 50%)" }} />}
          </Button>
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "hsl(200, 60%, 45%)" }}>
            {HOTEL_INFO.manager.avatar}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "hsl(225, 25%, 8%)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
