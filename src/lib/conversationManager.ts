export interface BookingSlots {
  location?: string;
  borough?: string;
  area?: string;
  date?: string;
  startTime?: string;
  durationHours?: number;
  guests?: number;
  maxBudget?: number;
  preferences?: string[];
  nearAirport?: string;
  roomType?: string;
}

export type ConversationStep =
  | "greeting"
  | "collecting"
  | "searching"
  | "presenting"
  | "selecting"
  | "confirming"
  | "booked"
  | "support";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  hotelCards?: HotelCardData[];
  bookingSummary?: BookingSummaryData;
  bookingConfirmation?: BookingConfirmationData;
  quickReplies?: string[];
}

export interface HotelCardData {
  id: string;
  name: string;
  area: string;
  borough: string;
  rating: number;
  reviews: number;
  cheapestRate: number;
  image: string;
  tags: string[];
  topAmenities: string[];
  address: string;
  nearAirport?: string;
}

export interface BookingSummaryData {
  hotelName: string;
  roomType: string;
  date: string;
  startTime: string;
  duration: number;
  guests: number;
  ratePerHour: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export interface BookingConfirmationData {
  bookingId: string;
  hotelName: string;
  roomType: string;
  date: string;
  timeRange: string;
  guests: number;
  total: number;
  email: string;
}

export interface ConversationState {
  messages: ChatMessage[];
  slots: BookingSlots;
  step: ConversationStep;
  selectedHotelId?: string;
  selectedRoomId?: string;
}

const SESSION_KEY = "houry_conversation";

export function getConversationState(): ConversationState {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { messages: [], slots: {}, step: "greeting" };
}

export function saveConversationState(state: ConversationState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {}
}

export function clearConversation() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function generateBookingId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `COH-2026-${num}`;
}

// Detect intent and mood from user message
const MOOD_MAP: Record<string, string[]> = {
  romantic: ["romantic", "anniversary", "date night", "date", "couples", "partner", "love"],
  workspace: ["work", "meeting", "focus", "quiet", "office", "business", "laptop"],
  family: ["kids", "family", "children"],
  luxury: ["celebrate", "party", "luxury", "premium", "best", "top"],
  layover: ["layover", "flight", "airport", "transit", "stopover"],
  budget: ["cheap", "affordable", "budget", "under", "save"],
};

export function detectMoodTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  for (const [tag, keywords] of Object.entries(MOOD_MAP)) {
    if (keywords.some(k => lower.includes(k))) tags.push(tag);
  }
  return tags;
}

const AIRPORT_MAP: Record<string, string> = {
  jfk: "JFK",
  "john f kennedy": "JFK",
  laguardia: "LGA",
  lga: "LGA",
  newark: "EWR",
  ewr: "EWR",
};

export function detectAirport(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [keyword, code] of Object.entries(AIRPORT_MAP)) {
    if (lower.includes(keyword)) return code;
  }
  return undefined;
}

const BOROUGH_MAP: Record<string, string> = {
  manhattan: "Manhattan",
  brooklyn: "Brooklyn",
  queens: "Queens",
  bronx: "The Bronx",
  "the bronx": "The Bronx",
  "staten island": "Staten Island",
  "jersey city": "Jersey City",
  hoboken: "Hoboken",
  newark: "Newark",
  "new jersey": "Jersey City",
  nj: "Jersey City",
};

export function detectBorough(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [keyword, borough] of Object.entries(BOROUGH_MAP)) {
    if (lower.includes(keyword)) return borough;
  }
  return undefined;
}
