import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Headphones, Eye, Type, Volume2, Accessibility, Play, Pause,
  BookOpen, ArrowRight,
  Wifi, ShieldCheck, CheckCircle
} from "lucide-react";
// Removed static mock import
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { toast } from "sonner";

export default function InclusiveEducation() {
  const { books, highContrast, toggleHighContrast, largeFonts, toggleLargeFonts, dyslexicFont, toggleDyslexicFont } = useApp();
  const audioBooks = books.filter((b) => b.audioAvailable);
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingBook, setPlayingBook] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1.0);
  const [voiceGender, setVoiceGender] = useState<"male" | "female">("female");

  const handlePlay = (bookId: string) => {
    if (playingBook === bookId) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingBook(bookId);
      setIsPlaying(true);
      toast(`Now playing: ${books.find(b => (b._id === bookId || b.id === bookId))?.title}`);
    }
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: "#F0F6FF" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.4)" }}>
              <Accessibility size={15} style={{ color: "#60A5FA" }} />
              <span style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600, fontSize: "0.85rem" }}>
                {t("incl.label")}
              </span>
            </div>
            <h1 className="text-white mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {t("incl.title")}
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: F }}>
              {t("incl.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/library" className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", color: "#fff", fontFamily: F, boxShadow: "0 8px 24px rgba(96,165,250,0.3)" }}>
                <BookOpen size={16} /> {t("incl.getStarted")}
              </Link>
              <a href="#features" className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:bg-white/15"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontFamily: F }}>
                {t("incl.learnMore")} <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live Demo Controls */}
      <section className="py-12 px-6 bg-white" id="features">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#2563EB", fontFamily: F, fontWeight: 600 }}>Live Demo</p>
            <h2 style={{ fontFamily: FH, fontWeight: 700, color: "#060F1E", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              {isBn ? "এখনই পরীক্ষা করুন" : "Try It Right Now"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Eye,  label: t("access.highContrast"), val: highContrast, toggle: toggleHighContrast, color: "#2563EB" },
              { icon: Type, label: t("access.largeFonts"),   val: largeFonts,   toggle: toggleLargeFonts,   color: "#60A5FA" },
              { icon: BookOpen, label: t("access.openDyslexic"), val: dyslexicFont, toggle: toggleDyslexicFont, color: "#22C55E" },
            ].map(({ icon: Icon, label, val, toggle, color }) => (
              <motion.button key={label} onClick={toggle} whileHover={{ scale: 1.03 }}
                className="p-5 rounded-2xl text-left transition-all"
                style={{ background: val ? `${color}10` : "#F8FBFF", border: `2px solid ${val ? color : "transparent"}`, boxShadow: val ? `0 4px 20px ${color}20` : "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="font-semibold mb-1" style={{ fontFamily: FH, color: "#060F1E" }}>{label}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded-full transition-all relative" style={{ background: val ? color : "#d1d5db" }}>
                    <div className="w-3 h-3 rounded-full bg-white shadow absolute top-0.5 transition-all" style={{ left: val ? "17px" : "2px" }} />
                  </div>
                  <span className="text-xs" style={{ color: val ? color : "#9ca3af", fontFamily: F }}>{val ? (isBn ? "চালু" : "ON") : (isBn ? "বন্ধ" : "OFF")}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Audiobooks Section */}
      <section className="py-12 px-6" style={{ background: "#F0F6FF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#2563EB", fontFamily: F, fontWeight: 600 }}>{t("incl.feature.audiobooks")}</p>
            <h2 style={{ fontFamily: FH, fontWeight: 700, color: "#060F1E", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              {isBn ? "শুনে পড়ুন" : "Listen & Learn"}
            </h2>
          </div>
          {/* Voice controls */}
          <div className="p-5 rounded-2xl bg-white mb-6 flex flex-wrap gap-4 items-center" style={{ border: "1px solid rgba(37,99,235,0.1)" }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: F }}>{isBn ? "গতি:" : "Speed:"}</span>
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                <button key={s} onClick={() => setSpeed(s)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: speed === s ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#f5f5f5", color: speed === s ? "#fff" : "#666", fontFamily: F }}>
                  {s}x
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: F }}>{isBn ? "কণ্ঠ:" : "Voice:"}</span>
              {(["female", "male"] as const).map((v) => (
                <button key={v} onClick={() => setVoiceGender(v)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: voiceGender === v ? "linear-gradient(135deg, #60A5FA, #2563EB)" : "#f5f5f5", color: voiceGender === v ? "#fff" : "#666", fontFamily: F }}>
                  {v === "female" ? (isBn ? "নারী" : "Female") : (isBn ? "পুরুষ" : "Male")}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {audioBooks.slice(0, 4).map((book) => {
              const active = playingBook === (book._id || book.id);
              return (
                <motion.div key={book._id || book.id} whileHover={{ scale: 1.01 }}
                  className="flex gap-4 p-4 rounded-2xl bg-white transition-all"
                  style={{ border: `2px solid ${active ? "#2563EB" : "rgba(37,99,235,0.06)"}`, boxShadow: active ? "0 4px 20px rgba(37,99,235,0.15)" : "none" }}>
                  <img src={book.cover} alt={book.title} className="w-14 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="line-clamp-1 mb-0.5" style={{ fontFamily: FH, fontWeight: 600, color: "#060F1E" }}>{book.title}</h3>
                    <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: F }}>{book.author}</p>
                    <button onClick={() => handlePlay((book._id || book.id)!)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                      style={{ background: active && isPlaying ? "linear-gradient(135deg, #60A5FA, #2563EB)" : "linear-gradient(135deg, #2563EB, #1D4ED8)", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                      {active && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      {active && isPlaying ? (isBn ? "বিরতি" : "Pause") : (isBn ? "চালান" : "Play")}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#2563EB", fontFamily: F, fontWeight: 600 }}>Features</p>
            <h2 style={{ fontFamily: FH, fontWeight: 700, color: "#060F1E", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              {isBn ? "সম্পূর্ণ অ্যাক্সেসিবিলিটি স্যুট" : "Complete Accessibility Suite"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Headphones, title: t("incl.feature.audiobooks"),  desc: isBn ? "১২,০০০+ এআই-বর্ণিত অডিওবুক" : "12,000+ AI-narrated audiobooks",  color: "#2563EB" },
              { icon: Type,       title: t("incl.feature.dyslexia"),    desc: isBn ? "ওপেন ডিসলেক্সিক ফন্ট সহায়তা" : "OpenDyslexic font support",         color: "#60A5FA" },
              { icon: Eye,        title: t("incl.feature.braille"),     desc: isBn ? "ব্রেইল উপকরণ উপলব্ধ" : "Braille materials available",            color: "#22C55E" },
              { icon: Wifi,       title: t("incl.feature.lowBandwidth"),desc: isBn ? "2G নেটওয়ার্কে কাজ করে" : "Works on 2G networks",                 color: "#7C3AED" },
              { icon: Volume2,    title: t("incl.feature.screenReader"),desc: isBn ? "NVDA, JAWS সম্পূর্ণ সমর্থন" : "Full NVDA, JAWS support",           color: "#1D4ED8" },
              { icon: ShieldCheck,title: "WCAG 2.1 AA",                desc: isBn ? "আন্তর্জাতিক মান অনুগত" : "Internationally certified standard",    color: "#22C55E" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <motion.div key={title} whileHover={{ y: -4 }}
                className="p-6 rounded-2xl"
                style={{ background: "#F8FBFF", border: "1px solid rgba(37,99,235,0.08)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}12` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: FH, color: "#060F1E" }}>{title}</h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: F }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle size={48} className="mx-auto mb-5" style={{ color: "#60A5FA" }} />
          <h2 className="text-white mb-3" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
            {isBn ? "আজই বিনামূল্যে শুরু করুন" : "Start for Free Today"}
          </h2>
          <p className="text-white/65 mb-8" style={{ fontFamily: F }}>
            {isBn ? "সীমাবদ্ধতা নির্বিশেষে শেখার শক্তি অনুভব করুন।" : "Experience the power of learning without limits."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/user/login" className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm hover:scale-105 transition-all"
              style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", color: "#fff", fontFamily: F, boxShadow: "0 8px 24px rgba(96,165,250,0.3)" }}>
              <BookOpen size={18} /> {t("incl.getStarted")}
            </Link>
            <Link to="/library" className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-white/15 transition-all"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontFamily: F }}>
              {t("incl.learnMore")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}