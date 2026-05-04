import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Clock, CheckCircle, LogOut, User, Phone, Mail,
  CreditCard, Calendar, Package, History, Wallet, Home,
  Edit3, Save, X, ArrowUpRight, RefreshCw,
  BookMarked, Sparkles, Award, TrendingUp, Library,
  AlertCircle, Eye, EyeOff, Shield
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { DashboardSkeleton } from "../components/Skeleton";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; dot: string }> = {
  pending:  { bg: "rgba(37,99,235,0.1)",    color: "#3B82F6", label: "Pending Approval",  dot: "#3B82F6" },
  approved: { bg: "rgba(29,78,216,0.1)",    color: "#2563EB", label: "Ready for Pickup",  dot: "#2563EB" },
  borrowed: { bg: "rgba(96,165,250,0.12)",  color: "#2563EB", label: "Currently Reading", dot: "#60A5FA" },
  returned: { bg: "rgba(34,197,94,0.1)",    color: "#22C55E", label: "Returned",           dot: "#22C55E" },
  rejected: { bg: "rgba(239,68,68,0.1)",    color: "#ef4444", label: "Rejected",           dot: "#ef4444" },
};

const PAY_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: "rgba(37,99,235,0.1)",  color: "#3B82F6", label: "Under Review" },
  approved: { bg: "rgba(34,197,94,0.1)",  color: "#22C55E", label: "Verified" },
  rejected: { bg: "rgba(239,68,68,0.1)",  color: "#ef4444", label: "Rejected" },
};

function daysLeft(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function StatRing({ value, max, color, size = 44 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / Math.max(max, 1), 1);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function ProfileEditModal({ user, onSave, onClose }: {
  user: { name: string; email: string; phone: string; studentId?: string; password?: string };
  onSave: (data: { name: string; phone: string; studentId: string; password?: string; newPassword: string }) => void | Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: user.name, phone: user.phone, studentId: user.studentId || "", password: "", newPassword: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  const handleSave = async () => {
    if (!form.name.trim()) { setError(isBn ? "নাম খালি রাখা যাবে না।" : "Name cannot be empty."); return; }
    if (!/^01[3-9]\d{8}$/.test(form.phone)) { setError(isBn ? "সঠিক ফোন নম্বর দিন।" : "Enter a valid phone number."); return; }
    if (form.newPassword && form.newPassword.length < 6) { setError(t("auth.shortPassword")); return; }
    if (form.newPassword && form.newPassword !== form.confirmPassword) { setError(t("auth.passwordMismatch")); return; }
    if (form.newPassword && form.password !== user.password) { setError(isBn ? "বর্তমান পাসওয়ার্ড ভুল।" : "Current password is incorrect."); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({ name: form.name, phone: form.phone, studentId: form.studentId, password: user.password, newPassword: form.newPassword });
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(145deg, #060F1E, #0C1A2E)", border: "1px solid rgba(96,165,250,0.2)", boxShadow: "0 50px 120px rgba(0,0,0,0.6)" }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(96,165,250,0.15)" }}>
              <Edit3 size={16} style={{ color: "#60A5FA" }} />
            </div>
            <p className="text-white font-semibold" style={{ fontFamily: FH, fontSize: "0.95rem" }}>{t("dash.editProfile")}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {[
            { label: t("dash.fullName"), key: "name", value: form.name, placeholder: isBn ? "আপনার পুরো নাম" : "Your full name" },
            { label: t("dash.phone"), key: "phone", value: form.phone, placeholder: "01XXXXXXXXX" },
            { label: t("dash.studentNid"), key: "studentId", value: form.studentId, placeholder: "STU001" },
          ].map(({ label, key, value, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{label}</label>
              <input value={value} onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setError(""); }}
                placeholder={placeholder} className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: F }} />
            </div>
          ))}
          <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{t("dash.changePass")}</p>
            <div className="space-y-3">
              {[
                { key: "password", placeholder: t("dash.currentPass") },
                { key: "newPassword", placeholder: t("dash.newPass") },
                { key: "confirmPassword", placeholder: t("dash.confirmNewPass") },
              ].map(({ key, placeholder }) => (
                <div key={key} className="relative">
                  <input type={showPass ? "text" : "password"} value={(form as Record<string, string>)[key]}
                    onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setError(""); }}
                    placeholder={placeholder} className="w-full pl-4 pr-10 py-3 rounded-xl text-white outline-none text-sm"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: F }} />
                  {key === "password" && (
                    <button onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={14} style={{ color: "#ef4444" }} />
              <p className="text-sm" style={{ color: "#ef4444", fontFamily: F }}>{error}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold hover:bg-white/08" style={{ color: "rgba(255,255,255,0.5)", fontFamily: F }}>{t("dash.cancel")}</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", fontFamily: F }}>
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={15} /> {t("dash.saveChanges")}</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function UserDashboard() {
  const { currentUser, setCurrentUser, bookRequests, payments, updateUser, isLoading } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const navigate = useNavigate();
  const [tab, setTab] = useState<"borrows" | "history" | "payments" | "profile">("borrows");
  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (isLoading) return <DashboardSkeleton />;
  if (!currentUser) { navigate("/user/login", { replace: true }); return null; }

  const myRequests     = bookRequests.filter(r => (r.userId === (currentUser._id || currentUser.id)));
  const activeRequests = myRequests.filter(r => ["pending", "approved", "borrowed"].includes(r.status));
  const historyReqs    = myRequests.filter(r => ["returned", "rejected"].includes(r.status));
  const myPayments     = payments.filter(p => (p.userId === (currentUser._id || currentUser.id)));

  const handleLogout = () => { setCurrentUser(null); navigate("/", { replace: true }); };

  const handleSaveProfile = async (data: { name: string; phone: string; studentId: string; password?: string; newPassword: string }) => {
    const userId = (currentUser._id || currentUser.id)!;
    await updateUser(userId, { name: data.name, phone: data.phone, studentId: data.studentId || undefined, password: data.newPassword || data.password });
    setShowEditModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const TABS = [
    { id: "borrows"  as const, label: t("dash.myBooks"),  icon: BookOpen, count: activeRequests.length },
    { id: "history"  as const, label: t("dash.history"),  icon: History,  count: historyReqs.length },
    { id: "payments" as const, label: t("dash.payments"), icon: Wallet,   count: myPayments.length },
    { id: "profile"  as const, label: t("dash.profile"),  icon: User,     count: 0 },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #020912 0%, #060F1E 50%, #0C1A2E 100%)" }}>
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5"
        style={{ background: "rgba(4,10,22,0.94)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(37,99,235,0.12)" }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden" style={{ border: "1.5px solid rgba(96,165,250,0.5)" }}>
            <img src="/assets/logo.png" alt="HPL" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <p style={{ fontFamily: FH, fontWeight: 700, fontSize: "0.82rem", color: "#FAFAFA", lineHeight: 1 }}>{isBn ? "হিউম্যানিটি" : "Humanity"}</p>
            <p style={{ fontFamily: F, fontSize: "0.55rem", color: "#60A5FA", letterSpacing: "0.1em" }}>{isBn ? "পাবলিক লাইব্রেরি" : "PUBLIC LIBRARY"}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E", fontFamily: F }}>
              <CheckCircle size={11} /> {t("dash.profileSaved")}
            </motion.span>
          )}
          <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/08"
            style={{ color: "rgba(255,255,255,0.45)", fontFamily: F }}>
            <Home size={13} /> {t("dash.backToSite")}
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-red-500/15"
            style={{ color: "rgba(239,68,68,0.75)", fontFamily: F }}>
            <LogOut size={13} /> {t("dash.signOut")}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Sidebar */}
          <div className="xl:w-72 flex-shrink-0 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))", border: "1px solid rgba(96,165,250,0.15)" }}>
              <div className="relative h-20" style={{ background: `linear-gradient(135deg, ${currentUser.avatarColor}80, ${currentUser.avatarColor}30)` }}>
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(10,2,5,0.8))" }} />
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ border: "2px solid #60A5FA" }} />
              </div>
              <div className="px-5 -mt-10 relative z-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${currentUser.avatarColor}, ${currentUser.avatarColor}bb)`, fontFamily: FH, border: "3px solid rgba(96,165,250,0.3)" }}>
                  {currentUser.name[0]}
                </div>
              </div>
              <div className="px-5 pt-3 pb-5">
                <h2 className="text-white mb-0.5" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.1rem" }}>{currentUser.name}</h2>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)", fontFamily: F }}>{currentUser.email}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(96,165,250,0.12)", color: "#60A5FA", fontFamily: F, border: "1px solid rgba(96,165,250,0.2)" }}>
                    {t("dash.memberSince")} {currentUser.joinDate}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: t("dash.active"), value: activeRequests.length, color: "#60A5FA", max: 5 },
                    { label: t("dash.borrowed"), value: myRequests.length, color: "#2563EB", max: 20 },
                    { label: t("dash.payments"), value: myPayments.length, color: "#22C55E", max: 10 },
                  ].map(({ label, value, color, max }) => (
                    <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="relative flex items-center justify-center">
                        <StatRing value={value} max={max} color={color} size={44} />
                        <span className="absolute text-xs font-bold" style={{ color, fontFamily: FH }}>{value}</span>
                      </div>
                      <span className="text-xs text-center leading-tight" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{label}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowEditModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.3)", fontFamily: F }}>
                  <Edit3 size={14} /> {t("dash.editProfile")}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { icon: Phone,      label: currentUser.phone },
                { icon: CreditCard, label: currentUser.studentId || (isBn ? "কোনো আইডি নেই" : "No Student ID") },
                { icon: Shield,     label: isBn ? "যাচাইকৃত সদস্য" : "Verified Member" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(96,165,250,0.08)" }}>
                    <Icon size={13} style={{ color: "#60A5FA" }} />
                  </div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: F }}>{label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { label: isBn ? "গ্রন্থাগার ব্রাউজ করুন" : "Browse Library", path: "/library",      icon: Library },
                { label: isBn ? "দান করুন" : "Donate",                        path: "/donate",       icon: Sparkles },
                { label: isBn ? "গেমিফিকেশন" : "Gamification",               path: "/gamification", icon: Award },
              ].map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path}
                  className="flex items-center justify-between px-4 py-3 transition-all hover:bg-white/05 group border-b border-white/04 last:border-0">
                  <span className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.55)", fontFamily: F }}>
                    <Icon size={14} style={{ color: "rgba(96,165,250,0.6)" }} /> {label}
                  </span>
                  <ArrowUpRight size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
                </Link>
              ))}
            </motion.div>

            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all hover:bg-red-500/15"
              style={{ color: "rgba(239,68,68,0.65)", border: "1px solid rgba(239,68,68,0.12)", fontFamily: F }}>
              <LogOut size={14} /> {t("dash.signOut")}
            </button>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Tabs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="flex gap-1 p-1.5 rounded-2xl overflow-x-auto"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {TABS.map(({ id, label, icon: Icon, count }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="relative flex-1 min-w-max flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                  style={{ background: tab === id ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "transparent", color: tab === id ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: F }}>
                  <Icon size={14} /> {label}
                  {count > 0 && (
                    <span className="rounded-full text-xs px-1.5 py-0.5 min-w-5 text-center"
                      style={{ background: tab === id ? "rgba(255,255,255,0.2)" : "rgba(96,165,250,0.2)", color: tab === id ? "#fff" : "#60A5FA", fontSize: "0.7rem" }}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Borrows */}
              {tab === "borrows" && (
                <motion.div key="borrows" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
                  {activeRequests.length === 0 ? (
                    <div className="rounded-3xl p-16 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(37,99,235,0.15)" }}>
                        <BookMarked size={28} style={{ color: "rgba(37,99,235,0.8)" }} />
                      </div>
                      <p className="text-white/40 mb-5 text-sm" style={{ fontFamily: F }}>{t("dash.noActiveBooks")}</p>
                      <Link to="/library" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
                        style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F }}>
                        <Library size={15} /> {t("dash.browseLibrary")}
                      </Link>
                    </div>
                  ) : (
                    activeRequests.map((req, i) => {
                      const days = daysLeft(req.expectedReturnDate);
                      const st = STATUS_STYLES[req.status] || STATUS_STYLES.pending;
                      const isOverdue = req.status === "borrowed" && days < 0;
                      const isUrgent = req.status === "borrowed" && days >= 0 && days <= 3;
                      return (
                        <motion.div key={req._id || req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                          className="rounded-2xl overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${isOverdue ? "rgba(239,68,68,0.3)" : isUrgent ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.08)"}` }}>
                          <div className="flex">
                            <div className="w-1 flex-shrink-0" style={{ background: st.dot }} />
                            <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                              <img src={req.bookCover} alt={req.bookTitle} className="w-14 h-20 rounded-xl object-cover shadow-lg flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className="text-white mb-0.5" style={{ fontFamily: FH, fontWeight: 600 }}>{req.bookTitle}</h3>
                                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{req.bookAuthor} · {req.bookGenre}</p>
                                  </div>
                                  <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                                    style={{ background: st.bg, color: st.color, fontFamily: F }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />{st.label}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>
                                  <span className="flex items-center gap-1"><Calendar size={11} /> {t("dash.requested")} {req.requestDate}</span>
                                  <span className="flex items-center gap-1"><RefreshCw size={11} /> {t("dash.returnBy")} {req.expectedReturnDate}</span>
                                </div>
                                {req.status === "borrowed" && (
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: F }}>{t("dash.borrowingPeriod")}</span>
                                      <span className="text-xs font-semibold" style={{ color: isOverdue ? "#ef4444" : isUrgent ? "#60A5FA" : "#22C55E", fontFamily: FH }}>
                                        {isOverdue ? `${Math.abs(days)} ${t("dash.daysOverdue")}` : days === 0 ? t("dash.dueToday") : `${days} ${t("dash.daysLeft")}`}
                                      </span>
                                    </div>
                                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                                      <div className="h-full rounded-full transition-all"
                                        style={{ width: `${Math.max(0, Math.min(100, ((req.borrowDays - Math.max(days, 0)) / req.borrowDays) * 100))}%`, background: isOverdue ? "#ef4444" : isUrgent ? "#60A5FA" : "#22C55E" }} />
                                    </div>
                                  </div>
                                )}
                                {req.status === "pending" && (
                                  <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "#60A5FA", fontFamily: F }}>
                                    <Clock size={11} className="animate-pulse" /> {t("dash.awaitingApproval")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <Link to="/library" className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all hover:bg-white/08"
                    style={{ color: "rgba(255,255,255,0.4)", border: "1px dashed rgba(255,255,255,0.1)", fontFamily: F }}>
                    <Library size={14} /> {t("dash.browseMore")}
                  </Link>
                </motion.div>
              )}

              {/* History */}
              {tab === "history" && (
                <motion.div key="history" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                  {historyReqs.length === 0 ? (
                    <div className="rounded-3xl p-14 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <History size={32} className="mx-auto mb-4 opacity-20 text-white" />
                      <p className="text-white/30 text-sm" style={{ fontFamily: F }}>{t("dash.noHistory")}</p>
                    </div>
                  ) : (
                    historyReqs.map((req, i) => {
                      const st = STATUS_STYLES[req.status] || STATUS_STYLES.pending;
                      return (
                        <motion.div key={req._id || req.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="flex gap-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <img src={req.bookCover} alt={req.bookTitle} className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-white" style={{ fontFamily: FH }}>{req.bookTitle}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color, fontFamily: F }}>{st.label}</span>
                            </div>
                            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: F }}>{req.bookAuthor}</p>
                            <div className="flex flex-wrap gap-3 text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: F }}>
                              <span><Calendar size={10} className="inline mr-1" />{req.requestDate}</span>
                              {req.returnedDate && <span className="text-green-400/70"><CheckCircle size={10} className="inline mr-1" />{t("dash.returned")} {req.returnedDate}</span>}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {/* Payments */}
              {tab === "payments" && (
                <motion.div key="payments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                  {myPayments.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      {[
                        { label: t("dash.totalDonated"), value: `৳${myPayments.filter(p => p.status === "approved").reduce((s, p) => s + p.amount, 0).toLocaleString()}`, color: "#60A5FA" },
                        { label: t("dash.pending"),      value: myPayments.filter(p => p.status === "pending").length,  color: "#2563EB" },
                        { label: t("dash.verified"),     value: myPayments.filter(p => p.status === "approved").length, color: "#22C55E" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="p-3 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <p style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.1rem", color }}>{value}</p>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: F }}>{label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {myPayments.length === 0 ? (
                    <div className="rounded-3xl p-14 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <Wallet size={32} className="mx-auto mb-4 opacity-20 text-white" />
                      <p className="text-white/30 text-sm mb-4" style={{ fontFamily: F }}>{t("dash.noPayments")}</p>
                      <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
                        style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", fontFamily: F }}>{t("dash.donateNow")}</Link>
                    </div>
                  ) : (
                    myPayments.map((pay, i) => {
                      const ps = PAY_STATUS[pay.status] || PAY_STATUS.pending;
                      return (
                        <motion.div key={pay._id || pay.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: pay.method === "bkash" ? "rgba(226,19,110,0.2)" : "rgba(229,32,40,0.2)", color: pay.method === "bkash" ? "#E2136E" : "#E52028", fontFamily: FH }}>
                            {pay.method === "bkash" ? "bK" : "NG"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-white" style={{ fontFamily: FH, fontSize: "0.9rem" }}>৳{pay.amount.toLocaleString()}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: ps.bg, color: ps.color, fontFamily: F }}>{ps.label}</span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.28)", fontFamily: F }}>
                              {pay.method === "bkash" ? "bKash" : "Nagad"} · {pay.transactionId} · {pay.date}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {/* Profile */}
              {tab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-white font-semibold" style={{ fontFamily: FH }}>{t("dash.myProfile")}</p>
                      <button onClick={() => setShowEditModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                        style={{ background: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.2)", fontFamily: F }}>
                        <Edit3 size={12} /> {t("dash.editProfile")}
                      </button>
                    </div>
                    <div className="p-6 grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: User,       label: t("dash.fullName"),           value: currentUser.name },
                        { icon: Mail,       label: t("dash.email"),              value: currentUser.email },
                        { icon: Phone,      label: t("dash.phone"),              value: currentUser.phone },
                        { icon: CreditCard, label: t("dash.studentNid"),         value: currentUser.studentId || (isBn ? "প্রদান করা হয়নি" : "Not provided") },
                        { icon: Calendar,   label: t("dash.memberSinceLabel"),   value: currentUser.joinDate },
                        { icon: TrendingUp, label: t("dash.booksBorrowedLabel"), value: `${myRequests.length} ${isBn ? "টি বই" : "books"}` },
                        { icon: Package,    label: t("dash.activeLabel"),        value: `${activeRequests.length} ${isBn ? "টি" : "active"}` },
                        { icon: Wallet,     label: t("dash.totalDonatedLabel"),  value: `৳${myPayments.filter(p => p.status === "approved").reduce((s, p) => s + p.amount, 0).toLocaleString()}` },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(96,165,250,0.08)" }}>
                            <Icon size={14} style={{ color: "#60A5FA" }} />
                          </div>
                          <div>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: F }}>{label}</p>
                            <p className="text-sm text-white font-medium" style={{ fontFamily: F }}>{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 pb-6">
                      <button onClick={() => setShowEditModal(true)}
                        className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 text-white transition-all hover:scale-[1.01]"
                        style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F }}>
                        <Edit3 size={15} /> {t("dash.editMyInfo")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <ProfileEditModal user={currentUser} onSave={handleSaveProfile} onClose={() => setShowEditModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}