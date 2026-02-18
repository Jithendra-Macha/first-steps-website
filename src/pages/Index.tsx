import { useState, useCallback } from "react";
import { Nav, Hero, TrustRow } from "@/components/coh/SharedComponents";
import { DealsSection, ZonesSection, WhySection, AirportsSection, NJSection, OccasionsSection, HowItWorks, Stats, Footer } from "@/components/coh/LandingSections";
import ResultsPage from "@/components/coh/ResultsPage";
import HotelPage, { ConfirmationPage, type BookingData } from "@/components/coh/HotelPage";
import type { Hotel } from "@/data/hotels";

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

  if (page === "confirmation" && bookingData) {
    return <ConfirmationPage booking={bookingData} onHome={goHome} />;
  }

  if (page === "hotel" && selectedHotel) {
    return <HotelPage hotel={selectedHotel} onBack={goBackFromHotel} onBookingComplete={handleBookingComplete} />;
  }

  if (page === "results") {
    return <ResultsPage query={query} onGoHome={goHome} onSearch={goSearch} onHotelClick={goHotel} />;
  }

  return (
    <div>
      {/* promo bar */}
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
  );
};

export default Index;