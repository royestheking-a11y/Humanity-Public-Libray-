import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Library from "./pages/Library";
import BookDetail from "./pages/BookDetail";
import Gamification from "./pages/Gamification";
import InclusiveEducation from "./pages/InclusiveEducation";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import UserAuth from "./pages/UserAuth";
import UserDashboard from "./pages/UserDashboard";
import Blog from "./pages/Blog";
import Events from "./pages/Events";
import About from "./pages/About";
import HumanLibrary from "./pages/HumanLibrary";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import AccessibilityPage from "./pages/AccessibilityPage";
import { BookOpen, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F0F6FF" }}>
      <div className="text-center px-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}>
          <BookOpen size={40} style={{ color: "#2563EB" }} />
        </div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#060F1E", fontSize: "3rem" }}>404</h1>
        <p className="text-gray-500 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>This page doesn't exist in our library.</p>
        <a href="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold" style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: "'Inter', sans-serif" }}>
          <ArrowLeft size={16} /> Return Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // ── Standalone pages (no main Navbar/Footer) ──
  { path: "/admin/login", Component: AdminLogin },
  { path: "/admin", Component: AdminDashboard },
  { path: "/user/login", Component: UserAuth },
  { path: "/user/register", Component: UserAuth },
  { path: "/user/dashboard", Component: UserDashboard },
  // ── Main site ──
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "library", Component: Library },
      { path: "book/:id", Component: BookDetail },
      { path: "gamification", Component: Gamification },
      { path: "inclusive", Component: InclusiveEducation },
      { path: "donate", Component: Donate },
      { path: "volunteer", Component: Volunteer },
      { path: "blog", Component: Blog },
      { path: "events", Component: Events },
      { path: "about", Component: About },
      { path: "project/human-library", Component: HumanLibrary },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "terms", Component: TermsOfUse },
      { path: "accessibility", Component: AccessibilityPage },
      { path: "*", Component: NotFound },
    ],
  },
]);