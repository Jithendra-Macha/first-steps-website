/**
 * GEO (Generative Engine Optimization) Components
 * Optimizes content for AI-powered search engines: Google SGE, Perplexity, Bing Chat, ChatGPT
 * 
 * Key strategies:
 * - Rich structured data (Organization, WebSite, HowTo, LocalBusiness)
 * - Speakable content markup for voice assistants
 * - Direct-answer content blocks for AI citation
 * - Entity-rich, authoritative content patterns
 * - SearchAction for sitelinks searchbox
 */

/* ── Organization Schema (homepage) ── */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CoupleOfHours",
    url: "https://coupleofhours.com",
    logo: "https://coupleofhours.com/favicon.ico",
    description: "CoupleOfHours is the leading platform for booking hourly hotel rooms in New York City and New Jersey. Pay only for the hours you need — not the whole night.",
    foundingDate: "2024",
    areaServed: [
      { "@type": "City", name: "New York City", containedInPlace: { "@type": "State", name: "New York" } },
      { "@type": "State", name: "New Jersey" },
    ],
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "2400",
      bestRating: "5",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ── WebSite + SearchAction Schema (enables sitelinks searchbox in SGE) ── */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CoupleOfHours",
    url: "https://coupleofhours.com",
    description: "Book premium hourly hotel rooms in NYC and NJ. Starting from $10/hr.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://coupleofhours.com/?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "CoupleOfHours",
      url: "https://coupleofhours.com",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ── HowTo Schema (for "how to book hourly hotel") ── */
export function HowToJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Book an Hourly Hotel Room on CoupleOfHours",
    description: "A step-by-step guide to booking a hotel room by the hour in New York City or New Jersey using CoupleOfHours.",
    totalTime: "PT3M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "10-50" },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Search your location",
        text: "Enter a city, borough, neighborhood, or airport code (e.g., JFK, Manhattan, Brooklyn) in the search bar. CoupleOfHours covers all 5 NYC boroughs and Northern New Jersey.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose your hotel and time slot",
        text: "Browse available hotels, compare hourly rates starting from $10/hr, read verified guest reviews, and select your preferred check-in time and duration (2 to 12 hours).",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Book and check in",
        text: "Confirm your booking instantly with no hidden fees. Receive a digital confirmation and check in at your selected time. Extend your stay on-site if needed.",
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ── Service Schema (for AI engines to understand the core offering) ── */
export function ServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hourly Hotel Booking",
    provider: { "@type": "Organization", name: "CoupleOfHours", url: "https://coupleofhours.com" },
    description: "Book hotel rooms by the hour in New York City and New Jersey. Ideal for airport layovers, business meetings, day stays, and romantic escapes. Rates start at $10/hr with instant confirmation.",
    areaServed: [
      { "@type": "City", name: "New York City" },
      { "@type": "AdministrativeArea", name: "New Jersey" },
    ],
    serviceType: "Hourly Hotel Booking",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "10",
      highPrice: "50",
      priceCurrency: "USD",
      offerCount: "200+",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hourly Hotel Rooms",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "HotelRoom", name: "Standard Room" }, price: "10", priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "HotelRoom", name: "Deluxe Room" }, price: "18", priceCurrency: "USD" },
        { "@type": "Offer", itemOffered: { "@type": "HotelRoom", name: "Suite" }, price: "35", priceCurrency: "USD" },
      ],
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ── Homepage FAQ Schema (different from location FAQs) ── */
export function HomepageFAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is CoupleOfHours?",
        acceptedAnswer: { "@type": "Answer", text: "CoupleOfHours is a platform that lets you book hotel rooms by the hour in New York City and New Jersey. Instead of paying for a full overnight stay, you pay only for 2 to 12 hours — starting from $10/hr. It's ideal for airport layovers, business meetings, day stays, and more." },
      },
      {
        "@type": "Question",
        name: "How much does an hourly hotel room cost in NYC?",
        acceptedAnswer: { "@type": "Answer", text: "Hourly hotel rates in NYC range from $10/hr in The Bronx and Queens to $18+/hr in Manhattan. The average rate across all boroughs is approximately $15/hr. CoupleOfHours shows transparent pricing with no hidden fees." },
      },
      {
        "@type": "Question",
        name: "Which areas does CoupleOfHours cover?",
        acceptedAnswer: { "@type": "Answer", text: "CoupleOfHours covers all 5 NYC boroughs (Manhattan, Brooklyn, Queens, The Bronx, Staten Island) and Northern New Jersey (Hoboken, Jersey City, Newark). We have 200+ partner hotels across these areas." },
      },
      {
        "@type": "Question",
        name: "Can I book an hourly hotel near JFK or LaGuardia airport?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. CoupleOfHours has 40+ hotels near NYC airports including JFK, LaGuardia (LGA), and Newark (EWR). Most are within a 5–10 minute drive from terminals, making them perfect for layovers or early/late flights." },
      },
      {
        "@type": "Question",
        name: "Is it safe to book hourly hotels through CoupleOfHours?",
        acceptedAnswer: { "@type": "Answer", text: "Absolutely. All hotels on CoupleOfHours are vetted and rated 4+ stars. We enforce strict hygiene protocols, verified guest reviews, and transparent pricing. Over 2,400 guests have rated us 4.7/5 stars." },
      },
      {
        "@type": "Question",
        name: "How do I book an hourly hotel room?",
        acceptedAnswer: { "@type": "Answer", text: "Booking takes under 3 minutes: (1) Search your location or airport, (2) Choose a hotel and select your check-in time and duration (2–12 hours), (3) Confirm instantly. No hidden fees. You can extend your stay on-site if the room is available." },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ── Speakable Schema (tells voice assistants which content to read) ── */
export function SpeakableJsonLd({ selectors }: { selectors: string[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: selectors,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ── LocalBusiness Schema per location ── */
export function LocalBusinessJsonLd({ name, state, slug, avgRate }: { name: string; state: string; slug: string; avgRate: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `CoupleOfHours — Hourly Hotels in ${name}`,
    url: `https://coupleofhours.com/hotels/${slug}`,
    description: `Book hourly hotel rooms in ${name}, ${state}. Rates starting from ${avgRate}/hr. Pay only for the hours you need.`,
    address: { "@type": "PostalAddress", addressLocality: name, addressRegion: state, addressCountry: "US" },
    priceRange: `${avgRate}+/hr`,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
