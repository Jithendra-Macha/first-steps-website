import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile, useThemeColors, Nav, SectionHeader, Btn } from "./SharedComponents";
import { LocalBusinessJsonLd, SpeakableJsonLd } from "@/components/seo/GEOSchemas";
import type { LocationPageData } from "@/data/locationPages";
import { LOCATION_PAGES } from "@/data/locationPages";
import { HOTEL_DATABASE } from "@/lib/hotelDatabase";

const A = "#ff4d00";

/* ── JSON-LD Structured Data ── */
export function LocationJsonLd({ data }: { data: LocationPageData }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `Hourly Hotels in ${data.name}, ${data.state}`,
    description: data.metaDescription,
    url: `https://coupleofhours.com/hotels/${data.slug}`,
    touristType: ["Business Traveler", "Leisure Traveler", "Transit Passenger"],
    geo: { "@type": "GeoCoordinates" },
    containsPlace: data.neighborhoods.map(n => ({
      "@type": "Accommodation",
      name: `Hourly Hotels in ${n.name}`,
      description: n.description,
      numberOfRooms: n.hotels,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: data.stats.find(s => s.label.includes("Rating"))?.value?.replace("★", "") || "4.5",
      bestRating: "5",
      ratingCount: "500",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://coupleofhours.com" },
      { "@type": "ListItem", position: 2, name: "Hotels", item: "https://coupleofhours.com/hotels" },
      { "@type": "ListItem", position: 3, name: data.name, item: `https://coupleofhours.com/hotels/${data.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}

/* ── Hero ── */
function Hero({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  return (
    <header
      style={{
        background: data.heroImage,
        padding: mob ? "4rem 5% 3rem" : "6rem 8% 4.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
        <nav aria-label="breadcrumb" style={{ marginBottom: "1.2rem", display: "flex", gap: 6, alignItems: "center", fontSize: ".72rem", color: "rgba(255,255,255,.6)" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,.9)" }}>{data.name}</span>
        </nav>
        <h1 style={{ fontSize: mob ? "2rem" : "3rem", fontWeight: 900, color: "#fff", letterSpacing: "-.04em", lineHeight: 1.08, marginBottom: "1rem" }}>
          {data.heroTitle}
        </h1>
        <p style={{ fontSize: mob ? ".95rem" : "1.1rem", color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 580, marginBottom: "2rem" }}>
          {data.heroSubtitle}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {data.stats.map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,.1)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "12px 18px", border: "1px solid rgba(255,255,255,.12)" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", letterSpacing: "-.03em" }}>{s.value}</div>
              <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.6)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ── Highlights ── */
function Highlights({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  return (
    <section style={{ padding: mob ? "2.5rem 5%" : "3.5rem 8%", background: t.bg }}>
      <SectionHeader title={`Why Book in`} accent={data.name} sub={`Top reasons travelers choose ${data.name} for hourly stays`} />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", gap: mob ? 10 : 16 }}>
        {data.highlights.map((h, i) => (
          <HighlightCard key={i} h={h} />
        ))}
      </div>
    </section>
  );
}

function HighlightCard({ h }: { h: { icon: string; title: string; description: string } }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: t.bgCard,
        border: `1.5px solid ${hov ? A : t.border}`,
        borderRadius: 16,
        padding: "22px 20px",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 8px 28px ${t.shadow}` : "none",
        transition: "all .2s",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>{h.icon}</div>
      <div style={{ fontSize: ".95rem", fontWeight: 800, color: t.navy, marginBottom: 6 }}>{h.title}</div>
      <div style={{ fontSize: ".77rem", color: t.textSecondary, lineHeight: 1.6 }}>{h.description}</div>
    </div>
  );
}

/* ── Neighborhoods ── */
function Neighborhoods({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  return (
    <section style={{ padding: mob ? "2.5rem 5%" : "3.5rem 8%", background: t.bgCard }}>
      <SectionHeader title="Neighborhoods in" accent={data.name} sub={`Explore ${data.neighborhoods.length} areas with hourly hotels`} />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)", gap: 14 }}>
        {data.neighborhoods.map((n, i) => (
          <NeighborhoodCard key={i} n={n} />
        ))}
      </div>
    </section>
  );
}

function NeighborhoodCard({ n }: { n: { name: string; description: string; hotels: number } }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  return (
    <article
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: t.bg,
        border: `1.5px solid ${hov ? A : t.border}`,
        borderRadius: 16,
        padding: "1.4rem 1.5rem",
        cursor: "pointer",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 8px 28px ${t.shadow}` : "none",
        transition: "all .2s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 800, color: t.navy, margin: 0 }}>{n.name}</h3>
        <span style={{ fontSize: ".64rem", fontWeight: 700, background: t.dark ? "#2a1a10" : "#fff2ee", color: A, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
          {n.hotels} hotels
        </span>
      </div>
      <p style={{ fontSize: ".8rem", color: t.textSecondary, lineHeight: 1.6, margin: 0 }}>{n.description}</p>
    </article>
  );
}

/* ── FAQs (SEO-critical) ── */
function FAQs({ data }: { data: LocationPageData }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const mob = useIsMobile();
  const t = useThemeColors();
  return (
    <section style={{ padding: mob ? "2.5rem 5%" : "3.5rem 8%", background: t.bg }}>
      <SectionHeader title="Frequently Asked" accent="Questions" sub={`Common questions about hourly hotels in ${data.name}`} />
      <div style={{ maxWidth: 740 }}>
        {data.faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "1.1rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: ".92rem", fontWeight: 700, color: t.navy, textAlign: "left" }}>{f.q}</span>
              <span style={{ fontSize: "1.2rem", color: t.textSecondary, flexShrink: 0, marginLeft: 12, transform: openIdx === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
            </button>
            {openIdx === i && (
              <p style={{ fontSize: ".84rem", color: t.textSecondary, lineHeight: 1.7, padding: "0 0 1.1rem", margin: 0 }}>{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Airports ── */
function NearbyAirports({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  if (!data.nearbyAirports.length) return null;
  return (
    <section style={{ padding: mob ? "2rem 5%" : "3rem 8%", background: t.bgCard }}>
      <SectionHeader title="Nearby" accent="Airports" sub={`Hotels near airports serving ${data.name}`} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {data.nearbyAirports.map(code => (
          <div key={code} style={{
            background: t.bg,
            border: `1.5px solid ${t.border}`,
            borderRadius: 14,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <span style={{ fontSize: "1.5rem" }}>✈️</span>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: A, letterSpacing: "-.03em" }}>{code}</div>
              <div style={{ fontSize: ".7rem", color: t.textSecondary }}>Hotels nearby</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTABanner({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  return (
    <section style={{
      background: `linear-gradient(135deg, #0d1f38 0%, #1a3a5c 50%, ${A} 100%)`,
      padding: mob ? "3rem 5%" : "4rem 8%",
      textAlign: "center",
    }}>
      <h2 style={{ fontSize: mob ? "1.6rem" : "2.2rem", fontWeight: 900, color: "#fff", letterSpacing: "-.03em", marginBottom: ".8rem" }}>
        Ready to Book in {data.name}?
      </h2>
      <p style={{ fontSize: ".95rem", color: "rgba(255,255,255,.7)", marginBottom: "1.8rem", maxWidth: 480, margin: "0 auto 1.8rem" }}>
        Starting from {data.avgRate}/hr · {data.stats[0]?.value} hotels available
      </p>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Btn style={{ padding: "14px 36px", fontSize: ".95rem", borderRadius: 12 }}>
          Search Hotels in {data.name} →
        </Btn>
      </Link>
    </section>
  );
}

/* ── Footer (simple SEO footer) ── */
function SEOFooter({ data }: { data: LocationPageData }) {
  const t = useThemeColors();
  const mob = useIsMobile();
  return (
    <footer style={{ padding: mob ? "2rem 5%" : "2.5rem 8%", background: t.dark ? "#080808" : "#f5f5f5", borderTop: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: mob ? 20 : 40, marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Explore</div>
          {data.neighborhoods.slice(0, 4).map(n => (
            <div key={n.name} style={{ fontSize: ".78rem", color: t.textSecondary, marginBottom: 4 }}>Hotels in {n.name}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Airports</div>
          {data.nearbyAirports.map(a => (
            <div key={a} style={{ fontSize: ".78rem", color: t.textSecondary, marginBottom: 4 }}>Hotels near {a}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Info</div>
          <div style={{ fontSize: ".78rem", color: t.textSecondary, marginBottom: 4 }}>Average Rate: {data.avgRate}/hr</div>
          <div style={{ fontSize: ".78rem", color: t.textSecondary, marginBottom: 4 }}>{data.stats[0]?.value} hotels</div>
        </div>
      </div>
      <div style={{ fontSize: ".7rem", color: t.textMuted, borderTop: `1px solid ${t.border}`, paddingTop: "1rem" }}>
        © {new Date().getFullYear()} CoupleOfHours. Hourly hotels in {data.name}, {data.state}.
      </div>
    </footer>
  );
}

/* ── Related Locations Map ── */
const RELATED_SLUGS: Record<string, string[]> = {
  "new-york-city": ["manhattan", "brooklyn", "queens", "bronx", "staten-island", "jfk-airport"],
  manhattan: ["new-york-city", "brooklyn", "jersey-city", "hoboken", "jfk-airport"],
  brooklyn: ["manhattan", "queens", "new-york-city", "jfk-airport", "staten-island"],
  queens: ["jfk-airport", "lga-airport", "brooklyn", "manhattan", "bronx"],
  bronx: ["manhattan", "queens", "new-york-city", "lga-airport"],
  "staten-island": ["brooklyn", "new-jersey", "jersey-city", "manhattan"],
  "new-jersey": ["jersey-city", "hoboken", "ewr-airport", "manhattan", "staten-island"],
  "jfk-airport": ["queens", "brooklyn", "lga-airport", "manhattan", "new-york-city"],
  "lga-airport": ["queens", "jfk-airport", "manhattan", "bronx", "brooklyn"],
  "ewr-airport": ["new-jersey", "jersey-city", "hoboken", "manhattan", "staten-island"],
  "jersey-city": ["hoboken", "new-jersey", "manhattan", "ewr-airport", "staten-island"],
  hoboken: ["jersey-city", "new-jersey", "manhattan", "ewr-airport"],
};

/* ── Related Locations Section ── */
function RelatedLocations({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  const relatedSlugs = RELATED_SLUGS[data.slug] || [];
  const related = relatedSlugs
    .map(slug => LOCATION_PAGES[slug])
    .filter(Boolean)
    .slice(0, mob ? 3 : 5);

  if (!related.length) return null;

  return (
    <section style={{ padding: mob ? "2.5rem 5%" : "3.5rem 8%", background: t.bgCard }}>
      <SectionHeader title="Explore" accent="Nearby" sub={`More hourly hotel locations near ${data.name}`} />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : `repeat(${Math.min(related.length, 5)},1fr)`, gap: 14 }}>
        {related.map(loc => (
          <RelatedCard key={loc.slug} loc={loc} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ loc }: { loc: LocationPageData }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  return (
    <Link
      to={`/hotels/${loc.slug}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        background: t.bg,
        border: `1.5px solid ${hov ? "#ff4d00" : t.border}`,
        borderRadius: 16,
        padding: "1.2rem 1.3rem",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 8px 28px ${t.shadow}` : "none",
        transition: "all .2s",
      }}>
        <div style={{ fontSize: "1rem", fontWeight: 800, color: t.navy, marginBottom: 4 }}>{loc.name}</div>
        <div style={{ fontSize: ".72rem", color: t.textSecondary, marginBottom: 8 }}>{loc.state}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: ".65rem", fontWeight: 700, background: t.dark ? "#2a1a10" : "#fff2ee", color: "#ff4d00", padding: "2px 8px", borderRadius: 12 }}>
            {loc.stats[0]?.value} hotels
          </span>
          <span style={{ fontSize: ".65rem", fontWeight: 600, color: t.textSecondary }}>
            from {loc.avgRate}/hr
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Featured Hotels Section ── */
function FeaturedHotels({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  const A = "#ff4d00";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  const locationName = data.name.toLowerCase();
  const hotels = HOTEL_DATABASE.filter(h => {
    const borough = h.borough.toLowerCase();
    const area = h.area.toLowerCase();
    return borough.includes(locationName) || locationName.includes(borough) || area.includes(locationName);
  });

  if (hotels.length === 0) return null;

  return (
    <section style={{ padding: mob ? "2.5rem 5%" : "3.5rem 8%", background: t.bg }}>
      <SectionHeader title="Hotels in" accent={data.name} sub={`${hotels.length} verified hourly hotels available`} />
      <div style={{ position: "relative" }}>
        {/* Left arrow */}
        {canLeft && (
          <button
            onClick={() => scroll("left")}
            style={{
              position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
              width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
              background: t.bgCard, boxShadow: "0 2px 12px rgba(0,0,0,.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} color={t.navy} />
          </button>
        )}
        {/* Right arrow */}
        {canRight && (
          <button
            onClick={() => scroll("right")}
            style={{
              position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
              width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
              background: t.bgCard, boxShadow: "0 2px 12px rgba(0,0,0,.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ChevronRight size={20} color={t.navy} />
          </button>
        )}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="hotel-scroll"
          style={{
            display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: 16,
            overflowX: "auto", scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch", paddingBottom: 16,
            scrollbarWidth: "none", msOverflowStyle: "none" as any,
          }}
        >
          <style>{`.hotel-scroll::-webkit-scrollbar{display:none}`}</style>
          {hotels.map(hotel => {
            const cheapest = Math.min(...hotel.rooms.map(r => r.hourly_rate));
            return (
              <div key={hotel.id} style={{ flex: "0 0 auto", width: mob ? "85vw" : 340, scrollSnapAlign: "start" }}>
                <HotelListingCard hotel={hotel} cheapest={cheapest} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HotelListingCard({ hotel, cheapest }: { hotel: typeof HOTEL_DATABASE[0]; cheapest: number }) {
  const [hov, setHov] = useState(false);
  const t = useThemeColors();
  const A = "#ff4d00";
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.bgCard,
        border: `1.5px solid ${hov ? A : t.border}`,
        borderRadius: 18,
        overflow: "hidden",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? `0 12px 32px ${t.shadow}` : "none",
        transition: "all .25s",
        cursor: "pointer",
      }}
    >
      {/* Image header */}
      <div style={{ height: 140, background: hotel.image, position: "relative" }}>
        <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {hotel.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: ".58rem", fontWeight: 700, padding: "3px 8px", borderRadius: 8,
              background: "rgba(0,0,0,.55)", color: "#fff", backdropFilter: "blur(6px)",
              textTransform: "capitalize",
            }}>{tag}</span>
          ))}
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ fontSize: ".92rem", fontWeight: 800, color: t.navy, margin: 0, lineHeight: 1.25 }}>{hotel.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
            <span style={{ fontSize: ".7rem" }}>⭐</span>
            <span style={{ fontSize: ".78rem", fontWeight: 800, color: t.navy }}>{hotel.rating}</span>
          </div>
        </div>
        <p style={{ fontSize: ".72rem", color: t.textSecondary, margin: "0 0 10px" }}>{hotel.area} · {hotel.total_reviews.toLocaleString()} reviews</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "1.1rem", fontWeight: 900, color: A }}>${cheapest}</span>
            <span style={{ fontSize: ".7rem", color: t.textSecondary }}>/hr</span>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {hotel.rooms.map(r => (
              <span key={r.room_id} style={{
                fontSize: ".58rem", fontWeight: 600, padding: "2px 7px", borderRadius: 6,
                background: t.dark ? "rgba(255,77,0,.15)" : "#fff2ee", color: A,
              }}>{r.type}</span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {hotel.rooms[0]?.amenities.slice(0, 4).map(a => (
            <span key={a} style={{ fontSize: ".6rem", color: t.textMuted, background: t.dark ? "rgba(255,255,255,.06)" : "#f5f5f5", padding: "2px 6px", borderRadius: 5 }}>{a}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ── Main Component ── */
export default function LocationLanding({ data }: { data: LocationPageData }) {
  return (
    <main>
      <LocationJsonLd data={data} />
      <LocalBusinessJsonLd name={data.name} state={data.state} slug={data.slug} avgRate={data.avgRate} />
      <SpeakableJsonLd selectors={["[data-speakable]", "h1", ".geo-answer"]} />
      <Nav onSearch={() => {}} />
      <Hero data={data} />
      <GEOSummary data={data} />
      <FeaturedHotels data={data} />
      <Highlights data={data} />
      <Neighborhoods data={data} />
      <NearbyAirports data={data} />
      <FAQs data={data} />
      <RelatedLocations data={data} />
      <CTABanner data={data} />
      <SEOFooter data={data} />
    </main>
  );
}

/* ── GEO: Direct-Answer Summary Block ── */
function GEOSummary({ data }: { data: LocationPageData }) {
  const mob = useIsMobile();
  const t = useThemeColors();
  const ratingStat = data.stats.find(s => s.label.includes("Rating"))?.value || "4.5★";
  const hotelsStat = data.stats.find(s => s.label.includes("Hotels"))?.value || "50+";

  return (
    <section
      data-speakable="true"
      className="geo-answer"
      style={{ padding: mob ? "2rem 5%" : "2.5rem 8%", background: t.bg, borderBottom: `1px solid ${t.border}` }}
    >
      <div style={{ maxWidth: 780 }}>
        <p style={{ fontSize: ".92rem", color: t.navy, lineHeight: 1.75, fontWeight: 500, margin: 0 }}>
          <strong>{data.name}</strong> has <strong>{hotelsStat}</strong> hourly hotels available through CoupleOfHours,
          with rates starting from <strong>{data.avgRate}/hr</strong>.
          Guests rate {data.name} hotels <strong>{ratingStat}</strong> on average.
          {data.name} hourly hotels are ideal for{" "}
          {data.nearbyAirports.length > 0
            ? `airport layovers (near ${data.nearbyAirports.join(", ")}), `
            : ""}
          business meetings, day stays, and short visits.
          Book 2–12 hours with instant confirmation and no hidden fees.
        </p>
      </div>
    </section>
  );
}
