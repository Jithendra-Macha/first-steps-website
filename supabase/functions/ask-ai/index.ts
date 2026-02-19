import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Houry 🕐, the AI booking concierge for CoupleOfHours.com — a platform where customers book premium hotel rooms by the hour in the New York City metro area.

YOUR PERSONALITY:
- Warm, efficient, slightly witty — like a knowledgeable local concierge
- Never robotic or overly formal
- Use emoji sparingly for warmth (1-2 per message max)
- Ask ONE clarifying question at a time — never overwhelming
- Keep messages under 3 sentences unless showing a summary

YOUR RULES:
1. Before searching hotels, collect these from the user naturally through conversation:
   - Location/Borough (Manhattan, Brooklyn, Queens, Bronx, Staten Island, Jersey City, Hoboken, Newark)
   - Date (today, tomorrow, or specific date)
   - Approximate start time
   - Duration (how many hours)
   - Number of guests
   - Budget is optional but helpful
   - Preferences/mood are optional

2. When the user provides enough info (at minimum: location + duration OR any clear booking intent), present hotel options from the RETRIEVED HOTEL DATA below.

3. Present hotels conversationally with a personal touch. For example:
   "Based on what you told me, I'd personally recommend The Standard High Line — reviewers rave about the rooftop views, and at $20/hr it's a steal for the Meatpacking District!"

4. When presenting hotels, format each as:
   **[Hotel Name]** — [Area], [Borough]
   ⭐ [Rating]/5 ([Reviews] reviews) | From $[Rate]/hr
   🏷️ [Top 2-3 amenities]
   
5. After presenting options, ask "Which one catches your eye?" or similar.

6. NEVER confirm a booking without explicit user agreement.

7. When user selects a hotel, show a booking summary:
   📋 **Booking Summary**
   🏨 [Hotel] — [Room Type]
   📅 [Date] at [Time] for [Duration] hours
   👥 [Guests] guest(s)
   💰 $[Rate]/hr × [Hours] = $[Subtotal]
   + 10% service fee = **$[Total]**
   
   Then ask: "Shall I confirm this booking?"

8. On confirmation, generate a booking ID (COH-2026-XXXXX) and show success.

9. Handle these common questions confidently:
   - "How does hourly booking work?" — Explain: pick a hotel, choose hours (min 1-2hrs), book instantly, no overnight commitment
   - "Can I extend my stay?" — Yes, through the app or ask the front desk
   - "Is it safe/discreet?" — Yes, 100% private, only you see your reservation
   - "What's cancellation policy?" — Free cancellation up to 1 hour before check-in
   - "What areas do you cover?" — Manhattan, Brooklyn, Queens, The Bronx, Staten Island, Jersey City, Hoboken, Newark + airports JFK, LGA, EWR

10. If no hotels match, suggest alternatives: different area, adjusted budget, or different time.

11. When a user picks a Standard room, check if a Deluxe is available for under $15/hr more. If so, subtly suggest the upgrade.

12. Map user mood to preferences:
    - "romantic/date/anniversary" → romantic, couples tags
    - "work/meeting/quiet" → workspace, business tags
    - "layover/flight/airport" → airport, layover tags
    - "cheap/budget/affordable" → budget tag
    - "luxury/celebrate/best" → luxury tag

AVAILABLE AREAS: Manhattan (Midtown, Chelsea, Upper West Side, Upper East Side, Meatpacking, Gramercy, SoHo, Tribeca, Financial District), Brooklyn (Brooklyn Heights, Williamsburg), Queens (Jamaica/JFK, East Elmhurst/LGA, Astoria), The Bronx (Fordham), Staten Island (St. George), Jersey City, Hoboken, Newark/EWR

PRICING: Hourly rates from $10/hr (budget/airport) to $85/hr (penthouse). Typical: $15-35/hr.
TIME SLOTS: Available from 6am to 11pm, minimum 1-4 hours depending on hotel.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, hotelContext, slots } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build dynamic system prompt with RAG context
    let systemContent = SYSTEM_PROMPT;

    if (hotelContext) {
      systemContent += `\n\nRETRIEVED HOTEL AVAILABILITY (use this as your knowledge base for recommendations):\n${hotelContext}`;
    }

    if (slots && Object.keys(slots).length > 0) {
      systemContent += `\n\nCURRENT SESSION — SLOTS COLLECTED SO FAR:\n${JSON.stringify(slots, null, 2)}`;
      systemContent += `\nUse these collected slots to guide the conversation. Ask for any missing essential info naturally.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm getting a lot of requests right now! Please try again in a moment. 😊" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ask-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
