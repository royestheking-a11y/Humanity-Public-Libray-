import { motion } from "motion/react";
import { 
  Target, Eye, Heart, MapPin, Mail, Phone, Users2 
} from "lucide-react";
import { useLang } from "../context/LangContext";
import { useApp } from "../context/AppContext";
import { PageSkeleton } from "../components/Skeleton";

const TEAM = [
  { name: "Arafat Hossain", role: "Founder & Executive Director", initials: "AH", image: "" },
  { name: "Taslima Begum", role: "Operations Lead", initials: "TB", image: "" },
  { name: "Laboni Labonno", role: "Women in Maritime & Coastal Resilience Coordinator", initials: "LL", image: "" },
  { name: "Ashikur Rahman", role: "International Affairs Coordinator", initials: "AR", image: "" },
  { name: "Madhusudan Mondal", role: "Development Coordinator", initials: "MM", image: "" },
  { name: "Jobayer Islam", role: "Education & Projects Coordinator", initials: "JI", image: "" },
  { name: "Hasibul Alam Hridoy", role: "Climate Change & Migration Lab Coordinator (Architect)", initials: "HH", image: "" },
  { name: "Mir MD Salauddin", role: "Monitoring, Evaluation & Learning (MEL) Coordinator", initials: "MS", image: "" },
  { name: "Tonmoy", role: "Finance Coordinator", initials: "TY", image: "" },
  { name: "Toufiquzzaman", role: "Communications & Outreach Coordinator", initials: "TZ", image: "" },
  { name: "Rifat Shahriar", role: "Volunteer Coordinator", initials: "RS", image: "" },
  { name: "Nurul Fakir", role: "Land Donor & Librarian", initials: "NF", image: "" },
];

const ADVISORS = [
  "Prof Dr. Navid Saleh, University of Texas at Austin, USA",
  "Prof Dr. Shaikh Sadi, University of Chittagong",
  "Prof Dr. Hanif Baul, CU",
  "Prof Dr Tuhin Roy, Khulna University",
  "Mohammad Ali, Assistant Prof, CU",
  "Sujon, CEO - GIGABIT",
  "Abel Atares",
  "Pablo Bescos",
  "Abdul Aziz Sardar"
];

const PARTNERS = [
  { name: "Chittagong University Disable Student Society (DISSCU)", color: "#2563EB" },
  { name: "Youth Climate Network", color: "#16a34a" },
  { name: "Humanity Public Library Org", color: "#1D4ED8" }
];

export default function About() {
  const { isBn, bnFont } = useLang();
  const { isLoading } = useApp();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="min-h-screen pt-16 bg-[#F0F6FF]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#60A5FA 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full mb-6 text-sm font-semibold tracking-wider" 
              style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", color: "#60A5FA", fontFamily: F }}>
              ESTABLISHED 2021
            </span>
            <h1 className="text-white mb-6" style={{ fontFamily: FH, fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1 }}>
              Empowering Coastal <br /> <span style={{ color: "#60A5FA" }}>Communities</span>
            </h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: F }}>
              Humanity Public Library is a coastal, community-based learning hub dedicated to empowering 
              learners and families from climate-vulnerable regions of Bangladesh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <h2 className="mb-6" style={{ fontFamily: FH, fontWeight: 700, fontSize: "2.5rem", color: "#060F1E" }}>Our Story</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed" style={{ fontFamily: F }}>
                <p>
                  Established in late 2021 as a small terminal library, we expanded into a purpose-built, 
                  stable public library in 2023. We are located in Nalian Village, Dacope Upazila, Khulna — 
                  a region on the frontline of climate change.
                </p>
                <p>
                  We serve as a critical educational lifeline, providing free access to books and learning 
                  resources for all ages. Our borrowing system is simple and inclusive, allowing community 
                  members to take books home for up to one week.
                </p>
                <p>
                  More than just books, we are a dynamic community center hosting workshops, awareness 
                  sessions, and mentorship programs that foster lifelong learning and resilience.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                <img src="/assets/carousel_books_1.png" alt="Library" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 p-8 rounded-[2rem] bg-white shadow-xl max-w-[240px]" style={{ border: "1px solid rgba(37,99,235,0.1)" }}>
                <p className="text-4xl font-bold mb-1" style={{ fontFamily: FH, color: "#2563EB" }}>50K+</p>
                <p className="text-sm font-semibold text-gray-500" style={{ fontFamily: F }}>People impacted by climate disasters in our region.</p>
              </div>
            </motion.div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {[
              { icon: Target, title: "Our Mission", desc: "To provide accessible education and climate resilience knowledge to coastal communities.", color: "#2563EB" },
              { icon: Eye, title: "Our Vision", desc: "A sustainable, community-led learning model that fosters academic excellence and social empowerment.", color: "#60A5FA" },
              { icon: Heart, title: "Our Commitment", desc: "Ensuring no learner is left behind, specifically supporting students with disabilities.", color: "#1D4ED8" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="p-10 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all" style={{ border: "1px solid rgba(37,99,235,0.06)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${item.color}15` }}>
                  <item.icon size={32} style={{ color: item.color }} />
                </div>
                <h3 className="mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.5rem", color: "#060F1E" }}>{item.title}</h3>
                <p className="text-gray-500 leading-relaxed" style={{ fontFamily: F }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Founder's Statement */}
          <div className="mb-32 p-12 rounded-[3rem] bg-white relative overflow-hidden" style={{ border: "1px solid rgba(37,99,235,0.1)" }}>
             <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <Users2 size={200} />
             </div>
             <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                <div className="lg:col-span-1 text-center">
                   <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden mx-auto mb-6 shadow-xl" style={{ border: "4px solid #F0F6FF" }}>
                      {/* You can replace this div with an <img src="..." /> once a photo is available */}
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold">AH</div>
                   </div>
                   <h3 style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.5rem", color: "#060F1E" }}>Arafat Hossain</h3>
                   <p className="text-blue-600 font-semibold mb-4" style={{ fontFamily: F }}>Founder & President</p>
                   <div className="flex justify-center gap-4">
                      <a href="mailto:humanitypubliclibrary@gmail.com" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-blue-50 transition-all"><Mail size={18} className="text-gray-400 hover:text-blue-600" /></a>
                      <a href="tel:+8801911368538" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-blue-50 transition-all"><Phone size={18} className="text-gray-400 hover:text-blue-600" /></a>
                   </div>
                </div>
                <div className="lg:col-span-2">
                   <h4 className="text-sm uppercase tracking-[0.2em] text-blue-600 font-bold mb-6" style={{ fontFamily: F }}>Founder's Statement</h4>
                   <div className="space-y-6 text-gray-600 leading-relaxed italic" style={{ fontFamily: F, fontSize: "1.1rem" }}>
                      <p>"I grew up in the coastal villages of Khulna, one of Bangladesh’s most climate-vulnerable regions. Since the Bhola Cyclone (1970), our communities have repeatedly faced devastating storms. During Cyclone Aila (2009), I witnessed the harsh reality: children and youth in climate-vulnerable areas are often denied their basic right to education."</p>
                      <p>"This inspired me to establish Humanity Public Library in 2021. Today, we serve as a community learning hub, providing scholarships, environmental education, and practical solutions for local challenges. Every book and program is a step toward a resilient, educated, and empowered community."</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Team Section */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 style={{ fontFamily: FH, fontWeight: 700, fontSize: "3rem", color: "#060F1E" }}>Meet Our Team</h2>
              <p className="text-gray-500 max-w-2xl mx-auto mt-4" style={{ fontFamily: F }}>
                The dedicated individuals working tirelessly to bring education and resilience to the coast.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.05 }} viewport={{ once: true }}
                  className="p-6 rounded-3xl bg-white text-center hover:shadow-xl transition-all" style={{ border: "1px solid rgba(37,99,235,0.06)" }}>
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-xl overflow-hidden" style={{ fontFamily: FH }}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.initials
                    )}
                  </div>
                  <h4 style={{ fontFamily: FH, fontWeight: 700, color: "#060F1E" }}>{member.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider" style={{ fontFamily: F }}>{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Advisors */}
          <div className="mb-32">
            <h3 className="text-center mb-12" style={{ fontFamily: FH, fontWeight: 700, fontSize: "2rem", color: "#060F1E" }}>Our Advisors</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {ADVISORS.map((advisor) => (
                <span key={advisor} className="px-6 py-3 rounded-2xl bg-white text-sm font-semibold text-gray-700 shadow-sm" style={{ border: "1px solid rgba(37,99,235,0.08)", fontFamily: F }}>
                  {advisor}
                </span>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-center mb-12" style={{ fontFamily: FH, fontWeight: 700, fontSize: "2rem", color: "#060F1E" }}>Partners & Supporters</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {PARTNERS.map((partner) => (
                <div key={partner.name} className="px-8 py-6 rounded-[2rem] bg-white flex items-center gap-4 shadow-md hover:shadow-xl transition-all" style={{ border: "1px solid rgba(37,99,235,0.1)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: partner.color }}>
                    {partner.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-800 max-w-[200px]" style={{ fontFamily: F }}>{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #1D4ED8, #2563EB)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="mb-8" style={{ fontFamily: FH, fontWeight: 800, fontSize: "2.5rem" }}>Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"><MapPin size={24} /></div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-blue-200" style={{ fontFamily: F }}>Location</p>
                <p className="font-semibold" style={{ fontFamily: F }}>Nalian 9273, Sutarkhali, Dacope, Khulna</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"><Phone size={24} /></div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-blue-200" style={{ fontFamily: F }}>Contact</p>
                <p className="font-semibold" style={{ fontFamily: F }}>+88 01911 368538 (WhatsApp)</p>
              </div>
            </div>
          </div>
          <p className="text-blue-100" style={{ fontFamily: F }}>Email: humanitypubliclibrary@gmail.com</p>
        </div>
      </section>
    </div>
  );
}
