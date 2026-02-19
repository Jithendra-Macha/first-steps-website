import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Hotel, Users, Star, DollarSign, Bell, Settings, ChevronDown, ChevronRight,
  Search, Menu, X, LogOut, Moon, Sun
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTIFICATIONS } from "@/data/adminMockData";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  {
    icon: Hotel, label: "Hotels", children: [
      { label: "All Hotels", path: "/admin/hotels" },
      { label: "Pending Approvals", path: "/admin/hotels/pending" },
    ],
  },
  {
    icon: Users, label: "Customers", children: [
      { label: "All Customers", path: "/admin/customers" },
      { label: "No-Shows", path: "/admin/customers/no-shows" },
    ],
  },
  { icon: Star, label: "Reviews & Ratings", path: "/admin/reviews" },
  { icon: DollarSign, label: "Financials", path: "/admin/financials" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Hotels", "Customers"]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("admin-theme", true);
    return () => { document.documentElement.classList.remove("admin-theme"); };
  }, [dark]);

  // Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]);
  };

  const isActive = (path?: string) => path && location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "hsl(220, 26%, 7%)", color: "hsl(0, 0%, 92%)" }}>
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r transition-all duration-300 shrink-0",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
        style={{ borderColor: "hsla(0,0%,100%,0.08)", background: "hsl(220, 28%, 9%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b" style={{ borderColor: "hsla(0,0%,100%,0.08)" }}>
          {!collapsed && <span className="font-bold text-base tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Admin</span>}
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {NAV_ITEMS.map(item => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => collapsed ? navigate(item.children![0].path) : toggleGroup(item.label)}
                    className={cn(
                      "flex items-center gap-2 w-full rounded-md px-2 py-2 text-sm transition-colors hover:bg-white/5",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0 opacity-70" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        <ChevronDown className={cn("h-3 w-3 transition-transform", expandedGroups.includes(item.label) && "rotate-180")} />
                      </>
                    )}
                  </button>
                  {!collapsed && expandedGroups.includes(item.label) && (
                    <div className="ml-6 space-y-0.5 mb-1">
                      {item.children.map(child => (
                        <button
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          className={cn(
                            "block w-full text-left rounded-md px-2 py-1.5 text-xs transition-colors",
                            isActive(child.path) ? "bg-blue-600/20 text-blue-400" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                          )}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate(item.path!)}
                  className={cn(
                    "flex items-center gap-2 w-full rounded-md px-2 py-2 text-sm transition-colors hover:bg-white/5",
                    collapsed && "justify-center",
                    isActive(item.path) && "bg-blue-600/20 text-blue-400"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 opacity-70" />
                  {!collapsed && <span>{item.label}</span>}
                  {item.label === "Notifications" && unreadCount > 0 && (
                    <Badge className="ml-auto h-5 min-w-5 flex items-center justify-center text-[10px] bg-red-500 border-0 text-white">{unreadCount}</Badge>
                  )}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        {!collapsed && (
          <div className="p-3 border-t space-y-1" style={{ borderColor: "hsla(0,0%,100%,0.08)" }}>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-white/40 hover:text-white/70" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {dark ? "Light mode" : "Dark mode"}
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-white/40 hover:text-white/70" onClick={() => navigate("/")}>
              <LogOut className="h-3.5 w-3.5" />Exit Admin
            </Button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-6 h-14 border-b shrink-0" style={{ borderColor: "hsla(0,0%,100%,0.08)", background: "hsl(220, 28%, 9%)" }}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search hotels, customers, reservations... (⌘K)"
              className="pl-9 h-9 text-sm border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-blue-500/30"
              onFocus={() => setSearchOpen(true)}
            />
          </div>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/admin/notifications")}>
            <Bell className="h-4 w-4 text-white/60" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
          </Button>
          <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: "hsla(0,0%,100%,0.08)" }}>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "hsl(217, 91%, 60%)" }}>A</div>
            {!collapsed && <span className="text-sm text-white/70">Admin</span>}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "hsl(220, 26%, 7%)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
