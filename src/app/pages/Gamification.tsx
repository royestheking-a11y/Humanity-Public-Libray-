import { useState } from "react";
import { motion } from "motion/react";
import { Trophy, Flame, Star, Award, Crown, Globe, BookOpen, Accessibility, Medal, Check } from "lucide-react";
// Removed static mock import
import { useApp } from "../context/AppContext";
import { useLang } from "../context/LangContext";

const RARITY_COLORS: Record<string, string> = {
  Common: "#6B7280",
  Uncommon: "#2563EB",
  Rare: "#7C3AED",
  Epic: "#D97706",
  Legendary: "#60A5FA",
};

export default function Gamification() {
  const { userStreak, userPoints, savedBooks, leaderboard, badges } = useApp();
  const { t, isBn, bnFont } = useLang();
  const F = isBn ? bnFont : "'Inter', sans-serif";
  const FH = isBn ? bnFont : "'Sora', sans-serif";
  const [activeTab, setActiveTab] = useState<"leaderboard" | "badges" | "challenges">("leaderboard");
  const myRank = 42;
  const myBooks = savedBooks.length + 3;

  return (
    <div className="min-h-screen pt-16" style={{ background: "#FAFAFA" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #060F1E, #0C1A2E, #1D4ED8)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "#60A5FA", fontFamily: F, fontWeight: 600 }}>{t("game.label")}</p>
            <h1 className="text-white mb-4" style={{ fontFamily: FH, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              <Trophy size={36} className="inline mr-3 -mt-1" style={{ color: "#60A5FA" }} />{t("game.title")}
            </h1>
            <p className="text-white/60" style={{ fontFamily: F }}>{t("game.subtitle")}</p>
          </motion.div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { icon: Flame, label: t("game.dayStreak"), value: userStreak, color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
              { icon: Star, label: t("game.totalPoints"), value: userPoints.toLocaleString(), color: "#60A5FA", bg: "rgba(96,165,250,0.15)" },
              { icon: Trophy, label: t("game.globalRank"), value: `#${myRank}`, color: "#2563EB", bg: "rgba(37,99,235,0.15)" },
              { icon: Award, label: t("game.booksRead"), value: myBooks, color: "#22C55E", bg: "rgba(34,197,94,0.15)" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="p-4 rounded-2xl" style={{ background: bg, border: `1px solid ${color}30` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <p className="font-bold" style={{ fontFamily: FH, fontSize: "1.1rem", color }}>{value}</p>
                <p className="text-xs text-white/60" style={{ fontFamily: F }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-2xl mb-8" style={{ background: "#fff", border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 2px 12px rgba(37,99,235,0.06)" }}>
          {(["leaderboard", "badges", "challenges"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize"
              style={{ background: activeTab === tab ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "transparent", color: activeTab === tab ? "#fff" : "#6B7280", fontFamily: F }}>
              {t(`game.${tab}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {activeTab === "leaderboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-4 mb-10">
              {leaderboard.length >= 3 && [leaderboard[1], leaderboard[0], leaderboard[2]].map((user, i) => {
                const heights = ["h-28", "h-36", "h-24"];
                const podiumPos = [2, 1, 3];
                return (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-3">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg border-4"
                        style={{
                          background: i === 1 ? "linear-gradient(135deg, #60A5FA, #2563EB)" : i === 0 ? "linear-gradient(135deg, #9ca3af, #6b7280)" : "linear-gradient(135deg, #CD7F32, #A0522D)",
                          borderColor: i === 1 ? "#60A5FA" : i === 0 ? "#9ca3af" : "#CD7F32",
                          fontFamily: FH,
                        }}
                      >
                        {user.avatar}
                      </div>
                      {i === 1 && <Crown className="absolute -top-3 -right-1 text-[#60A5FA]" size={20} />}
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-1 text-center" style={{ fontFamily: FH }}>{user.name.split(" ")[0]}</p>
                    <p className="text-xs text-gray-400 mb-2">{user.points.toLocaleString()} pts</p>
                    <div
                      className={`${heights[i]} w-20 rounded-t-xl flex items-start justify-center pt-3 text-white font-bold`}
                      style={{ background: i === 1 ? "linear-gradient(180deg, #60A5FA, #2563EB)" : i === 0 ? "linear-gradient(180deg, #9ca3af, #6b7280)" : "linear-gradient(180deg, #CD7F32, #A0522D)", fontFamily: FH, fontSize: "1.2rem" }}
                    >
                      {podiumPos[i]}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full Leaderboard */}
            <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
              <div className="p-4 border-b border-gray-50 grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: F }}>
                <span className="col-span-1 text-center">Rank</span>
                <span className="col-span-4">Reader</span>
                <span className="col-span-2 text-center">Books</span>
                <span className="col-span-2 text-center">Streak</span>
                <span className="col-span-2 text-center">Points</span>
                <span className="col-span-1 text-center">Badge</span>
              </div>
              {leaderboard.map((user, i) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="grid grid-cols-12 items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 flex justify-center">
                    {user.rank <= 3 ? (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          background: user.rank === 1 ? "linear-gradient(135deg, #60A5FA, #2563EB)" : user.rank === 2 ? "linear-gradient(135deg, #9ca3af, #6b7280)" : "linear-gradient(135deg, #CD7F32, #A0522D)",
                        }}
                      >
                        <Medal size={14} className="text-white" />
                      </div>
                    ) : (
                      <span className="text-gray-400 font-semibold text-sm" style={{ fontFamily: FH }}>{user.rank}</span>
                    )}
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", fontFamily: FH }}>
                      {user.avatar}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 line-clamp-1" style={{ fontFamily: F }}>{user.name}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: FH }}>{user.books}</span>
                  </div>
                  <div className="col-span-2 text-center flex items-center justify-center gap-1">
                    <Flame size={13} className="text-orange-400" />
                    <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: FH }}>{user.streak}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-semibold" style={{ color: "#60A5FA", fontFamily: FH }}>{user.points.toLocaleString()}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#2563EB10", color: "#2563EB", fontFamily: F }}>
                      {user.badge.split(" ")[0]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Badges */}
        {activeTab === "badges" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(badges || []).map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`p-5 rounded-2xl text-center transition-all hover:-translate-y-1 ${!badge.earned && "opacity-50"}`}
                  style={{
                    background: badge.earned ? "#fff" : "#f5f8ff",
                    boxShadow: badge.earned ? "0 4px 20px rgba(37,99,235,0.08)" : "none",
                    border: badge.earned ? `2px solid ${RARITY_COLORS[badge.rarity]}30` : "2px dashed #d1d5db",
                  }}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-semibold text-sm mb-1" style={{ fontFamily: FH, color: badge.earned ? "#060F1E" : "#9ca3af" }}>{badge.name}</p>
                  <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: F }}>{badge.description}</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${RARITY_COLORS[badge.rarity]}15`, color: RARITY_COLORS[badge.rarity], fontFamily: F }}
                  >
                    {badge.rarity}
                  </span>
                  {badge.earned && (
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <Check size={12} className="text-green-500" />
                      <span className="text-xs text-green-500 font-semibold" style={{ fontFamily: F }}>Earned</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6 p-4 rounded-xl" style={{ background: "#f8f4f4" }}>
              <p className="text-sm text-gray-500" style={{ fontFamily: F }}>
                You've earned <span className="font-semibold" style={{ color: "#2563EB" }}>{(badges || []).filter(b => b.earned).length}</span> out of{" "}
                <span className="font-semibold">{(badges || []).length}</span> badges.
              </p>
            </div>
          </motion.div>
        )}

        {/* Challenges */}
        {activeTab === "challenges" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
            {[
              { title: "April Reading Sprint", icon: BookOpen, desc: "Read 5 books this month", progress: 60, reward: "+500 pts", deadline: "Apr 30", difficulty: "Medium" },
              { title: "Global Genres Challenge", icon: Globe, desc: "Read books from 5 different genres", progress: 80, reward: "+300 pts", deadline: "May 15", difficulty: "Easy" },
              { title: "7-Day Streak Builder", icon: Flame, desc: "Read every day for 7 days in a row", progress: 100, reward: "+200 pts", deadline: "Ongoing", difficulty: "Easy" },
              { title: "Bilingual Reader", icon: Globe, desc: "Read a book in both English and Bangla", progress: 50, reward: "+400 pts", deadline: "May 30", difficulty: "Medium" },
              { title: "Accessibility Champion", icon: Accessibility, desc: "Complete 3 audiobooks using the accessible player", progress: 33, reward: "+600 pts", deadline: "Jun 1", difficulty: "Hard" },
              { title: "Century Scholar", icon: Crown, desc: "Reach 100 books total — the ultimate milestone!", progress: (myBooks / 100) * 100, reward: "+2000 pts", deadline: "No deadline", difficulty: "Legendary" },
            ].map((challenge, i) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="p-6 rounded-2xl bg-white hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#2563EB10" }}>
                      <challenge.icon size={17} style={{ color: "#2563EB" }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ fontFamily: FH, color: "#060F1E" }}>{challenge.title}</h3>
                      <p className="text-sm text-gray-500" style={{ fontFamily: F }}>{challenge.desc}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm" style={{ color: "#60A5FA", fontFamily: FH }}>{challenge.reward}</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: F }}>Deadline: {challenge.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, challenge.progress)}%`,
                        background: challenge.progress >= 100 ? "linear-gradient(90deg, #22C55E, #16a34a)" : "linear-gradient(90deg, #2563EB, #60A5FA)",
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-10 text-right" style={{ fontFamily: FH }}>{Math.min(100, Math.round(challenge.progress))}%</span>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: challenge.difficulty === "Easy" ? "#22C55E15" : challenge.difficulty === "Medium" ? "#60A5FA15" : challenge.difficulty === "Hard" ? "#2563EB15" : "#60A5FA25",
                      color: challenge.difficulty === "Easy" ? "#16a34a" : challenge.difficulty === "Medium" ? "#2563EB" : challenge.difficulty === "Hard" ? "#2563EB" : "#60A5FA",
                      fontFamily: F,
                    }}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}