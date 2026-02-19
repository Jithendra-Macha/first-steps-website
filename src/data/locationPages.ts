export interface LocationPageData {
  slug: string;
  name: string;
  state: string;
  heroTitle: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  heroImage: string;
  stats: { label: string; value: string }[];
  neighborhoods: { name: string; description: string; hotels: number }[];
  faqs: { q: string; a: string }[];
  highlights: { icon: string; title: string; description: string }[];
  nearbyAirports: string[];
  avgRate: string;
}

export const LOCATION_PAGES: Record<string, LocationPageData> = {
  "new-york-city": {
    slug: "new-york-city",
    name: "New York City",
    state: "NY",
    heroTitle: "Hourly Hotels in New York City",
    heroSubtitle: "Book premium NYC hotel rooms by the hour — perfect for layovers, day stays, business meetings, and more.",
    metaTitle: "Hourly Hotels in NYC | Book by the Hour | CoupleOfHours",
    metaDescription: "Find and book hourly hotel rooms across New York City. Premium hotels in Manhattan, Brooklyn, Queens & more. Starting from $12/hr.",
    ogImage: "/og/og-new-york-city.jpg",
    heroImage: "linear-gradient(135deg, #0d1f38 0%, #1a3a5c 50%, #ff4d00 100%)",
    avgRate: "$18",
    stats: [
      { label: "Hotels Available", value: "120+" },
      { label: "Average Rate", value: "$18/hr" },
      { label: "Boroughs Covered", value: "5" },
      { label: "Guest Rating", value: "4.7★" },
    ],
    neighborhoods: [
      { name: "Midtown Manhattan", description: "Heart of NYC — Times Square, Broadway theaters, and iconic skyscrapers. Perfect for business travelers.", hotels: 34 },
      { name: "Downtown Manhattan", description: "Financial District, World Trade Center, and trendy SoHo dining. Great for layover stays.", hotels: 22 },
      { name: "Upper East Side", description: "Museum Mile, Central Park access, and refined boutique hotels.", hotels: 12 },
      { name: "Chelsea & Meatpacking", description: "Art galleries, High Line, and vibrant nightlife. Stylish stays.", hotels: 9 },
      { name: "Brooklyn Heights", description: "Stunning Manhattan views, waterfront promenades, and brownstone charm.", hotels: 15 },
      { name: "Long Island City", description: "Affordable rates with Manhattan skyline views. Near MoMA PS1.", hotels: 11 },
    ],
    faqs: [
      { q: "How does hourly hotel booking work in NYC?", a: "Select your preferred hotel, choose a check-in date, and pick a duration (2–12 hours). You only pay for the time you use — no full-night charges." },
      { q: "What's the cheapest hourly rate in NYC?", a: "Rates start from $12/hr in outer boroughs like The Bronx and Queens. Manhattan hotels start from $18/hr." },
      { q: "Can I book a hotel near JFK or LaGuardia?", a: "Yes! We have 40+ hotels near NYC airports, perfect for layovers. Most are a 5–10 minute drive from terminals." },
      { q: "Are hourly hotels in NYC clean and safe?", a: "Absolutely. All our partner hotels are vetted, rated 4+ stars, and follow strict hygiene protocols." },
      { q: "Can I extend my stay?", a: "Yes, you can extend your stay directly from the hotel if the room is available for the additional hours." },
    ],
    highlights: [
      { icon: "🏙️", title: "5 Boroughs Covered", description: "Hotels across Manhattan, Brooklyn, Queens, The Bronx, and Staten Island." },
      { icon: "✈️", title: "Airport Proximity", description: "Hotels near JFK, LaGuardia, and Newark for easy layover stays." },
      { icon: "💼", title: "Business Ready", description: "Meeting rooms, fast WiFi, and day-use suites in Midtown." },
      { icon: "🌙", title: "24/7 Availability", description: "Book rooms any time — day or night, 365 days a year." },
    ],
    nearbyAirports: ["JFK", "LGA", "EWR"],
  },
  brooklyn: {
    slug: "brooklyn",
    name: "Brooklyn",
    state: "NY",
    heroTitle: "Hourly Hotels in Brooklyn",
    heroSubtitle: "Discover Brooklyn's best hourly hotel rooms — from waterfront suites to boutique stays in Williamsburg and DUMBO.",
    metaTitle: "Hourly Hotels in Brooklyn, NY | Book by the Hour | CoupleOfHours",
    metaDescription: "Book hourly hotels in Brooklyn. Trendy stays in Williamsburg, DUMBO, Park Slope & more. Starting from $14/hr.",
    ogImage: "/og/og-brooklyn.jpg",
    heroImage: "linear-gradient(135deg, #1a3a2a 0%, #0d3020 50%, #ff4d00 100%)",
    avgRate: "$16",
    stats: [
      { label: "Hotels Available", value: "38+" },
      { label: "Average Rate", value: "$16/hr" },
      { label: "Neighborhoods", value: "12" },
      { label: "Guest Rating", value: "4.6★" },
    ],
    neighborhoods: [
      { name: "Williamsburg", description: "Brooklyn's hippest neighborhood — rooftop bars, street art, and waterfront hotels.", hotels: 8 },
      { name: "DUMBO", description: "Iconic Brooklyn Bridge views, cobblestone streets, and luxury boutique stays.", hotels: 5 },
      { name: "Brooklyn Heights", description: "Charming brownstones, the Promenade, and easy Manhattan access.", hotels: 6 },
      { name: "Park Slope", description: "Tree-lined streets, Prospect Park, and family-friendly hotel options.", hotels: 4 },
      { name: "Downtown Brooklyn", description: "Shopping, dining, and convenient transit hub hotels.", hotels: 9 },
      { name: "Bushwick", description: "Art galleries, nightlife, and budget-friendly hourly rooms.", hotels: 6 },
    ],
    faqs: [
      { q: "Are there hourly hotels near the Brooklyn Bridge?", a: "Yes! Hotels in DUMBO and Brooklyn Heights are walking distance from the Brooklyn Bridge with stunning views." },
      { q: "What's the average rate in Brooklyn?", a: "Brooklyn hourly rates average $16/hr — more affordable than Manhattan while offering trendy, well-rated stays." },
      { q: "How do I get from Brooklyn to Manhattan?", a: "Brooklyn is connected to Manhattan via subway (15–25 min), Uber, or even a scenic walk across the Brooklyn Bridge." },
      { q: "Are there pet-friendly hourly hotels in Brooklyn?", a: "Several Brooklyn hotels welcome pets. Filter by 'pet-friendly' when searching." },
    ],
    highlights: [
      { icon: "🌉", title: "Bridge Views", description: "Hotels with stunning Brooklyn and Manhattan bridge panoramas." },
      { icon: "🎨", title: "Art & Culture", description: "Stay near galleries, street art, and Brooklyn Museum." },
      { icon: "🍕", title: "Food Scene", description: "World-class pizza, diverse cuisine, and rooftop dining." },
      { icon: "🚇", title: "Transit Access", description: "Easy subway connections to all of Manhattan." },
    ],
    nearbyAirports: ["JFK", "LGA"],
  },
  bronx: {
    slug: "bronx",
    name: "The Bronx",
    state: "NY",
    heroTitle: "Hourly Hotels in The Bronx",
    heroSubtitle: "Affordable hourly hotel rooms in The Bronx — near Yankee Stadium, Bronx Zoo, and major expressways.",
    metaTitle: "Hourly Hotels in The Bronx, NY | Book by the Hour | CoupleOfHours",
    metaDescription: "Book affordable hourly hotels in The Bronx. Near Yankee Stadium, Bronx Zoo & more. Starting from $10/hr.",
    ogImage: "/og/og-bronx.jpg",
    heroImage: "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 50%, #ff4d00 100%)",
    avgRate: "$12",
    stats: [
      { label: "Hotels Available", value: "18+" },
      { label: "Average Rate", value: "$12/hr" },
      { label: "Neighborhoods", value: "8" },
      { label: "Guest Rating", value: "4.4★" },
    ],
    neighborhoods: [
      { name: "Fordham", description: "Near Fordham University and the bustling Fordham Road shopping district.", hotels: 4 },
      { name: "Mott Haven", description: "The Bronx's trendiest area — new restaurants, galleries, and waterfront access.", hotels: 3 },
      { name: "Pelham Bay", description: "Near the largest park in NYC and Orchard Beach. Peaceful retreats.", hotels: 2 },
      { name: "Concourse", description: "Steps from Yankee Stadium. Perfect for game-day stays.", hotels: 5 },
      { name: "Riverdale", description: "Upscale neighborhood with leafy streets and Hudson River views.", hotels: 2 },
      { name: "City Island", description: "A hidden gem — New England-style seafood village in the Bronx.", hotels: 2 },
    ],
    faqs: [
      { q: "Are there hotels near Yankee Stadium?", a: "Yes! Multiple hotels in the Concourse area are within walking distance of Yankee Stadium — ideal for game-day visits." },
      { q: "Is The Bronx safe for tourists?", a: "The Bronx has transformed significantly. Areas like Mott Haven, Riverdale, and City Island are vibrant and welcoming for visitors." },
      { q: "How much do hourly hotels cost in The Bronx?", a: "The Bronx offers the most affordable hourly rates in NYC, starting from just $10/hr." },
      { q: "Can I get to Manhattan from The Bronx easily?", a: "Yes — the Bronx is well-served by the 1, 2, 4, 5, 6, B, and D subway lines, plus Metro-North to Grand Central." },
    ],
    highlights: [
      { icon: "⚾", title: "Yankee Stadium", description: "Hotels steps from the iconic baseball stadium." },
      { icon: "🦁", title: "Bronx Zoo", description: "Stay near the world-famous Bronx Zoo and Botanical Garden." },
      { icon: "💰", title: "Best Value", description: "Lowest hourly rates in New York City." },
      { icon: "🚄", title: "Metro-North", description: "Quick commuter rail access to Midtown Manhattan." },
    ],
    nearbyAirports: ["LGA", "JFK"],
  },
  queens: {
    slug: "queens",
    name: "Queens",
    state: "NY",
    heroTitle: "Hourly Hotels in Queens",
    heroSubtitle: "Book hourly rooms in Queens — the most diverse borough, near JFK & LaGuardia airports.",
    metaTitle: "Hourly Hotels in Queens, NY | Book by the Hour | CoupleOfHours",
    metaDescription: "Book hourly hotels in Queens near JFK & LaGuardia airports. Diverse neighborhoods, great rates from $12/hr.",
    ogImage: "/og/og-queens.jpg",
    heroImage: "linear-gradient(135deg, #0a1530 0%, #1a2a50 50%, #ff4d00 100%)",
    avgRate: "$14",
    stats: [
      { label: "Hotels Available", value: "32+" },
      { label: "Average Rate", value: "$14/hr" },
      { label: "Near Airports", value: "2" },
      { label: "Guest Rating", value: "4.5★" },
    ],
    neighborhoods: [
      { name: "Long Island City", description: "Manhattan skyline views, waterfront parks, and MoMA PS1. Most popular Queens location.", hotels: 11 },
      { name: "Astoria", description: "Diverse dining, beer gardens, and a thriving arts community.", hotels: 5 },
      { name: "Flushing", description: "NYC's Chinatown #2 — incredible Asian cuisine and cultural landmarks.", hotels: 6 },
      { name: "Jamaica", description: "Gateway to JFK Airport. Major transit hub with affordable stays.", hotels: 7 },
      { name: "Jackson Heights", description: "One of the most diverse neighborhoods in the world. Incredible food.", hotels: 3 },
      { name: "Rockaway Beach", description: "NYC's only beach community. Surf, sand, and seasonal stays.", hotels: 2 },
    ],
    faqs: [
      { q: "Are there hotels near JFK Airport in Queens?", a: "Yes! We have 20+ hotels near JFK Airport in Jamaica and Howard Beach, most within a 5–10 minute drive." },
      { q: "What about hotels near LaGuardia?", a: "Hotels in East Elmhurst and Astoria are minutes from LaGuardia, perfect for quick layovers." },
      { q: "Is Queens a good alternative to Manhattan hotels?", a: "Absolutely! Queens offers lower rates (avg $14/hr vs $18+/hr in Manhattan) with easy subway access to Midtown in 20–30 minutes." },
      { q: "What makes Queens unique?", a: "Queens is the most ethnically diverse urban area in the world. You'll find incredible food from over 120 countries." },
    ],
    highlights: [
      { icon: "✈️", title: "Airport Hub", description: "Closest borough to both JFK and LaGuardia airports." },
      { icon: "🌍", title: "Most Diverse", description: "120+ languages spoken — world-class international cuisine." },
      { icon: "🏖️", title: "Beach Access", description: "Rockaway Beach — NYC's surf and sand destination." },
      { icon: "🎭", title: "Arts & Culture", description: "MoMA PS1, Museum of Moving Image, and more." },
    ],
    nearbyAirports: ["JFK", "LGA"],
  },
};
