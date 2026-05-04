import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Menu, X, Eye, Type, Accessibility,
  ChevronDown, Shield, User, Users, LogOut, Gamepad2, HeartHandshake,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";

export function Navbar() {
  const location = useLocation();
  const { highContrast, toggleHighContrast, largeFonts, toggleLargeFonts, dyslexicFont, toggleDyslexicFont, isAdmin, currentUser, setCurrentUser } = useApp();
  const { lang, toggleLang, t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [accessOpen, setAccessOpen]   = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const accessRef  = useRef<HTMLDivElement>(null);

  const PRIMARY_LINKS = [
    { label: t("nav.home"),    path: "/" },
    { label: t("nav.about"),   path: "/about" },
    { label: t("nav.library"), path: "/library" },
    { label: t("nav.donate"),  path: "/donate" },
    { label: t("nav.events"),  path: "/events" },
    { label: t("nav.blog"),    path: "/blog" },
  ];
  const EXPLORE_LINKS = [
    { label: t("nav.inclusive"),    path: "/inclusive",    icon: Accessibility,  desc: t("nav.inclusive.desc") },
    { label: t("nav.gamification"), path: "/gamification", icon: Gamepad2,       desc: t("nav.gamification.desc") },
    { label: t("nav.volunteer"),    path: "/volunteer",    icon: HeartHandshake, desc: t("nav.volunteer.desc") },
  ];
  const PROJECT_LINKS = [
    { label: t("nav.humanLibrary"), path: "/project/human-library", icon: Users, desc: t("hl.slogan") },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setExploreOpen(false); setProjectOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) setProjectOpen(false);
      if (accessRef.current  && !accessRef.current.contains(e.target as Node))  setAccessOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(4,10,22,0.98)" : "rgba(6,15,30,0.95)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(37,99,235,0.2)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ border: "2px solid rgba(37,99,235,0.6)", boxShadow: "0 0 16px rgba(37,99,235,0.2)" }}>
              <img src="/assets/logo.png" alt="Humanity Public Library" className="w-full h-full object-cover" style={{ objectPosition: "center top" }} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[#FAFAFA] leading-none" style={{ fontFamily: FH, fontWeight: 700, fontSize: "0.93rem" }}>
                {isBn ? "হিউম্যানিটি" : "Humanity"}
              </p>
              <p style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600, fontSize: "0.58rem", letterSpacing: isBn ? "0.04em" : "0.14em" }}>
                {isBn ? "পাবলিক লাইব্রেরি" : "PUBLIC LIBRARY"}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {PRIMARY_LINKS.map(({ label, path }) => (
              <Link key={path} to={path}
                className="relative px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                style={{ color: isActive(path) ? "#93C5FD" : "rgba(255,255,255,0.72)", fontFamily: F, fontWeight: isActive(path) ? 600 : 400, background: isActive(path) ? "rgba(37,99,235,0.15)" : "transparent" }}
                onMouseEnter={e => { if (!isActive(path)) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={e => { if (!isActive(path)) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {label}
                {isActive(path) && <motion.div layoutId="nav-pill" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{ background: "#3B82F6" }} />}
              </Link>
            ))}

            {/* Explore dropdown */}
            <div ref={exploreRef} className="relative">
              <button onClick={() => setExploreOpen(v => !v)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.72)", fontFamily: F, background: exploreOpen ? "rgba(255,255,255,0.07)" : "transparent" }}>
                {t("nav.explore")} <ChevronDown size={13} className={`transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {exploreOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-64 rounded-2xl overflow-hidden"
                    style={{ background: "rgba(4,10,22,0.98)", border: "1px solid rgba(37,99,235,0.25)", backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                    <div className="p-1.5 space-y-0.5">
                      {EXPLORE_LINKS.map(({ label, path, icon: Icon, desc }) => (
                        <Link key={path} to={path} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/08 group"
                          style={{ background: isActive(path) ? "rgba(37,99,235,0.12)" : "transparent" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.15)" }}>
                            <Icon size={15} style={{ color: "#60A5FA" }} />
                          </div>
                          <div>
                            <p className="text-sm text-white leading-none mb-0.5" style={{ fontFamily: F, fontWeight: 500 }}>{label}</p>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Project dropdown */}
            <div ref={projectRef} className="relative">
              <button onClick={() => setProjectOpen(v => !v)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.72)", fontFamily: F, background: projectOpen ? "rgba(255,255,255,0.07)" : "transparent" }}>
                {t("nav.project")} <ChevronDown size={13} className={`transition-transform duration-200 ${projectOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {projectOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-72 rounded-2xl overflow-hidden"
                    style={{ background: "rgba(4,10,22,0.98)", border: "1px solid rgba(37,99,235,0.25)", backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                    <div className="p-1.5 space-y-0.5">
                      {PROJECT_LINKS.map(({ label, path, icon: Icon, desc }) => (
                        <Link key={path} to={path} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/08 group"
                          style={{ background: isActive(path) ? "rgba(37,99,235,0.12)" : "transparent" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.15)" }}>
                            <Icon size={15} style={{ color: "#60A5FA" }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white leading-none mb-1.5" style={{ fontFamily: F, fontWeight: 500 }}>{label}</p>
                            <p className="text-[10px] leading-tight line-clamp-2" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">

            {/* EN / BN Toggle */}
            <button onClick={toggleLang}
              className="relative flex items-center rounded-xl overflow-hidden transition-all hover:scale-105 flex-shrink-0"
              style={{ border: "1px solid rgba(37,99,235,0.4)", background: "rgba(37,99,235,0.08)", padding: "5px 4px" }}
              aria-label="Toggle language">
              <motion.span className="absolute top-0.5 bottom-0.5 rounded-lg"
                style={{ background: "rgba(37,99,235,0.3)", left: lang === "en" ? "2px" : "50%", right: lang === "en" ? "50%" : "2px" }}
                layout transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              <span className="relative z-10 px-2 text-xs font-bold transition-colors" style={{ color: lang === "en" ? "#93C5FD" : "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>EN</span>
              <span className="relative z-10 px-2 text-xs font-bold transition-colors" style={{ color: lang === "bn" ? "#93C5FD" : "rgba(255,255,255,0.35)", fontFamily: bnFont }}>বাং</span>
            </button>

            {/* Accessibility dropdown */}
            <div ref={accessRef} className="relative">
              <button onClick={() => setAccessOpen(v => !v)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.6)" }} aria-label={t("access.title")}>
                <Accessibility size={16} />
              </button>
              <AnimatePresence>
                {accessOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden"
                    style={{ background: "rgba(4,10,22,0.98)", border: "1px solid rgba(37,99,235,0.2)", backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", width: "220px" }}>
                    <div className="px-4 pt-3 pb-1.5 border-b border-white/08">
                      <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{t("access.title")}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      {[
                        { icon: Eye,      label: t("access.highContrast"), val: highContrast, toggle: toggleHighContrast },
                        { icon: Type,     label: t("access.largeFonts"),   val: largeFonts,   toggle: toggleLargeFonts },
                        { icon: BookOpen, label: t("access.openDyslexic"), val: dyslexicFont, toggle: toggleDyslexicFont },
                      ].map(({ icon: Icon, label, val, toggle }) => (
                        <button key={label} onClick={() => { toggle(); setAccessOpen(false); }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/08 transition-all">
                          <span className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.75)", fontFamily: F }}>
                            <Icon size={14} /> {label}
                          </span>
                          <div className="w-9 h-5 rounded-full transition-all relative flex-shrink-0" style={{ background: val ? "#2563EB" : "rgba(255,255,255,0.15)" }}>
                            <div className="w-3.5 h-3.5 rounded-full bg-white shadow absolute top-0.5 transition-all" style={{ left: val ? "calc(100% - 18px)" : "3px" }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:block w-px h-5 mx-0.5" style={{ background: "rgba(255,255,255,0.12)" }} />

            {/* User */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-0.5">
                <Link to="/user/dashboard" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, #2563EB, #1D4ED8)` }}>
                    {currentUser.name[0]}
                  </div>
                  <span className="text-sm max-w-[72px] truncate" style={{ color: "rgba(255,255,255,0.82)", fontFamily: F }}>
                    {currentUser.name.split(" ")[0]}
                  </span>
                </Link>
                <button onClick={() => setCurrentUser(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20"
                  style={{ color: "rgba(239,68,68,0.65)" }} title={t("nav.signOut")}>
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/user/login"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.55)", fontFamily: F }}>
                <User size={14} /> {t("nav.signIn")}
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin"
                className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg transition-all hover:bg-blue-500/15"
                style={{ color: "#60A5FA" }} title={t("nav.adminDashboard")}>
                <Shield size={15} />
              </Link>
            )}

            {/* Donate CTA */}
            <Link to="/donate"
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:scale-105 ml-0.5"
              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", fontFamily: F, boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
              {t("nav.donateBtn")}
            </Link>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.8)" }} aria-label="Toggle menu">
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.div>}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
            style={{ background: "rgba(4,10,22,0.99)", borderTop: "1px solid rgba(37,99,235,0.15)" }}>
            <div className="px-4 py-5 space-y-1.5 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-2 mb-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-xs text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>Language / ভাষা</span>
                <button onClick={toggleLang}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{ background: "rgba(37,99,235,0.15)", color: "#60A5FA", border: "1px solid rgba(37,99,235,0.3)", fontFamily: lang === "en" ? bnFont : "'Inter', sans-serif" }}>
                  {lang === "en" ? "বাংলায় পড়ুন" : "Switch to English"}
                </button>
              </div>
              {[...PRIMARY_LINKS, ...PROJECT_LINKS, ...EXPLORE_LINKS].map(({ label, path }) => (
                <Link key={path} to={path}
                  className="flex items-center px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: isActive(path) ? "rgba(37,99,235,0.12)" : "transparent", color: isActive(path) ? "#93C5FD" : "rgba(255,255,255,0.75)", fontFamily: F, fontWeight: isActive(path) ? 600 : 400 }}>
                  {label}
                </Link>
              ))}
              <div className="h-px mx-4 my-2" style={{ background: "rgba(255,255,255,0.07)" }} />
              {currentUser ? (
                <>
                  <Link to="/user/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/08"
                    style={{ color: "rgba(255,255,255,0.75)", fontFamily: F }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>{currentUser.name[0]}</div>
                    <div>
                      <p className="text-sm text-white" style={{ fontFamily: FH }}>{currentUser.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{t("nav.myLibrary")}</p>
                    </div>
                  </Link>
                  <button onClick={() => setCurrentUser(null)}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all hover:bg-red-500/10"
                    style={{ color: "#ef4444", fontFamily: F }}>
                    <LogOut size={14} /> {t("nav.signOut")}
                  </button>
                </>
              ) : (
                <Link to="/user/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all hover:bg-white/08"
                  style={{ color: "rgba(255,255,255,0.65)", fontFamily: F }}>
                  <User size={15} /> {t("nav.signInRegister")}
                </Link>
              )}
              <Link to={isAdmin ? "/admin" : "/admin/login"}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all hover:bg-white/08"
                style={{ color: isAdmin ? "#60A5FA" : "rgba(255,255,255,0.3)", fontFamily: F }}>
                <Shield size={14} /> {isAdmin ? t("nav.adminDashboard") : t("nav.adminLogin")}
              </Link>
              <Link to="/donate"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", fontFamily: F }}>
                {t("footer.cta.donate")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
