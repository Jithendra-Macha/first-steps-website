export interface Hotel {
  id: number;
  name: string;
  addr: string;
  stars: number;
  rating: number;
  reviews: number;
  rate: number;
  origRate: number | null;
  discount: string | null;
  avail: string;
  availTxt: string;
  featured: boolean;
  amenities: string[];
  tags: [string, string][];
  photoBg: string;
  lng: number;
  lat: number;
}

export interface Deal {
  id: number;
  name: string;
  location: string;
  rate: number;
  origRate: number;
  badge: string;
  rating: number;
  reviews: number;
  h: number;
  m: number;
  bg: string;
}

export interface Zone {
  key: string;
  emoji: string;
  name: string;
  count: number;
  bg: string;
  fill: string;
}

export interface Occasion {
  emoji: string;
  label: string;
  desc: string;
}

export const HOTELS: Hotel[] = [
  { id:1, name:"The Plaza Hotel", addr:"768 5th Ave, Midtown", stars:5, rating:4.9, reviews:2841, rate:28, origRate:43, discount:"-35%", avail:"hot", availTxt:"⚡ Only 2 rooms left!", featured:true, amenities:["WiFi","Spa","City View","Room Service","Pool"], tags:[["g","✓ Free Cancel"],["b","💑 Couples"],["o","🔥 Hot Deal"]], photoBg:"linear-gradient(155deg,#0a1628 0%,#1a2e50 30%,#2a4a7a 55%,#b8966e 85%,#d4b483 100%)", lng:-73.9743, lat:40.7645 },
  { id:2, name:"Chelsea Boutique Hotel", addr:"255 W 23rd St, Chelsea", stars:4, rating:4.7, reviews:1198, rate:21, origRate:null, discount:null, avail:"yes", availTxt:"✓ Available", featured:false, amenities:["WiFi","Rooftop Bar","Gym","Breakfast"], tags:[["g","✓ Free Cancel"],["b","💑 Couples"]], photoBg:"linear-gradient(155deg,#0e1e12 0%,#1a3a20 35%,#2a5a30 60%,#6a9a70 85%,#9abfa0 100%)", lng:-73.9985, lat:40.7446 },
  { id:3, name:"Mandarin Oriental NYC", addr:"80 Columbus Circle, Upper West", stars:5, rating:4.8, reviews:3407, rate:32, origRate:40, discount:"-20%", avail:"pop", availTxt:"🔥 Popular today!", featured:false, amenities:["Pool","Spa","Gym","City View","Jacuzzi"], tags:[["b","💑 Couples"],["y","⭐ Luxury"]], photoBg:"linear-gradient(155deg,#16082a 0%,#2e1050 30%,#4a1870 55%,#8a40b0 80%,#c880e8 100%)", lng:-73.9819, lat:40.7690 },
  { id:4, name:"Grand Hyatt New York", addr:"109 E 42nd St, Midtown East", stars:4, rating:4.6, reviews:1554, rate:18, origRate:28, discount:"-35%", avail:"yes", availTxt:"✓ Available", featured:false, amenities:["WiFi","Bar","Meeting Room","AC","Parking"], tags:[["o","🔥 Flash Deal"],["n","💼 Business"]], photoBg:"linear-gradient(155deg,#180e04 0%,#3a2008 30%,#5a3410 55%,#9a6820 80%,#c89040 100%)", lng:-73.9760, lat:40.7527 },
  { id:5, name:"The Standard High Line", addr:"848 Washington St, Meatpacking", stars:5, rating:4.9, reviews:2280, rate:24, origRate:40, discount:"-40%", avail:"hot", availTxt:"⚡ 1 room left!", featured:false, amenities:["WiFi","Rooftop","Bar","Spa","City View"], tags:[["o","🔥 Best Deal"],["b","💑 Couples"]], photoBg:"linear-gradient(155deg,#060e18 0%,#0a1e30 30%,#0e2e50 55%,#1a5080 80%,#2a80c0 100%)", lng:-74.0079, lat:40.7408 },
  { id:6, name:"Tribeca Loft Suites", addr:"200 Church St, Tribeca", stars:4, rating:4.5, reviews:832, rate:16, origRate:null, discount:null, avail:"yes", availTxt:"✓ Available", featured:false, amenities:["WiFi","Gym","Hudson View","AC"], tags:[["g","✓ Free Cancel"]], photoBg:"linear-gradient(155deg,#060e0a 0%,#0e2018 30%,#163428 55%,#2a6050 80%,#4a9878 100%)", lng:-74.0090, lat:40.7163 },
  { id:7, name:"Gramercy Park Hotel", addr:"2 Lexington Ave, Gramercy", stars:5, rating:4.8, reviews:3365, rate:29, origRate:null, discount:null, avail:"yes", availTxt:"✓ Available", featured:false, amenities:["Pool","Spa","Bar","Rooftop","City View"], tags:[["b","💑 Couples"],["y","⭐ Luxury"]], photoBg:"linear-gradient(155deg,#120406 0%,#200810 30%,#380a18 55%,#680f2a 80%,#a01840 100%)", lng:-73.9857, lat:40.7381 },
  { id:8, name:"The Carlyle Hotel", addr:"35 E 76th St, Upper East Side", stars:5, rating:4.7, reviews:2121, rate:19, origRate:25, discount:"-25%", avail:"pop", availTxt:"🔥 Popular!", featured:false, amenities:["WiFi","Pool","Spa","Gym","Bar"], tags:[["o","🔥 Flash Deal"],["b","💑 Couples"]], photoBg:"linear-gradient(155deg,#180406 0%,#300810 30%,#500a18 55%,#881828 80%,#c03040 100%)", lng:-73.9635, lat:40.7745 },
];

export const DEALS_DATA: Deal[] = [
  { id:1, name:"The Midtown Grand", location:"Midtown, Manhattan", rate:22, origRate:44, badge:"50% OFF", rating:4.8, reviews:120, h:3, m:42, bg:"linear-gradient(160deg,#0d2137,#1e3f66)" },
  { id:2, name:"Brooklyn Heights Hotel", location:"Brooklyn Heights, NY", rate:18, origRate:32, badge:"Deal", rating:4.6, reviews:89, h:5, m:10, bg:"linear-gradient(160deg,#0d2b1a,#1a4a2d)" },
  { id:3, name:"LGA Airport Suite", location:"East Elmhurst, Queens", rate:15, origRate:28, badge:"Hot", rating:4.5, reviews:204, h:2, m:55, bg:"linear-gradient(160deg,#1a1a2e,#2e2e5a)" },
  { id:4, name:"Jersey City Escape", location:"Jersey City, NJ", rate:12, origRate:20, badge:"40% OFF", rating:4.4, reviews:67, h:6, m:18, bg:"linear-gradient(160deg,#0d2610,#1a4420)" },
];

export const ZONE_DATA: Zone[] = [
  { key:"manhattan", emoji:"🗽", name:"Manhattan", count:42, bg:"linear-gradient(155deg,#0a1628,#2a4a7a 55%,#b8966e)", fill:"rgba(180,200,255,.85)" },
  { key:"brooklyn", emoji:"🌉", name:"Brooklyn", count:28, bg:"linear-gradient(155deg,#16082a,#4a1870 55%,#c880e8)", fill:"rgba(200,160,255,.85)" },
  { key:"queens", emoji:"✈️", name:"Queens", count:35, bg:"linear-gradient(155deg,#00142e,#0066cc)", fill:"rgba(120,180,255,.85)" },
  { key:"bronx", emoji:"🏟️", name:"The Bronx", count:14, bg:"linear-gradient(155deg,#0a1a08,#2d6e18)", fill:"rgba(140,220,120,.85)" },
  { key:"nj", emoji:"🌿", name:"New Jersey", count:31, bg:"linear-gradient(155deg,#1a1008,#7a5a10)", fill:"rgba(255,200,100,.85)" },
];

export const OCC_DATA: Occasion[] = [
  { emoji:"💑", label:"Romantic Escape", desc:"Surprise your partner with a luxury afternoon, no overnight costs." },
  { emoji:"✈️", label:"Layover Rest", desc:"Sleep comfortably between connecting flights." },
  { emoji:"💼", label:"Business Meeting", desc:"Professional private space with fast WiFi and a quiet environment." },
  { emoji:"🎂", label:"Celebration", desc:"Mark the moment in a beautiful hotel suite." },
  { emoji:"🧘", label:"Day Retreat", desc:"Spa access, pool and full relaxation in a 5-star room." },
  { emoji:"🏠", label:"Local Staycation", desc:"Escape the routine without leaving the city." },
  { emoji:"🎭", label:"Pre-Event Prep", desc:"Get ready in a luxury room before a gala or show." },
  { emoji:"🌙", label:"Late-Night Stay", desc:"A private, safe room whenever you need it most." },
];

export const WHY_CARDS = [
  { ibg:"linear-gradient(135deg,#fff2ee,#ffe0d0)", icon:"⏰", title:"Book any duration", desc:"2 hours to 12 hours — whatever you need. Check in at any time, day or night.", stat:"From $15/hr" },
  { ibg:"linear-gradient(135deg,#e8f0fe,#d4e2fc)", icon:"🔒", title:"100% private & discreet", desc:"No questions asked. Your booking is completely private — only you see your reservation.", stat:"No credit card hold on arrival" },
  { ibg:"linear-gradient(135deg,#e8f8f0,#d0f0e0)", icon:"✅", title:"Instant confirmation", desc:"Book online and get confirmed within seconds. No waiting, no back-and-forth calls.", stat:"Confirmed in <10 seconds" },
  { ibg:"linear-gradient(135deg,#fffbe6,#fff3be)", icon:"⭐", title:"Verified 4 & 5-star hotels", desc:"Every hotel is vetted and rated. Full amenities — same rooms as regular guests, lower price.", stat:"4.7 avg guest rating" },
];
