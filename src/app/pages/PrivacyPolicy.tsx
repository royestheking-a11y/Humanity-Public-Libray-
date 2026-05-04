import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function PrivacyPolicy() {
  const { isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  const sections = [
    {
      icon: Shield,
      title: isBn ? "তথ্য সংগ্রহ" : "Data Collection",
      content: isBn 
        ? "আমরা যখন আমাদের পরিষেবাগুলি ব্যবহার করি তখন আমরা আপনার নাম, ইমেল এবং পড়ার পছন্দ সংগ্রহ করি যাতে আপনাকে আরও ভাল পরিষেবা দেওয়া যায়।" 
        : "We collect your name, email, and reading preferences when you use our services to provide a personalized experience."
    },
    {
      icon: Lock,
      title: isBn ? "তথ্য সুরক্ষা" : "Data Security",
      content: isBn 
        ? "আপনার তথ্য আমাদের কাছে সুরক্ষিত। আমরা অত্যাধুনিক এনক্রিপশন প্রযুক্তি ব্যবহার করি আপনার ব্যক্তিগত তথ্য রক্ষা করতে।" 
        : "Your data is safe with us. We use industry-standard encryption to protect your personal information from unauthorized access."
    },
    {
      icon: Eye,
      title: isBn ? "স্বচ্ছতা" : "Transparency",
      content: isBn 
        ? "আমরা কখনই আপনার তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না। আপনার গোপনীয়তা আমাদের প্রধান অগ্রাধিকার।" 
        : "We never sell your data to third parties. Your privacy is our top priority, and we are transparent about how your data is used."
    },
    {
      icon: FileText,
      title: isBn ? "কুকিজ নীতি" : "Cookies Policy",
      content: isBn 
        ? "আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজার সেটিংসে এটি নিয়ন্ত্রণ করতে পারেন।" 
        : "We use cookies to improve your browsing experience. You can control cookie settings through your browser at any time."
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#FAFAFA]">
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-white mb-6" style={{ fontFamily: FH, fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </h1>
            <p className="text-white/70 text-lg" style={{ fontFamily: F }}>
              {isBn ? "আপনার বিশ্বাস এবং গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ।" : "Your trust and privacy are paramount to our mission."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-12">
            {sections.map((section, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 p-8 rounded-3xl bg-white shadow-lg border border-blue-50"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <section.icon size={28} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.5rem", color: "#060F1E" }}>
                    {section.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed" style={{ fontFamily: F }}>
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-10 rounded-[3rem] bg-blue-600 text-white text-center">
            <h2 className="mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "2rem" }}>
              {isBn ? "কোন প্রশ্ন আছে?" : "Have Questions?"}
            </h2>
            <p className="mb-8 opacity-90" style={{ fontFamily: F }}>
              {isBn ? "আমাদের গোপনীয়তা নীতি সম্পর্কে আরও জানতে আমাদের সাথে যোগাযোগ করুন।" : "Contact our privacy team if you have any concerns about how your data is handled."}
            </p>
            <a href="mailto:privacy@humanitylibrary.org" className="px-8 py-3 rounded-xl bg-white text-blue-600 font-bold hover:scale-105 transition-transform inline-block">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
