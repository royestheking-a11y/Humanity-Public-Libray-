import { motion } from "motion/react";
import { Scale, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function TermsOfUse() {
  const { isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  const terms = [
    {
      icon: Scale,
      title: isBn ? "ব্যবহারের শর্তাবলী" : "Acceptance of Terms",
      content: isBn 
        ? "আমাদের লাইব্রেরি ব্যবহারের মাধ্যমে আপনি এই শর্তাবলী মেনে নিতে সম্মত হচ্ছেন।" 
        : "By accessing and using Humanity Public Library, you agree to be bound by these Terms of Use and all applicable laws."
    },
    {
      icon: CheckCircle2,
      title: isBn ? "ব্যবহারকারীর দায়িত্ব" : "User Responsibility",
      content: isBn 
        ? "বই ধার নেওয়া এবং ফেরত দেওয়ার ক্ষেত্রে আপনাকে লাইব্রেরির নিয়মাবলী মেনে চলতে হবে।" 
        : "Users are responsible for the safe return of borrowed materials and for maintaining the integrity of digital resources."
    },
    {
      icon: BookOpen,
      title: isBn ? "মেধা সম্পদ" : "Intellectual Property",
      content: isBn 
        ? "লাইব্রেরির সমস্ত কন্টেন্ট মেধা সম্পদ আইন দ্বারা সুরক্ষিত। এটি কেবল ব্যক্তিগত শিক্ষার জন্য ব্যবহার করা যাবে।" 
        : "All content provided on this platform is the property of HPL or its content suppliers and is protected by international copyright laws."
    },
    {
      icon: AlertCircle,
      title: isBn ? "অ্যাকাউন্ট স্থগিতকরণ" : "Account Termination",
      content: isBn 
        ? "নিয়ম ভঙ্গ করলে লাইব্রেরি কর্তৃপক্ষ আপনার অ্যাকাউন্ট স্থগিত করার অধিকার সংরক্ষণ করে।" 
        : "We reserve the right to suspend or terminate access to our services for users who violate these terms or engage in misuse."
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#FAFAFA]">
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-white mb-6" style={{ fontFamily: FH, fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              {isBn ? "ব্যবহারের শর্তাবলী" : "Terms of Use"}
            </h1>
            <p className="text-white/70 text-lg" style={{ fontFamily: F }}>
              {isBn ? "সুষ্ঠু ও নিয়মতান্ত্রিক লাইব্রেরি পরিচালনার জন্য আমাদের নীতিমালা।" : "Our guidelines for a sustainable and fair community learning environment."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {terms.map((term, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2rem] bg-white shadow-xl hover:shadow-2xl transition-all border border-blue-50 group"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <term.icon size={24} />
                  </div>
                  <h3 style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.5rem", color: "#060F1E" }}>
                    {term.title}
                  </h3>
                </div>
                <p className="text-gray-500 leading-relaxed text-lg" style={{ fontFamily: F }}>
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
