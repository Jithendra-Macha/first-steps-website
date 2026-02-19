// ── Admin Dashboard Mock Data ──

export type HotelStatus = "live" | "pending" | "on_hold" | "suspended" | "under_review";
export type CustomerStatus = "active" | "inactive" | "flagged" | "suspended";
export type ReservationStatus = "confirmed" | "checked_in" | "completed" | "cancelled" | "no_show" | "disputed";
export type ReviewStatus = "published" | "pending" | "hidden" | "removed" | "flagged";
export type TransactionType = "booking" | "refund" | "commission";

export interface AdminHotel {
  id: string;
  name: string;
  location: string;
  city: string;
  owner: string;
  ownerEmail: string;
  ownerPhone: string;
  category: "Luxury" | "Boutique" | "Budget" | "Business" | "Resort";
  listingDate: string;
  totalRooms: number;
  status: HotelStatus;
  rating: number;
  reviews: number;
  revenue: number;
  description: string;
  amenities: string[];
  photos: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  joinDate: string;
  totalReservations: number;
  totalSpent: number;
  status: CustomerStatus;
  lastActive: string;
  noShows: number;
  avatar: string;
}

export interface AdminReservation {
  id: string;
  guestName: string;
  guestId: string;
  hotelName: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  amount: number;
  status: ReservationStatus;
  city: string;
  roomType: string;
}

export interface AdminReview {
  id: string;
  customerId: string;
  customerName: string;
  hotelId: string;
  hotelName: string;
  rating: number;
  text: string;
  date: string;
  status: ReviewStatus;
  reportedCount: number;
  sentiment: "positive" | "neutral" | "negative";
}

export interface AdminTransaction {
  id: string;
  type: TransactionType;
  customerName: string;
  hotelName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface AdminNotification {
  id: string;
  type: "hotel_registration" | "hotel_flagged" | "review_reported" | "account_flagged" | "no_show" | "payment_dispute";
  message: string;
  entityLink: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  timestamp: string;
  admin: string;
}

// ── Hotels (30) ──
const hotelNames = [
  "The Grand Meridian", "Skyline Boutique Hotel", "Harbor View Suites", "Central Park Lodge", "The Apex Tower",
  "Brooklyn Bridge Hotel", "Riverside Inn", "Metropolitan Luxe", "The Velvet Room", "Gramercy Terrace",
  "SoHo Art Hotel", "Times Square Grand", "Midtown Executive", "Wall Street Quarters", "Chelsea Haven",
  "Upper East Residence", "The Hudson Pearl", "Penn Station Suites", "Murray Hill Place", "Flatiron Loft Hotel",
  "NoMad Boutique", "Battery Park Hotel", "Tribeca Luxe", "West Village Inn", "East Side Comfort",
  "Lincoln Center Lodge", "Harlem Heritage Hotel", "Astoria Park Inn", "Jersey Waterfront", "Herald Square Hotel"
];
const cities = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Jersey City", "Hoboken"];
const categories: AdminHotel["category"][] = ["Luxury", "Boutique", "Budget", "Business", "Resort"];
const owners = [
  "James Morrison", "Sarah Chen", "Michael Rivera", "Emily Watson", "Robert Kim",
  "Diana Patel", "Thomas O'Brien", "Laura Martinez", "Chris Johnson", "Amanda Taylor",
  "David Wilson", "Jessica Brown", "Andrew Lee", "Sophia Garcia", "Ryan Thompson",
  "Nicole Adams", "Kevin Park", "Maria Sanchez", "Daniel White", "Olivia Davis",
  "Brian Hall", "Rachel Moore", "Steven Clark", "Hannah Lewis", "Paul Robinson",
  "Megan Walker", "George Young", "Victoria King", "Jonathan Wright", "Ashley Hill"
];

const hotelStatuses: HotelStatus[] = [
  ...Array(20).fill("live"),
  ...Array(5).fill("pending"),
  ...Array(3).fill("on_hold"),
  ...Array(2).fill("suspended"),
];

export const MOCK_HOTELS: AdminHotel[] = hotelNames.map((name, i) => ({
  id: `HTL-${String(i + 1).padStart(4, "0")}`,
  name,
  location: `${100 + i * 13} ${["5th Ave", "Broadway", "Park Ave", "Madison Ave", "Lexington Ave", "W 42nd St"][i % 6]}`,
  city: cities[i % cities.length],
  owner: owners[i],
  ownerEmail: `${owners[i].toLowerCase().replace(/ /g, ".")}@email.com`,
  ownerPhone: `+1 (${212 + (i % 5)}) ${String(555 + i).padStart(3, "0")}-${String(1000 + i * 7).slice(-4)}`,
  category: categories[i % categories.length],
  listingDate: new Date(2024, Math.floor(i / 3), 1 + (i % 28)).toISOString().split("T")[0],
  totalRooms: 20 + (i * 7) % 180,
  status: hotelStatuses[i],
  rating: parseFloat((3.5 + (i % 15) * 0.1).toFixed(1)),
  reviews: 10 + (i * 23) % 500,
  revenue: 5000 + (i * 1337) % 95000,
  description: `A ${categories[i % categories.length].toLowerCase()} hotel located in ${cities[i % cities.length]}.`,
  amenities: ["WiFi", "Pool", "Spa", "Gym", "Bar", "Restaurant", "Room Service", "Parking"].slice(0, 3 + (i % 5)),
  photos: 3 + (i % 8),
}));

// ── Customers (50) ──
const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Cameron", "Drew", "Jamie", "Peyton", "Skyler", "Reese", "Blake", "Harper", "Emerson", "Finley", "Rowan", "Dakota", "Sage", "Phoenix", "Marley", "Charlie", "Frankie", "Hayden", "Lennox", "Remy", "Shiloh", "Tatum", "Wren", "Oakley", "Ellis", "Hollis", "Kendall", "Lane", "Milan", "Nico", "Palmer", "Raven", "Sterling", "Toby", "Valentine", "Winter", "Zion", "Arden", "Blair", "Colby", "Devon", "Elliot"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];
const countries = ["USA", "Canada", "UK", "Germany", "France", "Australia", "Japan", "Brazil", "India", "Mexico"];
const customerStatuses: CustomerStatus[] = ["active", "active", "active", "active", "active", "active", "active", "inactive", "inactive", "flagged", "flagged", "suspended"];

export const MOCK_CUSTOMERS: AdminCustomer[] = firstNames.map((fn, i) => ({
  id: `CUS-${String(i + 1).padStart(4, "0")}`,
  name: `${fn} ${lastNames[i]}`,
  email: `${fn.toLowerCase()}.${lastNames[i].toLowerCase()}@email.com`,
  phone: `+1 (${300 + i}) ${String(555 + i).padStart(3, "0")}-${String(2000 + i * 11).slice(-4)}`,
  country: countries[i % countries.length],
  joinDate: new Date(2023, i % 12, 1 + (i % 28)).toISOString().split("T")[0],
  totalReservations: (i * 3) % 20,
  totalSpent: 100 + (i * 237) % 9000,
  status: customerStatuses[i % customerStatuses.length],
  lastActive: new Date(2025, 1, Math.max(1, 19 - (i % 15))).toISOString().split("T")[0],
  noShows: i % 7 === 0 ? 1 + (i % 3) : 0,
  avatar: `${fn[0]}${lastNames[i][0]}`,
}));

// ── Reservations (100) ──
const roomTypes = ["Standard", "Deluxe", "Suite", "Penthouse", "Economy"];
const resStatuses: ReservationStatus[] = ["confirmed", "confirmed", "checked_in", "completed", "completed", "completed", "cancelled", "no_show", "disputed"];

export const MOCK_RESERVATIONS: AdminReservation[] = Array.from({ length: 100 }, (_, i) => {
  const ci = new Date(2025, Math.floor(i / 10), 1 + (i % 28));
  const co = new Date(ci); co.setDate(co.getDate() + 1 + (i % 4));
  return {
    id: `RES-${String(i + 1).padStart(5, "0")}`,
    guestName: MOCK_CUSTOMERS[i % 50].name,
    guestId: MOCK_CUSTOMERS[i % 50].id,
    hotelName: MOCK_HOTELS[i % 30].name,
    hotelId: MOCK_HOTELS[i % 30].id,
    checkIn: ci.toISOString().split("T")[0],
    checkOut: co.toISOString().split("T")[0],
    rooms: 1 + (i % 3),
    guests: 1 + (i % 4),
    amount: 50 + (i * 47) % 450,
    status: resStatuses[i % resStatuses.length],
    city: MOCK_HOTELS[i % 30].city,
    roomType: roomTypes[i % roomTypes.length],
  };
});

// ── Reviews (80) ──
const reviewTexts = [
  "Amazing experience, would definitely come back!",
  "Room was clean but a bit noisy at night.",
  "Great location, friendly staff, excellent breakfast.",
  "Overpriced for what you get. Bathroom needs renovation.",
  "Perfect for a business trip. Fast WiFi and quiet rooms.",
  "The spa was incredible. Best hotel spa I've ever been to.",
  "Check-in was slow but the room made up for it.",
  "Terrible service. Staff was rude and unhelpful.",
  "Beautiful rooftop views of the city skyline.",
  "Good value for money. Will book again.",
];

const reviewStatuses: ReviewStatus[] = ["published", "published", "published", "published", "pending", "pending", "hidden", "removed", "flagged", "flagged"];

export const MOCK_REVIEWS: AdminReview[] = Array.from({ length: 80 }, (_, i) => ({
  id: `REV-${String(i + 1).padStart(4, "0")}`,
  customerId: MOCK_CUSTOMERS[i % 50].id,
  customerName: MOCK_CUSTOMERS[i % 50].name,
  hotelId: MOCK_HOTELS[i % 30].id,
  hotelName: MOCK_HOTELS[i % 30].name,
  rating: 1 + (i % 5),
  text: reviewTexts[i % reviewTexts.length],
  date: new Date(2025, Math.floor(i / 10), 1 + (i % 28)).toISOString().split("T")[0],
  status: reviewStatuses[i % reviewStatuses.length],
  reportedCount: i % 5 === 0 ? 1 + (i % 4) : 0,
  sentiment: i % 3 === 0 ? "negative" : i % 2 === 0 ? "positive" : "neutral",
}));

// ── Transactions ──
export const MOCK_TRANSACTIONS: AdminTransaction[] = Array.from({ length: 60 }, (_, i) => ({
  id: `TXN-${String(i + 1).padStart(5, "0")}`,
  type: (["booking", "refund", "commission"] as TransactionType[])[i % 3],
  customerName: MOCK_CUSTOMERS[i % 50].name,
  hotelName: MOCK_HOTELS[i % 30].name,
  amount: (["booking", "commission"] as string[]).includes((["booking", "refund", "commission"])[i % 3]) ? 50 + (i * 47) % 450 : -(20 + (i * 13) % 200),
  date: new Date(2025, Math.floor(i / 8), 1 + (i % 28)).toISOString().split("T")[0],
  status: (["completed", "pending", "completed", "completed", "failed"] as const)[i % 5],
}));

// ── Notifications ──
export const MOCK_NOTIFICATIONS: AdminNotification[] = [
  { id: "n1", type: "hotel_registration", message: "New hotel registration: Skyline Boutique Hotel", entityLink: "/admin/hotels/HTL-0002", timestamp: "2025-02-19T14:30:00", read: false },
  { id: "n2", type: "hotel_flagged", message: "The Velvet Room flagged by 3 customers", entityLink: "/admin/hotels/HTL-0009", timestamp: "2025-02-19T13:15:00", read: false },
  { id: "n3", type: "review_reported", message: "Review REV-0015 reported for inappropriate content", entityLink: "/admin/reviews", timestamp: "2025-02-19T12:00:00", read: false },
  { id: "n4", type: "account_flagged", message: "Customer Casey Jones flagged for suspicious activity", entityLink: "/admin/customers/CUS-0005", timestamp: "2025-02-19T10:45:00", read: true },
  { id: "n5", type: "no_show", message: "No-show auto-detected: RES-00008 at Central Park Lodge", entityLink: "/admin/customers/no-shows", timestamp: "2025-02-19T09:30:00", read: true },
  { id: "n6", type: "payment_dispute", message: "Payment dispute raised for TXN-00012", entityLink: "/admin/financials", timestamp: "2025-02-18T16:20:00", read: true },
  { id: "n7", type: "hotel_registration", message: "New hotel registration: Jersey Waterfront", entityLink: "/admin/hotels/HTL-0029", timestamp: "2025-02-18T14:10:00", read: true },
  { id: "n8", type: "review_reported", message: "Review REV-0032 flagged by hotel owner", entityLink: "/admin/reviews", timestamp: "2025-02-18T11:00:00", read: true },
];

// ── Activity Feed ──
export const MOCK_ACTIVITY: ActivityLogEntry[] = [
  { id: "a1", action: "Hotel 'Skyline Boutique Hotel' approved", timestamp: "2025-02-19T14:22:00", admin: "Admin" },
  { id: "a2", action: "Customer #CUS-0012 flagged for review", timestamp: "2025-02-19T13:45:00", admin: "Admin" },
  { id: "a3", action: "Review REV-0008 removed (policy violation)", timestamp: "2025-02-19T12:30:00", admin: "Admin" },
  { id: "a4", action: "Hotel 'The Velvet Room' put on hold", timestamp: "2025-02-19T11:15:00", admin: "Admin" },
  { id: "a5", action: "Reservation RES-00045 refund processed ($120)", timestamp: "2025-02-19T10:00:00", admin: "Admin" },
  { id: "a6", action: "Customer #CUS-0035 account suspended", timestamp: "2025-02-18T16:30:00", admin: "Admin" },
  { id: "a7", action: "Hotel 'Tribeca Luxe' listing updated", timestamp: "2025-02-18T15:00:00", admin: "Admin" },
  { id: "a8", action: "Platform commission rate updated to 12%", timestamp: "2025-02-18T14:00:00", admin: "Admin" },
];

// ── Chart Data ──
export const MONTHLY_RESERVATIONS = [
  { month: "Mar", count: 120 }, { month: "Apr", count: 180 }, { month: "May", count: 220 },
  { month: "Jun", count: 310 }, { month: "Jul", count: 380 }, { month: "Aug", count: 350 },
  { month: "Sep", count: 290 }, { month: "Oct", count: 260 }, { month: "Nov", count: 200 },
  { month: "Dec", count: 340 }, { month: "Jan", count: 280 }, { month: "Feb", count: 310 },
];

export const MONTHLY_REGISTRATIONS = [
  { month: "Mar", count: 3 }, { month: "Apr", count: 5 }, { month: "May", count: 2 },
  { month: "Jun", count: 4 }, { month: "Jul", count: 6 }, { month: "Aug", count: 3 },
  { month: "Sep", count: 4 }, { month: "Oct", count: 2 }, { month: "Nov", count: 5 },
  { month: "Dec", count: 3 }, { month: "Jan", count: 4 }, { month: "Feb", count: 2 },
];

export const RESERVATION_STATUS_DATA = [
  { name: "Confirmed", value: 25, fill: "hsl(217, 91%, 60%)" },
  { name: "Completed", value: 45, fill: "hsl(142, 71%, 45%)" },
  { name: "Cancelled", value: 18, fill: "hsl(38, 92%, 50%)" },
  { name: "No-Show", value: 12, fill: "hsl(0, 84%, 60%)" },
];

export const MONTHLY_REVENUE = [
  { month: "Mar", revenue: 45000 }, { month: "Apr", revenue: 62000 }, { month: "May", revenue: 78000 },
  { month: "Jun", revenue: 95000 }, { month: "Jul", revenue: 110000 }, { month: "Aug", revenue: 102000 },
  { month: "Sep", revenue: 88000 }, { month: "Oct", revenue: 76000 }, { month: "Nov", revenue: 65000 },
  { month: "Dec", revenue: 120000 }, { month: "Jan", revenue: 85000 }, { month: "Feb", revenue: 92000 },
];

// ── Helper ──
export const STATUS_CONFIG = {
  live: { label: "Live", color: "hsl(142, 71%, 45%)", bg: "hsla(142, 71%, 45%, 0.15)" },
  pending: { label: "Pending", color: "hsl(38, 92%, 50%)", bg: "hsla(38, 92%, 50%, 0.15)" },
  on_hold: { label: "On Hold", color: "hsl(217, 91%, 60%)", bg: "hsla(217, 91%, 60%, 0.15)" },
  suspended: { label: "Suspended", color: "hsl(0, 84%, 60%)", bg: "hsla(0, 84%, 60%, 0.15)" },
  under_review: { label: "Under Review", color: "hsl(270, 60%, 60%)", bg: "hsla(270, 60%, 60%, 0.15)" },
  active: { label: "Active", color: "hsl(142, 71%, 45%)", bg: "hsla(142, 71%, 45%, 0.15)" },
  inactive: { label: "Inactive", color: "hsl(0, 0%, 50%)", bg: "hsla(0, 0%, 50%, 0.15)" },
  flagged: { label: "Flagged", color: "hsl(38, 92%, 50%)", bg: "hsla(38, 92%, 50%, 0.15)" },
  confirmed: { label: "Confirmed", color: "hsl(217, 91%, 60%)", bg: "hsla(217, 91%, 60%, 0.15)" },
  checked_in: { label: "Checked In", color: "hsl(142, 71%, 45%)", bg: "hsla(142, 71%, 45%, 0.15)" },
  completed: { label: "Completed", color: "hsl(0, 0%, 50%)", bg: "hsla(0, 0%, 50%, 0.15)" },
  cancelled: { label: "Cancelled", color: "hsl(38, 92%, 50%)", bg: "hsla(38, 92%, 50%, 0.15)" },
  no_show: { label: "No-Show", color: "hsl(0, 84%, 60%)", bg: "hsla(0, 84%, 60%, 0.15)" },
  disputed: { label: "Disputed", color: "hsl(270, 60%, 60%)", bg: "hsla(270, 60%, 60%, 0.15)" },
  published: { label: "Published", color: "hsl(142, 71%, 45%)", bg: "hsla(142, 71%, 45%, 0.15)" },
  hidden: { label: "Hidden", color: "hsl(0, 0%, 50%)", bg: "hsla(0, 0%, 50%, 0.15)" },
  removed: { label: "Removed", color: "hsl(0, 84%, 60%)", bg: "hsla(0, 84%, 60%, 0.15)" },
} as const;
