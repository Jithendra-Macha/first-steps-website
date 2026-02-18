import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav, Hero, TrustRow } from "@/components/coh/SharedComponents";
import { DealsSection, ZonesSection, WhySection, AirportsSection, NJSection, OccasionsSection, HowItWorks, Stats, Footer } from "@/components/coh/LandingSections";
import ResultsPage from "@/components/coh/ResultsPage";
import HotelPage, { ConfirmationPage, type BookingData } from "@/components/coh/HotelPage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import ReservationsPage from "@/pages/ReservationsPage";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Hotel } from "@/data/hotels";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const A = "#ff4d00";
const NAVY = "#0d1f38";

const Index = () => {
  const [page, setPage] = useState<"landing" | "results" | "hotel" | "confirmation" | "profile" | "reservations">("landing");
  const [query, setQuery] = useState("Manhattan, New York");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut } = useAuth();

  const goSearch = useCallback((q: string) => {
    setQuery(q || "Manhattan");
    setPage("results");
    window.scrollTo(0, 0);
  }, []);

  const goHome = useCallback(() => {
    setPage("landing");
    window.scrollTo(0, 0);
  }, []);

  const goHotel = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setPage("hotel");
    window.scrollTo(0, 0);
  }, []);

  const goBackFromHotel = useCallback(() => {
    setPage("results");
    window.scrollTo(0, 0);
  }, []);

  const handleBookingComplete = useCallback(async (data: BookingData) => {
    // Save reservation to database if user is logged in
    if (user) {
      await supabase.from("reservations").insert({
        user_id: user.id,
        hotel_name: data.hotel.name,
        hotel_image: data.hotel.photoBg,
        hotel_address: data.hotel.addr,
        room_type: data.room.name,
        check_in_date: new Date().toISOString().split("T")[0],
        time_slot: data.slot.time,
        guests: data.rooms * 2,
        total_price: data.total,
        booking_id: data.bookingId,
        status: "upcoming" as any,
      });
    }
    setBookingData(data);
    setPage("confirmation");
    window.scrollTo(0, 0);
  }, [user]);

  const handleAuthClick = useCallback(() => {
    setShowAuth(true);
  }, []);

  const handleProfileClick = useCallback(() => {
    if (!user) { setShowAuth(true); return; }
    setPage("profile");
    window.scrollTo(0, 0);
  }, [user]);

  const handleReservationsClick = useCallback(() => {
    if (!user) { setShowAuth(true); return; }
    setPage("reservations");
    window.scrollTo(0, 0);
  }, [user]);

  const navProps = {
    onSearch: goSearch,
    onAuthClick: handleAuthClick,
    onProfileClick: handleProfileClick,
    onReservationsClick: handleReservationsClick,
    user,
    onSignOut: signOut,
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {page === "confirmation" && bookingData && (
          <motion.div key="confirmation" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ConfirmationPage booking={bookingData} onHome={goHome} />
          </motion.div>
        )}
        {page === "profile" && (
          <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ProfilePage onBack={goHome} />
          </motion.div>
        )}
        {page === "reservations" && (
          <motion.div key="reservations" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ReservationsPage onBack={goHome} onSearch={goSearch} />
          </motion.div>
        )}
        {page === "hotel" && selectedHotel && (
          <motion.div key="hotel" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <HotelPage hotel={selectedHotel} onBack={goBackFromHotel} onBookingComplete={handleBookingComplete} />
          </motion.div>
        )}
        {page === "results" && (
          <motion.div key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ResultsPage query={query} onGoHome={goHome} onSearch={goSearch} onHotelClick={goHotel} />
          </motion.div>
        )}
        {page === "landing" && (
          <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div>
              <div style={{ background: NAVY, padding: ".55rem 5%", display: "flex", alignItems: "center", justifyContent: "center", gap: ".8rem" }}>
                <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.75)" }}>🎉 New: Book by the hour in New Jersey — <a onClick={() => goSearch("Hoboken, NJ")} style={{ color: A, fontWeight: 700, cursor: "pointer" }}>Explore NJ Hotels →</a></span>
              </div>
              <Nav {...navProps} />
              <Hero onSearch={goSearch} />
              <TrustRow />
              <DealsSection onSearch={goSearch} />
              <ZonesSection onSearch={goSearch} />
              <AirportsSection onSearch={goSearch} />
              <NJSection onSearch={goSearch} />
              <OccasionsSection onSearch={goSearch} />
              <HowItWorks />
              <Stats />
              <Footer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Index;
