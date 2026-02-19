import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Flag, ThumbsUp, Send } from "lucide-react";
import { REVIEWS, HOTEL_INFO } from "@/data/hotelManagerMockData";

export default function ManagerReviews() {
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<"all" | "published" | "pending" | "reported">("all");

  const avgRating = HOTEL_INFO.rating;
  const ratingBreakdown = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: REVIEWS.filter(rev => rev.rating === r).length,
    pct: Math.round((REVIEWS.filter(rev => rev.rating === r).length / REVIEWS.length) * 100),
  }));

  const filtered = activeFilter === "all" ? REVIEWS : REVIEWS.filter(r => r.status === activeFilter);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">{REVIEWS.length} reviews · {avgRating} average rating</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Rating Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{avgRating}</span>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={i >= Math.round(avgRating) ? "h-4 w-4 text-muted-foreground/30" : "h-4 w-4"} style={i < Math.round(avgRating) ? { color: "hsl(38, 92%, 50%)" } : undefined} fill={i < Math.round(avgRating) ? "hsl(38, 92%, 50%)" : "none"} />
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-1">{HOTEL_INFO.totalReviews} total reviews</p>
            </div>
            {ratingBreakdown.map(r => (
              <div key={r.stars} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-4">{r.stars}</span>
                <Star className="h-3 w-3" style={{ color: "hsl(38, 92%, 50%)" }} fill="hsl(38, 92%, 50%)" />
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "hsl(38, 92%, 50%)" }} />
                </div>
                <span className="text-[11px] text-muted-foreground w-8 text-right">{r.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border bg-card text-card-foreground">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Review Tips</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { tip: "Respond to all reviews within 24 hours to show guests you value feedback.", icon: "⏰" },
              { tip: "Thank positive reviewers specifically — mention what they enjoyed.", icon: "🙏" },
              { tip: "For negative reviews, acknowledge the issue, apologize, and explain how you'll improve.", icon: "💡" },
              { tip: "Never argue with a reviewer publicly. Take heated discussions to private messages.", icon: "🤝" },
              { tip: "Ask happy guests at checkout to leave a review. Timing matters!", icon: "⭐" },
            ].map((t, i) => (
              <div key={i} className="flex gap-3 items-start rounded-lg p-2.5 bg-muted/30">
                <span className="text-sm">{t.icon}</span>
                <p className="text-xs text-muted-foreground">{t.tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "published", "pending", "reported"] as const).map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors border ${
            activeFilter === f ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground border-transparent hover:bg-accent"
          }`}>{f} ({f === "all" ? REVIEWS.length : REVIEWS.filter(r => r.status === f).length})</button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map(review => (
          <Card key={review.id} className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground/80">{review.guestName}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i >= review.rating ? "text-muted-foreground/30" : ""}`} style={i < review.rating ? { color: "hsl(38, 92%, 50%)" } : undefined} fill={i < review.rating ? "hsl(38, 92%, 50%)" : "none"} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{review.roomType}</span>
                    {review.status === "reported" && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "hsla(0, 70%, 50%, 0.15)", color: "hsl(0, 70%, 60%)" }}>Reported</span>}
                  </div>
                  <p className="text-xs font-medium text-foreground/60 mt-1">{review.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground/60">
                    <span>{review.date}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{review.helpful} helpful</span>
                  </div>

                  {review.response && (
                    <div className="mt-3 rounded-lg p-3 bg-muted/30 border-l-2 border-primary">
                      <p className="text-[10px] text-muted-foreground mb-1">Your Response</p>
                      <p className="text-xs text-muted-foreground">{review.response}</p>
                    </div>
                  )}

                  {!review.response && (
                    <div className="mt-3 flex gap-2">
                      <Textarea
                        placeholder="Write a response..."
                        value={responseText[review.id] || ""}
                        onChange={e => setResponseText({ ...responseText, [review.id]: e.target.value })}
                        className="bg-muted/50 border-border text-xs min-h-[60px] flex-1"
                      />
                      <Button size="icon" className="h-10 w-10 shrink-0 text-primary-foreground bg-primary">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!review.response && (
                    <Button size="sm" variant="ghost" className="text-[10px] text-muted-foreground h-7"><MessageSquare className="h-3 w-3 mr-1" />Reply</Button>
                  )}
                  {review.status !== "reported" && (
                    <Button size="sm" variant="ghost" className="text-[10px] text-red-400/50 h-7"><Flag className="h-3 w-3 mr-1" />Report</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
