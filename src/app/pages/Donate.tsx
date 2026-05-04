import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Check, BookOpen, Headphones, 
  CheckCircle, X, AlertCircle, Globe, Crown,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { toast } from "sonner";
import type { PaymentRecord, DonationTierRecord } from "../context/AppContext";

const BKASH_NUMBER = "01999-625197";
const NAGAD_NUMBER = "01999-625197";
const ROCKET_NUMBER = "01999-6251976";
const UPAY_NUMBER = "01999-625197";

const BANK_DETAILS = [
  {
    bank: "Dutch Bangla Bank (DBBL)",
    name: "Arafat Hossain",
    acc: "1201050048035",
    branch: "Khulna (Branch Code: 120)",
    routing: "090471544",
    swift: "DBBLBDDH"
  },
  {
    bank: "Exim Bank (Savings)",
    name: "Arafat Hossain",
    acc: "0112003874609",
    branch: "Gollamari Sub Branch, Khulna",
  },
  {
    bank: "Bangladesh Krishi Bank",
    name: "Youth Climate Network",
    acc: "1322-0311100509",
    branch: "Nalian Sub Branch, Dacope, Khulna",
    routing: "035471938"
  },
  {
    bank: "Agrani Bank",
    name: "Humanity Public Library",
    acc: "Coming Soon",
    branch: "Chittagong University Branch",
  }
];

function PaymentModal({
  amount, tier, onClose, onSuccess,
}: {
  amount: number; tier: string;
  onClose: () => void;
  onSuccess: (method: string, txnId: string, phone: string) => void;
}) {
  const { isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const [tab, setTab] = useState<"mobile" | "bank">("mobile");
  const [method, setMethod] = useState<"bkash" | "nagad" | "rocket" | "upay">("bkash");
  const [step] = useState<1 | 2>(1);
  const [senderPhone, setSenderPhone] = useState("");
  const [txnId, setTxnId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const getMerchantNumber = () => {
    if (method === "bkash") return BKASH_NUMBER;
    if (method === "nagad") return NAGAD_NUMBER;
    if (method === "rocket") return ROCKET_NUMBER;
    return UPAY_NUMBER;
  };
  
  const merchantNumber = getMerchantNumber();
  const methodConfig = {
    bkash: { color: "#E2136E", bg: "#E2136E12", name: "bKash", short: "bK" },
    nagad: { color: "#E52028", bg: "#E5202812", name: "Nagad",  short: "NG" },
    rocket: { color: "#8C3494", bg: "#8C349412", name: "Rocket", short: "RK" },
    upay: { color: "#FFC20E", bg: "#FFC20E12", name: "Upay", short: "UP" },
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text.replace(/-/g, ""));
    toast.success(isBn ? "কপি করা হয়েছে!" : "Copied to clipboard!");
  };

  const handleSubmit = async () => {
    if (!txnId.trim() || txnId.length < 5) {
      toast.error(isBn ? "সঠিক ট্রানজেকশন আইডি দিন।" : "Please enter a valid transaction ID."); return;
    }
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsVerifying(false);
    onSuccess(method, txnId.trim(), senderPhone);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        className="w-full max-w-xl rounded-3xl overflow-hidden bg-white"
        style={{ boxShadow: "0 50px 120px rgba(0,0,0,0.4)" }}>
        
        <div className="p-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #060F1E, #1D4ED8)" }}>
          <div>
            <p className="text-white font-semibold" style={{ fontFamily: FH }}>{isBn ? "পেমেন্ট গেটওয়ে" : "Payment Gateway"}</p>
            <p style={{ color: "#60A5FA", fontFamily: F, fontSize: "0.8rem" }}>৳{amount.toLocaleString()} — {tier}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10"><X size={18} className="text-white/60" /></button>
        </div>

        <div className="flex p-1 bg-gray-100 m-6 rounded-2xl">
          <button onClick={() => setTab("mobile")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "mobile" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`} style={{ fontFamily: F }}>Mobile Banking</button>
          <button onClick={() => setTab("bank")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "bank" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`} style={{ fontFamily: F }}>Bank Transfer</button>
        </div>

        <div className="px-6 pb-8">
          <AnimatePresence mode="wait">
            {tab === "mobile" ? (
              <motion.div key="mobile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(["bkash", "nagad", "rocket", "upay"] as const).map(m => (
                        <button key={m} onClick={() => setMethod(m)}
                          className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105"
                          style={{ borderColor: method === m ? methodConfig[m].color : "#eee", background: method === m ? methodConfig[m].bg : "#fff" }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: methodConfig[m].color }}>{methodConfig[m].short}</div>
                          <span className="text-xs font-bold" style={{ color: methodConfig[m].color }}>{methodConfig[m].name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                       <p className="text-xs text-blue-600 font-semibold mb-1">MARCHENT NUMBER</p>
                       <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: FH }}>{merchantNumber}</p>
                       <button onClick={() => handleCopy(merchantNumber)} className="mt-3 text-sm text-blue-600 font-bold hover:underline">Copy Number</button>
                    </div>
                    <div className="space-y-3">
                       <input type="tel" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} placeholder="Your Phone Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" />
                       <input type="text" value={txnId} onChange={e => setTxnId(e.target.value)} placeholder="Transaction ID (TxnID)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <button onClick={handleSubmit} disabled={isVerifying} className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] disabled:opacity-50">
                      {isVerifying ? "Verifying..." : "Verify Payment"}
                    </button>
                  </div>
                ) : null}
              </motion.div>
            ) : (
              <motion.div key="bank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {BANK_DETAILS.map((bank, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                       <p className="font-bold text-blue-600 mb-2" style={{ fontFamily: FH }}>{bank.bank}</p>
                       <div className="grid grid-cols-2 gap-y-2 text-xs">
                          <p className="text-gray-400">Account Name:</p><p className="font-semibold text-right">{bank.name}</p>
                          <p className="text-gray-400">Account Number:</p><p className="font-bold text-right text-blue-600">{bank.acc}</p>
                          <p className="text-gray-400">Branch:</p><p className="font-semibold text-right">{bank.branch}</p>
                          {bank.routing && <><p className="text-gray-400">Routing No:</p><p className="font-semibold text-right">{bank.routing}</p></>}
                          {bank.swift && <><p className="text-gray-400">SWIFT Code:</p><p className="font-semibold text-right">{bank.swift}</p></>}
                       </div>
                       <button onClick={() => handleCopy(bank.acc)} className="mt-4 w-full py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all">Copy Account Number</button>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                   <AlertCircle size={18} className="text-amber-500 shrink-0" />
                   <p className="text-xs text-amber-600 leading-relaxed">Please send the donation to any of the accounts above and then contact us at <b>humanitypubliclibrary@gmail.com</b> with the deposit slip.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Donate() {
  const { currentUser, addDonation, addPayment, donationTiers, isLoading } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const [selectedTier, setSelectedTier] = useState<DonationTierRecord | null>(null);
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [donated, setDonated] = useState(false);

  useEffect(() => {
    if (currentUser) setDonorName(currentUser.name);
  }, [currentUser]);

  useEffect(() => {
    if (donationTiers.length > 0 && !selectedTier) {
      setSelectedTier(donationTiers[1] || donationTiers[0]);
    }
  }, [donationTiers]);

  if (isLoading) return <div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>;

  if (donated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ background: "#F0F6FF" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 text-center p-12 rounded-3xl bg-white"
          style={{ boxShadow: "0 8px 40px rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.1)" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #22C55E, #16a34a)" }}>
            <CheckCircle size={44} className="text-white" />
          </motion.div>
          <h2 className="mb-3" style={{ fontFamily: FH, fontWeight: 700, color: "#060F1E", fontSize: "2rem" }}>
            {t("donate.success")}
          </h2>
          <p className="text-gray-500 mb-8" style={{ fontFamily: F }}>{t("donate.successDesc")}</p>
          <div className="flex gap-3">
            <button onClick={() => setDonated(false)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all" style={{ color: "#6B7280", fontFamily: F }}>
              {t("donate.donateAnother")}
            </button>
            <a href="/library" className="flex-1 py-3 rounded-xl font-semibold text-sm text-white text-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F }}>
              {isBn ? "গ্রন্থাগার" : "Browse Library"}
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: "#F0F6FF" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.4)" }}>
              <Heart size={15} style={{ color: "#60A5FA" }} />
              <span style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600, fontSize: "0.85rem" }}>
                {isBn ? "পরিবর্তন আনুন" : "Make a Difference"}
              </span>
            </div>
            <h1 className="text-white mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {t("donate.title")}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: F }}>
              {t("donate.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {!currentUser && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-5 py-4 rounded-2xl mb-6"
            style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>
            <div className="flex items-center gap-3">
              <AlertCircle size={18} style={{ color: "#2563EB" }} />
              <p className="text-sm font-semibold" style={{ color: "#1E40AF", fontFamily: F }}>{t("donate.loginRequired")}</p>
            </div>
            <a href="/user/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F }}>{t("donate.loginBtn")}</a>
          </motion.div>
        )}

        {/* Donor Name */}
        <div className="mb-6 p-5 rounded-2xl bg-white" style={{ border: "1px solid rgba(37,99,235,0.08)", boxShadow: "0 2px 12px rgba(37,99,235,0.05)" }}>
          <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: F }}>
            {t("donate.donateAs")}
          </label>
          <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)}
            placeholder={t("donate.yourName")} className="w-full px-4 py-3 rounded-xl outline-none text-gray-700"
            style={{ background: "#F8FBFF", border: "1.5px solid rgba(37,99,235,0.15)", fontFamily: F }} />
        </div>

        {/* Frequency */}
        <div className="flex gap-2 mb-8">
          {[["one-time", t("donate.oneTime")], ["monthly", t("donate.monthly")]].map(([val, label]) => (
            <button key={val} onClick={() => setFrequency(val as "one-time" | "monthly")}
              className="flex-1 py-3 rounded-xl font-semibold transition-all"
              style={{
                background: frequency === val ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#fff",
                color: frequency === val ? "#fff" : "#6B7280", fontFamily: F,
                border: frequency === val ? "none" : "1px solid #e5e7eb",
                boxShadow: frequency === val ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Donation Tiers */}
        <p className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "#2563EB", fontFamily: F }}>
          {t("donate.tiers.label")}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {donationTiers.map((tier, i) => {
            const tierId = tier._id || tier.id;
            const isSelected = selectedTier?.amount === tier.amount;
            const isPopular = i === 1;
            return (
              <motion.button key={tierId} onClick={() => setSelectedTier(tier)} whileHover={{ scale: 1.02 }}
                className="relative p-5 rounded-2xl text-left transition-all"
                style={{
                  background: isSelected ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#fff",
                  border: isSelected ? "none" : isPopular ? "2px solid #60A5FA" : "1px solid rgba(37,99,235,0.1)",
                  boxShadow: isSelected ? "0 8px 24px rgba(37,99,235,0.3)" : "0 2px 12px rgba(37,99,235,0.06)",
                }}>
                {isPopular && !isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", color: "#fff", fontFamily: F }}>
                    Popular
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: isSelected ? "rgba(255,255,255,0.2)" : "rgba(37,99,235,0.1)" }}>
                  <Crown size={18} style={{ color: isSelected ? "#fff" : "#2563EB" }} />
                </div>
                <p className="font-bold mb-0.5" style={{ fontFamily: FH, color: isSelected ? "#fff" : "#060F1E", fontSize: "1.1rem" }}>
                  ৳{tier.amount.toLocaleString()}
                </p>
                <p className="text-sm font-semibold mb-1" style={{ fontFamily: F, color: isSelected ? "rgba(255,255,255,0.9)" : "#2563EB" }}>{tier.label}</p>
                <p className="text-xs leading-relaxed" style={{ fontFamily: F, color: isSelected ? "rgba(255,255,255,0.7)" : "#6B7280" }}>{tier.impact}</p>
                {isSelected && <Check size={16} className="absolute top-4 right-4 text-white" />}
              </motion.button>
            );
          })}
        </div>

        {/* Message */}
        <div className="mb-6 p-5 rounded-2xl bg-white" style={{ border: "1px solid rgba(37,99,235,0.08)" }}>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#6B7280", fontFamily: F }}>
            {t("donate.yourMessage")}
          </label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
            placeholder={isBn ? "আপনার অনুপ্রেরণার গল্প লিখুন..." : "Share your motivation..."}
            className="w-full px-4 py-3 rounded-xl outline-none resize-none text-gray-700"
            style={{ background: "#F8FBFF", border: "1.5px solid rgba(37,99,235,0.12)", fontFamily: F }} />
        </div>

        {/* CTA */}
        {selectedTier && (
          <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowModal(true)}
            className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F, fontSize: "1rem", boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}>
            <Heart size={18} /> {t("donate.proceed")} — ৳{selectedTier.amount.toLocaleString()}
          </motion.button>
        )}

        {/* Impact */}
        <div className="mt-12 p-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(37,99,235,0.08)" }}>
          <p className="text-sm uppercase tracking-widest mb-5 font-semibold text-center" style={{ color: "#2563EB", fontFamily: F }}>
            {t("donate.impact.title")}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: BookOpen,   v: "৳250",   l: isBn ? "= ১ শিক্ষার্থীর ১ মাসের অ্যাক্সেস" : "= 1 month access for 1 student" },
              { icon: Headphones, v: "৳500",   l: isBn ? "= দৃষ্টিপ্রতিবন্ধীর ১ বছরের অডিওবুক" : "= 1 year audiobooks for blind student" },
              { icon: Globe,      v: "৳1,000", l: isBn ? "= ১০ জন শিক্ষার্থীর সম্পূর্ণ অ্যাক্সেস" : "= Full access for 10 students" },
            ].map(({ icon: Icon, v, l }) => (
              <div key={v} className="text-center p-4 rounded-xl" style={{ background: "#F0F6FF" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: "rgba(37,99,235,0.1)" }}>
                  <Icon size={18} style={{ color: "#2563EB" }} />
                </div>
                <p className="font-bold" style={{ fontFamily: FH, color: "#2563EB" }}>{v}</p>
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: F }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedTier && (
          <PaymentModal
            amount={selectedTier.amount} tier={selectedTier.label}
            onClose={() => setShowModal(false)}
            onSuccess={(method, txnId, phone) => {
              setShowModal(false);
              const pay: PaymentRecord = {
                userId: currentUser?._id || currentUser?.id || "guest",
                userName: donorName, userPhone: phone, amount: selectedTier.amount,
                method: method as any, transactionId: txnId, purpose: "donation", status: "pending",
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                tier: selectedTier.label,
              };
              addPayment(pay);
              addDonation({ id: `don${Date.now()}`, amount: selectedTier.amount, tier: selectedTier.label, type: frequency, date: pay.date });
              toast.success(`✅ ${t("donate.success")}`);
              setDonated(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
