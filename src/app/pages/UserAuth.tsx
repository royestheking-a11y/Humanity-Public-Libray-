import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, CreditCard,
  ArrowLeft, AlertCircle, CheckCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";

export default function UserAuth() {
  const { login, register, googleLogin } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "register">(
    location.pathname.includes("register") ? "register" : "login"
  );

  useEffect(() => {
    setMode(location.pathname.includes("register") ? "register" : "login");
  }, [location.pathname]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginShowPass, setLoginShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", studentId: "", password: "", confirm: "" });
  const [regShowPass, setRegShowPass] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPass) { setLoginError(t("auth.fillAllFields")); return; }
    setLoginLoading(true);
    setLoginError("");
    try {
      await login({ email: loginEmail, password: loginPass });
      navigate("/user/dashboard", { replace: true });
    } catch (err: any) {
      setLoginError(err.message || t("auth.invalidCredentials"));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    const { name, email, phone, password, confirm, studentId } = regForm;
    if (!name || !email || !phone || !password || !confirm) { setRegError(t("auth.fillAllRequired")); return; }
    if (!/^01[3-9]\d{8}$/.test(phone)) { setRegError(t("auth.invalidPhone")); return; }
    if (password.length < 6) { setRegError(t("auth.shortPassword")); return; }
    if (password !== confirm) { setRegError(t("auth.passwordMismatch")); return; }
    
    setRegLoading(true);
    setRegError("");
    try {
      await register({ name, email, phone, password, studentId });
      setRegSuccess(true);
      setTimeout(() => navigate("/user/dashboard", { replace: true }), 1200);
    } catch (err: any) {
      setRegError(err.message || t("auth.emailExists"));
    } finally {
      setRegLoading(false);
    }
  };

  const gLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoginLoading(true);
      setRegLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
        navigate("/user/dashboard", { replace: true });
      } catch (err: any) {
        setLoginError(err.message || "Google login failed");
        setRegError(err.message || "Google registration failed");
      } finally {
        setLoginLoading(false);
        setRegLoading(false);
      }
    },
    onError: () => {
      setLoginError("Google Auth Error");
      setRegError("Google Auth Error");
    }
  });

  const inputBase = {
    border: "1.5px solid rgba(37,99,235,0.15)",
    background: "rgba(37,99,235,0.06)",
    color: "#fff", fontFamily: F,
  };

  const googleBtnStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontFamily: F,
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #020912, #060F1E, #0C1A2E)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 50%, rgba(37,99,235,0.25), transparent 60%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.12), transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.15) 0%, transparent 50%)" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <Link to="/" className="flex items-center gap-3 justify-center mb-10">
            <div className="w-14 h-14 rounded-full overflow-hidden" style={{ border: "2px solid rgba(37,99,235,0.5)", boxShadow: "0 0 24px rgba(37,99,235,0.2)" }}>
              <img src="/assets/logo.png" alt="HPL" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-white" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.2rem" }}>
                {isBn ? "হিউম্যানিটি" : "Humanity"}
              </p>
              <p style={{ color: "#60A5FA", fontFamily: F, fontSize: "0.65rem", letterSpacing: isBn ? "0.04em" : "0.14em", fontWeight: 600 }}>
                {isBn ? "পাবলিক লাইব্রেরি" : "PUBLIC LIBRARY"}
              </p>
            </div>
          </Link>
          <h2 className="text-white mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
            {isBn ? "জ্ঞান অ্যাক্সেস করুন" : "Access Knowledge"}
          </h2>
          <p className="text-white/50 max-w-sm mx-auto" style={{ fontFamily: F }}>
            {isBn ? "৫২,০০০+ বিনামূল্যে বই এবং অডিওবুক পান।" : "52,000+ free books and audiobooks — your gateway to limitless learning."}
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { v: "52K+", l: isBn ? "বই" : "Books" },
              { v: "248K", l: isBn ? "পাঠক" : "Readers" },
              { v: "47",   l: isBn ? "দেশ" : "Countries" },
            ].map(({ v, l }) => (
              <div key={l} className="p-3 rounded-2xl text-center" style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}>
                <p style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.4rem", color: "#60A5FA" }}>{v}</p>
                <p className="text-white/40 text-xs" style={{ fontFamily: F }}>{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm transition-all hover:opacity-80" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>
            <ArrowLeft size={15} /> {t("nav.backToSite")}
          </Link>

          {/* Tab Toggle */}
          <div className="flex gap-1 p-1 rounded-2xl mb-8" style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}>
            {([["login", t("auth.login")], ["register", t("auth.register")]] as const).map(([m, label]) => (
              <button key={m} onClick={() => navigate(m === "login" ? "/user/login" : "/user/register", { replace: true })}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: mode === m ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "transparent", color: mode === m ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: F }}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                <h1 className="text-white mb-1" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.8rem" }}>{t("auth.welcome")}</h1>
                <p className="mb-8" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{t("auth.welcomeSub")}</p>
                
                {/* Google Login Button */}
                <button 
                  onClick={() => gLogin()}
                  className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all hover:bg-white/10 mb-6"
                  style={googleBtnStyle}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
                  {isBn ? "গুগল দিয়ে চালিয়ে যান" : "Continue with Google"}
                </button>

                <div className="relative mb-8 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <span className="relative px-4 text-xs uppercase tracking-widest bg-[#060F1E]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: F }}>
                    {isBn ? "অথবা ইমেল" : "OR EMAIL"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{t("auth.email")}</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
                      <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                        placeholder={t("auth.emailPlaceholder")} className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all" style={inputBase} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{t("auth.password")}</label>
                      <button className="text-xs" style={{ color: "#60A5FA", fontFamily: F }}>{t("auth.forgotPassword")}</button>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
                      <input type={loginShowPass ? "text" : "password"} value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                        placeholder={t("auth.passwordPlaceholder")} className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none transition-all" style={inputBase} />
                      <button onClick={() => setLoginShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {loginShowPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  {loginError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <AlertCircle size={14} style={{ color: "#ef4444" }} />
                      <p className="text-sm" style={{ color: "#ef4444", fontFamily: F }}>{loginError}</p>
                    </div>
                  )}
                  <button onClick={handleLogin} disabled={loginLoading}
                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F, boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}>
                    {loginLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t("auth.loginBtn")}
                  </button>
                </div>
                <p className="text-center mt-6 text-sm" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>
                  {t("auth.noAccount")}{" "}
                  <button onClick={() => setMode("register")} style={{ color: "#60A5FA", fontWeight: 600 }}>{t("auth.switchRegister")}</button>
                </p>
              </motion.div>
            ) : (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h1 className="text-white mb-1" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.8rem" }}>{t("auth.welcomeNew")}</h1>
                <p className="mb-6" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>{t("auth.welcomeNewSub")}</p>
                
                {/* Google Sign Up Button */}
                <button 
                  onClick={() => gLogin()}
                  className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all hover:bg-white/10 mb-6"
                  style={googleBtnStyle}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
                  {isBn ? "গুগল দিয়ে সাইন আপ করুন" : "Sign up with Google"}
                </button>

                <div className="relative mb-6 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <span className="relative px-4 text-xs uppercase tracking-widest bg-[#060F1E]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: F }}>
                    {isBn ? "অথবা ইমেল" : "OR EMAIL"}
                  </span>
                </div>

                {regSuccess && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <CheckCircle size={14} style={{ color: "#22C55E" }} />
                    <p className="text-sm" style={{ color: "#22C55E", fontFamily: F }}>{t("auth.registerSuccess")}</p>
                  </div>
                )}
                <div className="space-y-3">
                  {[
                    { icon: User,       label: t("auth.name"),      key: "name",      value: regForm.name,      placeholder: t("auth.namePlaceholder"),      type: "text" },
                    { icon: Mail,       label: t("auth.email"),     key: "email",     value: regForm.email,     placeholder: t("auth.emailPlaceholder"),     type: "email" },
                    { icon: Phone,      label: t("auth.phone"),     key: "phone",     value: regForm.phone,     placeholder: t("auth.phonePlaceholder"),     type: "tel" },
                    { icon: CreditCard, label: t("auth.studentId"),key: "studentId", value: regForm.studentId, placeholder: t("auth.studentIdPlaceholder"), type: "text" },
                  ].map(({ icon: Icon, label, key, value, placeholder, type }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)", fontFamily: F }}>{label}</label>
                      <div className="relative">
                        <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.22)" }} />
                        <input type={type} value={value} onChange={e => setRegForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder} className="w-full pl-11 pr-4 py-3 rounded-xl outline-none text-sm" style={inputBase} />
                      </div>
                    </div>
                  ))}
                  {[
                    { label: t("auth.password"),        val: regForm.password, key: "password", placeholder: t("auth.passwordPlaceholder") },
                    { label: t("auth.confirmPassword"), val: regForm.confirm,  key: "confirm",  placeholder: t("auth.confirmPlaceholder") },
                  ].map(({ label, val, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)", fontFamily: F }}>{label}</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.22)" }} />
                        <input type={regShowPass ? "text" : "password"} value={val} onChange={e => setRegForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder} className="w-full pl-11 pr-12 py-3 rounded-xl outline-none text-sm" style={inputBase} />
                        <button onClick={() => setRegShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.22)" }}>
                          {regShowPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {regError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <AlertCircle size={14} style={{ color: "#ef4444" }} />
                      <p className="text-sm" style={{ color: "#ef4444", fontFamily: F }}>{regError}</p>
                    </div>
                  )}
                  <button onClick={handleRegister} disabled={regLoading}
                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F, boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}>
                    {regLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t("auth.registerBtn")}
                  </button>
                </div>
                <p className="text-center mt-5 text-sm" style={{ color: "rgba(255,255,255,0.35)", fontFamily: F }}>
                  {t("auth.hasAccount")}{" "}
                  <button onClick={() => setMode("login")} style={{ color: "#60A5FA", fontWeight: 600 }}>{t("auth.switchLogin")}</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
