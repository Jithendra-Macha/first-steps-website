import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import ManagerLayout from "./components/hotel-manager/ManagerLayout";
import ManagerDashboard from "./pages/hotel-manager/ManagerDashboard";
import AvailabilityManager from "./pages/hotel-manager/AvailabilityManager";
import ManagerReservations from "./pages/hotel-manager/ManagerReservations";
import MyListing from "./pages/hotel-manager/MyListing";
import ManagerReviews from "./pages/hotel-manager/ManagerReviews";
import ManagerAnalytics from "./pages/hotel-manager/ManagerAnalytics";
import ManagerEarnings from "./pages/hotel-manager/ManagerEarnings";
import ManagerNotifications from "./pages/hotel-manager/ManagerNotifications";
import ManagerSettings from "./pages/hotel-manager/ManagerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
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
            <Route path="/manager" element={
              <ProtectedRoute requiredRole="hotel_manager">
                <ManagerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ManagerDashboard />} />
              <Route path="availability" element={<AvailabilityManager />} />
              <Route path="reservations" element={<ManagerReservations />} />
              <Route path="listing" element={<MyListing />} />
              <Route path="reviews" element={<ManagerReviews />} />
              <Route path="analytics" element={<ManagerAnalytics />} />
              <Route path="earnings" element={<ManagerEarnings />} />
              <Route path="notifications" element={<ManagerNotifications />} />
              <Route path="settings" element={<ManagerSettings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
