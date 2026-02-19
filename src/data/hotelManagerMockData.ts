// ═══════════════════════════════════════════════════════════════
// HOTEL MANAGER MOCK DATA — "The Grand Residency", Bangalore
// ═══════════════════════════════════════════════════════════════

export interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  maxGuests: number;
  totalRooms: number;
  description: string;
}

export interface AvailabilitySlot {
  id: string;
  roomTypeId: string;
  date: string; // ISO date
  startHour: number; // 0-23
  endHour: number;   // 0-23
  roomsListed: number;
  roomsBooked: number;
  priceOverride?: number;
}

export interface Reservation {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  timeSlot: string;
  guests: number;
  amount: number;
  status: "confirmed" | "checked-in" | "completed" | "cancelled" | "no-show" | "pending" | "refunded";
  paymentMethod: string;
  createdAt: string;
  specialRequests?: string;
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  roomType: string;
  status: "published" | "pending" | "reported";
  response?: string;
  helpful: number;
}

export interface EarningEntry {
  id: string;
  month: string;
  grossRevenue: number;
  platformFee: number;
  taxes: number;
  netPayout: number;
  status: "paid" | "pending" | "processing";
  payoutDate?: string;
  transactionId?: string;
}

export interface Notification {
  id: string;
  type: "booking" | "review" | "payout" | "system" | "cancellation" | "no-show";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface HotelInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  totalReviews: number;
  category: string;
  listingDate: string;
  status: "live" | "paused" | "delisted";
  manager: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  photos: string[];
  amenities: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    smoking: string;
    pets: string;
    ageRestriction: number;
  };
}

// ─── Hotel Info ────────────────────────────────────────
export const HOTEL_INFO: HotelInfo = {
  name: "The Grand Residency",
  tagline: "Where Luxury Meets Comfort",
  description: "A premier boutique hotel in the heart of Bangalore, offering world-class amenities and exceptional hospitality. Nestled in the vibrant MG Road district, The Grand Residency combines contemporary elegance with traditional Indian warmth.",
  address: "42 MG Road, Ashok Nagar",
  city: "Bangalore",
  state: "Karnataka",
  zip: "560001",
  phone: "+91 80 4567 8900",
  email: "info@grandresidency.in",
  website: "www.grandresidency.in",
  rating: 4.6,
  totalReviews: 342,
  category: "Boutique Hotel",
  listingDate: "2024-06-15",
  status: "live",
  manager: {
    name: "Rajesh Menon",
    email: "rajesh@grandresidency.in",
    phone: "+91 98765 43210",
    avatar: "RM",
  },
  photos: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
  amenities: [
    "Free WiFi", "Swimming Pool", "Gym", "Spa", "Restaurant", "Bar",
    "Room Service", "Concierge", "Business Center", "Parking",
    "Laundry", "EV Charging", "Airport Shuttle", "Rooftop Lounge"
  ],
  policies: {
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in. 50% charge for late cancellations.",
    smoking: "Non-smoking throughout. Designated outdoor areas available.",
    pets: "Small pets allowed with prior approval. ₹500/night surcharge.",
    ageRestriction: 18,
  },
};

// ─── Room Types ────────────────────────────────────────
export const ROOM_TYPES: RoomType[] = [
  { id: "std", name: "Standard Room", basePrice: 3500, maxGuests: 2, totalRooms: 12, description: "Comfortable 250 sq ft room with queen bed, work desk, and city view." },
  { id: "dlx", name: "Deluxe Room", basePrice: 5500, maxGuests: 3, totalRooms: 8, description: "Spacious 350 sq ft room with king bed, sitting area, and garden view." },
  { id: "ste", name: "Suite", basePrice: 9000, maxGuests: 4, totalRooms: 4, description: "Luxurious 550 sq ft suite with separate living area, premium amenities, and panoramic view." },
  { id: "prs", name: "Presidential Suite", basePrice: 18000, maxGuests: 4, totalRooms: 2, description: "Ultra-premium 900 sq ft suite with private balcony, jacuzzi, butler service, and exclusive lounge access." },
];

// ─── Availability Slots (today) ────────────────────────
const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

export const AVAILABILITY_SLOTS: AvailabilitySlot[] = [
  // Standard Room - today
  { id: "s1", roomTypeId: "std", date: today, startHour: 8, endHour: 12, roomsListed: 4, roomsBooked: 3 },
  { id: "s2", roomTypeId: "std", date: today, startHour: 14, endHour: 20, roomsListed: 6, roomsBooked: 4 },
  { id: "s3", roomTypeId: "std", date: today, startHour: 17, endHour: 22, roomsListed: 5, roomsBooked: 2 },
  // Deluxe Room - today
  { id: "s4", roomTypeId: "dlx", date: today, startHour: 9, endHour: 13, roomsListed: 3, roomsBooked: 2 },
  { id: "s5", roomTypeId: "dlx", date: today, startHour: 14, endHour: 19, roomsListed: 4, roomsBooked: 3 },
  { id: "s6", roomTypeId: "dlx", date: today, startHour: 20, endHour: 23, roomsListed: 3, roomsBooked: 1 },
  // Suite - today
  { id: "s7", roomTypeId: "ste", date: today, startHour: 10, endHour: 16, roomsListed: 2, roomsBooked: 2 },
  { id: "s8", roomTypeId: "ste", date: today, startHour: 18, endHour: 23, roomsListed: 3, roomsBooked: 1 },
  // Presidential - today
  { id: "s9", roomTypeId: "prs", date: today, startHour: 8, endHour: 14, roomsListed: 1, roomsBooked: 1 },
  { id: "s10", roomTypeId: "prs", date: today, startHour: 16, endHour: 22, roomsListed: 2, roomsBooked: 0 },
  // Standard Room - tomorrow
  { id: "s11", roomTypeId: "std", date: tomorrow, startHour: 8, endHour: 12, roomsListed: 5, roomsBooked: 1 },
  { id: "s12", roomTypeId: "std", date: tomorrow, startHour: 14, endHour: 20, roomsListed: 6, roomsBooked: 2 },
  // Deluxe - tomorrow
  { id: "s13", roomTypeId: "dlx", date: tomorrow, startHour: 9, endHour: 14, roomsListed: 4, roomsBooked: 0 },
  { id: "s14", roomTypeId: "dlx", date: tomorrow, startHour: 16, endHour: 22, roomsListed: 4, roomsBooked: 1 },
  // Suite - tomorrow
  { id: "s15", roomTypeId: "ste", date: tomorrow, startHour: 10, endHour: 18, roomsListed: 3, roomsBooked: 0 },
  // Presidential - tomorrow
  { id: "s16", roomTypeId: "prs", date: tomorrow, startHour: 10, endHour: 20, roomsListed: 2, roomsBooked: 1 },
];

// ─── Slot Templates ───────────────────────────────────
export const SLOT_TEMPLATES = [
  { id: "t1", name: "Weekday Standard", slots: [
    { roomTypeId: "std", startHour: 8, endHour: 12, roomsListed: 4 },
    { roomTypeId: "std", startHour: 14, endHour: 20, roomsListed: 6 },
    { roomTypeId: "dlx", startHour: 9, endHour: 14, roomsListed: 3 },
    { roomTypeId: "dlx", startHour: 16, endHour: 22, roomsListed: 4 },
  ]},
  { id: "t2", name: "Weekend Peak", slots: [
    { roomTypeId: "std", startHour: 8, endHour: 14, roomsListed: 6 },
    { roomTypeId: "std", startHour: 16, endHour: 23, roomsListed: 8 },
    { roomTypeId: "dlx", startHour: 8, endHour: 14, roomsListed: 5 },
    { roomTypeId: "dlx", startHour: 16, endHour: 23, roomsListed: 6 },
    { roomTypeId: "ste", startHour: 10, endHour: 22, roomsListed: 4 },
    { roomTypeId: "prs", startHour: 10, endHour: 22, roomsListed: 2 },
  ]},
];

// ─── Reservations (40) ────────────────────────────────
const GUEST_NAMES = [
  "Ananya Sharma", "Vikram Patel", "Priya Nair", "Arjun Reddy", "Meera Iyer",
  "Karan Singh", "Neha Gupta", "Rahul Joshi", "Divya Krishnan", "Aditya Rao",
  "Sneha Chatterjee", "Rohan Malhotra", "Pooja Desai", "Siddharth Menon", "Kavitha Pillai",
  "Amit Khanna", "Rithika Bhat", "Nikhil Verma", "Lakshmi Subramaniam", "Deepak Hegde",
  "Swati Kulkarni", "Varun Choudhary", "Ankita Srinivasan", "Manish Tiwari", "Gayatri Mohan",
  "Suresh Nambiar", "Tanvi Shah", "Harish Kumar", "Jyoti Mishra", "Prasad Kamath",
  "Rekha Deshpande", "Vivek Gopal", "Nandini Rao", "Ashwin Bose", "Shalini Dutta",
  "Rajiv Kapoor", "Bhavana Shetty", "Girish Pai", "Uma Ranganathan", "Arun Sundaram"
];

const ROOM_NAMES = ["Standard Room", "Deluxe Room", "Suite", "Presidential Suite"];
const STATUSES: Reservation["status"][] = ["confirmed", "checked-in", "completed", "cancelled", "no-show", "pending", "refunded"];
const PAYMENTS = ["Credit Card", "UPI", "Net Banking", "Debit Card", "Cash"];

export const RESERVATIONS: Reservation[] = Array.from({ length: 40 }, (_, i) => {
  const status = STATUSES[i % 7];
  const roomType = ROOM_NAMES[i % 4];
  const dayOffset = Math.floor(i / 4) - 5;
  const date = new Date(Date.now() + dayOffset * 86400000);
  const checkIn = date.toISOString().split("T")[0];
  const checkOut = new Date(date.getTime() + 86400000).toISOString().split("T")[0];
  const hours = [8, 10, 14, 16, 18];
  const startH = hours[i % 5];
  return {
    id: `RES-${String(1000 + i)}`,
    bookingId: `BK-${String(2000 + i)}`,
    guestName: GUEST_NAMES[i],
    guestEmail: `${GUEST_NAMES[i].split(" ")[0].toLowerCase()}@email.com`,
    guestPhone: `+91 ${90000 + i * 111}`,
    roomType,
    checkIn,
    checkOut,
    timeSlot: `${startH}:00 - ${startH + 4}:00`,
    guests: (i % 3) + 1,
    amount: [3500, 5500, 9000, 18000][i % 4] * ((i % 3) + 1) * 0.5,
    status,
    paymentMethod: PAYMENTS[i % 5],
    createdAt: new Date(date.getTime() - 3 * 86400000).toISOString(),
    specialRequests: i % 3 === 0 ? "Early check-in requested" : undefined,
  };
});

// ─── Reviews (25) ──────────────────────────────────────
const REVIEW_TITLES = [
  "Amazing experience!", "Good value for money", "Perfect getaway", "Could be better",
  "Exceptional service", "Loved the pool", "Great location", "Clean and comfortable",
  "Spa was incredible", "Will come back!", "Decent stay", "Beautiful property",
  "Friendly staff", "Room was spacious", "Food was delicious", "Nice ambiance",
  "Needs improvement", "Wonderful views", "Very relaxing", "Best hotel in Bangalore",
  "Cozy and warm", "Top notch amenities", "Quick service", "Memorable stay", "Worth every penny"
];

const REVIEW_TEXTS = [
  "Had an absolutely wonderful stay at The Grand Residency. The staff went above and beyond to make our anniversary special.",
  "Good hotel overall. Room was clean, amenities were nice. Breakfast could be better though.",
  "The rooftop lounge has the best views in Bangalore! Highly recommend the weekend brunch.",
  "Room was a bit small for the price. However, the service was impeccable. Would consider the deluxe next time.",
  "Rajesh and his team are exceptional. They arranged a surprise cake for my wife's birthday. True hospitality!",
  "The pool area is beautiful. Spent most of our time there. Kids loved it too!",
  "Perfect location on MG Road. Walking distance to everything. The concierge recommendations were spot on.",
  "Very clean rooms, comfortable beds. The bathroom amenities were premium quality.",
  "The spa treatment was the highlight of our trip. The therapists are very skilled.",
  "This is our go-to hotel in Bangalore now. 3rd visit and it keeps getting better.",
  "Average experience. Nothing special but nothing bad either. Standard hotel stay.",
  "The architecture and interior design are stunning. Every corner is Instagram-worthy.",
  "The staff remembered my name from my last visit! That level of attention to detail is rare.",
  "Upgraded to a suite and it was worth every rupee. So much space and the balcony view was gorgeous.",
  "The restaurant serves the best biryani in the area. Don't miss the chef's special thali.",
  "Loved the ambient lighting and the jazz music in the lobby. Very classy atmosphere.",
  "AC was not working properly on the first night. They fixed it quickly but still inconvenient.",
  "Woke up to a beautiful sunrise from our room. The floor-to-ceiling windows are a great feature.",
  "Used the hotel for a quiet workation. Fast WiFi, great coffee, and peaceful environment.",
  "Simply the best hotel experience in Bangalore. Five stars all the way!",
  "The blankets and pillows were so comfortable. Best sleep I've had in a hotel.",
  "Gym is well-equipped and open 24/7. Loved the sauna too.",
  "Room service was prompt - food arrived in 15 minutes. Hot and delicious.",
  "Celebrating 10 years of marriage here was the best decision. Truly memorable.",
  "Value for money is excellent, especially with the loyalty program discounts."
];

export const REVIEWS: Review[] = Array.from({ length: 25 }, (_, i) => ({
  id: `REV-${100 + i}`,
  guestName: GUEST_NAMES[i],
  rating: i < 3 ? 5 : i < 8 ? 4 : i < 15 ? 5 : i < 20 ? 3 : 4,
  title: REVIEW_TITLES[i],
  text: REVIEW_TEXTS[i],
  date: new Date(Date.now() - i * 3 * 86400000).toISOString().split("T")[0],
  roomType: ROOM_NAMES[i % 4],
  status: i === 16 ? "reported" : i > 22 ? "pending" : "published",
  response: i < 5 ? "Thank you for your kind words! We look forward to welcoming you back." : undefined,
  helpful: Math.floor(Math.random() * 20),
}));

// ─── Earnings ──────────────────────────────────────────
const MONTHS = ["Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"];

export const EARNINGS: EarningEntry[] = MONTHS.map((month, i) => {
  const gross = 400000 + Math.floor(Math.random() * 200000);
  const fee = Math.round(gross * 0.12);
  const tax = Math.round(gross * 0.18);
  return {
    id: `PAY-${200 + i}`,
    month,
    grossRevenue: gross,
    platformFee: fee,
    taxes: tax,
    netPayout: gross - fee - tax,
    status: i < 5 ? "paid" : i === 5 ? "processing" : "pending",
    payoutDate: i < 5 ? `2025-${String(8 + i).padStart(2, "0")}-28` : undefined,
    transactionId: i < 5 ? `TXN-${3000 + i}` : undefined,
  };
});

export const MONTHLY_REVENUE_CHART = MONTHS.map((month, i) => ({
  month: month.split(" ")[0],
  revenue: EARNINGS[i].grossRevenue,
  payout: EARNINGS[i].netPayout,
}));

// ─── Analytics Data ────────────────────────────────────
export const HEATMAP_DATA = Array.from({ length: 7 }, (_, dayIdx) => {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return {
    day: dayNames[dayIdx],
    hours: Array.from({ length: 16 }, (_, h) => {
      const hour = h + 6; // 6AM - 10PM
      const isWeekend = dayIdx >= 5;
      const isPeak = (hour >= 10 && hour <= 14) || (hour >= 18 && hour <= 21);
      const base = isWeekend ? 70 : 40;
      const peak = isPeak ? 30 : 0;
      return { hour, occupancy: Math.min(100, base + peak + Math.floor(Math.random() * 20)) };
    }),
  };
});

export const OCCUPANCY_TREND = MONTHS.map((month, i) => ({
  month: month.split(" ")[0],
  occupancy: 60 + Math.floor(Math.random() * 25),
}));

export const ROOM_TYPE_REVENUE = ROOM_TYPES.map(rt => ({
  name: rt.name,
  revenue: rt.basePrice * rt.totalRooms * 20 + Math.floor(Math.random() * 100000),
  bookings: rt.totalRooms * 15 + Math.floor(Math.random() * 30),
}));

export const ANALYTICS_INSIGHTS = [
  { id: 1, type: "positive" as const, text: "Weekend occupancy is 32% higher than weekdays. Consider premium pricing for Fri-Sun slots." },
  { id: 2, type: "positive" as const, text: "Deluxe rooms have the highest satisfaction rating at 4.8/5. Feature them more prominently." },
  { id: 3, type: "warning" as const, text: "The 6AM-8AM slot has only 15% utilization. Consider adjusting availability or offering discounts." },
  { id: 4, type: "positive" as const, text: "Repeat guest rate is 28%, above the industry average of 20%. Your loyalty efforts are working." },
  { id: 5, type: "warning" as const, text: "No-show rate increased by 5% this month. Consider implementing stricter cancellation policies." },
];

// ─── Notifications ─────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "booking", title: "New Booking", message: "Ananya Sharma booked a Deluxe Room for Feb 20, 2:00 PM - 6:00 PM", timestamp: new Date(Date.now() - 1800000).toISOString(), read: false, link: "/manager/reservations" },
  { id: "n2", type: "booking", title: "New Booking", message: "Vikram Patel booked a Standard Room for Feb 21, 8:00 AM - 12:00 PM", timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, link: "/manager/reservations" },
  { id: "n3", type: "cancellation", title: "Booking Cancelled", message: "Priya Nair cancelled her Suite reservation for Feb 19", timestamp: new Date(Date.now() - 7200000).toISOString(), read: false, link: "/manager/reservations" },
  { id: "n4", type: "review", title: "New Review", message: "Arjun Reddy left a 5-star review: 'Amazing experience!'", timestamp: new Date(Date.now() - 14400000).toISOString(), read: true, link: "/manager/reviews" },
  { id: "n5", type: "payout", title: "Payout Processed", message: "₹3,42,000 has been transferred to your bank account for January 2026", timestamp: new Date(Date.now() - 86400000).toISOString(), read: true, link: "/manager/earnings" },
  { id: "n6", type: "no-show", title: "No-Show Recorded", message: "Karan Singh did not check in for his 10:00 AM reservation today", timestamp: new Date(Date.now() - 43200000).toISOString(), read: false, link: "/manager/reservations" },
  { id: "n7", type: "system", title: "Listing Update", message: "Your hotel listing has been updated successfully", timestamp: new Date(Date.now() - 172800000).toISOString(), read: true },
  { id: "n8", type: "review", title: "Review Flagged", message: "A review by Kavitha Pillai has been flagged for moderation", timestamp: new Date(Date.now() - 259200000).toISOString(), read: true, link: "/manager/reviews" },
  { id: "n9", type: "booking", title: "Booking Modified", message: "Meera Iyer changed her check-in time from 2:00 PM to 4:00 PM", timestamp: new Date(Date.now() - 345600000).toISOString(), read: true, link: "/manager/reservations" },
  { id: "n10", type: "payout", title: "Statement Available", message: "Your December 2025 earnings statement is ready for download", timestamp: new Date(Date.now() - 432000000).toISOString(), read: true, link: "/manager/earnings" },
  { id: "n11", type: "system", title: "Platform Update", message: "New analytics features are now available in your dashboard", timestamp: new Date(Date.now() - 518400000).toISOString(), read: true },
  { id: "n12", type: "booking", title: "Bulk Booking", message: "Corporate booking for 5 Standard Rooms, Mar 1-3", timestamp: new Date(Date.now() - 604800000).toISOString(), read: true, link: "/manager/reservations" },
];

// ─── Dashboard KPIs ────────────────────────────────────
export const MANAGER_KPIS = {
  todayBookings: 8,
  todayRevenue: 52000,
  occupancyRate: 76,
  pendingCheckIns: 3,
  activeGuests: 12,
  avgRating: 4.6,
  monthlyRevenue: EARNINGS[EARNINGS.length - 2]?.grossRevenue || 0,
  monthlyBookings: 156,
};

export const TODAY_TIMELINE = [
  { time: "8:00 AM", event: "Ananya Sharma — Standard Room check-in", type: "check-in" },
  { time: "9:00 AM", event: "Vikram Patel — Deluxe Room check-in", type: "check-in" },
  { time: "10:00 AM", event: "Presidential Suite — VIP arrival (Arjun Reddy)", type: "vip" },
  { time: "12:00 PM", event: "3 Standard Rooms — Check-out", type: "check-out" },
  { time: "2:00 PM", event: "Meera Iyer — Suite check-in", type: "check-in" },
  { time: "4:00 PM", event: "Housekeeping turnover — 6 rooms", type: "housekeeping" },
  { time: "6:00 PM", event: "Karan Singh — Deluxe Room check-in", type: "check-in" },
  { time: "8:00 PM", event: "Neha Gupta — Standard Room check-in", type: "check-in" },
];

export const RECENT_ACTIVITY = [
  { id: "a1", action: "Ananya Sharma checked in to Deluxe Room #204", timestamp: new Date(Date.now() - 900000).toISOString() },
  { id: "a2", action: "New booking: Rahul Joshi — Suite, Feb 22", timestamp: new Date(Date.now() - 2700000).toISOString() },
  { id: "a3", action: "Room #108 marked for housekeeping", timestamp: new Date(Date.now() - 5400000).toISOString() },
  { id: "a4", action: "Priya Nair cancelled reservation BK-2002", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "a5", action: "5-star review received from Arjun Reddy", timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: "a6", action: "January payout of ₹3,42,000 processed", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "a7", action: "Availability updated for Feb 20-22", timestamp: new Date(Date.now() - 129600000).toISOString() },
];
