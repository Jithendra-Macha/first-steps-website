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
    id: "h21", name: "1 Hotel Brooklyn Bridge", area: "Brooklyn Heights", borough: "Brooklyn",
    distance_from_center_km: 4.8, rating: 4.7, total_reviews: 2759,
    image: "linear-gradient(155deg,#0a2a1a 0%,#1a4a2a 30%,#2a6a3a 55%,#4a9a5a 80%,#6aba7a 100%)",
    address: "60 Furman St, Brooklyn Heights, Brooklyn",
    rooms: [
      { room_id: "h21-std", type: "Standard", hourly_rate: 28, max_guests: 2, amenities: ["WiFi", "Gym", "Skyline View", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h21-dlx", type: "Deluxe", hourly_rate: 42, max_guests: 3, amenities: ["WiFi", "Rooftop Pool", "Spa", "Skyline View", "Restaurant"], min_hours: 2, max_hours: 10 },
      { room_id: "h21-ste", type: "Suite", hourly_rate: 65, max_guests: 4, amenities: ["WiFi", "Rooftop Pool", "Spa", "Skyline View", "Room Service", "Bar"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["luxury", "romantic", "couples", "city-view", "eco-friendly"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h22", name: "Wythe Hotel", area: "Williamsburg", borough: "Brooklyn",
    distance_from_center_km: 6.2, rating: 4.6, total_reviews: 1595,
    image: "linear-gradient(155deg,#1a0e04 0%,#3a2010 30%,#5a3820 55%,#8a5830 80%,#b07840 100%)",
    address: "80 Wythe Ave, Williamsburg, Brooklyn",
    rooms: [
      { room_id: "h22-std", type: "Standard", hourly_rate: 22, max_guests: 2, amenities: ["WiFi", "Industrial Decor", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h22-dlx", type: "Deluxe", hourly_rate: 35, max_guests: 3, amenities: ["WiFi", "Rooftop Bar", "City View", "Restaurant"], min_hours: 2, max_hours: 10 },
      { room_id: "h22-ste", type: "Suite", hourly_rate: 52, max_guests: 4, amenities: ["WiFi", "Rooftop Bar", "City View", "Room Service", "Spa"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["trendy", "boutique", "romantic", "rooftop", "artsy"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h23", name: "The William Vale", area: "Williamsburg", borough: "Brooklyn",
    distance_from_center_km: 6.0, rating: 4.5, total_reviews: 3412,
    image: "linear-gradient(155deg,#080818 0%,#101838 30%,#182858 55%,#284080 80%,#3860a8 100%)",
    address: "111 N 12th St, Williamsburg, Brooklyn",
    rooms: [
      { room_id: "h23-std", type: "Standard", hourly_rate: 25, max_guests: 2, amenities: ["WiFi", "City View", "AC", "Gym"], min_hours: 2, max_hours: 8 },
      { room_id: "h23-dlx", type: "Deluxe", hourly_rate: 38, max_guests: 3, amenities: ["WiFi", "Rooftop Pool", "City View", "Bar", "Spa"], min_hours: 2, max_hours: 10 },
      { room_id: "h23-ste", type: "Suite", hourly_rate: 58, max_guests: 4, amenities: ["WiFi", "Rooftop Pool", "Panoramic View", "Room Service", "Spa", "Kitchen"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["luxury", "romantic", "rooftop", "pool-access", "city-view"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h24", name: "Ace Hotel Brooklyn", area: "Boerum Hill", borough: "Brooklyn",
    distance_from_center_km: 5.5, rating: 4.4, total_reviews: 1280,
    image: "linear-gradient(155deg,#120808 0%,#281410 30%,#3e2018 55%,#6a3828 80%,#965040 100%)",
    address: "252 Schermerhorn St, Boerum Hill, Brooklyn",
    rooms: [
      { room_id: "h24-std", type: "Standard", hourly_rate: 18, max_guests: 2, amenities: ["WiFi", "Lobby Lounge", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h24-dlx", type: "Deluxe", hourly_rate: 28, max_guests: 3, amenities: ["WiFi", "Restaurant", "Bar", "Workspace"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["boutique", "trendy", "workspace", "artsy", "budget"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h25", name: "The Hoxton Williamsburg", area: "Williamsburg", borough: "Brooklyn",
    distance_from_center_km: 6.3, rating: 4.5, total_reviews: 1890,
    image: "linear-gradient(155deg,#0e0a14 0%,#1e1828 30%,#2e2840 55%,#4e4068 80%,#6e5890 100%)",
    address: "97 Wythe Ave, Williamsburg, Brooklyn",
    rooms: [
      { room_id: "h25-std", type: "Standard", hourly_rate: 20, max_guests: 2, amenities: ["WiFi", "AC", "Gym"], min_hours: 2, max_hours: 8 },
      { room_id: "h25-dlx", type: "Deluxe", hourly_rate: 32, max_guests: 3, amenities: ["WiFi", "Rooftop", "Bar", "City View", "Restaurant"], min_hours: 2, max_hours: 10 },
      { room_id: "h25-ste", type: "Suite", hourly_rate: 48, max_guests: 4, amenities: ["WiFi", "Rooftop", "Spa", "City View", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["trendy", "boutique", "rooftop", "romantic", "couples"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h26", name: "Hotel Indigo Brooklyn", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.2, rating: 4.3, total_reviews: 1150,
    image: "linear-gradient(155deg,#0a0e1a 0%,#141e34 30%,#1e2e50 55%,#2e4878 80%,#3e62a0 100%)",
    address: "229 Duffield St, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h26-std", type: "Standard", hourly_rate: 15, max_guests: 2, amenities: ["WiFi", "Gym", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h26-dlx", type: "Deluxe", hourly_rate: 24, max_guests: 3, amenities: ["WiFi", "Gym", "City View", "Bar"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "business", "workspace", "transit-friendly"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h27", name: "McCarren Hotel & Pool", area: "Williamsburg", borough: "Brooklyn",
    distance_from_center_km: 6.8, rating: 4.4, total_reviews: 980,
    image: "linear-gradient(155deg,#0a1418 0%,#142830 30%,#1e3c48 55%,#2e5c70 80%,#3e7c98 100%)",
    address: "160 N 12th St, Williamsburg, Brooklyn",
    rooms: [
      { room_id: "h27-std", type: "Standard", hourly_rate: 19, max_guests: 2, amenities: ["WiFi", "Pool", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h27-dlx", type: "Deluxe", hourly_rate: 30, max_guests: 3, amenities: ["WiFi", "Pool", "Rooftop", "Bar", "Spa"], min_hours: 2, max_hours: 10 },
      { room_id: "h27-ste", type: "Suite", hourly_rate: 45, max_guests: 4, amenities: ["WiFi", "Pool", "Rooftop", "Spa", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["trendy", "pool-access", "romantic", "couples", "rooftop"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h28", name: "NU Hotel Brooklyn", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.3, rating: 4.5, total_reviews: 1420,
    image: "linear-gradient(155deg,#14080a 0%,#28101a 30%,#3e1828 55%,#682a40 80%,#923c58 100%)",
    address: "85 Smith St, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h28-std", type: "Standard", hourly_rate: 16, max_guests: 2, amenities: ["WiFi", "AC", "Hammock Lounge"], min_hours: 2, max_hours: 8 },
      { room_id: "h28-dlx", type: "Deluxe", hourly_rate: 25, max_guests: 3, amenities: ["WiFi", "Workspace", "Lounge", "Gym"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["boutique", "budget", "workspace", "local-vibe", "artsy"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h29", name: "The Williamsburg Hotel", area: "Williamsburg", borough: "Brooklyn",
    distance_from_center_km: 6.4, rating: 4.3, total_reviews: 2100,
    image: "linear-gradient(155deg,#0a0a18 0%,#1a1a30 30%,#2a2a50 55%,#4040780 80%,#5858a0 100%)",
    address: "96 Wythe Ave, Williamsburg, Brooklyn",
    rooms: [
      { room_id: "h29-std", type: "Standard", hourly_rate: 21, max_guests: 2, amenities: ["WiFi", "AC", "Gym"], min_hours: 2, max_hours: 8 },
      { room_id: "h29-dlx", type: "Deluxe", hourly_rate: 34, max_guests: 3, amenities: ["WiFi", "Rooftop Pool", "Bar", "City View"], min_hours: 2, max_hours: 10 },
      { room_id: "h29-ste", type: "Suite", hourly_rate: 50, max_guests: 4, amenities: ["WiFi", "Rooftop Pool", "Bar", "City View", "Room Service", "Spa"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["trendy", "rooftop", "pool-access", "romantic", "couples"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h30", name: "EVEN Hotel Brooklyn", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.1, rating: 4.4, total_reviews: 870,
    image: "linear-gradient(155deg,#081408 0%,#102810 30%,#183e18 55%,#286028 80%,#388238 100%)",
    address: "46 Nevins St, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h30-std", type: "Standard", hourly_rate: 14, max_guests: 2, amenities: ["WiFi", "Gym", "AC", "Yoga Mat"], min_hours: 2, max_hours: 8 },
      { room_id: "h30-dlx", type: "Deluxe", hourly_rate: 22, max_guests: 3, amenities: ["WiFi", "Gym", "Wellness Room", "Healthy Snacks"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["wellness", "budget", "workspace", "quiet", "family"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h31", name: "The Brooklyn", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.0, rating: 4.2, total_reviews: 1650,
    image: "linear-gradient(155deg,#0e0e14 0%,#1e1e28 30%,#2e2e40 55%,#484860 80%,#626280 100%)",
    address: "625 Atlantic Ave, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h31-std", type: "Standard", hourly_rate: 13, max_guests: 2, amenities: ["WiFi", "AC", "Parking"], min_hours: 1, max_hours: 8 },
      { room_id: "h31-dlx", type: "Deluxe", hourly_rate: 20, max_guests: 3, amenities: ["WiFi", "Gym", "Bar", "Parking"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "family", "transit-friendly", "parking"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h32", name: "DUMBO House Hotel", area: "DUMBO", borough: "Brooklyn",
    distance_from_center_km: 5.2, rating: 4.7, total_reviews: 920,
    image: "linear-gradient(155deg,#1a0a04 0%,#3a1a0a 30%,#5a2a14 55%,#8a4420 80%,#b05e30 100%)",
    address: "55 Water St, DUMBO, Brooklyn",
    rooms: [
      { room_id: "h32-dlx", type: "Deluxe", hourly_rate: 35, max_guests: 2, amenities: ["WiFi", "Bridge View", "Spa", "Restaurant"], min_hours: 2, max_hours: 10 },
      { room_id: "h32-ste", type: "Suite", hourly_rate: 55, max_guests: 4, amenities: ["WiFi", "Bridge View", "Spa", "Room Service", "Jacuzzi", "Bar"], min_hours: 3, max_hours: 12 },
      { room_id: "h32-ph", type: "Penthouse", hourly_rate: 80, max_guests: 6, amenities: ["WiFi", "Panoramic Bridge View", "Spa", "Jacuzzi", "Butler Service", "Private Terrace"], min_hours: 4, max_hours: 12 },
    ],
    tags: ["luxury", "romantic", "couples", "city-view", "exclusive"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h33", name: "Aloft New York Brooklyn", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.4, rating: 4.2, total_reviews: 1340,
    image: "linear-gradient(155deg,#14081a 0%,#281034 30%,#3e184e 55%,#5e2870 80%,#7e3890 100%)",
    address: "216 Duffield St, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h33-std", type: "Standard", hourly_rate: 14, max_guests: 2, amenities: ["WiFi", "AC", "Bar"], min_hours: 1, max_hours: 8 },
      { room_id: "h33-dlx", type: "Deluxe", hourly_rate: 22, max_guests: 3, amenities: ["WiFi", "Pool Table", "Bar", "Gym"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "trendy", "business", "transit-friendly"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h34", name: "Park Slope Brownstone Hotel", area: "Park Slope", borough: "Brooklyn",
    distance_from_center_km: 6.0, rating: 4.6, total_reviews: 680,
    image: "linear-gradient(155deg,#180c04 0%,#301808 30%,#482810 55%,#704018 80%,#985820 100%)",
    address: "350 7th Ave, Park Slope, Brooklyn",
    rooms: [
      { room_id: "h34-std", type: "Standard", hourly_rate: 17, max_guests: 2, amenities: ["WiFi", "Garden View", "AC"], min_hours: 2, max_hours: 8 },
      { room_id: "h34-dlx", type: "Deluxe", hourly_rate: 26, max_guests: 3, amenities: ["WiFi", "Garden Terrace", "Breakfast", "Gym"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["boutique", "family", "quiet", "local-vibe", "romantic"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h35", name: "Bushwick Generator Hotel", area: "Bushwick", borough: "Brooklyn",
    distance_from_center_km: 8.0, rating: 4.1, total_reviews: 540,
    image: "linear-gradient(155deg,#1a1a08 0%,#2e2e10 30%,#424218 55%,#5e5e28 80%,#7a7a38 100%)",
    address: "215 Moore St, Bushwick, Brooklyn",
    rooms: [
      { room_id: "h35-std", type: "Standard", hourly_rate: 11, max_guests: 2, amenities: ["WiFi", "AC", "Lounge"], min_hours: 1, max_hours: 8 },
      { room_id: "h35-dlx", type: "Deluxe", hourly_rate: 18, max_guests: 3, amenities: ["WiFi", "Rooftop", "Bar", "AC"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "trendy", "artsy", "backpacker", "local-vibe"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h36", name: "Days Inn by Wyndham Brooklyn Borough Park", area: "Borough Park", borough: "Brooklyn",
    distance_from_center_km: 8.5, rating: 3.8, total_reviews: 1420,
    image: "linear-gradient(155deg,#1a1406 0%,#34280c 30%,#4e3c14 55%,#7a6020 80%,#a6842c 100%)",
    address: "3117 13th Ave, Borough Park, Brooklyn",
    rooms: [
      { room_id: "h36-std", type: "Standard", hourly_rate: 10, max_guests: 2, amenities: ["WiFi", "AC", "Parking", "TV"], min_hours: 1, max_hours: 8 },
      { room_id: "h36-dlx", type: "Deluxe", hourly_rate: 16, max_guests: 3, amenities: ["WiFi", "AC", "Parking", "Breakfast", "Gym"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "family", "parking", "quiet"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h37", name: "Hampton Inn Brooklyn/Downtown", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.3, rating: 4.3, total_reviews: 2180,
    image: "linear-gradient(155deg,#0a0e1a 0%,#141e34 30%,#1e2e50 55%,#2e4a78 80%,#3e66a0 100%)",
    address: "125 Flatbush Ave Extension, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h37-std", type: "Standard", hourly_rate: 15, max_guests: 2, amenities: ["WiFi", "AC", "Breakfast", "Gym"], min_hours: 2, max_hours: 8 },
      { room_id: "h37-dlx", type: "Deluxe", hourly_rate: 24, max_guests: 3, amenities: ["WiFi", "AC", "Breakfast", "Gym", "City View", "Business Center"], min_hours: 2, max_hours: 10 },
      { room_id: "h37-ste", type: "Suite", hourly_rate: 36, max_guests: 4, amenities: ["WiFi", "Breakfast", "Gym", "City View", "Room Service", "Business Center"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["business", "family", "transit-friendly", "breakfast-included"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h38", name: "The Box House Hotel", area: "Greenpoint", borough: "Brooklyn",
    distance_from_center_km: 6.5, rating: 4.5, total_reviews: 1890,
    image: "linear-gradient(155deg,#1a1008 0%,#342010 30%,#4e3418 55%,#7a5428 80%,#a67438 100%)",
    address: "77 Box St, Greenpoint, Brooklyn",
    rooms: [
      { room_id: "h38-std", type: "Standard", hourly_rate: 18, max_guests: 2, amenities: ["WiFi", "AC", "Kitchen", "TV"], min_hours: 2, max_hours: 8 },
      { room_id: "h38-dlx", type: "Deluxe", hourly_rate: 28, max_guests: 4, amenities: ["WiFi", "Kitchen", "Terrace", "Washer/Dryer", "City View"], min_hours: 2, max_hours: 10 },
      { room_id: "h38-ste", type: "Suite", hourly_rate: 42, max_guests: 6, amenities: ["WiFi", "Full Kitchen", "Terrace", "City View", "Washer/Dryer", "Living Room"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["boutique", "family", "local-vibe", "spacious", "kitchen"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h39", name: "Franklin Guesthouse", area: "Greenpoint", borough: "Brooklyn",
    distance_from_center_km: 6.3, rating: 4.4, total_reviews: 620,
    image: "linear-gradient(155deg,#0e1410 0%,#1c2a20 30%,#2a4030 55%,#3e6048 80%,#528060 100%)",
    address: "286 Franklin St, Greenpoint, Brooklyn",
    rooms: [
      { room_id: "h39-std", type: "Standard", hourly_rate: 14, max_guests: 2, amenities: ["WiFi", "AC", "Garden View"], min_hours: 2, max_hours: 8 },
      { room_id: "h39-dlx", type: "Deluxe", hourly_rate: 22, max_guests: 3, amenities: ["WiFi", "AC", "Garden Terrace", "Breakfast"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["boutique", "quiet", "local-vibe", "romantic", "cozy"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h40", name: "Holiday Inn Brooklyn Downtown", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.2, rating: 4.1, total_reviews: 2640,
    image: "linear-gradient(155deg,#0a1a0a 0%,#143414 30%,#1e4e1e 55%,#2e7a2e 80%,#3ea63e 100%)",
    address: "300 Schermerhorn St, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h40-std", type: "Standard", hourly_rate: 13, max_guests: 2, amenities: ["WiFi", "AC", "Gym", "Parking"], min_hours: 1, max_hours: 8 },
      { room_id: "h40-dlx", type: "Deluxe", hourly_rate: 20, max_guests: 3, amenities: ["WiFi", "AC", "Gym", "Breakfast", "Business Center"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["budget", "family", "transit-friendly", "business", "parking"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h41", name: "Sheraton Brooklyn New York Hotel", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.0, rating: 4.3, total_reviews: 3210,
    image: "linear-gradient(155deg,#0c0a18 0%,#1a1430 30%,#281e4a 55%,#3e3070 80%,#544298 100%)",
    address: "228 Duffield St, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h41-std", type: "Standard", hourly_rate: 16, max_guests: 2, amenities: ["WiFi", "AC", "Pool", "Gym"], min_hours: 2, max_hours: 8 },
      { room_id: "h41-dlx", type: "Deluxe", hourly_rate: 26, max_guests: 3, amenities: ["WiFi", "Pool", "Gym", "Restaurant", "Bar"], min_hours: 2, max_hours: 10 },
      { room_id: "h41-ste", type: "Suite", hourly_rate: 40, max_guests: 4, amenities: ["WiFi", "Pool", "Gym", "Room Service", "City View", "Business Center"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["business", "pool-access", "family", "transit-friendly"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h42", name: "The Lodge Red Hook", area: "Red Hook", borough: "Brooklyn",
    distance_from_center_km: 7.0, rating: 4.2, total_reviews: 480,
    image: "linear-gradient(155deg,#140a04 0%,#2a1408 30%,#401e0e 55%,#603218 80%,#804622 100%)",
    address: "134 Van Brunt St, Red Hook, Brooklyn",
    rooms: [
      { room_id: "h42-std", type: "Standard", hourly_rate: 12, max_guests: 2, amenities: ["WiFi", "AC", "Harbor View"], min_hours: 2, max_hours: 8 },
      { room_id: "h42-dlx", type: "Deluxe", hourly_rate: 20, max_guests: 3, amenities: ["WiFi", "Harbor View", "Patio", "Breakfast"], min_hours: 2, max_hours: 10 },
    ],
    tags: ["boutique", "quiet", "local-vibe", "artsy", "waterfront"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: false },
  },
  {
    id: "h43", name: "The Tillary Hotel Brooklyn", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 4.8, rating: 4.5, total_reviews: 1560,
    image: "linear-gradient(155deg,#08101a 0%,#102034 30%,#18304e 55%,#244a72 80%,#306496 100%)",
    address: "85 Flatbush Ave Extension, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h43-std", type: "Standard", hourly_rate: 18, max_guests: 2, amenities: ["WiFi", "AC", "Gym", "City View"], min_hours: 2, max_hours: 8 },
      { room_id: "h43-dlx", type: "Deluxe", hourly_rate: 28, max_guests: 3, amenities: ["WiFi", "Gym", "City View", "Restaurant", "Bar"], min_hours: 2, max_hours: 10 },
      { room_id: "h43-ste", type: "Suite", hourly_rate: 44, max_guests: 4, amenities: ["WiFi", "Gym", "Panoramic View", "Room Service", "Bar", "Spa"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["boutique", "trendy", "city-view", "romantic", "business"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h44", name: "Ace Hotel Brooklyn", area: "Boerum Hill", borough: "Brooklyn",
    distance_from_center_km: 5.5, rating: 4.6, total_reviews: 1940,
    image: "linear-gradient(155deg,#1a0c14 0%,#34182a 30%,#4e2440 55%,#723858 80%,#964c70 100%)",
    address: "252 Schermerhorn St, Boerum Hill, Brooklyn",
    rooms: [
      { room_id: "h44-std", type: "Standard", hourly_rate: 20, max_guests: 2, amenities: ["WiFi", "AC", "Turntable", "Coffee Bar"], min_hours: 2, max_hours: 8 },
      { room_id: "h44-dlx", type: "Deluxe", hourly_rate: 32, max_guests: 3, amenities: ["WiFi", "Gym", "Rooftop Bar", "Restaurant", "Turntable"], min_hours: 2, max_hours: 10 },
      { room_id: "h44-ste", type: "Suite", hourly_rate: 50, max_guests: 4, amenities: ["WiFi", "Gym", "Rooftop Bar", "Restaurant", "Spa", "Room Service"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["trendy", "boutique", "romantic", "artsy", "couples"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: false, late_checkout: true },
  },
  {
    id: "h45", name: "Hotel Le Bleu", area: "Park Slope", borough: "Brooklyn",
    distance_from_center_km: 6.2, rating: 4.5, total_reviews: 780,
    image: "linear-gradient(155deg,#04081a 0%,#0a1234 30%,#101c50 55%,#1a2e78 80%,#2440a0 100%)",
    address: "370 4th Ave, Park Slope, Brooklyn",
    rooms: [
      { room_id: "h45-std", type: "Standard", hourly_rate: 17, max_guests: 2, amenities: ["WiFi", "AC", "Rain Shower", "TV"], min_hours: 2, max_hours: 8 },
      { room_id: "h45-dlx", type: "Deluxe", hourly_rate: 28, max_guests: 3, amenities: ["WiFi", "Rain Shower", "Spa Tub", "Minibar"], min_hours: 2, max_hours: 10 },
      { room_id: "h45-ste", type: "Suite", hourly_rate: 42, max_guests: 4, amenities: ["WiFi", "Jacuzzi", "Rain Shower", "Room Service", "Terrace"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["boutique", "romantic", "couples", "spa", "quiet"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h46", name: "Hilton Brooklyn New York", area: "Downtown Brooklyn", borough: "Brooklyn",
    distance_from_center_km: 5.1, rating: 4.4, total_reviews: 4120,
    image: "linear-gradient(155deg,#0a0a14 0%,#14142a 30%,#1e1e42 55%,#303060 80%,#424280 100%)",
    address: "140 Schermerhorn St, Downtown Brooklyn, Brooklyn",
    rooms: [
      { room_id: "h46-std", type: "Standard", hourly_rate: 17, max_guests: 2, amenities: ["WiFi", "AC", "Gym", "Business Center"], min_hours: 2, max_hours: 8 },
      { room_id: "h46-dlx", type: "Deluxe", hourly_rate: 28, max_guests: 3, amenities: ["WiFi", "Gym", "City View", "Restaurant", "Bar"], min_hours: 2, max_hours: 10 },
      { room_id: "h46-ste", type: "Suite", hourly_rate: 45, max_guests: 4, amenities: ["WiFi", "Gym", "Panoramic View", "Room Service", "Business Center", "Spa"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["business", "family", "transit-friendly", "city-view"],
    policies: { cancellation: "Free cancellation up to 2 hours before check-in", early_checkin: true, late_checkout: true },
  },
  {
    id: "h47", name: "Coda Williamsburg", area: "Williamsburg", borough: "Brooklyn",
    distance_from_center_km: 5.8, rating: 4.6, total_reviews: 1120,
    image: "linear-gradient(155deg,#14100a 0%,#2a2014 30%,#40301e 55%,#604a30 80%,#806442 100%)",
    address: "160 N 12th St, Williamsburg, Brooklyn",
    rooms: [
      { room_id: "h47-std", type: "Standard", hourly_rate: 19, max_guests: 2, amenities: ["WiFi", "AC", "Coffee Bar", "Rooftop Access"], min_hours: 2, max_hours: 8 },
      { room_id: "h47-dlx", type: "Deluxe", hourly_rate: 30, max_guests: 3, amenities: ["WiFi", "Rooftop Bar", "City View", "Restaurant"], min_hours: 2, max_hours: 10 },
      { room_id: "h47-ste", type: "Suite", hourly_rate: 48, max_guests: 4, amenities: ["WiFi", "Rooftop Bar", "Skyline View", "Room Service", "Spa", "Terrace"], min_hours: 3, max_hours: 12 },
    ],
    tags: ["trendy", "boutique", "romantic", "city-view", "artsy"],
    policies: { cancellation: "Free cancellation up to 1 hour before check-in", early_checkin: true, late_checkout: true },
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
