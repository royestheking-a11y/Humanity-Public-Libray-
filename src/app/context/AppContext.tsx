import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

// ── Types ─────────────────────────────────────────────────────────────────────
// Synchronized with MongoDB and Cloudinary
export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  genre: string;
  language: string;
  cover: string;
  rating: number;
  pages: number;
  available: boolean;
  audioAvailable: boolean;
  description: string;
  year: number;
  category: string;
  downloads: number;
  saves: number;
  pdfUrl?: string;
}

export interface DonationRecord {
  id: string;
  amount: number;
  tier: string;
  type: "one-time" | "monthly";
  date: string;
  message?: string;
}

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  motivation: string;
  date: string;
}

export interface AppUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  studentId?: string;
  joinDate: string;
  totalBorrowed: number;
  avatarColor: string;
  role?: string;
  points?: number;
  streak?: number;
  savedBooks?: string[];
  readingProgress?: Record<string, number>;
}

export interface BookRequest {
  _id?: string;
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  bookGenre: string;
  requestDate: string;
  expectedReturnDate: string;
  borrowDays: number;
  status: "pending" | "approved" | "borrowed" | "returned" | "rejected";
  adminNote?: string;
  approvedDate?: string;
  returnedDate?: string;
}

export interface PaymentRecord {
  _id?: string;
  id?: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: "bkash" | "nagad";
  transactionId: string;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  tier?: string;
}

export interface CarouselSlide {
  _id?: string;
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  active: boolean;
}

export interface LivingBook {
  _id?: string;
  id?: string;
  title: string;
  narrator: string;
  category: string;
  icon: string;
  description: string;
}

export interface BlogPost {
  _id?: string;
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  cover: string;
}

export interface EventRecord {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
  cover: string;
  capacity: number;
  attendees: number;
  featured: boolean;
  tags: string[];
}

export interface StatRecord {
  totalBooks: number;
  audioBooks: number;
  activeUsers: number;
  visuallyImpairedUsers: number;
  volunteers: number;
  donations: number;
  countriesServed: number;
  languagesAvailable: number;
}

export interface DonationTierRecord {
  _id?: string;
  id?: string;
  label: string;
  amount: number;
  impact: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  books: number;
  streak: number;
  points: number;
  badge: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  rarity: string;
}

export interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  commitment: string;
  skills: string[];
  openings: number;
  icon: string;
}

export const VOLUNTEER_ROLES: VolunteerRole[] = [
  {
    id: "1",
    title: "Audiobook Narrator",
    description: "Record books for visually impaired users at our studio",
    commitment: "4-8 hrs/week",
    skills: ["Clear voice", "Reading fluency", "Patience"],
    openings: 12,
    icon: "🎙️",
  },
  {
    id: "2",
    title: "Content Digitizer",
    description: "Scan and digitize physical books to expand our library",
    commitment: "2-4 hrs/week",
    skills: ["Attention to detail", "Basic computer skills"],
    openings: 25,
    icon: "💻",
  },
  {
    id: "3",
    title: "Language Translator",
    description: "Translate books and UI between English and Bangla",
    commitment: "5-10 hrs/week",
    skills: ["Bilingual proficiency", "Writing skills"],
    openings: 8,
    icon: "🌐",
  },
  {
    id: "4",
    title: "Community Educator",
    description: "Conduct workshops in rural areas on using the platform",
    commitment: "Weekend sessions",
    skills: ["Teaching", "Communication", "Travel"],
    openings: 15,
    icon: "👩‍🏫",
  },
  {
    id: "5",
    title: "Tech Volunteer",
    description: "Help improve the platform's features and accessibility",
    commitment: "6-12 hrs/week",
    skills: ["Web development", "React", "Accessibility"],
    openings: 5,
    icon: "⚙️",
  },
  {
    id: "6",
    title: "Social Media Ambassador",
    description: "Promote literacy and the platform across social channels",
    commitment: "2-3 hrs/week",
    skills: ["Social media", "Content creation", "Storytelling"],
    openings: 20,
    icon: "📱",
  },
];

// ── Context Type ───────────────────────────────────────────────────────────────
interface AppContextType {
  highContrast: boolean; toggleHighContrast: () => void;
  largeFonts: boolean; toggleLargeFonts: () => void;
  dyslexicFont: boolean; toggleDyslexicFont: () => void;
  savedBooks: string[]; toggleSaveBook: (id: string) => void;
  readingProgress: Record<string, number>; updateProgress: (id: string, progress: number) => void;
  volunteerApplications: VolunteerApplication[]; addVolunteerApplication: (a: VolunteerApplication) => void;
  userPoints: number; userStreak: number; addPoints: (pts: number) => void;
  addDonation: (d: DonationRecord) => void;
  isAdmin: boolean; setIsAdmin: (v: boolean) => void;
  isLoading: boolean;
  
  // ── Data Collections ──
  books: Book[]; setBooks: (v: Book[]) => void;
  users: AppUser[]; setUsers: (v: AppUser[]) => void;
  blogPosts: BlogPost[]; setBlogPosts: (v: BlogPost[]) => void;
  events: EventRecord[]; setEvents: (v: EventRecord[]) => void;
  livingBooks: LivingBook[]; setLivingBooks: (v: LivingBook[]) => void;
  carouselSlides: CarouselSlide[]; setCarouselSlides: (v: CarouselSlide[]) => void;
  bookRequests: BookRequest[]; setBookRequests: (v: BookRequest[]) => void;
  payments: PaymentRecord[]; setPayments: (v: PaymentRecord[]) => void;
  donationTiers: DonationTierRecord[]; setDonationTiers: (v: DonationTierRecord[]) => void;
  volunteerRoles: VolunteerRole[]; setVolunteerRoles: (v: VolunteerRole[]) => void;
  leaderboard: LeaderboardEntry[]; setLeaderboard: (v: LeaderboardEntry[]) => void;
  badges: Badge[]; setBadges: (v: Badge[]) => void;
  stats: StatRecord | null; setStats: (v: StatRecord | null) => void;

  // ── Auth ──
  currentUser: AppUser | null; 
  setCurrentUser: (u: AppUser | null) => void;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;

  // ── Methods ──
  addBookRequest: (r: BookRequest) => Promise<void>;
  updateBookRequest: (id: string, updates: Partial<BookRequest>) => Promise<void>;
  addPayment: (p: PaymentRecord) => Promise<void>;
  updatePayment: (id: string, updates: Partial<PaymentRecord>) => Promise<void>;
  updateUser: (id: string, updates: Partial<AppUser>) => Promise<void>;
  addUser: (u: AppUser) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem("highContrast") === "true");
  const [largeFonts, setLargeFonts] = useState(() => localStorage.getItem("largeFonts") === "true");
  const [dyslexicFont, setDyslexicFont] = useState(() => localStorage.getItem("dyslexicFont") === "true");
  
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [livingBooks, setLivingBooks] = useState<LivingBook[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [donationTiers, setDonationTiers] = useState<DonationTierRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<StatRecord | null>(null);

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem("hpl_currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [savedBooks, setSavedBooks] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});
  const [volunteerRoles, setVolunteerRoles] = useState<VolunteerRole[]>([]);
  const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>([]);
  
  const userPoints = currentUser?.points || 0;
  const userStreak = currentUser?.streak || 0;

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("books"),
          api.get("users"),
          api.get("blogs"),
          api.get("events"),
          api.get("living-books"),
          api.get("carousel-slides"),
          api.get("book-requests"),
          api.get("payments"),
          api.get("donation-tiers"),
          api.get("volunteer-applications"),
          api.get("leaderboard"),
          api.get("badges"),
          api.get("stats"),
          api.get("volunteer-roles"),
        ]);

        const data = results.map((res, i) => {
          if (res.status === "fulfilled") return res.value;
          console.error(`Error fetching index ${i}:`, res.reason);
          // Indices that should be arrays
          const arrayIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13];
          return arrayIndices.includes(i) ? [] : null;
        });

        const [b, u, blogs, ev, lb, slides, reqs, pays, stTiers, vApps, lBoard, bBadges, st, vRoles] = data;

        if (b) setBooks(b);
        if (u) setUsers(u);
        if (blogs) setBlogPosts(blogs);
        if (ev) setEvents(ev);
        if (lb) setLivingBooks(lb);
        if (slides) setCarouselSlides(slides);
        if (reqs) setBookRequests(reqs);
        if (pays) setPayments(pays);
        if (stTiers) setDonationTiers(stTiers);
        if (vApps) setVolunteerApplications(vApps);
        if (lBoard) setLeaderboard(lBoard);
        if (bBadges) setBadges(bBadges);
        if (st) setStats(Array.isArray(st) ? (st[0] || null) : st);
        if (vRoles) setVolunteerRoles(vRoles);
      } catch (err) {
        console.error("Critical error in fetchData:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync Preferences to LocalStorage (still useful for UI state)
  useEffect(() => { localStorage.setItem("highContrast", String(highContrast)); if (highContrast) document.documentElement.classList.add("high-contrast"); else document.documentElement.classList.remove("high-contrast"); }, [highContrast]);
  useEffect(() => { localStorage.setItem("largeFonts", String(largeFonts)); document.documentElement.style.fontSize = largeFonts ? "20px" : "16px"; }, [largeFonts]);
  useEffect(() => { localStorage.setItem("dyslexicFont", String(dyslexicFont)); document.documentElement.style.fontFamily = dyslexicFont ? "'OpenDyslexic', sans-serif" : "'Inter', 'Sora', sans-serif"; }, [dyslexicFont]);
  useEffect(() => { 
    if (currentUser) {
      setIsAdmin(currentUser.role === "admin");
      setSavedBooks(currentUser.savedBooks || []);
      setReadingProgress(currentUser.readingProgress || {});
      localStorage.setItem("hpl_currentUser", JSON.stringify(currentUser));
    } else {
      setIsAdmin(false);
      setSavedBooks([]);
      setReadingProgress({});
      localStorage.removeItem("hpl_currentUser");
    }
  }, [currentUser]);

  const toggleHighContrast = () => setHighContrast((v) => !v);
  const toggleLargeFonts = () => setLargeFonts((v) => !v);
  const toggleDyslexicFont = () => setDyslexicFont((v) => !v);
  const toggleSaveBook = async (id: string) => {
    if (!currentUser) return;
    const newSaved = savedBooks.includes(id) ? savedBooks.filter(x => x !== id) : [...savedBooks, id];
    await updateUser(currentUser._id || currentUser.id || "", { savedBooks: newSaved });
  };
  const updateProgress = async (id: string, progress: number) => {
    if (!currentUser) return;
    const newProgress = { ...readingProgress, [id]: progress };
    await updateUser(currentUser._id || currentUser.id || "", { readingProgress: newProgress });
  };
  const addVolunteerApplication = async (a: VolunteerApplication) => {
    const newApp = await api.post("volunteer-applications", a);
    setVolunteerApplications((p) => [newApp, ...p]);
  };
  const addPoints = async (pts: number) => {
    if (!currentUser) return;
    const newPoints = (currentUser.points || 0) + pts;
    await updateUser(currentUser._id || currentUser.id || "", { points: newPoints });
  };
  const addDonation = (d: DonationRecord) => {
    // For now, we'll just log this as the main record is handled by addPayment
    console.log("Legacy donation record:", d);
  };

  const login = async (credentials: any) => {
    const { user, token } = await api.login(credentials);
    if (token) localStorage.setItem("hpl_token", token);
    setCurrentUser(user);
    setIsAdmin(user.role === "admin");
  };

  const register = async (userData: any) => {
    const { user, token } = await api.register(userData);
    if (token) localStorage.setItem("hpl_token", token);
    setCurrentUser(user);
    setIsAdmin(user.role === "admin");
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("hpl_currentUser");
    localStorage.removeItem("hpl_token");
    localStorage.removeItem("isAdmin");
  };

  const addUser = async (u: AppUser) => {
    const newUser = await api.post("users", u);
    setUsers((p) => [newUser, ...p]);
  };

  const addBookRequest = async (r: BookRequest) => {
    const newReq = await api.post("book-requests", r);
    setBookRequests((p) => [newReq, ...p]);
  };

  const updateUser = async (id: string, updates: Partial<AppUser>) => {
    const updated = await api.put("users", id, updates);
    setUsers((p) => p.map((u) => (u._id === id || u.id === id) ? updated : u));
    if (currentUser && (currentUser._id === id || currentUser.id === id)) {
      setCurrentUser(updated);
    }
  };

  const updateBookRequest = async (id: string, updates: Partial<BookRequest>) => {
    const updated = await api.put("book-requests", id, updates);
    setBookRequests((p) => p.map((r) => (r._id === id || r.id === id) ? updated : r));
  };

  const addPayment = async (p: PaymentRecord) => {
    const newPay = await api.post("payments", p);
    setPayments((p) => [newPay, ...p]);
  };

  const updatePayment = async (id: string, updates: Partial<PaymentRecord>) => {
    const updated = await api.put("payments", id, updates);
    setPayments((p) => p.map((pay) => (pay._id === id || pay.id === id) ? updated : pay));
  };

  return (
    <AppContext.Provider value={{
      highContrast, toggleHighContrast, largeFonts, toggleLargeFonts, dyslexicFont, toggleDyslexicFont,
      savedBooks, toggleSaveBook, readingProgress, updateProgress,
      volunteerApplications, addVolunteerApplication,
      userStreak, userPoints, addPoints, addDonation, isAdmin, setIsAdmin,
      isLoading,
      books, setBooks, users, setUsers, blogPosts, setBlogPosts, events, setEvents, livingBooks, setLivingBooks, carouselSlides, setCarouselSlides, bookRequests, setBookRequests, payments, setPayments, donationTiers, setDonationTiers, volunteerRoles, setVolunteerRoles, leaderboard, setLeaderboard, badges, setBadges, stats, setStats,
      currentUser, setCurrentUser, login, register, logout,
      addBookRequest, updateBookRequest, addPayment, updatePayment, addUser, updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
