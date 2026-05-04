import { motion } from "motion/react";
import { Accessibility, Eye, Headphones, Type, Monitor } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function AccessibilityPage() {
  const { isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  const features = [
    {
      icon: Headphones,
      title: isBn ? "অডিওবুক সিস্টেম" : "Audiobook System",
      desc: isBn 
        ? "১২,০০০+ বই এআই-বর্ণিত অডিও সহ পাওয়া যাচ্ছে দৃষ্টিপ্রতিবন্ধী পাঠকদের জন্য।" 
        : "Over 12,000+ books are available with AI-narrated audio, specifically designed for visually impaired readers."
    },
    {
      icon: Type,
      title: isBn ? "ওপেন ডিসলেক্সিক ফন্ট" : "OpenDyslexic Support",
      desc: isBn 
        ? "ডিসলেক্সিয়া আক্রান্ত পাঠকদের জন্য বিশেষ ফন্ট যা পড়ার অভিজ্ঞতা সহজ করে।" 
        : "A specialized font designed to mitigate some of the common reading errors caused by dyslexia."
    },
    {
      icon: Monitor,
      title: isBn ? "উচ্চ কন্ট্রাস্ট মোড" : "High Contrast Mode",
      desc: isBn 
        ? "দৃষ্টির সীমাবদ্ধতা রয়েছে এমন ব্যবহারকারীদের জন্য বিশেষ কালার প্যালেট।" 
        : "WCAG 2.1 AA certified contrast ratios for users with low vision or color sensitivity."
    },
    {
      icon: Eye,
      title: isBn ? "ভয়েস নেভিগেশন" : "Voice Navigation",
      desc: isBn 
        ? "পুরো লাইব্রেরি হাত ছাড়াই ভয়েস কমান্ডের মাধ্যমে ব্যবহার করা সম্ভব।" 
        : "Browse and interact with the entire library using hands-free voice commands."
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#FAFAFA]">
      <section className="py-24 px-6 text-center overflow-hidden relative" style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
             <Accessibility size={40} className="text-blue-400" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white mb-6" style={{ fontFamily: FH, fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            {isBn ? "সবার জন্য শিক্ষা" : "Inclusive by Design"}
          </motion.h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto" style={{ fontFamily: F }}>
            {isBn ? "হিউম্যানিটি পাবলিক লাইব্রেরি প্রতিবন্ধকতা দূর করে জ্ঞানের আলো ছড়িয়ে দিতে অঙ্গীকারবদ্ধ।" : "Humanity Public Library is built from the ground up to ensure no learner is left behind, regardless of their physical abilities."}
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all border border-blue-50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                   <f.icon size={120} />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6">
                  <f.icon size={28} />
                </div>
                <h3 className="mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.8rem", color: "#060F1E" }}>
                  {f.title}
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed" style={{ fontFamily: F }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-12 rounded-[3.5rem] bg-white border border-blue-100 shadow-2xl relative overflow-hidden">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="mb-6" style={{ fontFamily: FH, fontWeight: 700, fontSize: "2.5rem", color: "#060F1E" }}>
                      {isBn ? "আমাদের লক্ষ্য" : "Our Commitment"}
                   </h2>
                   <div className="space-y-6 text-gray-600 text-lg leading-relaxed" style={{ fontFamily: F }}>
                      <p>
                         {isBn 
                           ? "আমরা বিশ্বাস করি যে শিক্ষা প্রতিটি মানুষের মৌলিক অধিকার। আমাদের প্ল্যাটফর্মটি এমনভাবে ডিজাইন করা হয়েছে যাতে দৃষ্টিপ্রতিবন্ধী বা ডিসলেক্সিয়া আক্রান্ত ব্যক্তিরাও কোনো বাধা ছাড়াই শিখতে পারে।" 
                           : "We believe that knowledge should be accessible to everyone. Our commitment goes beyond just compliance; we actively build tools that empower those who have traditionally been excluded from digital learning."}
                      </p>
                      <p>
                         {isBn 
                           ? "আমাদের অ্যাক্সেসিবিলিটি টিম প্রতিনিয়ত কাজ করছে প্ল্যাটফর্মটিকে আরও সহজতর করতে।" 
                           : "Our accessibility team is constantly iterating on our core modules to ensure we meet and exceed WCAG 2.1 AA standards across all devices."}
                      </p>
                   </div>
                </div>
                <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-blue-50 flex items-center justify-center">
                   <img src="/assets/inclusive_education.png" alt="Inclusive" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
