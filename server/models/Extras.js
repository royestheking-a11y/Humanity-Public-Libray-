import mongoose from "mongoose";

const carouselSlideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String },
  badge: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const CarouselSlide = mongoose.model("CarouselSlide", carouselSlideSchema);

const livingBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  narrator: { type: String },
  category: { type: String },
  icon: { type: String },
  description: { type: String },
}, { timestamps: true });

export const LivingBook = mongoose.model("LivingBook", livingBookSchema);

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  description: { type: String },
  rarity: { type: String },
}, { timestamps: true });

export const Badge = mongoose.model("Badge", badgeSchema);

const statSchema = new mongoose.Schema({
  totalBooks: { type: Number },
  audioBooks: { type: Number },
  activeUsers: { type: Number },
  visuallyImpairedUsers: { type: Number },
  volunteers: { type: Number },
  donations: { type: Number },
  countriesServed: { type: Number },
  languagesAvailable: { type: Number },
}, { timestamps: true });

export const Stat = mongoose.model("Stat", statSchema);

const donationTierSchema = new mongoose.Schema({
  amount: { type: Number },
  label: { type: String },
  impact: { type: String },
  icon: { type: String },
}, { timestamps: true });

export const DonationTier = mongoose.model("DonationTier", donationTierSchema);

const leaderboardSchema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  books: { type: Number },
  streak: { type: Number },
  points: { type: Number },
  badge: { type: String },
  rank: { type: Number },
}, { timestamps: true });

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
