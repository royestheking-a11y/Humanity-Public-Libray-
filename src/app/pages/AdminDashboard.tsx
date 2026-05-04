import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, BookOpen, Heart, UserCheck, BarChart2, Settings,
  LogOut, Menu, X, Search, Plus, Edit3, Trash2, Check, AlertTriangle,
  Shield, Users, TrendingUp, Globe, ChevronRight, Headphones,
  Star, Download, CheckCircle, XCircle, MessageSquare,
  Sliders, ToggleLeft, ToggleRight, RefreshCw,
  FileText, Zap, Package,
  Wallet, Layers, Clock, CreditCard, Phone, Edit2,
  Waves, Fish, Wind, Palette, History, Droplets, Handshake,
  Calendar, MapPin
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { CarouselSlide, BookRequest } from "../context/AppContext";
import { toast } from "sonner";
import { api } from "../services/api";
import ImageUploader from "../components/ImageUploader";
import { DashboardSkeleton } from "../components/Skeleton";

// ── Types ─────────────────────────────────────────────────────────────────────
// Synchronized with MongoDB and Cloudinary
type Section = "overview" | "books" | "borrowing" | "payments" | "donations" | "volunteers" | "carousel" | "analytics" | "human-library" | "blogs" | "events" | "settings";

interface BookFormData {
  title: string; author: string; genre: string; language: string;
  pages: string; year: string; description: string;
  available: boolean; audioAvailable: boolean; cover: string; category: string;
  pdfUrl?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview" as Section, label: "Overview", icon: LayoutDashboard },
  { id: "books" as Section, label: "Books", icon: BookOpen },
  { id: "borrowing" as Section, label: "Borrowing", icon: Package },
  { id: "payments" as Section, label: "Payments", icon: Wallet },
  { id: "donations" as Section, label: "Donations", icon: Heart },
  { id: "volunteers" as Section, label: "Volunteers", icon: UserCheck },
  { id: "carousel" as Section, label: "Carousel", icon: Layers },
  { id: "analytics" as Section, label: "Analytics", icon: BarChart2 },
  { id: "human-library" as Section, label: "Human Library", icon: Users },
  { id: "blogs" as Section, label: "Blogs", icon: FileText },
  { id: "events" as Section, label: "Events", icon: Calendar },
  { id: "settings" as Section, label: "Settings", icon: Settings },
];

const GENRE_COLORS = ["#2563EB", "#60A5FA", "#1D4ED8", "#22C55E", "#6B7280"];

const GENRES = ["Fiction", "Science", "History", "Philosophy", "Education", "Technology", "Health", "Arts", "Biography", "Other"];
const LANGUAGES = ["English", "Bangla", "Arabic", "French", "Spanish", "Hindi", "Urdu"];

const EMPTY_FORM: BookFormData = {
  title: "", author: "", genre: "Fiction", language: "English",
  pages: "", year: new Date().getFullYear().toString(),
  description: "", available: true, audioAvailable: false,
  cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  category: "Literature",
  pdfUrl: "",
};

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({
  section, setSection, collapsed, setCollapsed, onLogout,
}: {
  section: Section;
  setSection: (s: Section) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onLogout: () => void;
}) {
  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? "68px" : "230px",
        background: "linear-gradient(180deg, #060F1E 0%, #0C1A2E 50%, #0F2040 100%)",
        borderRight: "1px solid rgba(37,99,235,0.15)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 p-4 border-b"
        style={{ borderColor: "rgba(96,165,250,0.1)", minHeight: "64px" }}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "rgba(96,165,250,0.5)" }}>
          <img src="/assets/logo.png" alt="HPL" className="w-full h-full object-cover object-top" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white truncate" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.85rem" }}>
              HPL Admin
            </p>
            <p style={{ color: "#60A5FA", fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.12em" }}>
              CONTROL CENTER
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-lg transition-colors flex-shrink-0"
          style={{ color: "rgba(255,255,255,0.3)" }}
          aria-label="Toggle sidebar"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto mt-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = section === id;
          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              className="w-full flex items-center gap-3 rounded-xl transition-all duration-200 group"
              style={{
                padding: collapsed ? "10px 12px" : "10px 14px",
                background: active ? "rgba(96,165,250,0.15)" : "transparent",
                border: active ? "1px solid rgba(96,165,250,0.25)" : "1px solid transparent",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? label : ""}
            >
              <Icon
                size={17}
                style={{ color: active ? "#60A5FA" : "rgba(255,255,255,0.4)", flexShrink: 0 }}
              />
              {!collapsed && (
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: active ? 600 : 400,
                    fontSize: "0.875rem",
                    color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {label}
                </span>
              )}
              {!collapsed && active && (
                <ChevronRight size={14} style={{ color: "#60A5FA", marginLeft: "auto" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t" style={{ borderColor: "rgba(96,165,250,0.1)" }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all hover:bg-red-500/10 group"
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          title={collapsed ? "Log Out" : ""}
        >
          <LogOut size={16} style={{ color: "rgba(239,68,68,0.6)" }} />
          {!collapsed && (
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "rgba(239,68,68,0.6)" }}>
              Log Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

// ── Overview Section ──────────────────────────────────────────────────────────
function OverviewSection() {
  const { stats, payments, bookRequests } = useApp();
  
  const kpis = [
    { label: "Total Books", value: (stats?.totalBooks || 0).toLocaleString(), change: (stats?.totalBooks || 0) > 0 ? "Live" : "Empty", icon: BookOpen, color: "#2563EB" },
    { label: "Active Users", value: (stats?.activeUsers || 0).toLocaleString(), change: "Active", icon: Users, color: "#2563EB" },
    { label: "Total Donations", value: `৳${(stats?.donations || 0).toLocaleString()}`, change: "Real-time", icon: Heart, color: "#60A5FA" },
    { label: "Volunteers", value: (stats?.volunteers || 0).toLocaleString(), change: "Verified", icon: UserCheck, color: "#22C55E" },
  ];

  // Dynamic monthly reads from bookRequests
  const monthlyReads = bookRequests.reduce((acc: any, req) => {
    const month = new Date(req.requestDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find((m: any) => m.month === month);
    if (existing) existing.reads += 1;
    else acc.push({ month, reads: 1 });
    return acc;
  }, []).slice(-6);

  // Dynamic revenue growth from payments
  const donationTrends = payments.filter(p => p.status === "approved").reduce((acc: any, p) => {
    const month = new Date(p.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find((m: any) => m.month === month);
    if (existing) existing.amount += p.amount;
    else acc.push({ month, amount: p.amount });
    return acc;
  }, []).slice(-6);

  const chartData = {
    monthlyReads: monthlyReads.length ? monthlyReads : [{ month: "No Data", reads: 0 }],
    donationTrends: donationTrends.length ? donationTrends : [{ month: "No Data", amount: 0 }],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-green-500" style={{ fontFamily: "'Inter', sans-serif" }}>{change}</span>
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "#060F1E" }}>{value}</p>
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Monthly Reads</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData.monthlyReads}>
              <defs>
                <linearGradient id="overviewReadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <YAxis tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: "'Inter', sans-serif", borderRadius: "12px", border: "1px solid #e5e7eb" }} />
              <Area type="monotone" dataKey="reads" stroke="#2563EB" strokeWidth={2} fill="url(#overviewReadsGrad)" name="Reads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Donation Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData.donationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <YAxis tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: "'Inter', sans-serif", borderRadius: "12px" }} />
              <Bar dataKey="amount" fill="#60A5FA" radius={[6, 6, 0, 0]} name="Donations (৳)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Genre Distribution</h3>
          <p className="text-xs text-gray-400 mb-4">Visit Analytics for details</p>
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-2xl">
            <BarChart2 size={24} className="text-gray-200" />
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Recent Donations</h3>
          <div className="space-y-3">
            {payments.filter(p => p.purpose === "donation").slice(0, 5).map((d) => (
              <div key={d._id || d.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>
                    {d.userName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif", color: "#060F1E" }}>{d.userName}</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{d.date} · {d.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: "#60A5FA", fontFamily: "'Sora', sans-serif" }}>৳{d.amount}</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{d.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Books Section ──────────────────────────────────────────────────────────────
function BooksSection() {
  const { books } = useApp();
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [deletingBook, setDeletingBook] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<BookFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filtered = books.filter((b: any) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchGenre = filterGenre === "All" || b.genre === filterGenre;
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Available" && b.available) ||
      (filterStatus === "Borrowed" && !b.available);
    return matchSearch && matchGenre && matchStatus;
  });

  const openAdd = () => {
    setIsAdding(true);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (book: any) => {
    setIsAdding(false);
    setEditingBook(book);
    setForm({
      title: book.title, author: book.author, genre: book.genre,
      language: book.language, pages: String(book.pages), year: String(book.year),
      description: book.description, available: book.available,
      audioAvailable: book.audioAvailable, cover: book.cover, category: book.category,
      pdfUrl: book.pdfUrl || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.author) return;
    setIsSaving(true);
    try {
      if (isAdding) {
        await api.post("books", {
          ...form,
          pages: parseInt(form.pages) || 200,
          year: parseInt(form.year) || 2024,
          rating: 4.5, downloads: 0, saves: 0,
        });
        toast.success("Book added successfully!");
      } else if (editingBook) {
        await api.put("books", (editingBook._id || editingBook.id)!, {
          ...form,
          pages: parseInt(form.pages) || 200,
          year: parseInt(form.year) || 2024,
        });
        toast.success("Book updated successfully!");
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
        setEditingBook(null);
        window.location.reload(); // Quick way to refresh data for now
      }, 1000);
    } catch (err) {
      toast.error("Failed to save book");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBook) return;
    try {
      await api.delete("books", deletingBook._id || deletingBook.id);
      toast.success("Book deleted successfully!");
      setDeletingBook(null);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete book");
    }
  };

  const uniqueGenres = ["All", ...Array.from(new Set(books.map((b: any) => b.genre)))];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books or authors..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "#fff", border: "1px solid #e5e7eb", fontFamily: "'Inter', sans-serif", color: "#374151" }}
            />
          </div>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "#fff", border: "1px solid #e5e7eb", fontFamily: "'Inter', sans-serif", color: "#6B7280" }}
          >
            {uniqueGenres.map((g) => <option key={g}>{g}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "#fff", border: "1px solid #e5e7eb", fontFamily: "'Inter', sans-serif", color: "#6B7280" }}
          >
            {["All", "Available", "Borrowed"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}
        >
          <Plus size={15} /> Add Book
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <span style={{ color: "#6B7280" }}>Showing <strong style={{ color: "#060F1E" }}>{filtered.length}</strong> of {books.length} books</span>
        <span style={{ color: "#22C55E" }}>{books.filter((b) => b.available).length} Available</span>
        <span style={{ color: "#ef4444" }}>{books.filter((b) => !b.available).length} Borrowed</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Book", "Author", "Genre", "Lang", "Status", "Downloads", "Rating", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={book.cover} alt={book.title} className="w-10 h-13 rounded-lg object-cover flex-shrink-0" style={{ height: "52px", width: "40px" }} />
                      <div>
                        <p className="text-sm font-semibold line-clamp-1 max-w-36" style={{ fontFamily: "'Inter', sans-serif", color: "#060F1E" }}>{book.title}</p>
                        <p className="text-xs text-gray-400">{book.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>{book.author}</td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={{ background: "#2563EB10", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>{book.genre}</span>
                  </td>
                  <td className="p-4 text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{book.language}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: book.available ? "#22C55E15" : "#ef444415",
                          color: book.available ? "#22C55E" : "#ef4444",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {book.available ? "Available" : "Borrowed"}
                      </span>
                      {book.audioAvailable && (
                        <span title="Audio available">
                          <Headphones size={13} style={{ color: "#2563EB" }} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div className="flex items-center gap-1">
                      <Download size={12} className="text-gray-300" />
                      {(book.downloads / 1000).toFixed(1)}K
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#60A5FA" stroke="#60A5FA" />
                      <span className="text-sm font-semibold" style={{ color: "#60A5FA", fontFamily: "'Sora', sans-serif" }}>{book.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(book)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "#2563EB10", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeletingBook(book)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "#ef444415", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                    No books match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit/Add Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white"
              style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#2563EB10" }}>
                    {isAdding ? <Plus size={18} style={{ color: "#2563EB" }} /> : <Edit3 size={18} style={{ color: "#2563EB" }} />}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E" }}>
                      {isAdding ? "Add New Book" : "Edit Book"}
                    </h3>
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {isAdding ? "Fill in the book details below" : `Editing: ${editingBook?.title}`}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X size={18} style={{ color: "#6B7280" }} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Cover preview and Upload */}
                  <ImageUploader
                    value={form.cover}
                    onChange={(url) => setForm(f => ({ ...f, cover: url }))}
                    aspect={3 / 4}
                    label="Cover Image"
                  />

                  <ImageUploader
                    value={form.pdfUrl || ""}
                    onChange={(url) => setForm(f => ({ ...f, pdfUrl: url }))}
                    aspect={1}
                    label="Digital PDF (Optional)"
                  />

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Title", key: "title", full: true },
                    { label: "Author", key: "author" },
                    { label: "Category", key: "category" },
                  ].map(({ label, key, full }) => (
                    <div key={key} className={full ? "col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
                      <input
                        type="text"
                        value={(form as any)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-[#2563EB] transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  ))}

                  {/* Genre select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Genre</label>
                    <select
                      value={form.genre}
                      onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {GENRES.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>

                  {/* Language select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Language</label>
                    <select
                      value={form.language}
                      onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Pages</label>
                    <input
                      type="number"
                      value={form.pages}
                      onChange={(e) => setForm((f) => ({ ...f, pages: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Year</label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      min="1900" max="2099"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-[#2563EB] transition-colors resize-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  {[
                    { label: "Available", key: "available", color: "#22C55E" },
                    { label: "Audio Available", key: "audioAvailable", color: "#2563EB" },
                  ].map(({ label, key, color }) => (
                    <button
                      key={key}
                      onClick={() => setForm((f) => ({ ...f, [key]: !(f as any)[key] }))}
                      className="flex items-center gap-2"
                    >
                      {(form as any)[key] ? (
                        <ToggleRight size={24} style={{ color }} />
                      ) : (
                        <ToggleLeft size={24} style={{ color: "#9ca3af" }} />
                      )}
                      <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: (form as any)[key] ? color : "#9ca3af" }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100"
                  style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !form.title || !form.author}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
                  style={{ background: saveSuccess ? "linear-gradient(135deg, #22C55E, #16a34a)" : "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}
                >
                  {saveSuccess ? <><CheckCircle size={15} /> Saved!</> : <><Check size={15} /> {isAdding ? "Add Book" : "Save Changes"}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deletingBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center"
              style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "#ef444415" }}>
                <AlertTriangle size={28} style={{ color: "#ef4444" }} />
              </div>
              <h3 className="mb-2" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E" }}>Delete Book?</h3>
              <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                "<strong>{deletingBook.title}</strong>" will be permanently removed from the library.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingBook(null)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-gray-100"
                  style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", fontFamily: "'Inter', sans-serif" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Donations Section ──────────────────────────────────────────────────────────
function DonationsSection() {
  const { payments, stats } = useApp();
  const [search, setSearch] = useState("");
  const donations = payments.filter(p => p.purpose === "donation");
  const filtered = donations.filter((d) =>
    d.userName.toLowerCase().includes(search.toLowerCase())
  );

  const statsItems = [
    { label: "Total Raised", value: `৳${(stats?.donations || 0).toLocaleString()}`, change: "Updated Live" },
    { label: "Total Donors", value: donations.length.toString(), change: "Verified" },
    { label: "Avg. Donation", value: `৳${donations.length ? Math.round((stats?.donations || 0) / donations.length) : 0}`, change: "Per Donor" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsItems.map(({ label, value, change }) => (
          <div key={label} className="p-5 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <p className="text-sm text-gray-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "#60A5FA" }}>{value}</p>
            <p className="text-xs text-green-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              <TrendingUp size={11} className="inline mr-1" />{change}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>All Donations</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donors..."
              className="pl-8 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: "#f9f9f9", border: "1px solid #e5e7eb", fontFamily: "'Inter', sans-serif", color: "#374151" }}
            />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Donor", "Amount", "Tier", "Type", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d._id || d.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}>{d.userName[0]}</div>
                    <span className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif", color: "#060F1E" }}>{d.userName}</span>
                  </div>
                </td>
                <td className="p-4"><span className="font-bold text-sm" style={{ color: "#60A5FA", fontFamily: "'Sora', sans-serif" }}>৳{d.amount}</span></td>
                <td className="p-4"><span className="text-xs px-2 py-1 rounded-full" style={{ background: "#2563EB10", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>{d.tier || "Standard"}</span></td>
                <td className="p-4 text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>{d.method}</td>
                <td className="p-4 text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{d.date}</td>
                <td className="p-4">
                  <button
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                    style={{ background: "#2563EB10", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}
                  >
                    <FileText size={12} /> Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ── Volunteers Section ─────────────────────────────────────────────────────────
function VolunteersSection() {
  const { volunteerApplications } = useApp();
  const volunteers = volunteerApplications.map(v => ({
    name: v.name, role: v.role, date: v.date, status: "Pending" // Assuming pending for applications
  }));
  const [messaging, setMessaging] = useState<string | null>(null);
  const [msgText, setMsgText] = useState("");

  const handleApprove = (name: string) => {
    toast.success(`${name} approved!`);
  };

  const handleReject = (name: string) => {
    toast.error(`${name} application rejected.`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Volunteers", value: volunteers.length, color: "#22C55E", icon: UserCheck },
          { label: "Active", value: volunteers.filter((v) => v.status === "Active").length, color: "#2563EB", icon: CheckCircle },
          { label: "Pending Review", value: volunteers.filter((v) => v.status === "Pending").length, color: "#60A5FA", icon: AlertTriangle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="p-5 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "#060F1E" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Volunteer Applications</h3>
          <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: "#22C55E15", color: "#22C55E", fontFamily: "'Inter', sans-serif" }}>
            {volunteers.filter((v) => v.status === "Pending").length} pending
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Volunteer", "Role", "Applied", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, i) => (
              <tr key={`vol-${i}`} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}>
                      {v.name[0]}
                    </div>
                    <span className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif", color: "#060F1E" }}>{v.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#2563EB10", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>{v.role}</span>
                </td>
                <td className="p-4 text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{v.date}</td>
                <td className="p-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{
                    background: v.status === "Active" ? "#22C55E15" : v.status === "Rejected" ? "#ef444415" : "#60A5FA15",
                    color: v.status === "Active" ? "#22C55E" : v.status === "Rejected" ? "#ef4444" : "#2563EB",
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {v.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {v.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(v.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          style={{ background: "#22C55E15", color: "#22C55E", fontFamily: "'Inter', sans-serif" }}
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(v.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          style={{ background: "#ef444415", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setMessaging(v.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                      style={{ background: "#2563EB10", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}
                    >
                      <MessageSquare size={12} /> Message
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message modal */}
      <AnimatePresence>
        {messaging && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-8"
              style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#2563EB10" }}>
                  <MessageSquare size={18} style={{ color: "#2563EB" }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E" }}>Message Volunteer</h3>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>To: {messaging}</p>
                </div>
              </div>
              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                rows={4}
                placeholder="Write your message..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 resize-none mb-5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <div className="flex gap-3">
                <button onClick={() => setMessaging(null)} className="flex-1 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all" style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button
                  onClick={() => { setMessaging(null); setMsgText(""); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}
                >
                  Send Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Analytics Section ──────────────────────────────────────────────────────────
function AnalyticsSection() {
  const { books, payments, bookRequests } = useApp();
  
  const genreCounts = books.reduce((acc: any, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});

  const genreDistribution = Object.entries(genreCounts).map(([name, value]) => ({
    name,
    value: Math.round((Number(value) / (books.length || 1)) * 100)
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  // Dynamic monthly reads from bookRequests
  const monthlyReads = bookRequests.reduce((acc: any, req) => {
    const month = new Date(req.requestDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find((m: any) => m.month === month);
    if (existing) existing.reads += 1;
    else acc.push({ month, reads: 1 });
    return acc;
  }, []).slice(-6);

  // Dynamic revenue growth from payments
  const donationTrends = payments.filter(p => p.status === "approved").reduce((acc: any, p) => {
    const month = new Date(p.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find((m: any) => m.month === month);
    if (existing) existing.amount += p.amount;
    else acc.push({ month, amount: p.amount });
    return acc;
  }, []).slice(-6);

  const chartData = {
    monthlyReads: monthlyReads.length ? monthlyReads : [{ month: "No Data", reads: 0 }],
    donationTrends: donationTrends.length ? donationTrends : [{ month: "No Data", amount: 0 }],
    genreDistribution
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Reading Activity (Recent Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData.monthlyReads}>
              <defs>
                <linearGradient id="analyticsReadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <YAxis tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: "'Inter', sans-serif", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="reads" stroke="#2563EB" strokeWidth={2} fill="url(#analyticsReadsGrad)" name="Reads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.donationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <YAxis tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: "'Inter', sans-serif", borderRadius: "12px" }} />
              <Bar dataKey="amount" fill="#60A5FA" radius={[6, 6, 0, 0]} name="Donations (৳)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Genre Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={chartData.genreDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {chartData.genreDistribution.map((_, i) => (
                  <Cell key={`analytics-genre-cell-${i}`} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: "'Inter', sans-serif", borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Platform Health</h3>
          <div className="space-y-4">
            {[
              { metric: "Server Uptime", value: "99.9%", pct: 100, color: "#22C55E" },
              { metric: "Avg. Load Time", value: "1.2s", pct: 88, color: "#22C55E" },
              { metric: "Accessibility Score", value: "98 / 100", pct: 98, color: "#2563EB" },
              { metric: "User Satisfaction", value: "4.9 / 5", pct: 98, color: "#60A5FA" },
            ].map(({ metric, value, pct, color }) => (
              <div key={metric}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>{metric}</span>
                  <span className="text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif", color }}>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg. Session", value: "28 min", icon: Zap, color: "#60A5FA" },
          { label: "Retention Rate", value: "84%", icon: TrendingUp, color: "#22C55E" },
          { label: "Countries Active", value: "47", icon: Globe, color: "#2563EB" },
          { label: "Badges Awarded", value: "12.4K", icon: Star, color: "#2563EB" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#060F1E" }}>{value}</p>
            <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
// ── Human Library Section ───────────────────────────────────────────────────
function HumanLibrarySection() {
  const { livingBooks, setLivingBooks, livingBookSessions } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingBook, setEditingBook] = useState<any>(null);
  const IconMap: Record<string, any> = {
    Waves, Fish, Wind, Palette, Heart, History, Droplets, Handshake
  };

  const [form, setForm] = useState({
    title: "",
    narrator: "",
    category: "",
    icon: "Waves",
    description: ""
  });

  const openAdd = () => {
    setIsAdding(true);
    setForm({ title: "", narrator: "", category: "", icon: "Waves", description: "" });
    setShowModal(true);
  };

  const openEdit = (book: any) => {
    setIsAdding(false);
    setEditingBook(book);
    setForm({ ...book });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.narrator) return;
    
    try {
      if (isAdding) {
        const newBook = await api.post("living-books", form);
        setLivingBooks([newBook, ...livingBooks]);
        toast.success("Living book added successfully!");
      } else {
        const updated = await api.put("living-books", editingBook._id || editingBook.id || "", form);
        setLivingBooks(livingBooks.map(b => (b._id === updated._id || b.id === updated.id) ? updated : b));
        toast.success("Changes saved!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save living book");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("living-books", id);
      setLivingBooks(livingBooks.filter(b => (b._id !== id && b.id !== id)));
      toast.success("Living book removed.");
    } catch (err) {
      toast.error("Failed to remove living book");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>Human Library Management</h2>
          <p className="text-sm text-gray-500">Manage living books, narrators, and session bookings.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all"
          >
            <Plus size={16} /> Add Living Book
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Active Living Books</h3>
            <div className="space-y-4">
              {livingBooks.map((book, i) => (
                <div key={book.id || i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                      {IconMap[book.icon] ? (
                        (() => {
                          const Icon = IconMap[book.icon];
                          return <Icon size={20} />;
                        })()
                      ) : <BookOpen size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{book.title}</h4>
                      <p className="text-xs text-gray-500">{book.narrator} · {book.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Active</span>
                    <button 
                      onClick={() => openEdit(book)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(book._id || book.id || "")}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Upcoming Sessions</h3>
            <div className="space-y-4">
              {livingBookSessions.map((session, i) => (
                <div key={session._id || session.id || i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase">{session.type}</span>
                    <span className="text-xs text-gray-500">{session.date} · {session.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{session.bookTitle}</h4>
                  <p className="text-xs text-gray-500 mb-3">User: {session.userName}</p>
                  <div className="flex gap-2">
                    {session.status === "pending" ? (
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Approve</button>
                    ) : (
                      <span className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-bold text-center">Confirmed ✓</span>
                    )}
                    <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors">Details</button>
                  </div>
                </div>
              ))}
              {livingBookSessions.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No active sessions.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-xl bg-white rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {isAdding ? "Add New Living Book" : "Edit Living Book"}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Title</label>
                    <input 
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                      placeholder="e.g. My home is underwater"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Narrator</label>
                    <input 
                      value={form.narrator}
                      onChange={e => setForm({...form, narrator: e.target.value})}
                      placeholder="e.g. Fatema Khatun"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                    <input 
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                      placeholder="e.g. Climate migrant"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Icon (Premium)</label>
                    <select 
                      value={form.icon}
                      onChange={e => setForm({...form, icon: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                      {Object.keys(IconMap).map(iconName => (
                        <option key={iconName} value={iconName}>{iconName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                  <textarea 
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    rows={3}
                    placeholder="Short description of the story..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all resize-none" 
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!form.title || !form.narrator}
                    className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:scale-[1.02] shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isAdding ? "Add Book" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// ── Blogs Section ─────────────────────────────────────────────────────────────
function BlogsSection() {
  const { blogPosts, setBlogPosts } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    category: "Impact Stories",
    author: "Admin",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: "5",
    cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
  });

  const openAdd = () => {
    setIsAdding(true);
    setForm({ 
      title: "", excerpt: "", category: "Impact Stories", author: "Admin", 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: "5", cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80" 
    });
    setShowModal(true);
  };

  const openEdit = (post: any) => {
    setIsAdding(false);
    setEditingPost(post);
    setForm({ ...post });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    try {
      if (isAdding) {
        const newBlog = await api.post("blogs", form);
        setBlogPosts([newBlog, ...blogPosts]);
        toast.success("Blog post published!");
      } else {
        const updated = await api.put("blogs", editingPost._id || editingPost.id || "", form);
        setBlogPosts(blogPosts.map(b => (b._id === updated._id || b.id === updated.id) ? updated : b));
        toast.success("Changes saved!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save blog post");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("blogs", id);
      setBlogPosts(blogPosts.filter(b => (b._id !== id && b.id !== id)));
      toast.success("Blog post deleted.");
    } catch (err) {
      toast.error("Failed to delete blog post");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>Blog Management</h2>
          <p className="text-sm text-gray-500">Create, edit, and manage your stories and news.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blogPosts.map((post) => (
          <div key={post._id || post.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img src={post.cover} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{post.category}</span>
                <span className="text-[10px] text-gray-400">{post.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 truncate">{post.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{post.excerpt}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(post)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(post._id || post.id || "")} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold">{isAdding ? "Create New Post" : "Edit Post"}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Title</label>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border outline-none bg-white">
                      {["Impact Stories", "Accessibility", "Milestones", "Community", "Product"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Excerpt</label>
                  <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border outline-none resize-none" />
                </div>
                  <div className="col-span-2">
                    <ImageUploader
                      value={form.cover}
                      onChange={(url) => setForm(f => ({ ...f, cover: url }))}
                      aspect={16 / 9}
                      label="Cover Image"
                    />
                  </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-xl bg-gray-100 font-bold">Cancel</button>
                  <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-bold">{isAdding ? "Publish Post" : "Save Changes"}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Events Section ────────────────────────────────────────────────────────────
function EventsSection() {
  const { events, setEvents } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "In-Person",
    description: "",
    cover: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?w=800&q=80",
    capacity: 100,
    attendees: 0,
    featured: false,
    tags: [] as string[]
  });

  const openAdd = () => {
    setIsAdding(true);
    setForm({ 
      title: "", date: "", time: "", location: "", type: "In-Person", description: "",
      cover: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?w=800&q=80",
      capacity: 100, attendees: 0, featured: false, tags: []
    });
    setShowModal(true);
  };

  const openEdit = (ev: any) => {
    setIsAdding(false);
    setEditingEvent(ev);
    setForm({ ...ev });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    try {
      if (isAdding) {
        const newEvent = await api.post("events", form);
        setEvents([newEvent, ...events]);
        toast.success("Event scheduled!");
      } else {
        const updated = await api.put("events", editingEvent._id || editingEvent.id || "", form);
        setEvents(events.map(e => (e._id === updated._id || e.id === updated.id) ? updated : e));
        toast.success("Event updated!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("events", id);
      setEvents(events.filter(e => (e._id !== id && e.id !== id)));
      toast.success("Event cancelled.");
    } catch (err) {
      toast.error("Failed to cancel event");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>Events Management</h2>
          <p className="text-sm text-gray-500">Schedule workshops, field visits, and library sessions.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">
          <Plus size={16} /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map((ev) => (
          <div key={ev._id || ev.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
            <div className="w-20 h-20 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-600 font-bold border border-blue-100">
              <span className="text-[10px] uppercase">{ev.date.split(' ')[1]}</span>
              <span className="text-xl">{ev.date.split(' ')[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{ev.type}</span>
                {ev.featured && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Featured</span>}
              </div>
              <h3 className="font-bold text-gray-900">{ev.title}</h3>
              <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Clock size={12} /> {ev.time}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {ev.attendees}/{ev.capacity}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(ev)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(ev._id || ev.id || "")} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold">{isAdding ? "Create New Event" : "Edit Event"}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Event Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Date</label>
                    <input placeholder="e.g. 12 JUL" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Time</label>
                    <input placeholder="e.g. 6:00 PM" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border outline-none bg-white">
                      {["In-Person", "Online", "Hybrid"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-3">
                    <ImageUploader
                      value={form.cover}
                      onChange={(url) => setForm(f => ({ ...f, cover: url }))}
                      aspect={16 / 9}
                      label="Cover Image"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <button onClick={() => setForm({...form, featured: !form.featured})} className="flex items-center gap-2">
                      {form.featured ? <ToggleRight size={24} className="text-blue-600" /> : <ToggleLeft size={24} className="text-gray-400" />}
                      <span className="text-sm font-semibold">Featured Event</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border outline-none" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-xl bg-gray-100 font-bold">Cancel</button>
                  <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-bold">{isAdding ? "Create Event" : "Save Changes"}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Settings Section ───────────────────────────────────────────────────────────
function SettingsSection() {
  const [maintenance, setMaintenance] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [highContrastDefault, setHighContrastDefault] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange, color = "#22C55E" }: { value: boolean; onChange: () => void; color?: string }) => (
    <button
      onClick={onChange}
      className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? color : "#e5e7eb" }}
    >
      <div
        className="w-5 h-5 rounded-full bg-white shadow transition-all absolute top-0.5"
        style={{ left: value ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6 max-w-2xl">
      {/* General */}
      <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#2563EB10" }}>
            <Settings size={18} style={{ color: "#2563EB" }} />
          </div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>General Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Platform Name</label>
            <input
              type="text"
              defaultValue="Humanity Public Library"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-[#2563EB] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Support Email</label>
            <input
              type="email"
              defaultValue="support@hpl.org"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-[#2563EB] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Admin Password</label>
            <input
              type="password"
              defaultValue="admin123"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-[#2563EB] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#2563EB10" }}>
            <Sliders size={18} style={{ color: "#2563EB" }} />
          </div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Platform Controls</h3>
        </div>
        <div className="space-y-5">
          {[
            { label: "Maintenance Mode", desc: "Temporarily disable public access", value: maintenance, onChange: () => setMaintenance(!maintenance), color: "#ef4444" },
            { label: "Email Notifications", desc: "Send automated emails to donors and volunteers", value: emailNotifs, onChange: () => setEmailNotifs(!emailNotifs), color: "#22C55E" },
            { label: "Auto Backup", desc: "Daily backup of all library data", value: autoBackup, onChange: () => setAutoBackup(!autoBackup), color: "#22C55E" },
            { label: "High Contrast Default", desc: "Enable high contrast mode for all new users", value: highContrastDefault, onChange: () => setHighContrastDefault(!highContrastDefault), color: "#60A5FA" },
          ].map(({ label, desc, value, onChange, color }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{desc}</p>
              </div>
              <Toggle value={value} onChange={onChange} color={color} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="p-6 rounded-2xl" style={{ background: "#fff5f5", border: "1px solid rgba(239,68,68,0.15)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#ef444415" }}>
            <AlertTriangle size={18} style={{ color: "#ef4444" }} />
          </div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#ef4444" }}>Danger Zone</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          These actions are irreversible. Proceed with extreme caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ background: "#ef444420", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>
            Reset All Analytics
          </button>
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ background: "#ef444420", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>
            Clear Donation History
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-xl"
        style={{ background: saved ? "linear-gradient(135deg, #22C55E, #16a34a)" : "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}
      >
        {saved ? <><CheckCircle size={16} /> Settings Saved!</> : <><Check size={16} /> Save All Changes</>}
      </button>
    </motion.div>
  );
}

// ── Borrowing Section ──────────────────────────────────────────────────────────
function BorrowingSection() {
  const { bookRequests, updateBookRequest } = useApp();
  const [filter, setFilter] = useState("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const filtered = filter === "all" ? bookRequests : bookRequests.filter((r) => r.status === filter);

  const handleApprove = async (req: BookRequest) => {
    await updateBookRequest((req._id || req.id)!, { status: "borrowed", approvedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) });
    toast.success("Request approved!");
  };
  const handleReturn = async (req: BookRequest) => {
    await updateBookRequest((req._id || req.id)!, { status: "returned", returnedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) });
    toast.success("Book marked as returned!");
  };
  const handleReject = async () => {
    if (!rejectingId) return;
    await updateBookRequest(rejectingId, { status: "rejected", adminNote: rejectNote });
    setRejectingId(null); setRejectNote("");
    toast.error("Request rejected.");
  };

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:  { bg: "#60A5FA15", color: "#2563EB" },
    approved: { bg: "#2563EB15", color: "#2563EB" },
    borrowed: { bg: "#2563EB15", color: "#2563EB" },
    returned: { bg: "#22C55E15", color: "#22C55E" },
    rejected: { bg: "#ef444415", color: "#ef4444" },
  };

  const counts = {
    all: bookRequests.length,
    pending: bookRequests.filter((r) => r.status === "pending").length,
    borrowed: bookRequests.filter((r) => r.status === "borrowed").length,
    returned: bookRequests.filter((r) => r.status === "returned").length,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: counts.all, color: "#6B7280", icon: Package },
          { label: "Pending", value: counts.pending, color: "#60A5FA", icon: Clock },
          { label: "Currently Borrowed", value: counts.borrowed, color: "#2563EB", icon: BookOpen },
          { label: "Returned", value: counts.returned, color: "#22C55E", icon: CheckCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="p-5 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "#060F1E" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {["all", "pending", "borrowed", "returned", "rejected"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all"
            style={{ background: filter === f ? "#2563EB" : "#fff", color: filter === f ? "#fff" : "#6B7280", fontFamily: "'Inter', sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {f} {f === "pending" && counts.pending > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.25)" }}>{counts.pending}</span>}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Book", "Borrower", "Requested", "Return By", "Days", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => {
                const sc = STATUS_COLORS[req.status] || { bg: "#e5e7eb", color: "#6B7280" };
                return (
                  <tr key={req._id || req.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={req.bookCover} alt={req.bookTitle} className="w-10 h-13 rounded-lg object-cover flex-shrink-0" style={{ height: "48px", width: "36px" }} />
                        <div>
                          <p className="text-sm font-semibold line-clamp-1 max-w-28" style={{ fontFamily: "'Inter', sans-serif", color: "#060F1E" }}>{req.bookTitle}</p>
                          <p className="text-xs text-gray-400">{req.bookAuthor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif", color: "#060F1E" }}>{req.userName}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{req.userPhone}</p>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{req.requestDate}</td>
                    <td className="p-4 text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "#6B7280" }}>{req.expectedReturnDate}</td>
                    <td className="p-4 text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif", color: "#2563EB" }}>{req.borrowDays}d</td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize" style={{ background: sc.bg, color: sc.color, fontFamily: "'Inter', sans-serif" }}>{req.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {req.status === "pending" && (
                          <>
                            <button onClick={() => handleApprove(req)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#22C55E15", color: "#22C55E", fontFamily: "'Inter', sans-serif" }}>
                              <CheckCircle size={11} /> Approve
                            </button>
                            <button onClick={() => setRejectingId(req._id || req.id || "")} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#ef444415", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>
                              <XCircle size={11} /> Reject
                            </button>
                          </>
                        )}
                        {req.status === "borrowed" && (
                          <button onClick={() => handleReturn(req)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#60A5FA15", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>
                            <RefreshCw size={11} /> Mark Returned
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-12 text-center text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Package size={32} className="mx-auto mb-3 opacity-30" />No borrow requests matching this filter.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject modal */}
      <AnimatePresence>
        {rejectingId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-sm rounded-3xl bg-white p-8" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}>
              <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E" }}>Reject Request</h3>
              <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={3} placeholder="Reason for rejection (optional)..." className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 resize-none mb-4" style={{ fontFamily: "'Inter', sans-serif" }} />
              <div className="flex gap-3">
                <button onClick={() => setRejectingId(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100" style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button onClick={handleReject} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", fontFamily: "'Inter', sans-serif" }}>Reject</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Payments Section ───────────────────────────────────────────────────────────
function AdminPaymentsSection() {
  const { payments, updatePayment } = useApp();
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? payments : payments.filter((p) => p.status === filter);

  const total = payments.filter((p) => p.status === "approved").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").length;

  const PAY_COLORS: Record<string, { bg: string; color: string }> = {
    pending:  { bg: "#60A5FA15", color: "#2563EB" },
    approved: { bg: "#22C55E15", color: "#22C55E" },
    rejected: { bg: "#ef444415", color: "#ef4444" },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Verified", value: `৳${total.toLocaleString()}`, color: "#22C55E", icon: CheckCircle },
          { label: "Pending Review", value: pending, color: "#60A5FA", icon: Clock },
          { label: "Total Payments", value: payments.length, color: "#2563EB", icon: CreditCard },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="p-5 rounded-2xl bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "#060F1E" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all"
            style={{ background: filter === f ? "#2563EB" : "#fff", color: filter === f ? "#fff" : "#6B7280", fontFamily: "'Inter', sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Donor", "Amount", "Method", "Transaction ID", "Purpose", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((pay) => {
              const pc = PAY_COLORS[pay.status] || { bg: "#e5e7eb", color: "#6B7280" };
              return (
                <tr key={pay._id || pay.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif", color: "#060F1E" }}>{pay.userName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{pay.userPhone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-sm" style={{ color: "#60A5FA", fontFamily: "'Sora', sans-serif" }}>৳{pay.amount.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: pay.method === "bkash" ? "#E2136E15" : "#E5202815", color: pay.method === "bkash" ? "#E2136E" : "#E52028", fontFamily: "'Sora', sans-serif" }}>
                      {pay.method === "bkash" ? "bKash" : "Nagad"}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-600">{pay.transactionId}</td>
                  <td className="p-4 text-sm capitalize text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>{pay.purpose}</td>
                  <td className="p-4 text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{pay.date}</td>
                  <td className="p-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize" style={{ background: pc.bg, color: pc.color, fontFamily: "'Inter', sans-serif" }}>{pay.status}</span>
                  </td>
                  <td className="p-4">
                    {pay.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => updatePayment(pay._id || pay.id || "", { status: "approved" })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#22C55E15", color: "#22C55E", fontFamily: "'Inter', sans-serif" }}>
                          <CheckCircle size={11} /> Verify
                        </button>
                        <button onClick={() => updatePayment(pay._id || pay.id || "", { status: "rejected" })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#ef444415", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>
                          <XCircle size={11} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-12 text-center text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                <CreditCard size={32} className="mx-auto mb-3 opacity-30" />No payment records found.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ── Carousel Section ───────────────────────────────────────────────────────────
function CarouselSection() {
  const { carouselSlides, setCarouselSlides } = useApp();
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", ctaText: "", ctaLink: "/", badge: "", image: "", active: true });

  const openAdd = () => {
    setIsAdding(true);
    setForm({ title: "", subtitle: "", ctaText: "Learn More", ctaLink: "/library", badge: "", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1080&q=80", active: true });
    setShowModal(true);
  };

  const openEdit = (slide: CarouselSlide) => {
    setIsAdding(false);
    setEditingSlide(slide);
    setForm({ title: slide.title, subtitle: slide.subtitle, ctaText: slide.ctaText, ctaLink: slide.ctaLink, badge: slide.badge || "", image: slide.image, active: slide.active });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.image) return;
    try {
      if (isAdding) {
        const newSlide = await api.post("carousel-slides", form);
        setCarouselSlides([newSlide, ...carouselSlides]);
        toast.success("Slide added!");
      } else if (editingSlide) {
        const updated = await api.put("carousel-slides", editingSlide._id || editingSlide.id || "", form);
        setCarouselSlides(carouselSlides.map(s => (s._id === updated._id || s.id === updated.id) ? updated : s));
        toast.success("Slide updated!");
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
        setEditingSlide(null);
      }, 1000);
    } catch (err) {
      toast.error("Failed to save slide");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("carousel-slides", id);
      setCarouselSlides(carouselSlides.filter(s => (s._id !== id && s.id !== id)));
      toast.success("Slide deleted.");
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete slide");
    }
  };

  const toggleActive = async (slide: CarouselSlide) => {
    try {
      const updated = await api.put("carousel-slides", slide._id || slide.id || "", { ...slide, active: !slide.active });
      setCarouselSlides(carouselSlides.map(s => (s._id === updated._id || s.id === updated.id) ? updated : s));
      toast.success(updated.active ? "Slide activated" : "Slide deactivated");
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Hero Carousel Slides</h2>
          <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{carouselSlides.filter((s) => s.active).length} active · {carouselSlides.length} total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-semibold transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}>
          <Plus size={15} /> Add Slide
        </button>
      </div>

      <div className="space-y-4">
        {carouselSlides.map((slide, i) => (
          <motion.div key={slide._id || slide.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl overflow-hidden bg-white flex" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", opacity: slide.active ? 1 : 0.6 }}>
            {/* Slide preview */}
            <div className="relative w-40 h-28 flex-shrink-0">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"; }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,2,5,0.7), rgba(107,30,43,0.5))" }} />
              <span className="absolute top-2 left-2 text-white text-xs font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>#{i + 1}</span>
            </div>
            <div className="flex-1 p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold line-clamp-1 mb-0.5" style={{ fontFamily: "'Sora', sans-serif", color: "#060F1E" }}>{slide.title}</p>
                <p className="text-xs text-gray-400 line-clamp-1 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{slide.subtitle}</p>
                <div className="flex items-center gap-2">
                  {slide.badge && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#60A5FA15", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>{slide.badge}</span>}
                  <span className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>→ {slide.ctaLink}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => toggleActive(slide)} title={slide.active ? "Deactivate" : "Activate"}>
                  {slide.active ? <ToggleRight size={24} style={{ color: "#22C55E" }} /> : <ToggleLeft size={24} style={{ color: "#9ca3af" }} />}
                </button>
                <button onClick={() => openEdit(slide)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#2563EB10", color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => setDeletingId(slide._id || slide.id || "")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#ef444415", color: "#ef4444", fontFamily: "'Inter', sans-serif" }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}>
              <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E" }}>{isAdding ? "Add New Slide" : "Edit Slide"}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} style={{ color: "#6B7280" }} /></button>
              </div>
              <div className="p-5 space-y-4">
                {/* Image preview and upload */}
                <ImageUploader
                  value={form.image}
                  onChange={(url) => setForm(f => ({ ...f, image: url }))}
                  aspect={16 / 9}
                  label="Background Image"
                />
                {[
                  { label: "Title", key: "title" },
                  { label: "Subtitle", key: "subtitle" },
                  { label: "Badge Text (optional)", key: "badge" },
                  { label: "CTA Button Text", key: "ctaText" },
                  { label: "CTA Link", key: "ctaLink" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
                    <input type="text" value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-gray-200" style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>
                ))}
                <button onClick={() => setForm((f) => ({ ...f, active: !f.active })) } className="flex items-center gap-2">
                  {form.active ? <ToggleRight size={24} style={{ color: "#22C55E" }} /> : <ToggleLeft size={24} style={{ color: "#9ca3af" }} />}
                  <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: form.active ? "#22C55E" : "#9ca3af" }}>{form.active ? "Slide is Active" : "Slide is Hidden"}</span>
                </button>
              </div>
              <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100" style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: saveSuccess ? "linear-gradient(135deg, #22C55E, #16a34a)" : "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}>
                  {saveSuccess ? <><CheckCircle size={15} /> Saved!</> : <><Check size={15} /> {isAdding ? "Add Slide" : "Save Changes"}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deletingId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-sm rounded-3xl bg-white p-8 text-center" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#ef444415" }}><AlertTriangle size={28} style={{ color: "#ef4444" }} /></div>
              <h3 className="mb-2" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E" }}>Delete Slide?</h3>
              <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>This carousel slide will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingId(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100" style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
                <button onClick={() => handleDelete(deletingId)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", fontFamily: "'Inter', sans-serif" }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main AdminDashboard ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { isAdmin, setIsAdmin, isLoading } = useApp();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/admin/login", { replace: true });
  }, [isAdmin, navigate, isLoading]);

  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/admin/login", { replace: true });
  };

  if (isLoading) return <DashboardSkeleton />;
  if (!isAdmin) return null;

  const sectionTitles: Record<Section, string> = {
    overview: "Dashboard Overview",
    books: "Book Management",
    borrowing: "Borrow Requests",
    payments: "Payment Management",
    donations: "Donation Records",
    volunteers: "Volunteer Applications",
    carousel: "Hero Carousel",
    analytics: "Analytics",
    "human-library": "Human Library",
    blogs: "Blog Management",
    events: "Event Management",
    settings: "Settings",
  };

  const renderSection = () => {
    switch (section) {
      case "overview": return <OverviewSection />;
      case "books": return <BooksSection />;
      case "borrowing": return <BorrowingSection />;
      case "payments": return <AdminPaymentsSection />;
      case "donations": return <DonationsSection />;
      case "volunteers": return <VolunteersSection />;
      case "carousel": return <CarouselSection />;
      case "analytics": return <AnalyticsSection />;
      case "human-library": return <HumanLibrarySection />;
      case "blogs": return <BlogsSection />;
      case "events": return <EventsSection />;
      case "settings": return <SettingsSection />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f0eff2" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          section={section}
          setSection={setSection}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex"
            >
              <Sidebar
                section={section}
                setSection={(s) => { setSection(s); setMobileSidebarOpen(false); }}
                collapsed={false}
                setCollapsed={() => {}}
                onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} style={{ color: "#6B7280" }} />
            </button>
            <div>
              <h1
                style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E", fontSize: "1.2rem" }}
              >
                {sectionTitles[section]}
              </h1>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Humanity Public Library · Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-gray-100"
              style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}
            >
              <Globe size={14} /> View Site
            </Link>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(107,30,43,0.08)", border: "1px solid rgba(107,30,43,0.15)" }}
            >
              <Shield size={14} style={{ color: "#2563EB" }} />
              <span className="text-xs font-semibold" style={{ color: "#2563EB", fontFamily: "'Inter', sans-serif" }}>Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all hover:bg-red-50"
              style={{ color: "#ef4444", fontFamily: "'Inter', sans-serif" }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
