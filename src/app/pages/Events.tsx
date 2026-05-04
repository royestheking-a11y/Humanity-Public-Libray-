import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Users, Clock, ArrowRight, Check, Star, Monitor, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { toast } from "sonner";
import { PageSkeleton } from "../components/Skeleton";

export default function Events() {
  const [filter, setFilter] = useState("All");
  const [registered, setRegistered] = useState<string[]>([]);
  const { events, isLoading } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  if (isLoading) return <PageSkeleton />;

  const filtered = filter === "All" ? events : events.filter((e: any) => e.type === filter);

  const handleRegister = (eventId: string, title: string) => {
    if (registered.includes(eventId)) {
      setRegistered((prev) => prev.filter((id) => id !== eventId));
      toast(`Unregistered from ${title}`);
    } else {
      setRegistered((prev) => [...prev, eventId]);
      toast(`🎉 Registered for ${title}! Check your email.`);
    }
  };

  const featured = events.filter((e: any) => e.featured);
  const regular = events.filter((e: any) => !e.featured);

  return (
    <div className="min-h-screen pt-16" style={{ background: "#FAFAFA" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600 }}>{t("events.label")}</p>
            <h1 className="text-white mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {t("events.title")}
            </h1>
            <p className="text-white/60" style={{ fontFamily: F }}>{t("events.subtitle")}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {["All", "In-Person", "Online", "Hybrid"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all"
              style={{
                background: filter === type ? "#2563EB" : "#fff",
                color: filter === type ? "#fff" : "#6B7280",
                border: filter === type ? "none" : "1px solid #e5e7eb",
                fontFamily: F,
                boxShadow: filter === type ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
              }}
            >
              {type === "In-Person" ? <MapPin size={14} /> : type === "Online" ? <Monitor size={14} /> : type === "Hybrid" ? <Globe size={14} /> : null}
              {type === "All" ? "All Events" : type}
            </button>
          ))}
        </div>

        {/* Featured Events */}
        {filter === "All" && (
          <div className="mb-10">
            <h2 className="flex items-center gap-2 mb-5" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.3rem", color: "#060F1E" }}>
              <span className="text-xl">✨</span> {t("events.featured")}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((event, i) => (
                <motion.div
                  key={event._id || event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-3xl overflow-hidden mb-8 hover:-translate-y-1 transition-all duration-300"
                  style={{ background: "#fff", boxShadow: "0 8px 40px rgba(37,99,235,0.12)" }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.cover}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: event.type === "Online" ? "rgba(37,99,235,0.9)" : "rgba(34,197,94,0.9)", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
                        {event.type === "In-Person" ? <MapPin size={12} /> : event.type === "Online" ? <Monitor size={12} /> : <Globe size={12} />} {event.type}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(96,165,250,0.9)", color: "#060F1E", fontFamily: "'Inter', sans-serif" }}>
                        <Star size={12} className="fill-blue-900" /> Featured ✨
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white mb-2" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3 text-white/80 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {event.date}</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {event.attendees.toLocaleString()} going</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <MapPin size={12} className="text-[#2563EB]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {/* Attendance progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span>{event.attendees.toLocaleString()} registered</span>
                        <span>{event.capacity.toLocaleString()} capacity</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100">
                        <div className="h-full rounded-full" style={{ width: `${(event.attendees / event.capacity) * 100}%`, background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRegister(event._id || event.id || "", event.title)}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                      style={{
                        background: registered.includes(event._id || event.id || "") ? "linear-gradient(135deg, #22C55E, #16a34a)" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                        color: "#fff",
                        fontFamily: F,
                      }}
                    >
                      {registered.includes(event._id || event.id || "") ? <><Check size={16} /> Registered! 🎉</> : <><ArrowRight size={16} /> Register Now</>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events */}
        <div>
          {filter === "All" && (
            <h2 className="flex items-center gap-2 mb-5" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.3rem", color: "#060F1E" }}>
              <span className="text-xl">📅</span> {t("events.upcoming")}
            </h2>
          )}
          <div className="space-y-4">
            {(filter === "All" ? regular : filtered).map((event: any, i: number) => (
              <motion.div
                key={event._id || event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex flex-col md:flex-row gap-5 p-5 rounded-2xl bg-white hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.05)" }}
              >
                <div className="md:w-36 h-24 md:h-auto rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={event.cover} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2 flex-wrap">
                    <h3 style={{ fontFamily: FH, fontWeight: 600, fontSize: "1.05rem", color: "#060F1E" }}>{event.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: event.type === "Online" ? "#2563EB15" : event.type === "Hybrid" ? "#7C3AED15" : "#22C55E15", color: event.type === "Online" ? "#2563EB" : event.type === "Hybrid" ? "#7C3AED" : "#22C55E", fontFamily: "'Inter', sans-serif" }}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {event.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {event.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /></span>
                    <span className="flex items-center gap-1"><Users size={11} /> {event.attendees.toLocaleString()} going</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{event.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {event.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(37,99,235,0.08)", color: "#2563EB", fontFamily: F }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex md:flex-col gap-3 md:w-32 justify-between md:justify-center">
                  <div className="text-center hidden md:block">
                    <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Spots left</p>
                    <p className="font-bold" style={{ fontFamily: FH, color: "#2563EB" }}>{(event.capacity - event.attendees).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleRegister(event._id || event.id || "", event.title)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
                    style={{
                      background: registered.includes(event._id || event.id || "") ? "linear-gradient(135deg, #22C55E, #16a34a)" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                      color: "#fff",
                      fontFamily: F,
                    }}
                  >
                    {registered.includes(event._id || event.id || "") ? <><Check size={14} /> Registered</> : <><ArrowRight size={14} /> Register</>}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}