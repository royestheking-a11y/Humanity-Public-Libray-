import { Link } from "react-router";
import { motion } from "motion/react";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Youtube, Instagram, ArrowRight } from "lucide-react";
import { useLang } from "../context/LangContext";

export function Footer() {
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  const EXPLORE_LINKS = [
    { label: t("footer.links.library"),       path: "/library" },
    { label: t("footer.links.inclusive"),     path: "/inclusive" },
    { label: t("footer.links.gamification"),  path: "/gamification" },
    { label: t("footer.links.volunteer"),     path: "/volunteer" },
    { label: t("footer.links.blog"),          path: "/blog" },
    { label: t("footer.links.events"),        path: "/events" },
    { label: t("footer.links.donate"),        path: "/donate" },
  ];

  const PLATFORM_LINKS = [
    { label: t("footer.memberDashboard"), path: "/user/login" },
    { label: t("footer.adminPanel"),      path: "/admin/login" },
    { label: t("footer.freeEbooks"),      path: "/library" },
    { label: t("footer.audiobooks"),      path: "/library" },
    { label: t("footer.readingStreaks"),  path: "/gamification" },
    { label: t("footer.brailleSupport"), path: "/inclusive" },
    { label: t("footer.sponsorship"),    path: "/donate" },
  ];

  return (
    <footer style={{ background: "linear-gradient(180deg, #0C1A2E 0%, #060F1E 100%)" }} className="text-white">
      {/* CTA Banner */}
      <div style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB, #1D4ED8)" }} className="py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-white mb-3"
            style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}
          >
            {t("footer.cta.title")}{" "}
            <span style={{ color: "#60A5FA" }}>{t("footer.cta.highlight")}</span>
          </motion.h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto" style={{ fontFamily: F }}>
            {t("footer.cta.desc")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/donate"
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", color: "#fff", fontFamily: F, boxShadow: "0 8px 24px rgba(96,165,250,0.3)" }}>
              <Heart size={18} /> {t("footer.cta.donate")}
            </Link>
            <Link to="/volunteer"
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all hover:bg-white/15"
              style={{ border: "2px solid rgba(255,255,255,0.35)", color: "#fff", fontFamily: F }}>
              {t("footer.cta.volunteer")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: "2px solid rgba(37,99,235,0.5)" }}>
                <img src="/assets/logo.png" alt="HPL" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="text-white leading-none" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.1rem" }}>
                  {isBn ? "হিউম্যানিটি" : "Humanity"}
                </p>
                <p style={{ color: "#60A5FA", fontFamily: F, fontWeight: 500, fontSize: "0.6rem", letterSpacing: isBn ? "0.04em" : "0.15em" }}>
                  {isBn ? "পাবলিক লাইব্রেরি" : "PUBLIC LIBRARY"}
                </p>
              </div>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-6" style={{ fontFamily: F }}>
              {t("footer.tagline")}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook,  label: "Facebook",  href: "#" },
                { icon: Twitter,   label: "Twitter",   href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Youtube,   label: "YouTube",   href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-[#60A5FA] transition-all hover:bg-blue-500/10"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white mb-5" style={{ fontFamily: FH, fontWeight: 600, fontSize: "0.95rem" }}>{t("footer.explore")}</h4>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path}
                    className="text-white/50 hover:text-[#60A5FA] text-sm transition-colors flex items-center gap-2 group"
                    style={{ fontFamily: F }}>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white mb-5" style={{ fontFamily: FH, fontWeight: 600, fontSize: "0.95rem" }}>{t("footer.platform")}</h4>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path}
                    className="text-white/50 hover:text-[#60A5FA] text-sm transition-colors flex items-center gap-2 group"
                    style={{ fontFamily: F }}>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-5" style={{ fontFamily: FH, fontWeight: 600, fontSize: "0.95rem" }}>{t("footer.contact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm" style={{ fontFamily: F }}>
                  {isBn ? "নলিয়ান ৯২৭৩, সুতারখালী, দাকোপ, খুলনা" : "Nalian 9273, Sutarkhali, Dacope, Khulna"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400 flex-shrink-0" />
                <a href="tel:+8801911368538" className="text-white/50 hover:text-blue-400 text-sm transition-colors" style={{ fontFamily: F }}>
                  +88 01911 368538
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <a href="mailto:humanitypubliclibrary@gmail.com" className="text-white/50 hover:text-blue-400 text-sm transition-colors" style={{ fontFamily: F }}>
                  humanitypubliclibrary@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-white/70 text-sm mb-3" style={{ fontFamily: F, fontWeight: 500 }}>{t("footer.newsletter")}</p>
              <div className="flex gap-2">
                <input type="email" placeholder={t("footer.newsletterPlaceholder")}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none text-white placeholder-white/30"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(37,99,235,0.2)", fontFamily: F }} />
                <button className="px-3 py-2 rounded-lg transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }} aria-label="Subscribe">
                  <ArrowRight size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} className="py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-sm text-center" style={{ fontFamily: F }}>
            {t("footer.copyright")} {" "}
            {isBn ? "ডিজাইন এবং ডেভেলপ করেছেন" : "Design and develop by"} {" "}
            <a href="https://www.rizqara.tech" target="_blank" rel="noopener noreferrer" className="hover:text-[#60A5FA] transition-colors underline underline-offset-4">rizqara tech</a>
          </p>
          <div className="flex gap-6">
            {[
              { path: "/privacy",       label: t("footer.privacy") },
              { path: "/terms",         label: t("footer.terms") },
              { path: "/accessibility", label: t("footer.accessibility") },
            ].map(({ path, label }) => (
              <Link key={path} to={path} className="text-white/35 hover:text-white/60 text-sm transition-colors" style={{ fontFamily: F }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
