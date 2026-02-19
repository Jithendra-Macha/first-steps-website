import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import HotelsAll from "./pages/admin/HotelsAll";
import HotelsPending from "./pages/admin/HotelsPending";
import HotelDetail from "./pages/admin/HotelDetail";
import CustomersAll from "./pages/admin/CustomersAll";
import CustomerDetail from "./pages/admin/CustomerDetail";
import NoShowsPage from "./pages/admin/NoShowsPage";
import ReviewsPage from "./pages/admin/ReviewsPage";
import FinancialsPage from "./pages/admin/FinancialsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="hotels" element={<HotelsAll />} />
              <Route path="hotels/pending" element={<HotelsPending />} />
              <Route path="hotels/:id" element={<HotelDetail />} />
              <Route path="customers" element={<CustomersAll />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="customers/no-shows" element={<NoShowsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="financials" element={<FinancialsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
