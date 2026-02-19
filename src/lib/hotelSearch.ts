import { HOTEL_DATABASE, type RAGHotel, type HotelRoom } from "./hotelDatabase";

export interface SearchParams {
  borough?: string;
  area?: string;
  guests?: number;
  maxBudgetPerHour?: number;
  tags?: string[];
  nearAirport?: string;
  durationHours?: number;
  roomType?: string;
}

export interface SearchResult {
  hotel: RAGHotel;
  matchingRooms: HotelRoom[];
  matchScore: number;
}

export function searchHotels(params: SearchParams): SearchResult[] {
  let results: SearchResult[] = [];

  for (const hotel of HOTEL_DATABASE) {
    let score = 0;

    // Borough filter
    if (params.borough) {
      const b = params.borough.toLowerCase();
      const hb = hotel.borough.toLowerCase();
      const ha = hotel.area.toLowerCase();
      if (!hb.includes(b) && !ha.includes(b) && !hotel.address.toLowerCase().includes(b)) continue;
      score += 10;
    }

    // Area filter (boost)
    if (params.area) {
      if (hotel.area.toLowerCase().includes(params.area.toLowerCase())) score += 5;
    }

    // Airport filter
    if (params.nearAirport) {
      if (hotel.near_airport?.toLowerCase() !== params.nearAirport.toLowerCase()) continue;
      score += 15;
    }

    // Filter rooms
    let matchingRooms = [...hotel.rooms];

    if (params.guests) {
      matchingRooms = matchingRooms.filter(r => r.max_guests >= params.guests!);
      if (matchingRooms.length === 0) continue;
    }

    if (params.maxBudgetPerHour) {
      matchingRooms = matchingRooms.filter(r => r.hourly_rate <= params.maxBudgetPerHour!);
      if (matchingRooms.length === 0) continue;
    }

    if (params.durationHours) {
      matchingRooms = matchingRooms.filter(
        r => params.durationHours! >= r.min_hours && params.durationHours! <= r.max_hours
      );
      if (matchingRooms.length === 0) continue;
    }

    if (params.roomType) {
      const rt = params.roomType.toLowerCase();
      matchingRooms = matchingRooms.filter(r => r.type.toLowerCase().includes(rt));
      if (matchingRooms.length === 0) continue;
    }

    // Tag matching (boost)
    if (params.tags && params.tags.length > 0) {
      const tagMatches = params.tags.filter(t => hotel.tags.includes(t.toLowerCase())).length;
      score += tagMatches * 3;
    }

    // Rating boost
    score += hotel.rating * 2;

    results.push({ hotel, matchingRooms, matchScore: score });
  }

  // Sort by score desc, then rating desc, then cheapest first
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    if (b.hotel.rating !== a.hotel.rating) return b.hotel.rating - a.hotel.rating;
    const aMin = Math.min(...a.matchingRooms.map(r => r.hourly_rate));
    const bMin = Math.min(...b.matchingRooms.map(r => r.hourly_rate));
    return aMin - bMin;
  });

  return results.slice(0, 5);
}

// Serialize results for RAG injection
export function formatResultsForAI(results: SearchResult[]): string {
  if (results.length === 0) return "No hotels found matching the criteria.";

  return results.map((r, i) => {
    const cheapest = Math.min(...r.matchingRooms.map(rm => rm.hourly_rate));
    const roomList = r.matchingRooms.map(rm =>
      `  - ${rm.type}: $${rm.hourly_rate}/hr (up to ${rm.max_guests} guests) — ${rm.amenities.join(", ")}`
    ).join("\n");

    return `${i + 1}. ${r.hotel.name} (${r.hotel.area}, ${r.hotel.borough})
   ⭐ ${r.hotel.rating}/5 (${r.hotel.total_reviews} reviews) | From $${cheapest}/hr
   Tags: ${r.hotel.tags.join(", ")}${r.hotel.near_airport ? ` | Near ${r.hotel.near_airport} Airport` : ""}
   Address: ${r.hotel.address}
   Rooms:
${roomList}
   Cancellation: ${r.hotel.policies.cancellation}`;
  }).join("\n\n");
}
