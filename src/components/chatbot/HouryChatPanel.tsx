import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Send, Clock, RotateCcw } from "lucide-react";
import { searchHotels, formatResultsForAI } from "@/lib/hotelSearch";
import {
  type ChatMessage, type BookingSlots, type ConversationStep,
  getConversationState, saveConversationState, clearConversation,
  detectMoodTags, detectAirport, detectBorough, generateBookingId,
} from "@/lib/conversationManager";
import ReactMarkdown from "react-markdown";

const CORAL = "#E8705A";
const NAVY = "#0d1f38";
const ASK_AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-ai`;

const CONVERSATION_STARTERS = [
  "Find me a room in Manhattan this afternoon",
  "I need a quiet workspace for 2 hours",
  "Something romantic tonight for two",
  "Hotels near JFK for a layover",
];

// ─── Typing Indicator ───
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex items-center gap-1 bg-[#FFF0EC] rounded-2xl rounded-bl-sm px-4 py-3">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: CORAL }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Quick Reply Chips ───
function QuickReplies({ replies, onSelect }: { replies: string[]; onSelect: (r: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {replies.map(r => (
        <button
          key={r}
          onClick={() => onSelect(r)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:scale-105"
          style={{ borderColor: CORAL, color: CORAL, background: "#FFF8F6" }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

// ─── Chat Message Bubble ───
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-4 mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
          style={{ background: CORAL }}>
          <Clock size={14} color="#fff" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-2xl rounded-br-sm text-white"
            : "rounded-2xl rounded-bl-sm"
        }`}
        style={{
          background: isUser ? NAVY : "#FFF0EC",
          color: isUser ? "#fff" : "#1a1a1a",
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        {isUser ? (
          msg.content
        ) : (
          <div className="prose prose-sm max-w-none [&_p]:m-0 [&_strong]:font-bold [&_ul]:mt-1 [&_li]:text-sm">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Conversation Starters ───
function ConversationStarters({ onSelect }: { onSelect: (s: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2" style={{ background: CORAL }}>
        <Clock size={28} color="#fff" />
      </div>
      <h3 className="text-lg font-bold text-foreground">Hi! I'm Houry 🕐</h3>
      <p className="text-sm text-muted-foreground text-center max-w-[280px]">
        Your personal booking assistant. Tell me what you need and I'll find the perfect hourly hotel for you!
      </p>
      <div className="flex flex-col gap-2 w-full mt-2">
        {CONVERSATION_STARTERS.map(s => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="text-left text-sm px-4 py-3 rounded-xl border transition-all hover:shadow-md hover:scale-[1.02]"
            style={{ borderColor: "#f0e0dc", background: "#FFF8F6", color: "#333" }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Chat Panel ───
export default function HouryChatPanel({
  open,
  onClose,
  onMinimize,
  fullPage = false,
}: {
  open: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  fullPage?: boolean;
}) {
  const [state, setState] = useState(getConversationState);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, slots, step } = state;

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    saveConversationState(state);
  }, [state]);

  const updateSlots = useCallback((text: string, currentSlots: BookingSlots): BookingSlots => {
    const updated = { ...currentSlots };
    const borough = detectBorough(text);
    if (borough) updated.borough = borough;
    const airport = detectAirport(text);
    if (airport) updated.nearAirport = airport;
    const tags = detectMoodTags(text);
    if (tags.length > 0) updated.preferences = [...(updated.preferences || []), ...tags];

    // Duration detection
    const durMatch = text.match(/(\d+)\s*(?:hours?|hrs?)/i);
    if (durMatch) updated.durationHours = parseInt(durMatch[1]);

    // Guest detection
    const guestMatch = text.match(/(\d+)\s*(?:guests?|people|persons?)/i);
    if (guestMatch) updated.guests = parseInt(guestMatch[1]);
    if (/\btwo\b/i.test(text) && !updated.guests) updated.guests = 2;

    // Budget detection
    const budgetMatch = text.match(/(?:under|below|less than|max)\s*\$?(\d+)/i);
    if (budgetMatch) updated.maxBudget = parseInt(budgetMatch[1]);

    return updated;
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newSlots = updateSlots(text, slots);

    // Run RAG search
    const searchResults = searchHotels({
      borough: newSlots.borough,
      area: newSlots.area,
      guests: newSlots.guests,
      maxBudgetPerHour: newSlots.maxBudget,
      tags: newSlots.preferences,
      nearAirport: newSlots.nearAirport,
      durationHours: newSlots.durationHours,
    });
    const hotelContext = formatResultsForAI(searchResults);

    const allMessages = [...messages, userMsg];
    setState(prev => ({
      ...prev,
      messages: allMessages,
      slots: newSlots,
      step: "collecting" as ConversationStep,
    }));
    setInput("");
    setLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(ASK_AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          hotelContext,
          slots: newSlots,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Something went wrong" }));
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, { role: "assistant", content: `⚠️ ${err.error || "Request failed"}` }],
        }));
        setLoading(false);
        return;
      }

      if (!resp.body) { setLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setState(prev => {
                const msgs = [...prev.messages];
                const last = msgs[msgs.length - 1];
                if (last?.role === "assistant") {
                  msgs[msgs.length - 1] = { ...last, content: assistantSoFar };
                } else {
                  msgs.push({ role: "assistant", content: assistantSoFar });
                }
                return { ...prev, messages: msgs };
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, { role: "assistant", content: "⚠️ Network error. Please try again." }],
      }));
    }
    setLoading(false);
  }, [messages, slots, loading, updateSlots]);

  const handleNewChat = useCallback(() => {
    clearConversation();
    setState({ messages: [], slots: {}, step: "greeting" });
  }, []);

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const isEmpty = messages.length === 0;

  const panelClasses = fullPage
    ? "flex flex-col h-full w-full bg-background"
    : "fixed bottom-20 right-6 z-[9999] w-[420px] max-w-[calc(100vw-24px)] h-[600px] max-h-[calc(100vh-100px)] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden";

  const mobileFullScreen = !fullPage
    ? "max-[640px]:!bottom-0 max-[640px]:!right-0 max-[640px]:!w-screen max-[640px]:!h-screen max-[640px]:!max-w-none max-[640px]:!max-h-none max-[640px]:!rounded-none"
    : "";

  return (
    <>
      {!fullPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998]"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={fullPage ? {} : { opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={fullPage ? {} : { opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`${panelClasses} ${mobileFullScreen}`}
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: CORAL }}>
            <Clock size={18} color="#fff" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-foreground">Houry</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={handleNewChat} className="p-2 rounded-lg hover:bg-muted transition-colors" title="New chat">
              <RotateCcw size={16} className="text-muted-foreground" />
            </button>
          )}
          {onMinimize && !fullPage && (
            <button onClick={onMinimize} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Minus size={16} className="text-muted-foreground" />
            </button>
          )}
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-4">
          {isEmpty ? (
            <ConversationStarters onSelect={send} />
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
            </>
          )}
        </div>

        {/* Quick Replies */}
        {!isEmpty && !loading && (
          <QuickReplies
            replies={getContextualReplies(messages, slots)}
            onSelect={send}
          />
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-border flex-shrink-0">
          <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground"
              style={{ fontFamily: "inherit", maxHeight: 80, lineHeight: 1.5 }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: input.trim() ? CORAL : "hsl(var(--muted-foreground) / 0.2)",
                cursor: input.trim() ? "pointer" : "default",
              }}
            >
              <Send size={14} color="#fff" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Powered by CoupleOfHours AI · Responses may vary
          </p>
        </div>
      </motion.div>
    </>
  );
}

// ─── Contextual Quick Replies ───
function getContextualReplies(messages: ChatMessage[], slots: BookingSlots): string[] {
  if (messages.length === 0) return [];
  const lastBot = [...messages].reverse().find(m => m.role === "assistant");
  if (!lastBot) return [];

  const content = lastBot.content.toLowerCase();

  if (!slots.borough) return ["Manhattan", "Brooklyn", "Near JFK", "Queens"];
  if (!slots.durationHours) return ["2 hours", "3 hours", "4 hours", "Just a quick stay"];
  if (!slots.guests) return ["Just me", "2 guests", "3 guests", "4 guests"];
  if (content.includes("shall i confirm") || content.includes("shall i book") || content.includes("want to book")) {
    return ["Yes, confirm!", "Modify", "Show more options"];
  }
  if (content.includes("which one") || content.includes("catches your eye")) {
    return ["Option 1", "Option 2", "Show more", "Different area"];
  }
  return ["Show cheaper options", "Different area", "Change time", "Help"];
}

// ─── Floating Widget Launcher ───
export function HouryWidgetLauncher({
  onClick,
  hasUnread,
}: {
  onClick: () => void;
  hasUnread: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9997] flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-white font-bold text-sm"
      style={{ background: CORAL, fontFamily: "'Nunito Sans', sans-serif" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15 }}
    >
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${CORAL}` }}
        animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <Clock size={18} />
      <span>Book by the Hour</span>
      <span>🕐</span>
      {hasUnread && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
          1
        </div>
      )}
    </motion.button>
  );
}
