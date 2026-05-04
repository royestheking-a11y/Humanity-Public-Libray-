import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "sonner";
import { MessageCircle, X, Send, Bot } from "lucide-react";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! Welcome to Humanity Public Library. How can I help you today?", time: "Now" },
  ]);

  const botReplies = [
    "I'm here to help! You can browse our library of 52,000+ free books.",
    "To access audiobooks, visit the Inclusive Education section. 🎧",
    "Donations fund free books for visually impaired students. Visit our Donate page! 💛",
    "For volunteer opportunities, check out our Volunteer Platform. 🤝",
    "You can reach our team at info@hpl.org.bd for more help.",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input, time: "Now" };
    const botMsg = { from: "bot", text: botReplies[Math.floor(Math.random() * botReplies.length)], time: "Now" };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 1000);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-50 w-80 md:w-96 rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)" }}
          >
            {/* Chat Header */}
            <div className="p-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Bot size={20} style={{ color: "#ffffff" }} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>HPL Support</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Online now</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>
            {/* Messages */}
            <div className="p-4 space-y-3 h-56 md:h-80 overflow-y-auto" style={{ background: "#F3F4F6" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-2xl text-sm"
                    style={{
                      background: msg.from === "user" ? "#2563EB" : "#fff",
                      color: msg.from === "user" ? "#fff" : "#060F1E",
                      borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="p-3 flex gap-2 border-t border-gray-100">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #e5e7eb", fontFamily: "'Inter', sans-serif" }}
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl"
        style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open live support chat"
      >
        {open ? <X className="w-6 h-6 md:w-7 md:h-7 text-white" /> : <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />}
      </motion.button>
    </>
  );
}

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif", background: "#FAFAFA" }}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#060F1E",
            border: "1px solid rgba(37,99,235,0.3)",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </div>
  );
}