export interface HotelRoom {
  room_id: string;
  type: "Standard" | "Deluxe" | "Suite" | "Penthouse";
  hourly_rate: number;
  max_guests: number;
  amenities: string[];
  min_hours: number;
  max_hours: number;
}

export interface RAGHotel {
  id: string;
  name: string;
  area: string;
  borough: string;
  distance_from_center_km: number;
  rating: number;
  total_reviews: number;
  image: string;
  rooms: HotelRoom[];
  tags: string[];
  policies: {
    cancellation: string;
    early_checkin: boolean;
    late_checkout: boolean;
  };
  near_airport?: string;
  address: string;
}

export const HOTEL_DATABASE: RAGHotel[] = [
  {
    id: "h1", name: "The Plaza Hotel", area: "Midtown", borough: "Manhattan",
    distance_from_center_km: 0.5, rating: 4.9, total_reviews: 2841,
    image: "linear-gradient(155deg,#0a1628 0%,#1a2e50 30%,#2a4a7a 55%,#b8966e 85%,#d4b483 100%)",
    address: "768 5th Ave, Midtown, Manhattan",
    rooms: [
      { room_id: "h1-std", type: "Standard", hourly_rate: 22, max_guests: 2, amenities: ["WiFi", "AC", "TV"], min_hours: 2, max_hours: 8 },
      { room_id: "h1-dlx", type: "Deluxe", hourly_rate: 35, max_guests: 3, amenities: ["WiFi", "City View", "Minibar", "Spa Access"], min_hours: 2, max_hours: 10 },
      { room_id: "h1-ste", type: "Suite", hourly_rate: 55, max_guests: 4, amenities: ["WiFi", "City View", "Jacuzzi", "Room Service", "Spa"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["luxury", "romantic", "couples", "city-view"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h2", name: "Chelsea Boutique Hotel", area: "Chelsea", borough: "Manhattan",
    distance_from_center_km: 2.1, rating: 4.7, total_reviews: 1198,
    image: "linear-gradient(155deg,#0e1e12 0%,#1a3a20 35%,#2a5a30 60%,#6a9a70 85%,#9abfa0 100%)",
    address: "255 W 23rd St, Chelsea, Manhattan",
    rooms: [
      { room_id: "h2-std", type: "Standard", hourly_rate: 18, max_guests: 2, amenities: ["WiFi", "Gym", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h2-dlx", type: "Deluxe", hourly_rate: 28, max_guests: 3, amenities: ["WiFi", "Rooftop Bar", "Gym", "Breakfast"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["boutique", "workspace", "business", "budget"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h3", name: "Mandarin Oriental NYC", area: "Upper West Side", borough: "Manhattan",
    distance_from_center_km: 3.2, rating: 4.8, total_reviews: 3407,
    image: "linear-gradient(155deg,#16082a 0%,#2e1050 30%,#4a1870 55%,#8a40b0 80%,#c880e8 100%)",
    address: "80 Columbus Circle, Upper West Side, Manhattan",
    rooms: [
      { room_id: "h3-dlx", type: "Deluxe", hourly_rate: 32, max_guests: 2, amenities: ["Pool", "Spa", "Gym", "City View"], min_hours: 2, max_hours: 10 },
      { room_id: "h3-ste", type: "Suite", hourly_rate: 48, max_guests: 4, amenities: ["Pool", "Spa", "Gym", "City View", "Jacuzzi", "Room Service"], min_hours: 3, max_hours: 12 },
      { room_id: "h3-ph", type: "Penthouse", hourly_rate: 85, max_guests: 6, amenities: ["Pool", "Spa", "Jacuzzi", "Panoramic View", "Butler Service"], min_hours: 4, max_hours: 12 },
    ],
    tags: ["luxury", "romantic", "spa", "pool-access"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h4", name: "Grand Hyatt New York", area: "Midtown East", borough: "Manhattan",
    distance_from_center_km: 1.0, rating: 4.6, total_reviews: 1554,
    image: "linear-gradient(155deg,#180e04 0%,#3a2008 30%,#5a3410 55%,#9a6820 80%,#c89040 100%)",
    address: "109 E 42nd St, Midtown East, Manhattan",
    rooms: [
      { room_id: "h4-std", type: "Standard", hourly_rate: 15, max_guests: 2, amenities: ["WiFi", "Bar", "AC", "Parking"], min_hours: 1, max_hours: 8 },
      { room_id: "h4-dlx", type: "Deluxe", hourly_rate: 25, max_guests: 3, amenities: ["WiFi", "Meeting Room", "Bar", "Parking"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["business", "workspace", "budget", "transit-friendly"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h5", name: "The Standard High Line", area: "Meatpacking", borough: "Manhattan",
    distance_from_center_km: 2.8, rating: 4.9, total_reviews: 2280,
    image: "linear-gradient(155deg,#060e18 0%,#0a1e30 30%,#0e2e50 55%,#1a5080 80%,#2a80c0 100%)",
    address: "848 Washington St, Meatpacking, Manhattan",
    rooms: [
      { room_id: "h5-std", type: "Standard", hourly_rate: 20, max_guests: 2, amenities: ["WiFi", "Rooftop", "Bar"], min_hours: 2, max_hours: 8 },
      { room_id: "h5-dlx", type: "Deluxe", hourly_rate: 30, max_guests: 2, amenities: ["WiFi", "Rooftop", "Bar", "Spa", "City View"], min_hours: 2, max_hours: 10 },
      { room_id: "h5-ste", type: "Suite", hourly_rate: 45, max_guests: 4, amenities: ["WiFi", "Rooftop", "Spa", "City View", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["romantic", "couples", "rooftop", "trendy"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h6", name: "Brooklyn Heights Inn", area: "Brooklyn Heights", borough: "Brooklyn",
    distance_from_center_km: 5.0, rating: 4.5, total_reviews: 832,
    image: "linear-gradient(155deg,#060e0a 0%,#0e2018 30%,#163428 55%,#2a6050 80%,#4a9878 100%)",
    address: "120 Atlantic Ave, Brooklyn Heights, Brooklyn",
    rooms: [
      { room_id: "h6-std", type: "Standard", hourly_rate: 14, max_guests: 2, amenities: ["WiFi", "Gym", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h6-dlx", type: "Deluxe", hourly_rate: 22, max_guests: 3, amenities: ["WiFi", "Bridge View", "Gym", "AC"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "family", "quiet", "local-vibe"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h7", name: "Williamsburg Loft Hotel", area: "Williamsburg", borough: "Brooklyn",
    distance_from_center_km: 6.5, rating: 4.6, total_reviews: 1045,
    image: "linear-gradient(155deg,#120406 0%,#200810 30%,#380a18 55%,#680f2a 80%,#a01840 100%)",
    address: "160 N 4th St, Williamsburg, Brooklyn",
    rooms: [
      { room_id: "h7-std", type: "Standard", hourly_rate: 16, max_guests: 2, amenities: ["WiFi", "Rooftop", "Bar"], min_hours: 2, max_hours: 8 },
      { room_id: "h7-dlx", type: "Deluxe", hourly_rate: 26, max_guests: 3, amenities: ["WiFi", "Rooftop", "Bar", "City View", "Spa"], min_hours: 2, max_hours: 10 },
      { room_id: "h7-ste", type: "Suite", hourly_rate: 40, max_guests: 4, amenities: ["WiFi", "Rooftop", "Spa", "Jacuzzi", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["trendy", "romantic", "rooftop", "couples"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h8", name: "JFK Airport Suites", area: "Jamaica", borough: "Queens",
    distance_from_center_km: 22.0, rating: 4.4, total_reviews: 2105,
    image: "linear-gradient(155deg,#0a0a1a 0%,#1a1a3a 30%,#2a2a5a 55%,#4a4a8a 80%,#6a6ab0 100%)",
    address: "144-02 135th Ave, Jamaica, Queens",
    near_airport: "JFK",
    rooms: [
      { room_id: "h8-std", type: "Standard", hourly_rate: 12, max_guests: 2, amenities: ["WiFi", "AC", "Shuttle"], min_hours: 1, max_hours: 8 },
      { room_id: "h8-dlx", type: "Deluxe", hourly_rate: 20, max_guests: 3, amenities: ["WiFi", "AC", "Shuttle", "Gym", "Breakfast"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["airport", "layover", "budget", "transit-friendly"],
    policies: { cancellation: "Free cancellation up to 30 minutes before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h9", name: "LaGuardia Rest & Fly", area: "East Elmhurst", borough: "Queens",
    distance_from_center_km: 14.0, rating: 4.3, total_reviews: 1580,
    image: "linear-gradient(155deg,#1a1a2e 0%,#2e2e5a 30%,#3e3e7a 55%,#5e5ea0 80%,#8080c0 100%)",
    address: "90-10 Ditmars Blvd, East Elmhurst, Queens",
    near_airport: "LGA",
    rooms: [
      { room_id: "h9-std", type: "Standard", hourly_rate: 10, max_guests: 2, amenities: ["WiFi", "AC", "Shuttle"], min_hours: 1, max_hours: 6 },
      { room_id: "h9-dlx", type: "Deluxe", hourly_rate: 18, max_guests: 3, amenities: ["WiFi", "Shuttle", "Breakfast", "Gym"], min_hours: 2, max_hours: 8 },
    ],
    tags: ["airport", "layover", "budget"],
    policies: { cancellation: "Free cancellation up to 30 minutes before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h10", name: "Gramercy Park Hotel", area: "Gramercy", borough: "Manhattan",
    distance_from_center_km: 2.5, rating: 4.8, total_reviews: 3365,
    image: "linear-gradient(155deg,#120406 0%,#200810 30%,#380a18 55%,#680f2a 80%,#a01840 100%)",
    address: "2 Lexington Ave, Gramercy, Manhattan",
    rooms: [
      { room_id: "h10-dlx", type: "Deluxe", hourly_rate: 29, max_guests: 2, amenities: ["Pool", "Spa", "Bar", "City View"], min_hours: 2, max_hours: 10 },
      { room_id: "h10-ste", type: "Suite", hourly_rate: 42, max_guests: 4, amenities: ["Pool", "Spa", "Bar", "Rooftop", "City View", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["luxury", "romantic", "couples", "spa"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h11", name: "The Carlyle Hotel", area: "Upper East Side", borough: "Manhattan",
    distance_from_center_km: 4.0, rating: 4.7, total_reviews: 2121,
    image: "linear-gradient(155deg,#180406 0%,#300810 30%,#500a18 55%,#881828 80%,#c03040 100%)",
    address: "35 E 76th St, Upper East Side, Manhattan",
    rooms: [
      { room_id: "h11-std", type: "Standard", hourly_rate: 19, max_guests: 2, amenities: ["WiFi", "Pool", "Gym"], min_hours: 2, max_hours: 8 },
      { room_id: "h11-dlx", type: "Deluxe", hourly_rate: 30, max_guests: 3, amenities: ["WiFi", "Pool", "Spa", "Bar"], min_hours: 2, max_hours: 10 },
      { room_id: "h11-ste", type: "Suite", hourly_rate: 50, max_guests: 4, amenities: ["WiFi", "Pool", "Spa", "Gym", "Bar", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["luxury", "romantic", "spa", "pool-access"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h12", name: "Jersey City Waterfront Hotel", area: "Waterfront", borough: "Jersey City",
    distance_from_center_km: 8.0, rating: 4.5, total_reviews: 920,
    image: "linear-gradient(155deg,#0d2610 0%,#1a4420 30%,#2a6630 55%,#4a9050 80%,#6ac070 100%)",
    address: "100 Washington Blvd, Jersey City, NJ",
    rooms: [
      { room_id: "h12-std", type: "Standard", hourly_rate: 13, max_guests: 2, amenities: ["WiFi", "City View", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h12-dlx", type: "Deluxe", hourly_rate: 21, max_guests: 3, amenities: ["WiFi", "City View", "Pool", "Gym"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "city-view", "family", "quiet"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h13", name: "Hoboken Grand Hotel", area: "Hoboken", borough: "Hoboken",
    distance_from_center_km: 7.0, rating: 4.6, total_reviews: 740,
    image: "linear-gradient(155deg,#1a1008 0%,#3a2810 30%,#5a4020 55%,#8a6830 80%,#b09040 100%)",
    address: "300 River St, Hoboken, NJ",
    rooms: [
      { room_id: "h13-std", type: "Standard", hourly_rate: 14, max_guests: 2, amenities: ["WiFi", "Gym", "Skyline View"], min_hours: 2, max_hours: 8 },
      { room_id: "h13-dlx", type: "Deluxe", hourly_rate: 24, max_guests: 3, amenities: ["WiFi", "Skyline View", "Rooftop Bar", "Spa"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "city-view", "romantic", "quiet"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h14", name: "Newark Airport Lodge", area: "Newark", borough: "Newark",
    distance_from_center_km: 18.0, rating: 4.2, total_reviews: 1320,
    image: "linear-gradient(155deg,#0a0a0a 0%,#1a1a2a 30%,#2a2a3a 55%,#4a4a5a 80%,#6a6a7a 100%)",
    address: "1 Hotel Rd, Newark, NJ",
    near_airport: "EWR",
    rooms: [
      { room_id: "h14-std", type: "Standard", hourly_rate: 10, max_guests: 2, amenities: ["WiFi", "Shuttle", "AC"], min_hours: 1, max_hours: 6 },
      { room_id: "h14-dlx", type: "Deluxe", hourly_rate: 16, max_guests: 3, amenities: ["WiFi", "Shuttle", "Breakfast", "Parking"], min_hours: 2, max_hours: 8 },
    ],
    tags: ["airport", "layover", "budget", "transit-friendly"],
    policies: { cancellation: "Free cancellation up to 30 minutes before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h15", name: "Bronx Comfort Inn", area: "Fordham", borough: "The Bronx",
    distance_from_center_km: 12.0, rating: 4.1, total_reviews: 560,
    image: "linear-gradient(155deg,#0a1a08 0%,#1a3a10 30%,#2a5a18 55%,#4a8a28 80%,#6ab040 100%)",
    address: "2541 Grand Concourse, Fordham, Bronx",
    rooms: [
      { room_id: "h15-std", type: "Standard", hourly_rate: 11, max_guests: 2, amenities: ["WiFi", "AC", "Parking"], min_hours: 2, max_hours: 8 },
      { room_id: "h15-dlx", type: "Deluxe", hourly_rate: 18, max_guests: 3, amenities: ["WiFi", "AC", "Parking", "Gym"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "family", "quiet", "parking"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h16", name: "Staten Island Harbor Hotel", area: "St. George", borough: "Staten Island",
    distance_from_center_km: 10.0, rating: 4.3, total_reviews: 480,
    image: "linear-gradient(155deg,#04080a 0%,#0a1820 30%,#102838 55%,#1a4860 80%,#2a6890 100%)",
    address: "1 Bay St, St. George, Staten Island",
    rooms: [
      { room_id: "h16-std", type: "Standard", hourly_rate: 12, max_guests: 2, amenities: ["WiFi", "Harbor View", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h16-dlx", type: "Deluxe", hourly_rate: 20, max_guests: 3, amenities: ["WiFi", "Harbor View", "Gym", "Restaurant"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "quiet", "city-view", "family"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h17", name: "SoHo Luxe Suites", area: "SoHo", borough: "Manhattan",
    distance_from_center_km: 3.5, rating: 4.8, total_reviews: 1870,
    image: "linear-gradient(155deg,#1a0808 0%,#3a1010 30%,#5a1818 55%,#8a2828 80%,#b03838 100%)",
    address: "310 W Broadway, SoHo, Manhattan",
    rooms: [
      { room_id: "h17-dlx", type: "Deluxe", hourly_rate: 28, max_guests: 2, amenities: ["WiFi", "Spa", "Bar", "Loft Style"], min_hours: 2, max_hours: 10 },
      { room_id: "h17-ste", type: "Suite", hourly_rate: 45, max_guests: 4, amenities: ["WiFi", "Spa", "Bar", "Loft Style", "Room Service", "Jacuzzi"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["luxury", "trendy", "romantic", "couples"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h18", name: "Astoria Queens Hotel", area: "Astoria", borough: "Queens",
    distance_from_center_km: 9.0, rating: 4.4, total_reviews: 680,
    image: "linear-gradient(155deg,#0a1020 0%,#1a2840 30%,#2a4060 55%,#3a5880 80%,#4a70a0 100%)",
    address: "31-11 Broadway, Astoria, Queens",
    rooms: [
      { room_id: "h18-std", type: "Standard", hourly_rate: 13, max_guests: 2, amenities: ["WiFi", "AC", "Gym"], min_hours: 2, max_hours: 8 },
      { room_id: "h18-dlx", type: "Deluxe", hourly_rate: 20, max_guests: 3, amenities: ["WiFi", "AC", "Gym", "Rooftop"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "family", "local-vibe", "quiet"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h19", name: "Financial District Tower", area: "Financial District", borough: "Manhattan",
    distance_from_center_km: 4.5, rating: 4.6, total_reviews: 1430,
    image: "linear-gradient(155deg,#080810 0%,#101830 30%,#182850 55%,#204070 80%,#286090 100%)",
    address: "85 West St, Financial District, Manhattan",
    rooms: [
      { room_id: "h19-std", type: "Standard", hourly_rate: 17, max_guests: 2, amenities: ["WiFi", "Meeting Room", "AC"], min_hours: 1, max_hours: 8 },
      { room_id: "h19-dlx", type: "Deluxe", hourly_rate: 27, max_guests: 3, amenities: ["WiFi", "Meeting Room", "Bar", "City View"], min_hours: 2, max_hours: 10 },
      { room_id: "h19-ste", type: "Suite", hourly_rate: 42, max_guests: 4, amenities: ["WiFi", "Meeting Room", "Bar", "City View", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["business", "workspace", "transit-friendly", "city-view"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h20", name: "Tribeca Loft Suites", area: "Tribeca", borough: "Manhattan",
    distance_from_center_km: 3.8, rating: 4.5, total_reviews: 832,
    image: "linear-gradient(155deg,#060e0a 0%,#0e2018 30%,#163428 55%,#2a6050 80%,#4a9878 100%)",
    address: "200 Church St, Tribeca, Manhattan",
    rooms: [
      { room_id: "h20-std", type: "Standard", hourly_rate: 16, max_guests: 2, amenities: ["WiFi", "Gym", "Hudson View", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h20-dlx", type: "Deluxe", hourly_rate: 25, max_guests: 3, amenities: ["WiFi", "Gym", "Hudson View", "Loft Style"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["quiet", "workspace", "family", "local-vibe"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
];
