import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  BookOpen, Headphones, Star, Heart, ArrowLeft, Play, Pause
} from "lucide-react";
// Removed static mock import
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export default function BookDetail() {
  const { id } = useParams();
  const { books, savedBooks, toggleSaveBook, readingProgress, updateProgress, addPoints, currentUser, bookRequests, addBookRequest } = useApp();
  const book = books.find((b) => (b._id === id || b.id === id));
  const related = books.filter((b) => (b._id !== id && b.id !== id) && b.genre === book?.genre).slice(0, 3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(readingProgress[id || ""] || 0);
  const [speed, setSpeed] = useState(1.0);
  const [activeTab, setActiveTab] = useState<"about" | "audio">("about");
  const navigate = useNavigate();

  const isBorrowed = bookRequests?.some(r => (r.bookId === book?._id || r.bookId === book?.id) && (r.userId === currentUser?._id || r.userId === currentUser?.id));

  const handleBorrow = () => {
    if (!currentUser) {
      navigate("/user/login");
      return;
    }
    if (isBorrowed) {
      toast("You have already requested this book!");
      return;
    }
    addBookRequest({
      userId: (currentUser._id || currentUser.id)!,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      bookId: (book!._id || book!.id)!,
      bookTitle: book!.title,
      bookAuthor: book!.author,
      bookCover: book!.cover,
      bookGenre: book!.genre,
      status: "pending",
      requestDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      borrowDays: 14
    });
    addPoints(20);
    toast("Borrow request submitted! +20 points 📚");
  };

  useEffect(() => {
    if (id) {
      setProgress(readingProgress[id] || 0);
    }
  }, [id, readingProgress]);

  const handleProgressChange = (val: number) => {
    setProgress(val);
    if (id) updateProgress(id, val);
    if (val > 0 && val % 25 === 0) {
      addPoints(50);
      toast(`🎉 ${val}% complete! +50 points earned!`);
    }
  };



  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: "#F0F6FF" }}>
        <div className="text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Book not found.</p>
          <Link to="/library" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={16} /> Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: "#F0F6FF" }}>
      {/* Hero */}
      <div className="relative py-20 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }}>
        <div className="max-w-5xl mx-auto">
          <Link to="/library" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={16} /> Back to Library
          </Link>
        </div>
      </div>

      {/* Book Hero */}
      <div style={{ background: "linear-gradient(180deg, #0C1A2E 0%, #1D4ED8 100%)" }} className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start pt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div className="w-48 h-64 rounded-2xl overflow-hidden shadow-2xl">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(96,165,250,0.2)", color: "#60A5FA", fontFamily: "'Inter', sans-serif" }}>
                  {book.genre}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif" }}>
                  {book.language}
                </span>
                {book.audioAvailable && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(37,99,235,0.3)", color: "#93c5fd" }}>
                    <Headphones size={10} /> Audio Available
                  </span>
                )}
              </div>
              <h1 className="text-white mb-2" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>
                {book.title}
              </h1>
              <p className="text-white/70 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>by {book.author} · {book.year} · {book.pages} pages</p>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={j < Math.floor(book.rating) ? "#60A5FA" : "none"} stroke="#60A5FA" />)}
                </div>
                <span className="text-white/70 text-sm">{book.rating} · {(book.downloads / 1000).toFixed(1)}K reads · {(book.saves / 1000).toFixed(1)}K saves</span>
              </div>

              {/* Progress */}
              {progress > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-white/60 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Reading Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #60A5FA, #93C5FD)" }} />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => { toggleSaveBook((book._id || book.id)!); addPoints(5); toast(savedBooks.includes((book._id || book.id)!) ? "Removed from library" : "Saved! +5 points 📚"); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: savedBooks.includes((book._id || book.id)!) ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <Heart size={16} style={{ fill: savedBooks.includes((book._id || book.id)!) ? "#60A5FA" : "none", color: savedBooks.includes((book._id || book.id)!) ? "#60A5FA" : "#fff" }} />
                  {savedBooks.includes((book._id || book.id)!) ? "Saved" : "Save"}
                </button>
                <button onClick={handleBorrow}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: isBorrowed ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", cursor: isBorrowed ? "not-allowed" : "pointer" }}
                  disabled={isBorrowed}
                >
                  <BookOpen size={16} /> {isBorrowed ? "Requested" : "Borrow Book"}
                </button>
                {/* @ts-ignore - Check if pdfUrl exists in the book object */}
                {book.pdfUrl && (
                  <button onClick={() => window.open((book as any).pdfUrl, "_blank")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: "rgba(34,197,94,0.9)", color: "#fff" }}>
                    <BookOpen size={16} /> Read Online (PDF)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Content Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-2 p-1 rounded-2xl mb-6" style={{ background: "#fff", border: "1px solid rgba(37,99,235,0.1)" }}>
          {(["about", "audio"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
              style={{ background: activeTab === tab ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "transparent", color: activeTab === tab ? "#fff" : "#6B7280" }}>
              {tab === "about" ? "About" : "Audiobook"}
            </button>
          ))}
        </div>
        {activeTab === "about" && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(37,99,235,0.08)" }}>
              <h3 className="mb-3" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>About this book</h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{book.description}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Genre", value: book.genre },
                { label: "Language", value: book.language },
                { label: "Rating", value: `${book.rating}/5 ⭐` },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-2xl bg-white text-center" style={{ border: "1px solid rgba(37,99,235,0.08)" }}>
                  <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
                  <p className="font-semibold" style={{ fontFamily: "'Sora', sans-serif", color: "#060F1E" }}>{value}</p>
                </div>
              ))}
            </div>
            {/* Progress */}
            <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(37,99,235,0.08)" }}>
              <div className="flex justify-between items-center mb-3">
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Reading Progress</h3>
                <span className="text-sm font-semibold" style={{ color: "#2563EB" }}>{progress}%</span>
              </div>
              <div className="relative pt-4 pb-2">
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden relative" style={{ border: "1px solid rgba(37,99,235,0.1)" }}>
                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3B82F6, #2563EB)" }} />
                </div>
                <input type="range" min="0" max="100" value={progress} onChange={e => handleProgressChange(Number(e.target.value))}
                  className="absolute top-3 left-0 w-full h-4 appearance-none bg-transparent cursor-pointer z-10" 
                  style={{
                    accentColor: "#2563EB"
                  }} />
                <style dangerouslySetInnerHTML={{ __html: `
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #2563EB;
                    border: 3px solid #fff;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.4);
                    cursor: pointer;
                  }
                  input[type=range]::-moz-range-thumb {
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #2563EB;
                    border: 3px solid #fff;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.4);
                    cursor: pointer;
                  }
                `}} />
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span>Start Reading</span><span>Finish Book</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "audio" && book.audioAvailable && (
          <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(37,99,235,0.08)" }}>
            <div className="flex items-center gap-4 mb-6">
              <img src={book.cover} alt={book.title} className="w-16 h-20 rounded-xl object-cover" />
              <div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>{book.title}</h3>
                <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>{book.author}</p>
              </div>
            </div>
            {/* Playback controls */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Speed:</span>
              {[0.75, 1.0, 1.25, 1.5, 2.0].map(s => (
                <button key={s} onClick={() => setSpeed(s)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: speed === s ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#f5f5f5", color: speed === s ? "#fff" : "#666" }}>
                  {s}x
                </button>
              ))}
            </div>
            <div className="h-2 rounded-full mb-4" style={{ background: "rgba(37,99,235,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />
            </div>
            <button onClick={() => { setIsPlaying(!isPlaying); addPoints(10); toast(!isPlaying ? `🎧 Playing "${book.title}" at ${speed}x` : "Paused"); }}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: isPlaying ? "linear-gradient(135deg, #60A5FA, #2563EB)" : "linear-gradient(135deg, #2563EB, #1D4ED8)", boxShadow: "0 8px 24px rgba(37,99,235,0.3)" }}>
              {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play Audiobook</>}
            </button>
          </div>
        )}
        {/* Related Books */}
        {related.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>Related Books</h3>
            <div className="grid grid-cols-3 gap-3">
              {related.map(b => (
                <Link key={b._id || b.id} to={`/book/${b._id || b.id}`}
                  className="rounded-xl overflow-hidden hover:-translate-y-1 transition-all"
                  style={{ boxShadow: "0 2px 12px rgba(37,99,235,0.08)" }}>
                  <img src={b.cover} alt={b.title} className="w-full h-32 object-cover" />
                  <div className="p-2 bg-white">
                    <p className="text-xs line-clamp-1" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#060F1E" }}>{b.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}