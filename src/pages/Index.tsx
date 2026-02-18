import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav, Hero, TrustRow } from "@/components/coh/SharedComponents";
import { DealsSection, ZonesSection, WhySection, AirportsSection, NJSection, OccasionsSection, HowItWorks, Stats, Footer } from "@/components/coh/LandingSections";
import ResultsPage from "@/components/coh/ResultsPage";
import HotelPage, { ConfirmationPage, type BookingData } from "@/components/coh/HotelPage";
import type { Hotel } from "@/data/hotels";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const A = "#ff4d00";
const NAVY = "#0d1f38";

const Index = () => {
  const [page, setPage] = useState<"landing" | "results" | "hotel" | "confirmation">("landing");
  const [query, setQuery] = useState("Manhattan, New York");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

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

  const handleBookingComplete = useCallback((data: BookingData) => {
    setBookingData(data);
    setPage("confirmation");
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {page === "confirmation" && bookingData && (
        <motion.div key="confirmation" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <ConfirmationPage booking={bookingData} onHome={goHome} />
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
            <Nav onSearch={goSearch} />
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
  );
};

export default Index;