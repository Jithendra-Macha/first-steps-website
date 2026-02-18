export interface USLocation {
  name: string;
  type: "city" | "borough" | "county" | "village" | "neighborhood" | "region";
  state: string;
  popular?: boolean;
}

export const US_LOCATIONS: USLocation[] = [
  // Popular cities
  { name: "Manhattan", type: "borough", state: "NY", popular: true },
  { name: "Brooklyn", type: "borough", state: "NY", popular: true },
  { name: "Queens", type: "borough", state: "NY", popular: true },
  { name: "The Bronx", type: "borough", state: "NY", popular: true },
  { name: "Staten Island", type: "borough", state: "NY", popular: true },
  { name: "Jersey City", type: "city", state: "NJ", popular: true },
  { name: "Hoboken", type: "city", state: "NJ", popular: true },
  { name: "Newark", type: "city", state: "NJ", popular: true },
  { name: "Los Angeles", type: "city", state: "CA", popular: true },
  { name: "San Francisco", type: "city", state: "CA", popular: true },
  { name: "Chicago", type: "city", state: "IL", popular: true },
  { name: "Miami", type: "city", state: "FL", popular: true },
  { name: "Las Vegas", type: "city", state: "NV", popular: true },
  { name: "Houston", type: "city", state: "TX", popular: true },
  { name: "Dallas", type: "city", state: "TX", popular: true },
  { name: "Austin", type: "city", state: "TX", popular: true },
  { name: "San Diego", type: "city", state: "CA", popular: true },
  { name: "Seattle", type: "city", state: "WA", popular: true },
  { name: "Boston", type: "city", state: "MA", popular: true },
  { name: "Washington", type: "city", state: "DC", popular: true },
  { name: "Atlanta", type: "city", state: "GA", popular: true },
  { name: "Denver", type: "city", state: "CO", popular: true },
  { name: "Nashville", type: "city", state: "TN", popular: true },
  { name: "Orlando", type: "city", state: "FL", popular: true },
  { name: "Philadelphia", type: "city", state: "PA", popular: true },
  { name: "Phoenix", type: "city", state: "AZ", popular: true },
  { name: "Portland", type: "city", state: "OR", popular: true },
  { name: "New Orleans", type: "city", state: "LA", popular: true },

  // NY Neighborhoods
  { name: "Midtown", type: "neighborhood", state: "NY" },
  { name: "Upper East Side", type: "neighborhood", state: "NY" },
  { name: "Upper West Side", type: "neighborhood", state: "NY" },
  { name: "Chelsea", type: "neighborhood", state: "NY" },
  { name: "SoHo", type: "neighborhood", state: "NY" },
  { name: "Tribeca", type: "neighborhood", state: "NY" },
  { name: "Greenwich Village", type: "neighborhood", state: "NY" },
  { name: "East Village", type: "neighborhood", state: "NY" },
  { name: "Lower East Side", type: "neighborhood", state: "NY" },
  { name: "Harlem", type: "neighborhood", state: "NY" },
  { name: "Financial District", type: "neighborhood", state: "NY" },
  { name: "Meatpacking District", type: "neighborhood", state: "NY" },
  { name: "Gramercy", type: "neighborhood", state: "NY" },
  { name: "Murray Hill", type: "neighborhood", state: "NY" },
  { name: "Hell's Kitchen", type: "neighborhood", state: "NY" },
  { name: "Williamsburg", type: "neighborhood", state: "NY" },
  { name: "DUMBO", type: "neighborhood", state: "NY" },
  { name: "Brooklyn Heights", type: "neighborhood", state: "NY" },
  { name: "Park Slope", type: "neighborhood", state: "NY" },
  { name: "Bushwick", type: "neighborhood", state: "NY" },
  { name: "Astoria", type: "neighborhood", state: "NY" },
  { name: "Long Island City", type: "neighborhood", state: "NY" },
  { name: "Flushing", type: "neighborhood", state: "NY" },
  { name: "Jamaica", type: "neighborhood", state: "NY" },

  // NY Counties
  { name: "Nassau County", type: "county", state: "NY" },
  { name: "Suffolk County", type: "county", state: "NY" },
  { name: "Westchester County", type: "county", state: "NY" },
  { name: "Rockland County", type: "county", state: "NY" },
  { name: "Dutchess County", type: "county", state: "NY" },
  { name: "Orange County", type: "county", state: "NY" },
  { name: "Kings County", type: "county", state: "NY" },

  // NY Cities & Villages
  { name: "Yonkers", type: "city", state: "NY" },
  { name: "White Plains", type: "city", state: "NY" },
  { name: "New Rochelle", type: "city", state: "NY" },
  { name: "Buffalo", type: "city", state: "NY" },
  { name: "Rochester", type: "city", state: "NY" },
  { name: "Syracuse", type: "city", state: "NY" },
  { name: "Albany", type: "city", state: "NY" },
  { name: "Scarsdale", type: "village", state: "NY" },
  { name: "Tarrytown", type: "village", state: "NY" },
  { name: "Bronxville", type: "village", state: "NY" },
  { name: "Garden City", type: "village", state: "NY" },
  { name: "Great Neck", type: "village", state: "NY" },
  { name: "Port Washington", type: "village", state: "NY" },
  { name: "Montauk", type: "village", state: "NY" },
  { name: "Southampton", type: "village", state: "NY" },
  { name: "Sag Harbor", type: "village", state: "NY" },

  // NJ Cities
  { name: "Paterson", type: "city", state: "NJ" },
  { name: "Elizabeth", type: "city", state: "NJ" },
  { name: "Trenton", type: "city", state: "NJ" },
  { name: "Atlantic City", type: "city", state: "NJ" },
  { name: "Princeton", type: "city", state: "NJ" },
  { name: "Morristown", type: "city", state: "NJ" },
  { name: "Asbury Park", type: "city", state: "NJ" },
  { name: "Fort Lee", type: "city", state: "NJ" },
  { name: "Weehawken", type: "city", state: "NJ" },
  { name: "Edgewater", type: "city", state: "NJ" },

  // NJ Counties
  { name: "Bergen County", type: "county", state: "NJ" },
  { name: "Hudson County", type: "county", state: "NJ" },
  { name: "Essex County", type: "county", state: "NJ" },
  { name: "Middlesex County", type: "county", state: "NJ" },
  { name: "Morris County", type: "county", state: "NJ" },
  { name: "Monmouth County", type: "county", state: "NJ" },

  // CA Cities
  { name: "Beverly Hills", type: "city", state: "CA" },
  { name: "Santa Monica", type: "city", state: "CA" },
  { name: "Hollywood", type: "neighborhood", state: "CA" },
  { name: "West Hollywood", type: "city", state: "CA" },
  { name: "Pasadena", type: "city", state: "CA" },
  { name: "Long Beach", type: "city", state: "CA" },
  { name: "Anaheim", type: "city", state: "CA" },
  { name: "San Jose", type: "city", state: "CA" },
  { name: "Sacramento", type: "city", state: "CA" },
  { name: "Oakland", type: "city", state: "CA" },
  { name: "Palo Alto", type: "city", state: "CA" },
  { name: "Napa", type: "city", state: "CA" },
  { name: "Palm Springs", type: "city", state: "CA" },
  { name: "Laguna Beach", type: "city", state: "CA" },
  { name: "Carmel-by-the-Sea", type: "village", state: "CA" },
  { name: "Sausalito", type: "city", state: "CA" },

  // FL Cities
  { name: "Fort Lauderdale", type: "city", state: "FL" },
  { name: "Tampa", type: "city", state: "FL" },
  { name: "Jacksonville", type: "city", state: "FL" },
  { name: "Naples", type: "city", state: "FL" },
  { name: "Key West", type: "city", state: "FL" },
  { name: "St. Petersburg", type: "city", state: "FL" },
  { name: "West Palm Beach", type: "city", state: "FL" },
  { name: "Miami Beach", type: "city", state: "FL" },
  { name: "Clearwater", type: "city", state: "FL" },
  { name: "Sarasota", type: "city", state: "FL" },

  // FL Counties
  { name: "Miami-Dade County", type: "county", state: "FL" },
  { name: "Broward County", type: "county", state: "FL" },
  { name: "Palm Beach County", type: "county", state: "FL" },
  { name: "Orange County", type: "county", state: "FL" },
  { name: "Hillsborough County", type: "county", state: "FL" },

  // TX Cities
  { name: "San Antonio", type: "city", state: "TX" },
  { name: "Fort Worth", type: "city", state: "TX" },
  { name: "El Paso", type: "city", state: "TX" },
  { name: "Plano", type: "city", state: "TX" },
  { name: "Galveston", type: "city", state: "TX" },
  { name: "Corpus Christi", type: "city", state: "TX" },
  { name: "Fredericksburg", type: "city", state: "TX" },

  // IL Cities
  { name: "Naperville", type: "city", state: "IL" },
  { name: "Evanston", type: "city", state: "IL" },
  { name: "Oak Park", type: "village", state: "IL" },
  { name: "Schaumburg", type: "village", state: "IL" },
  { name: "Springfield", type: "city", state: "IL" },

  // MA Cities
  { name: "Cambridge", type: "city", state: "MA" },
  { name: "Salem", type: "city", state: "MA" },
  { name: "Plymouth", type: "city", state: "MA" },
  { name: "Provincetown", type: "city", state: "MA" },
  { name: "Nantucket", type: "city", state: "MA" },
  { name: "Martha's Vineyard", type: "region", state: "MA" },

  // PA Cities
  { name: "Pittsburgh", type: "city", state: "PA" },
  { name: "Lancaster", type: "city", state: "PA" },
  { name: "Gettysburg", type: "city", state: "PA" },
  { name: "Bethlehem", type: "city", state: "PA" },

  // CO Cities
  { name: "Boulder", type: "city", state: "CO" },
  { name: "Colorado Springs", type: "city", state: "CO" },
  { name: "Aspen", type: "city", state: "CO" },
  { name: "Vail", type: "village", state: "CO" },
  { name: "Telluride", type: "city", state: "CO" },

  // GA Cities
  { name: "Savannah", type: "city", state: "GA" },
  { name: "Augusta", type: "city", state: "GA" },

  // TN Cities
  { name: "Memphis", type: "city", state: "TN" },
  { name: "Knoxville", type: "city", state: "TN" },
  { name: "Chattanooga", type: "city", state: "TN" },
  { name: "Gatlinburg", type: "city", state: "TN" },
  { name: "Pigeon Forge", type: "city", state: "TN" },

  // NV Cities
  { name: "Reno", type: "city", state: "NV" },
  { name: "Henderson", type: "city", state: "NV" },

  // WA Cities
  { name: "Tacoma", type: "city", state: "WA" },
  { name: "Bellevue", type: "city", state: "WA" },
  { name: "Spokane", type: "city", state: "WA" },

  // OR Cities
  { name: "Eugene", type: "city", state: "OR" },
  { name: "Bend", type: "city", state: "OR" },
  { name: "Ashland", type: "city", state: "OR" },

  // LA Cities
  { name: "Baton Rouge", type: "city", state: "LA" },
  { name: "Lafayette", type: "city", state: "LA" },

  // AZ Cities
  { name: "Scottsdale", type: "city", state: "AZ" },
  { name: "Tucson", type: "city", state: "AZ" },
  { name: "Sedona", type: "city", state: "AZ" },
  { name: "Flagstaff", type: "city", state: "AZ" },

  // HI Cities
  { name: "Honolulu", type: "city", state: "HI", popular: true },
  { name: "Maui", type: "region", state: "HI" },
  { name: "Kailua-Kona", type: "city", state: "HI" },
  { name: "Lahaina", type: "city", state: "HI" },

  // SC Cities
  { name: "Charleston", type: "city", state: "SC" },
  { name: "Myrtle Beach", type: "city", state: "SC" },
  { name: "Hilton Head Island", type: "city", state: "SC" },

  // NC Cities
  { name: "Charlotte", type: "city", state: "NC" },
  { name: "Raleigh", type: "city", state: "NC" },
  { name: "Asheville", type: "city", state: "NC" },
  { name: "Wilmington", type: "city", state: "NC" },

  // VA Cities
  { name: "Virginia Beach", type: "city", state: "VA" },
  { name: "Richmond", type: "city", state: "VA" },
  { name: "Alexandria", type: "city", state: "VA" },
  { name: "Arlington", type: "county", state: "VA" },

  // MD Cities
  { name: "Baltimore", type: "city", state: "MD" },
  { name: "Annapolis", type: "city", state: "MD" },
  { name: "Bethesda", type: "city", state: "MD" },
  { name: "Ocean City", type: "city", state: "MD" },

  // MN Cities
  { name: "Minneapolis", type: "city", state: "MN" },
  { name: "St. Paul", type: "city", state: "MN" },
  { name: "Duluth", type: "city", state: "MN" },

  // MI Cities
  { name: "Detroit", type: "city", state: "MI" },
  { name: "Ann Arbor", type: "city", state: "MI" },
  { name: "Grand Rapids", type: "city", state: "MI" },
  { name: "Traverse City", type: "city", state: "MI" },

  // OH Cities
  { name: "Columbus", type: "city", state: "OH" },
  { name: "Cleveland", type: "city", state: "OH" },
  { name: "Cincinnati", type: "city", state: "OH" },

  // MO Cities
  { name: "St. Louis", type: "city", state: "MO" },
  { name: "Kansas City", type: "city", state: "MO" },
  { name: "Branson", type: "city", state: "MO" },

  // WI Cities
  { name: "Milwaukee", type: "city", state: "WI" },
  { name: "Madison", type: "city", state: "WI" },
  { name: "Door County", type: "county", state: "WI" },

  // CT Cities
  { name: "Hartford", type: "city", state: "CT" },
  { name: "New Haven", type: "city", state: "CT" },
  { name: "Stamford", type: "city", state: "CT" },
  { name: "Greenwich", type: "city", state: "CT" },
  { name: "Mystic", type: "village", state: "CT" },

  // UT Cities
  { name: "Salt Lake City", type: "city", state: "UT" },
  { name: "Park City", type: "city", state: "UT" },
  { name: "Moab", type: "city", state: "UT" },

  // IN Cities
  { name: "Indianapolis", type: "city", state: "IN" },
  { name: "Bloomington", type: "city", state: "IN" },

  // KY Cities
  { name: "Louisville", type: "city", state: "KY" },
  { name: "Lexington", type: "city", state: "KY" },

  // AL Cities
  { name: "Birmingham", type: "city", state: "AL" },
  { name: "Mobile", type: "city", state: "AL" },
  { name: "Gulf Shores", type: "city", state: "AL" },

  // ME Cities
  { name: "Portland", type: "city", state: "ME" },
  { name: "Bar Harbor", type: "city", state: "ME" },
  { name: "Kennebunkport", type: "village", state: "ME" },

  // RI Cities
  { name: "Providence", type: "city", state: "RI" },
  { name: "Newport", type: "city", state: "RI" },

  // NM Cities
  { name: "Santa Fe", type: "city", state: "NM" },
  { name: "Albuquerque", type: "city", state: "NM" },
  { name: "Taos", type: "city", state: "NM" },

  // ID Cities
  { name: "Boise", type: "city", state: "ID" },
  { name: "Sun Valley", type: "city", state: "ID" },
  { name: "Coeur d'Alene", type: "city", state: "ID" },

  // MT Cities
  { name: "Bozeman", type: "city", state: "MT" },
  { name: "Whitefish", type: "city", state: "MT" },
  { name: "Missoula", type: "city", state: "MT" },

  // WY Cities
  { name: "Jackson Hole", type: "city", state: "WY" },
  { name: "Yellowstone", type: "region", state: "WY" },

  // AK Cities
  { name: "Anchorage", type: "city", state: "AK" },
  { name: "Juneau", type: "city", state: "AK" },

  // VT Cities
  { name: "Burlington", type: "city", state: "VT" },
  { name: "Stowe", type: "village", state: "VT" },

  // NH Cities
  { name: "Portsmouth", type: "city", state: "NH" },
  { name: "North Conway", type: "village", state: "NH" },

  // MS Cities
  { name: "Biloxi", type: "city", state: "MS" },
  { name: "Natchez", type: "city", state: "MS" },

  // AR Cities
  { name: "Hot Springs", type: "city", state: "AR" },
  { name: "Little Rock", type: "city", state: "AR" },
  { name: "Eureka Springs", type: "city", state: "AR" },

  // NE Cities
  { name: "Omaha", type: "city", state: "NE" },
  { name: "Lincoln", type: "city", state: "NE" },

  // OK Cities
  { name: "Oklahoma City", type: "city", state: "OK" },
  { name: "Tulsa", type: "city", state: "OK" },

  // IA Cities
  { name: "Des Moines", type: "city", state: "IA" },
  { name: "Iowa City", type: "city", state: "IA" },

  // KS Cities
  { name: "Wichita", type: "city", state: "KS" },

  // SD Cities
  { name: "Rapid City", type: "city", state: "SD" },
  { name: "Deadwood", type: "city", state: "SD" },

  // ND Cities
  { name: "Fargo", type: "city", state: "ND" },

  // WV Cities
  { name: "Charleston", type: "city", state: "WV" },

  // DE Cities
  { name: "Wilmington", type: "city", state: "DE" },
  { name: "Rehoboth Beach", type: "city", state: "DE" },
];

const TYPE_ICONS: Record<string, string> = {
  city: "🏙️",
  borough: "🏛️",
  county: "📍",
  village: "🏘️",
  neighborhood: "📌",
  region: "🗺️",
};

export function getTypeIcon(type: string): string {
  return TYPE_ICONS[type] || "📍";
}

// State display names & icons
const STATE_DISPLAY: Record<string, { name: string; icon: string }> = {
  NY: { name: "New York", icon: "🗽" },
  NJ: { name: "New Jersey", icon: "🌊" },
  CA: { name: "California", icon: "☀️" },
  FL: { name: "Florida", icon: "🌴" },
  TX: { name: "Texas", icon: "⛤" },
  IL: { name: "Illinois", icon: "🌆" },
  MA: { name: "Massachusetts", icon: "🎓" },
  PA: { name: "Pennsylvania", icon: "🔔" },
  CO: { name: "Colorado", icon: "⛰️" },
  GA: { name: "Georgia", icon: "🍑" },
  TN: { name: "Tennessee", icon: "🎵" },
  NV: { name: "Nevada", icon: "🎰" },
  WA: { name: "Washington", icon: "🌲" },
  OR: { name: "Oregon", icon: "🦫" },
  LA: { name: "Louisiana", icon: "⚜️" },
  AZ: { name: "Arizona", icon: "🌵" },
  HI: { name: "Hawaii", icon: "🏝️" },
  SC: { name: "South Carolina", icon: "🌙" },
  NC: { name: "North Carolina", icon: "🏔️" },
  VA: { name: "Virginia", icon: "🏛️" },
  MD: { name: "Maryland", icon: "🦀" },
  DC: { name: "Washington D.C.", icon: "🏛️" },
};

export function getStateDisplay(state: string): { name: string; icon: string } {
  return STATE_DISPLAY[state] || { name: state, icon: "📍" };
}

export function searchLocations(query: string, limit = 8): USLocation[] {
  if (!query.trim()) {
    return US_LOCATIONS.filter(l => l.popular).slice(0, limit);
  }
  const q = query.toLowerCase();
  const exact: USLocation[] = [];
  const starts: USLocation[] = [];
  const contains: USLocation[] = [];

  for (const loc of US_LOCATIONS) {
    const full = `${loc.name} ${loc.state}`.toLowerCase();
    if (full === q) exact.push(loc);
    else if (loc.name.toLowerCase().startsWith(q) || loc.state.toLowerCase() === q) starts.push(loc);
    else if (full.includes(q)) contains.push(loc);
  }
  return [...exact, ...starts, ...contains].slice(0, limit);
}
