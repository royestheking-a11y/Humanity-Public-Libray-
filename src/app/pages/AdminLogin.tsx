import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Shield, Eye, EyeOff, Lock, AlertCircle, BookOpen,
  Users, BarChart2, Globe
} from "lucide-react";
import { useApp } from "../context/AppContext";

const INFO_ITEMS = [
  { icon: BookOpen, label: "52,000+ Books Under Management" },
  { icon: Users, label: "248,000+ Global Users Served" },
  { icon: BarChart2, label: "Real-Time Analytics & Reporting" },
  { icon: Globe, label: "47 Countries — International Reach" },
];

export default function AdminLogin() {
  const { isAdmin, setIsAdmin } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Please enter your admin password.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (password === "admin123") {
      setIsAdmin(true);
      navigate("/admin", { replace: true });
    } else {
      setError("Incorrect password. Demo hint: admin123");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #020912, #060F1E, #0C1A2E)" }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(37,99,235,0.12), rgba(29,78,216,0.06))",
          borderRight: "1px solid rgba(37,99,235,0.12)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(37,99,235,0.2), transparent 60%)",
          }}
        />
        <div className="relative z-10 text-center max-w-sm">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-8 border-4 shadow-2xl"
            style={{ borderColor: "rgba(96,165,250,0.5)" }}
          >
            <img
              src="/assets/logo.png"
              alt="Humanity Public Library"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h1
              className="text-white mb-2"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "2.2rem" }}
            >
              Humanity Public Library
            </h1>
            <p
              style={{
                color: "#60A5FA",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.18em",
                fontSize: "0.75rem",
              }}
            >
              ADMIN CONTROL CENTER
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-px my-8 mx-auto w-40"
            style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)" }}
          />

          {/* Info items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 text-left"
          >
            {INFO_ITEMS.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)" }}
                >
                  <Icon size={16} style={{ color: "#60A5FA" }} />
                </div>
                <span
                  className="text-white/60"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                >
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}>
                <Shield size={28} className="text-white" />
              </div>
              <h1 className="text-white mb-1" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.8rem" }}>
                Admin Access
              </h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>Secure admin portal</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="Admin password"
                  className="w-full pl-11 pr-12 py-4 rounded-xl outline-none text-white"
                  style={{ background: "rgba(37,99,235,0.08)", border: "1.5px solid rgba(37,99,235,0.2)", fontFamily: "'Inter', sans-serif" }} />
                <button onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} style={{ color: "#ef4444" }} />
                  <p className="text-sm" style={{ color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>{error}</p>
                </div>
              )}
              <button onClick={handleLogin} disabled={isLoading}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Shield size={16} /> Access Dashboard</>}
              </button>
            </div>
            <div className="text-center mt-6">
              <a href="/" className="text-sm transition-all hover:opacity-80" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}>
                ← Back to site
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}