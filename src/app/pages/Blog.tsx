import { useState } from "react";
import { motion } from "motion/react";
import { Clock, ArrowRight, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { PageSkeleton } from "../components/Skeleton";

const CATEGORIES = ["All", "Impact Stories", "Accessibility", "Milestones", "Community", "Product"];

export default function Blog() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { blogPosts, isLoading } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";

  if (isLoading) return <PageSkeleton />;

  const filtered = blogPosts.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-16" style={{ background: "#FAFAFA" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600 }}>{t("blog.label")}</p>
            <h1 className="text-white mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {t("blog.title")}
            </h1>
            <p className="text-white/60 mb-8" style={{ fontFamily: F }}>{t("blog.subtitle")}</p>
            <div className="relative max-w-md mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("blog.searchPlaceholder")}
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-gray-800 outline-none shadow-lg"
                style={{ fontFamily: F }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-5 py-2 rounded-full text-sm transition-all"
              style={{
                background: category === cat ? "#2563EB" : "#fff",
                color: category === cat ? "#fff" : "#6B7280",
                border: category === cat ? "none" : "1px solid #e5e7eb",
                fontFamily: F, fontWeight: category === cat ? 600 : 400,
                boxShadow: category === cat ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {filtered.length > 0 && category === "All" && !search && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="rounded-3xl overflow-hidden mb-8 group cursor-pointer hover:-translate-y-1 transition-all duration-300"
            style={{ boxShadow: "0 8px 40px rgba(37,99,235,0.12)" }}>
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img src={filtered[0].cover} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>
              <div className="md:w-1/2 p-8 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "#2563EB15", color: "#2563EB", fontFamily: F }}>
                    ⭐ {t("blog.featuredBadge")}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#60A5FA15", color: "#2563EB", fontFamily: F }}>
                    {filtered[0].category}
                  </span>
                </div>
                <h2 className="mb-3 group-hover:text-[#2563EB] transition-colors" style={{ fontFamily: FH, fontWeight: 700, fontSize: "1.4rem", color: "#060F1E" }}>
                  {filtered[0].title}
                </h2>
                <p className="text-gray-500 mb-5 leading-relaxed" style={{ fontFamily: F }}>{filtered[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400" style={{ fontFamily: F }}>
                    <span>{filtered[0].author}</span><span>·</span><span>{filtered[0].date}</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:gap-3 transition-all" style={{ fontFamily: F }}>
                    {t("blog.readMore")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(category === "All" && !search ? filtered.slice(1) : filtered).map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden bg-white cursor-pointer group hover:-translate-y-1 transition-all duration-300"
              style={{ boxShadow: "0 4px 24px rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.05)" }}>
              <div className="relative h-48 overflow-hidden">
                <img src={post.cover} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(29,78,216,0.85)" }}>
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="mb-2 line-clamp-2 group-hover:text-[#2563EB] transition-colors" style={{ fontFamily: FH, fontWeight: 600, color: "#060F1E" }}>
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2" style={{ fontFamily: F }}>{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400" style={{ fontFamily: F }}>
                    <Clock size={11} /><span>{post.readTime} {t("blog.minRead")}</span>
                  </div>
                  <button className="text-xs font-semibold text-[#2563EB] flex items-center gap-1 hover:gap-2 transition-all" style={{ fontFamily: F }}>
                    {t("blog.readMore")} <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-500" style={{ fontFamily: F }}>{t("blog.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}