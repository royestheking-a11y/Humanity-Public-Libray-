import { useState } from "react";
import { motion } from "motion/react";
import { Check, Clock, Heart, ArrowRight } from "lucide-react";
// Removed static mock import
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { toast } from "sonner";
import type { VolunteerApplication } from "../context/AppContext";

export default function Volunteer() {
  const { addVolunteerApplication, volunteerApplications, volunteerRoles } = useApp();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "", motivation: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !selectedRole) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    const app: VolunteerApplication = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: selectedRole,
      experience: form.experience,
      motivation: form.motivation,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
    addVolunteerApplication(app);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const alreadyApplied = volunteerApplications.some((a) => a.email === form.email && a.role === selectedRole);

  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  return (
    <div className="min-h-screen pt-16" style={{ background: "#F0F6FF" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600 }}>{t("vol.label")}</p>
            <h1 className="text-white mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {t("vol.title")}
            </h1>
            <p className="text-white/70 text-lg" style={{ fontFamily: F }}>
              {t("vol.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center p-12 rounded-3xl bg-white"
            style={{ boxShadow: "0 8px 40px rgba(37,99,235,0.1)" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, #22C55E, #16a34a)" }}
            >
              <Check size={36} className="text-white" />
            </motion.div>
            <h2 className="mb-3" style={{ fontFamily: FH, fontWeight: 700, color: "#060F1E", fontSize: "1.8rem" }}>
              {t("vol.success.title")}
            </h2>
            <p className="text-gray-500 mb-2" style={{ fontFamily: F }}>
              {isBn ? `আপনি "${selectedRole}" হিসেবে আবেদন করেছেন।` : `Thank you for applying as a ${selectedRole}.`}
            </p>
            <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: F }}>{t("vol.success.desc")}</p>
            <button
              onClick={() => { setSubmitted(false); setShowForm(false); setSelectedRole(null); setForm({ name: "", email: "", phone: "", experience: "", motivation: "" }); }}
              className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" }}
            >
              {t("vol.success.btn")}
            </button>
          </motion.div>
        ) : !showForm ? (
          <>
            {/* Role Cards */}
            <div className="mb-10">
              <h2 className="mb-2 text-center" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.5rem", color: "#060F1E" }}>
                {t("vol.chooseRole")}
              </h2>
              <p className="text-center text-gray-500 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>Select the role that best matches your skills and availability.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {volunteerRoles.map((role, i) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="p-6 rounded-2xl bg-white cursor-pointer hover:-translate-y-1 transition-all group"
                    style={{
                      background: selectedRole === role.title ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#fff",
                      color: selectedRole === role.title ? "#fff" : "#374151",
                      boxShadow: selectedRole === role.title ? "0 8px 24px rgba(37,99,235,0.35)" : "0 2px 12px rgba(0,0,0,0.06)",
                      border: selectedRole === role.title ? "none" : "1px solid rgba(37,99,235,0.08)",
                    }}
                    onClick={() => setSelectedRole(role.title)}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto text-2xl"
                      style={{ background: selectedRole === role.title ? "rgba(255,255,255,0.2)" : "rgba(37,99,235,0.1)" }}>
                      {role.icon}
                    </div>
                    <h3 className="font-semibold mb-1" style={{ fontFamily: FH, color: selectedRole === role.title ? "#fff" : "#060F1E", fontSize: "0.95rem" }}>{role.title}</h3>
                    <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{role.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={13} className="text-gray-400" />
                      <span className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{role.commitment}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.skills.slice(0, 2).map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 rounded-full"
                          style={{ background: "rgba(37,99,235,0.08)", color: "#2563EB", fontFamily: F }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    {selectedRole === role.title && (
                      <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                        <Check size={14} className="text-white" />
                        <span className="text-xs font-semibold text-white" style={{ fontFamily: F }}>{isBn ? "নির্বাচিত" : "Selected"}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-gray-600 mb-4" style={{ fontFamily: F }}>
                  {isBn ? "নির্বাচিত:" : "Selected:"} <strong style={{ color: "#2563EB" }}>{selectedRole}</strong>
                </p>
                <button onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all hover:scale-105 hover:shadow-xl"
                  style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" }}>
                  {isBn ? "এখন আবেদন করুন" : "Apply Now"} <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {/* My Applications */}
            {volunteerApplications.length > 0 && (
              <div className="mt-12 p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <h3 className="mb-4" style={{ fontFamily: FH, fontWeight: 600, color: "#060F1E" }}>{isBn ? "আমার আবেদনসমূহ" : "My Applications"}</h3>
                <div className="space-y-3">
                  {volunteerApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold" style={{ fontFamily: F, color: "#060F1E" }}>{app.role}</p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Applied on {app.date}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#60A5FA20", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>
                        Under Review
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Application Form */
          <div className="max-w-xl mx-auto">
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-gray-800 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              ← Back to Roles
            </button>
            <div className="p-8 rounded-3xl bg-white" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
              <h2 className="mb-2" style={{ fontFamily: FH, fontWeight: 700, color: "#060F1E", fontSize: "1.5rem" }}>
                {isBn ? `"${selectedRole}" হিসেবে আবেদন করুন` : `Apply as ${selectedRole}`}
              </h2>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Fill out the form below. We'll contact you within 3-5 business days.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none text-gray-700"
                    style={{ border: "2px solid #e5e7eb", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none text-gray-700"
                    style={{ border: "2px solid #e5e7eb", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+880 ..."
                    className="w-full px-4 py-3 rounded-xl outline-none text-gray-700"
                    style={{ border: "2px solid #e5e7eb", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Relevant Experience</label>
                  <textarea
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="Tell us about your relevant skills and experience..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl resize-none outline-none text-gray-700"
                    style={{ border: "2px solid #e5e7eb", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Why do you want to volunteer?</label>
                  <textarea
                    value={form.motivation}
                    onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                    placeholder="Share your motivation for joining our mission..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl resize-none outline-none text-gray-700"
                    style={{ border: "2px solid #e5e7eb", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || alreadyApplied}
                  className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                  style={{ background: isSubmitting || alreadyApplied ? "rgba(107,114,128,0.5)" : "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F, boxShadow: isSubmitting || alreadyApplied ? "none" : "0 8px 24px rgba(37,99,235,0.35)" }}
                >
                  {isSubmitting ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : alreadyApplied ? (
                    <><Check size={18} /> Already Applied</>
                  ) : (
                    <><Heart size={18} /> Submit Application</>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}