import { useState } from "react";
import { motion } from "motion/react";
import { 
  Clock, MapPin, Globe, ArrowRight, 
  Send, CheckCircle, Info, Library, Video, 
  Sprout, Users, Waves, Fish, Wind, 
  Palette, Heart, History, Droplets, Handshake
} from "lucide-react";
import { useLang } from "../context/LangContext";
import { useApp } from "../context/AppContext";
// Removing static mock imports
import { toast } from "sonner";

export default function HumanLibrary() {
  const { livingBooks } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const [submitted, setSubmitted] = useState(false);

  const SESSION_TYPES = [
    { id: "in-person", title: t("hl.inPerson"), Icon: Library, desc: t("hl.inPersonDesc") },
    { id: "online", title: t("hl.online"), Icon: Video, desc: t("hl.onlineDesc") },
    { id: "field", title: t("hl.fieldVisit"), Icon: Sprout, desc: t("hl.fieldVisitDesc") },
    { id: "group", title: t("hl.groupSession"), Icon: Users, desc: t("hl.groupSessionDesc") },
  ];

  const IconMap: Record<string, any> = {
    Waves, Fish, Wind, Palette, Heart, History, Droplets, Handshake
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success(isBn ? "সেশন অনুরোধ জমা দেওয়া হয়েছে!" : "Session request submitted!");
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: "#060F1E" }}>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: "radial-gradient(circle, #2563EB, transparent)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block" 
              style={{ background: "rgba(37,99,235,0.1)", color: "#60A5FA", border: "1px solid rgba(37,99,235,0.2)", fontFamily: F }}>
              {t("hl.title")}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1]" style={{ fontFamily: FH }}>
              {t("hl.slogan").split(".")[0]} <br />
              <span style={{ color: "#60A5FA" }}>{t("hl.slogan").split(".")[1]}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ fontFamily: F }}>
              {t("hl.desc")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#book-section" className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]" style={{ fontFamily: F }}>
                {t("hl.bookSession")}
              </a>
              <a href="#living-books" className="px-8 py-4 rounded-2xl border border-white/10 text-white font-bold transition-all hover:bg-white/5" style={{ fontFamily: F }}>
                {t("hl.livingBooks")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Living Books Section */}
      <section id="living-books" className="py-24" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: FH }}>
                {t("hl.livingBooks")}
              </h2>
              <div className="h-1 w-20 bg-blue-600 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {livingBooks.map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-3xl transition-all hover:scale-[1.02]"
                style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                }}
              >
                <div className="text-4xl mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-blue-600/20 transition-colors">
                  {IconMap[book.icon] ? (
                    (() => {
                      const Icon = IconMap[book.icon];
                      return <Icon size={32} className="text-blue-400 group-hover:text-blue-300 transition-colors" />;
                    })()
                  ) : book.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>{book.title}</h3>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">{book.category}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {book.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-400 font-medium">{book.narrator}</span>
                  <button className="text-blue-500 hover:text-blue-400 p-2 rounded-lg transition-colors">
                    <Info size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Session Types Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              {t("hl.sessions")}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">{isBn ? "আপনি যেভাবে আমাদের জীবন্ত বইগুলোর সাথে যুক্ত হতে পারেন" : "How you can connect with our living books"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SESSION_TYPES.map((type, idx) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2.5rem] text-center border border-white/05 hover:border-blue-500/30 transition-all group"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 mx-auto mb-6 transform group-hover:scale-110 group-hover:bg-blue-600/20 transition-all duration-300">
                  <type.Icon size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{type.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section className="py-24" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{t("hl.upcoming")}</h2>
            <button className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:gap-3 transition-all">
              {isBn ? "সব দেখুন" : "View All"} <ArrowRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {(livingBooks || []).slice(0, 3).map((session) => (
              <div key={session._id || session.id} className="p-6 rounded-3xl flex flex-wrap items-center justify-center gap-6 hover:bg-white/05 transition-colors border border-white/05">
                <div className="flex items-center gap-6 flex-1 min-w-[300px]">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex flex-col items-center justify-center text-white text-center flex-shrink-0">
                    <span className="text-xl font-bold leading-none">12</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">MAY</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">"{session.title}" — {session.narrator}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> 10:00 AM · 45m</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> Humanity Library Hub</span>
                      <span className="flex items-center gap-1.5" style={{ color: "#60A5FA" }}><Globe size={14} /> In-Person</span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-blue-600 transition-colors whitespace-nowrap">
                  {isBn ? "বুক করুন" : "Book Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="book-section" className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-[3rem] p-8 md:p-12 relative overflow-hidden" 
            style={{ 
              background: "linear-gradient(145deg, rgba(37,99,235,0.05), rgba(30,58,138,0.1))",
              border: "1px solid rgba(37,99,235,0.2)"
            }}>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">{t("hl.bookSession")}</h2>
                <p className="text-gray-400">{t("hl.bookingForm")}</p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t("hl.yourName")}</label>
                    <input required type="text" className="w-full px-6 py-4 rounded-2xl bg-white/05 border border-white/10 text-white outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t("hl.emailPhone")}</label>
                    <input required type="text" className="w-full px-6 py-4 rounded-2xl bg-white/05 border border-white/10 text-white outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t("hl.whichBook")}</label>
                    <select className="w-full px-6 py-4 rounded-2xl bg-white/05 border border-white/10 text-white outline-none focus:border-blue-500 appearance-none transition-all">
                      {livingBooks.map(b => <option key={b.id} value={b.id} className="bg-slate-900">{b.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t("hl.sessionType")}</label>
                    <select className="w-full px-6 py-4 rounded-2xl bg-white/05 border border-white/10 text-white outline-none focus:border-blue-500 appearance-none transition-all">
                      <option>In-person</option>
                      <option>Online</option>
                      <option>Field visit</option>
                      <option>Group session</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t("hl.preferredDate")}</label>
                    <input required type="date" className="w-full px-6 py-4 rounded-2xl bg-white/05 border border-white/10 text-white outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t("hl.purpose")}</label>
                    <textarea required rows={3} className="w-full px-6 py-4 rounded-2xl bg-white/05 border border-white/10 text-white outline-none focus:border-blue-500 transition-all resize-none" />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button type="submit" className="w-full py-5 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                      {t("hl.requestSession")} <Send size={18} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{isBn ? "অনুরোধ গৃহীত হয়েছে" : "Request Received"}</h3>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto">{isBn ? "আমরা আপনার বুকিং পর্যালোচনা করব এবং শীঘ্রই আপনার সাথে যোগাযোগ করব।" : "We will review your booking and get back to you shortly."}</p>
                  <button onClick={() => setSubmitted(false)} className="px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all">
                    {isBn ? "আবার বুক করুন" : "Book Another Session"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-blue-900/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-[3rem] p-12 text-center border border-white/05 bg-white/02">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              {t("hl.shareStory")}
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("hl.shareStoryDesc")}
            </p>
            <button className="px-10 py-5 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all shadow-xl">
              {t("hl.applyBook")} ↗
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
