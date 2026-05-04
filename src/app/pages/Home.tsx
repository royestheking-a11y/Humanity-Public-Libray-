import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import {
  BookOpen, Headphones, Users, Heart, Star, ArrowRight,
  Shield, Volume2, Type, Moon, Waves, Droplets
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { toast } from "sonner";
import { HeroCarousel } from "../components/HeroCarousel";
import { HomeSkeleton } from "../components/Skeleton";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

export default function Home() {
  const { savedBooks, toggleSaveBook, books, stats, isLoading } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Testimonials are still mock for now in context if not fetched, but I'll use a default if null
  const TESTIMONIALS = [
    { name: "Fatema Begum", role: "Student, Dhaka University", avatar: "https://images.unsplash.com/photo-1734554118661-29139b63546c?w=200&q=80", quote: "Humanity Public Library changed my life. As a visually impaired student, the audiobook system and accessible interface allowed me to complete my degree. I'm forever grateful." },
    { name: "Rafiqul Islam", role: "Rural Teacher, Sylhet", avatar: "https://images.unsplash.com/photo-1761963108315-739eb365d446?w=200&q=80", quote: "In our remote village school, we had no books. Now my students access thousands of educational materials in Bangla and English. This platform is a miracle for our community." }
  ];

  const featuredBooks = books.slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((p) => (p + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [TESTIMONIALS.length]);

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO CAROUSEL ===== */}
      <HeroCarousel />

      {/* ===== CYCLONE IMPACT SECTION ===== */}
      <section className="py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #F0F6FF, #E0EBFF)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>
                <Waves size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-600" style={{ fontFamily: F }}>SURVIVING THE TIDE</span>
              </div>
              <h2 className="mb-8" style={{ fontFamily: FH, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#060F1E", lineHeight: 1.1 }}>
                From Devastation <br /> to <span style={{ color: "#2563EB" }}>Empowerment</span>
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg" style={{ fontFamily: F }}>
                <p>
                  Since the <a href="https://en.wikipedia.org/wiki/1970_Bhola_cyclone" target="_blank" className="text-blue-600 font-bold hover:underline">Bhola Cyclone (1970)</a> and storms like 
                  <a href="https://en.wikipedia.org/wiki/Cyclone_Sidr" target="_blank" className="text-blue-600 font-bold hover:underline mx-1">Cyclone Sidr (2007)</a>, 
                  <a href="https://en.wikipedia.org/wiki/Cyclone_Aila" target="_blank" className="text-blue-600 font-bold hover:underline mx-1">Cyclone Aila (2009)</a>, 
                  <a href="https://en.wikipedia.org/wiki/Cyclone_Amphan" target="_blank" className="text-blue-600 font-bold hover:underline mx-1">Cyclone Amphan (2020)</a>, and 
                  <a href="https://en.wikipedia.org/wiki/Cyclone_Mocha" target="_blank" className="text-blue-600 font-bold hover:underline mx-1">Cyclone Mocha (2023)</a>, 
                  our coastal communities in Khulna have faced repeated devastation.
                </p>
                <p className="font-semibold">
                  Thousands of homes lost, rivers eroded, and over 50,000 people forced to migrate—yet hope survives through education.
                </p>
                <p>
                  Support Humanity Public Library today—help children learn, women earn, and communities rebuild stronger against climate disasters.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/donate" className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-200 hover:scale-105 transition-all" style={{ fontFamily: F }}>Support Our Mission</Link>
                <Link to="/volunteer" className="px-8 py-4 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all" style={{ fontFamily: F }}>Join as Volunteer</Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img src="/assets/cyclone_resilience.png" alt="Resilience in Khulna" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-6 -right-6 p-8 rounded-3xl bg-white shadow-xl" style={{ border: "1px solid rgba(37,99,235,0.1)" }}>
                <Droplets size={32} className="text-blue-500 mb-2" />
                <p className="text-2xl font-bold" style={{ fontFamily: FH, color: "#060F1E" }}>50,000+</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest" style={{ fontFamily: F }}>Forced Migrants</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

{/* ===== FEATURED BOOKS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#2563EB", fontFamily: F, fontWeight: 600 }}>{t("home.featured.label")}</p>
              <h2 style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#060F1E" }}>
                {t("home.featured.title")}
              </h2>
            </motion.div>
            <Link
              to="/library"
              className="hidden md:flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
              style={{ color: "#2563EB", fontFamily: F }}
            >
              {t("home.featured.viewAll")} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book, i) => (
              <motion.div
                key={book._id || book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300"
                style={{ background: "#fff", boxShadow: "0 4px 24px rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.06)" }}
              >
                <Link to={`/book/${book._id || book.id}`} className="block">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {book.audioAvailable && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white" style={{ background: "rgba(37,99,235,0.9)" }}>
                          <Headphones size={10} /> {t("home.featured.audio")}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ background: book.available ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)" }}>
                        {book.available ? t("home.featured.available") : t("home.featured.unavailable")}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(29,78,216,0.85)", color: "#60A5FA" }}>
                        {book.genre}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <Link to={`/book/${book._id || book.id}`} className="block group/title">
                    <h3 className="mb-1 line-clamp-1 group-hover/title:text-blue-600 transition-colors" style={{ fontFamily: FH, fontWeight: 600, fontSize: "1rem", color: "#060F1E" }}>
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3" style={{ fontFamily: F }}>{book.author}</p>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} fill={j < Math.floor(book.rating) ? "#60A5FA" : "none"} stroke={j < Math.floor(book.rating) ? "#60A5FA" : "#ccc"} />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{book.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const id = book._id || book.id || "";
                          toggleSaveBook(id);
                          toast(savedBooks.includes(id) ? "Removed from library" : "Saved to your library! 📚");
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-110"
                        style={{ background: savedBooks.includes(book._id || book.id || "") ? "#2563EB15" : "#f5f5f5" }}
                        aria-label="Save book"
                      >
                        <BookOpen size={14} style={{ color: savedBooks.includes(book._id || book.id || "") ? "#2563EB" : "#999" }} />
                      </button>
                      <Link
                        to={`/book/${book._id || book.id}`}
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
                        style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", fontFamily: F }}
                      >
                        {t("home.featured.readNow")}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* ===== IMPACT STATS ===== */}
      <section className="py-20" style={{ background: "#F0F6FF" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "#2563EB", fontFamily: F, fontWeight: 600 }}>{t("home.impact.label")}</p>
            <h2 style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#060F1E" }}>
              {t("home.impact.title")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats && [
              { icon: BookOpen,   value: stats.totalBooks,            label: t("home.stat.booksAvailable"), suffix: "+", color: "#2563EB" },
              { icon: Headphones, value: stats.audioBooks,            label: t("home.stat.audiobooks"),     suffix: "+", color: "#60A5FA" },
              { icon: Users,      value: stats.activeUsers,           label: t("home.stat.activeReaders"),  suffix: "",  color: "#1D4ED8" },
              { icon: Heart,      value: stats.visuallyImpairedUsers, label: t("home.stat.accessibleUsers"),suffix: "+", color: "#22C55E" },
            ].map(({ icon: Icon, value, label, suffix, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl group hover:-translate-y-1 transition-all duration-300"
                style={{ background: "#fff", border: "1px solid rgba(37,99,235,0.08)", boxShadow: "0 4px 24px rgba(37,99,235,0.06)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={26} style={{ color }} />
                </div>
                <p
                  className="mb-1"
                  style={{ fontFamily: FH, fontWeight: 800, fontSize: "2rem", color }}
                >
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: F }}>{label}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {stats && [
              { value: stats.volunteers,        label: t("home.stat.volunteers"), suffix: "+", color: "#6B7280" },
              { value: stats.donations,         label: t("home.stat.bdtDonated"), suffix: "+", color: "#60A5FA" },
              { value: stats.countriesServed,   label: t("home.stat.countries"),  suffix: "",  color: "#2563EB" },
              { value: stats.languagesAvailable,label: t("home.stat.languages"),  suffix: "+", color: "#22C55E" },
            ].map(({ value, label, suffix, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl"
                style={{ background: `${color}08`, border: `1px solid ${color}20` }}
              >
                <p className="mb-1" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.6rem", color }}>
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: F }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INCLUSIVE EDUCATION HIGHLIGHT ===== */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #060F1E 0%, #0C1A2E 50%, #1D4ED8 100%)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.4)" }}
              >
                <Shield size={13} className="inline mr-1 -mt-0.5" style={{ color: "#60A5FA" }} />{t("home.inclusive.badge")}
              </div>
              <h2
                className="text-white mb-6"
                style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: "1.2" }}
              >
                {t("home.inclusive.title")}
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed" style={{ fontFamily: F, fontSize: "1.05rem" }}>
                {t("home.inclusive.desc")}
              </p>
              <div className="space-y-4">
                {[
                  { icon: Headphones, title: t("home.inclusive.feature1"), desc: t("home.inclusive.feature1.desc") },
                  { icon: Volume2,    title: t("home.inclusive.feature2"), desc: t("home.inclusive.feature2.desc") },
                  { icon: Type,       title: t("home.inclusive.feature3"), desc: t("home.inclusive.feature3.desc") },
                  { icon: Moon,       title: t("home.inclusive.feature4"), desc: t("home.inclusive.feature4.desc") },
                ].map(({ icon: FeatureIcon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(96,165,250,0.15)" }}>
                      <FeatureIcon size={18} style={{ color: "#60A5FA" }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold" style={{ fontFamily: F }}>{title}</p>
                      <p className="text-white/60 text-sm" style={{ fontFamily: F }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/inclusive"
                className="inline-flex items-center gap-2 mt-8 px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", color: "#fff", fontFamily: F }}
              >
                {t("home.inclusive.explore")} <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/inclusive_education.png"
                  alt="Inclusive education technology"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating stat card */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl shadow-xl"
                style={{ background: "rgba(96,165,250,0.95)", backdropFilter: "blur(10px)" }}
              >
                <p style={{ fontFamily: FH, fontWeight: 800, fontSize: "1.8rem", color: "#060F1E" }}>34.2K</p>
                <p className="text-sm" style={{ color: "#0C1A2E", fontFamily: F, fontWeight: 500 }}>{t("home.inclusive.floatStat")}</p>
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -top-6 -right-6 px-5 py-3 rounded-2xl shadow-xl"
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <p className="text-xs mb-1" style={{ fontFamily: F, color: "#FFFFFF", fontWeight: 600 }}>WCAG 2.1 AA Compliant</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-[#22C55E]" />)}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20" style={{ background: "#F0F6FF" }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#2563EB", fontFamily: F, fontWeight: 600 }}>{t("home.testimonials.voices")}</p>
            <h2 style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#060F1E" }}>
              {t("home.testimonials.title")}
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-10 rounded-3xl text-center"
              style={{ background: "#fff", border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 8px 40px rgba(37,99,235,0.08)" }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6" style={{ border: "4px solid rgba(37,99,235,0.2)" }}>
                <img src={TESTIMONIALS[currentTestimonial].avatar} alt={TESTIMONIALS[currentTestimonial].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#60A5FA" stroke="#60A5FA" />)}
              </div>
              <blockquote className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: F, fontSize: "1.1rem", fontStyle: "italic" }}>
                "{TESTIMONIALS[currentTestimonial].quote}"
              </blockquote>
              <p className="font-semibold" style={{ fontFamily: FH, color: "#060F1E" }}>{TESTIMONIALS[currentTestimonial].name}</p>
              <p className="text-sm text-gray-400" style={{ fontFamily: F }}>{TESTIMONIALS[currentTestimonial].role}</p>
            </motion.div>

            <div className="flex justify-center gap-3 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className="rounded-full transition-all"
                  style={{ width: i === currentTestimonial ? "32px" : "12px", height: "12px", background: i === currentTestimonial ? "#2563EB" : "#ccc" }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
