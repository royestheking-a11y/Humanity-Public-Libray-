import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, BookOpen, Headphones, Star, Heart,
  Grid3X3, List, X
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";
import { toast } from "sonner";
import type { BookRequest } from "../context/AppContext";
import { LibrarySkeleton } from "../components/Skeleton";

const GENRES = ["All", "Fiction", "Science", "History", "Philosophy", "Technology", "Children", "Health", "Education", "Environment", "Business", "Poetry"];
const LANGUAGES = ["All", "English", "Bangla"];
const BORROW_DAYS_OPTIONS = [7, 14, 21, 30];

// ── Book Status relative to logged-in user ────────────────────────────────────
function getBookStatus(bookId: string, bookRequests: BookRequest[], userId?: string) {
  const activeReq = bookRequests.find(
    (r) => r.bookId === bookId && ["pending", "approved", "borrowed"].includes(r.status)
  );
  if (!activeReq) return "available";
  if (activeReq.userId === userId) return activeReq.status; // user's own request
  return "taken"; // taken by someone else
}

// ── Borrow Modal ───────────────────────────────────────────────────────────────
function BorrowModal({
  book,
  onClose,
  onSubmit,
}: {
  book: any;
  onClose: () => void;
  onSubmit: (days: number) => void;
}) {
  const [days, setDays] = useState(14);
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + days);
  const returnStr = returnDate.toLocaleDateString(isBn ? "bn-BD" : "en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #060F1E, #1D4ED8)" }}>
          <div className="flex items-center gap-3">
            <img src={book.cover} alt={book.title} className="w-12 h-16 rounded-xl object-cover shadow-md" />
            <div>
              <p className="text-white font-semibold line-clamp-1" style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem" }}>{book.title}</p>
              <p className="text-white/60 text-xs" style={{ fontFamily: F }}>{book.author}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X size={18} className="text-white/70" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide" style={{ fontFamily: F }}>
              {t("lib.borrowDays")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {BORROW_DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: days === d ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#f5f5f5",
                    color: days === d ? "#fff" : "#666",
                    fontFamily: F,
                  }}
                >
                  {d} {t("lib.days")}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl" style={{ background: "#F0F6FF", border: "1px solid rgba(37,99,235,0.1)" }}>
            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: F }}>{t("lib.returnDate")}</p>
            <p className="font-semibold" style={{ fontFamily: F, color: "#060F1E" }}>{returnStr}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "#f5f5f5", color: "#666", fontFamily: F }}
            >
              {t("lib.cancel")}
            </button>
            <button
              onClick={() => onSubmit(days)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F }}
            >
              {t("lib.confirm")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Library() {
  const { savedBooks, toggleSaveBook, currentUser, bookRequests, addBookRequest, books, isLoading } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [language, setLanguage] = useState("All");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [borrowModal, setBorrowModal] = useState<any | null>(null);

  const filtered = useMemo(() => books.filter((b) => {
    const s = search.toLowerCase();
    const matchSearch = !s || b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s) || (b.genre && b.genre.toLowerCase().includes(s));
    const matchGenre = genre === "All" || b.genre === genre;
    const matchLang = language === "All" || b.language === language;
    const matchFilter =
      filter === "all" ? true :
      filter === "available" ? b.available :
      filter === "audio" ? b.audioAvailable :
      filter === "saved" ? savedBooks.includes(b._id || b.id || "") : true;
    return matchSearch && matchGenre && matchLang && matchFilter;
  }), [search, genre, language, filter, savedBooks, books]);

  const handleBorrow = (book: any) => {
    if (!currentUser) { navigate("/user/login"); return; }
    setBorrowModal(book);
  };

  const submitBorrowRequest = (days: number) => {
    if (!borrowModal || !currentUser) return;
    const bookId = borrowModal._id || borrowModal.id;
    const status = getBookStatus(bookId, bookRequests, currentUser.id);
    if (status !== "available") { toast.error(t("lib.alreadyBorrowed")); setBorrowModal(null); return; }
    const returnDate = new Date(); returnDate.setDate(returnDate.getDate() + days);
    const req: any = {
      userId: currentUser.id, userName: currentUser.name, userEmail: currentUser.email, userPhone: currentUser.phone,
      bookId: bookId, bookTitle: borrowModal.title, bookAuthor: borrowModal.author, bookCover: borrowModal.cover, bookGenre: borrowModal.genre,
      requestDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      expectedReturnDate: returnDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      borrowDays: days, status: "pending",
    };
    addBookRequest(req);
    toast.success(`✅ "${borrowModal.title}" borrow request submitted!`);
    setBorrowModal(null);
  };

  const QUICK_FILTERS = [
    { id: "all",       label: t("lib.filter.all") },
    { id: "available", label: t("lib.filter.available") },
    { id: "audio",     label: t("lib.filter.audio") },
    { id: "saved",     label: t("lib.filter.saved") },
  ];

  if (isLoading) return <LibrarySkeleton />;

  return (
    <div className="min-h-screen pt-16" style={{ background: "#F0F6FF" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600 }}>{t("lib.subtitle")}</p>
            <h1 className="text-white mb-6" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>{t("lib.title")}</h1>
            <div className="relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t("lib.search")}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 outline-none shadow-xl"
                style={{ fontFamily: F }} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map(({ id, label }) => (
              <button key={id} onClick={() => setFilter(id)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: filter === id ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#fff", color: filter === id ? "#fff" : "#6B7280", fontFamily: F, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={genre} onChange={e => setGenre(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm outline-none border border-gray-200"
              style={{ fontFamily: F, color: "#6B7280" }}>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm outline-none border border-gray-200"
              style={{ fontFamily: F, color: "#6B7280" }}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#fff", border: "1px solid #eee" }}>
              {(["grid", "list"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: viewMode === v ? "#2563EB" : "transparent", color: viewMode === v ? "#fff" : "#999" }}>
                  {v === "grid" ? <Grid3X3 size={14} /> : <List size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-gray-500 mb-1" style={{ fontFamily: FH, fontWeight: 600, color: "#060F1E" }}>{t("lib.noResults")}</p>
            <p className="text-gray-400 text-sm" style={{ fontFamily: F }}>{t("lib.noResults.desc")}</p>
          </div>
        ) : (
          <motion.div layout className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            <AnimatePresence>
              {filtered.map((book, i) => {
                const bookId = book._id || book.id || "";
                const bookStatus = currentUser ? getBookStatus(bookId, bookRequests, currentUser._id || currentUser.id || "") : "available";
                const isSaved = savedBooks.includes(bookId);
                return (
                  <motion.div key={bookId} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                    className={`group rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${viewMode === "list" ? "flex gap-4 p-4 items-center" : ""}`}
                    style={{ background: "#fff", boxShadow: "0 4px 20px rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.05)" }}>
                    {viewMode === "grid" ? (
                      <>
                        <Link to={`/book/${bookId}`} className="block relative h-48 overflow-hidden">
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                            {book.audioAvailable && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: "rgba(37,99,235,0.9)" }}>
                                <Headphones size={9} /> {t("lib.audio")}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ background: book.available ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)" }}>
                              {book.available ? t("lib.available") : t("lib.unavailable")}
                            </span>
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link to={`/book/${bookId}`} className="block group/title mb-0.5">
                            <h3 className="line-clamp-1 group-hover/title:text-blue-600 transition-colors" style={{ fontFamily: FH, fontWeight: 600, color: "#060F1E" }}>{book.title}</h3>
                            <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: F }}>{book.author}</p>
                          </Link>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, j) => <Star key={j} size={11} fill={j < Math.floor(book.rating) ? "#60A5FA" : "none"} stroke={j < Math.floor(book.rating) ? "#60A5FA" : "#ccc"} />)}
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => { toggleSaveBook(bookId); toast(isSaved ? "Removed" : "Saved! 📚"); }}
                                className="p-1.5 rounded-lg transition-all hover:scale-110"
                                style={{ background: isSaved ? "#2563EB15" : "#f5f5f5" }}>
                                <Heart size={13} style={{ color: isSaved ? "#2563EB" : "#bbb" }} />
                              </button>
                              {bookStatus === "available" ? (
                                <button onClick={() => handleBorrow(book)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-md text-white"
                                  style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F }}>
                                  {t("lib.borrow")}
                                </button>
                              ) : (
                                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                                  style={{ background: bookStatus === "pending" || bookStatus === "borrowed" ? "#60A5FA15" : "#f5f5f5", color: bookStatus === "pending" || bookStatus === "borrowed" ? "#2563EB" : "#999", fontFamily: F }}>
                                  {bookStatus === "pending" ? t("lib.pending") : bookStatus === "borrowed" || bookStatus === "approved" ? t("lib.yourBorrow") : t("lib.takenByOther")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to={`/book/${bookId}`}>
                          <img src={book.cover} alt={book.title} className="w-14 h-20 rounded-xl object-cover flex-shrink-0" />
                        </Link>
                        <Link to={`/book/${bookId}`} className="flex-1 min-w-0 group/title">
                          <h3 className="line-clamp-1 mb-0.5 group-hover/title:text-blue-600 transition-colors" style={{ fontFamily: FH, fontWeight: 600, color: "#060F1E" }}>{book.title}</h3>
                          <p className="text-xs text-gray-400" style={{ fontFamily: F }}>{book.author} · {book.genre}</p>
                        </Link>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ background: book.available ? "rgba(34,197,94,0.85)" : "rgba(239,68,68,0.85)" }}>
                            {book.available ? t("lib.available") : t("lib.unavailable")}
                          </span>
                          {bookStatus === "available" && (
                            <button onClick={() => handleBorrow(book)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: F }}>
                              {t("lib.borrow")}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Borrow Modal */}
      <AnimatePresence>
        {borrowModal && (
          <BorrowModal book={borrowModal} onClose={() => setBorrowModal(null)} onSubmit={submitBorrowRequest} />
        )}
      </AnimatePresence>
    </div>
  );
}