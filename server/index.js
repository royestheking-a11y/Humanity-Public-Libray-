import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { v2 as cloudinary } from "cloudinary";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hpl_media",
    resource_type: "auto", // supports image, video, raw (pdf, etc.)
  },
});

const upload = multer({ storage: storage });

// --- Routes ---

// File Upload Route
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    res.json({ url: req.file.path, public_id: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// Import Models
import Book from "./models/Book.js";
import User from "./models/User.js";
import { Event, BlogPost, Testimonial } from "./models/Content.js";
import { VolunteerRole, BookRequest, Payment, VolunteerApplication, LivingBookSession } from "./models/Operations.js";
import { CarouselSlide, LivingBook, Badge, Stat, DonationTier, Leaderboard } from "./models/Extras.js";

// Generic CRUD helper
const createCRUD = (model, path) => {
  app.get(`/api/${path}`, async (req, res) => {
    try {
      const data = await model.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/api/${path}`, async (req, res) => {
    try {
      const newItem = new model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put(`/api/${path}/:id`, async (req, res) => {
    try {
      const updatedItem = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete(`/api/${path}/:id`, async (req, res) => {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Register Routes
createCRUD(Book, "books");
createCRUD(User, "users");
createCRUD(Event, "events");
createCRUD(BlogPost, "blogs");
createCRUD(Testimonial, "testimonials");
createCRUD(VolunteerRole, "volunteer-roles");
createCRUD(BookRequest, "book-requests");
createCRUD(Payment, "payments");
createCRUD(CarouselSlide, "carousel-slides");
createCRUD(LivingBook, "living-books");
createCRUD(Badge, "badges");
// createCRUD(Stat, "stats"); // Replaced with dynamic endpoint below

// --- Dashboard Stats Endpoint ---
app.get("/api/stats", async (req, res) => {
  try {
    const [
      totalBooks,
      audioBooks,
      activeUsers,
      volunteers,
      donationsData,
    ] = await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ audioAvailable: true }),
      User.countDocuments({ role: "member" }),
      VolunteerApplication.countDocuments(),
      Payment.find({ purpose: "donation", status: "approved" }),
    ]);

    const totalDonations = donationsData.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalBooks,
      audioBooks,
      activeUsers,
      volunteers,
      donations: totalDonations,
      countriesServed: 1, 
      languagesAvailable: 2,
      visuallyImpairedUsers: Math.floor(activeUsers * 0.15),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
createCRUD(DonationTier, "donation-tiers");
createCRUD(Leaderboard, "leaderboard");
createCRUD(VolunteerApplication, "volunteer-applications");
createCRUD(LivingBookSession, "living-book-sessions");

// --- Auth Routes ---

// --- Seeding Routes ---
app.post("/api/seed/human-library", async (req, res) => {
  const livingBooksData = [
    { title: "My home is underwater", narrator: "Climate migration · erosion", category: "Climate migration · erosion", icon: "🌊", description: "A story of losing three homes to the rising tides of the Bay of Bengal." },
    { title: "The sea used to give", narrator: "Fisher community · salinity", category: "Fisher community · salinity", icon: "🐟", description: "How the changing salinity of our rivers turned a bountiful life into a struggle for survival." },
    { title: "The night of the cyclone", narrator: "Disaster survivor · Dacope", category: "Disaster survivor · Dacope", icon: "🌀", description: "A harrowing account of surviving the strongest storm in a generation." },
    { title: "A craft no one buys", narrator: "Local artisan · heritage", category: "Local artisan · heritage", icon: "🎨", description: "The fading art of traditional wood carving in the coastal villages." },
    { title: "I was 13", narrator: "Early marriage · education", category: "Early marriage · education", icon: "💍", description: "A journey from being a child bride to an advocate for girls' education." },
    { title: "Our ancestors' land", narrator: "Indigenous community", category: "Indigenous community", icon: "🏺", description: "Preserving the culture and land rights of the Munda people in the Sundarbans." },
    { title: "Walking miles for water", narrator: "Water crisis · salinity", category: "Water crisis · salinity", icon: "💧", description: "The daily struggle of coastal women to find a single pot of drinkable water." },
    { title: "I stayed to help", narrator: "Social worker · resilience", category: "Social worker · resilience", icon: "🤝", description: "Why I chose to stay in my vulnerable village to build a better future for the next generation." }
  ];

  try {
    await LivingBook.deleteMany({});
    await LivingBook.insertMany(livingBooksData);
    
    // Seed some initial sessions
    const sessionData = [
      { bookTitle: "The night of the cyclone", userName: "Disaster survivor", userEmail: "hpl@humanity.org", date: "12 JUL", time: "6:00 PM · 45 min", location: "Hosted by Humanity Public Library", type: "Online", status: "approved" },
      { bookTitle: "My home is underwater", userName: "Climate migrant", userEmail: "hpl@humanity.org", date: "19 JUL", time: "10:00 AM · 30 min", location: "Nalian Library, Dacope", type: "In-person", status: "approved" },
      { bookTitle: "Researcher field visit", userName: "Coastal community", userEmail: "hpl@humanity.org", date: "26 JUL", time: "Full day", location: "Nalian village · Max 6 participants", type: "Field visit", status: "approved" }
    ];
    await LivingBookSession.deleteMany({});
    await LivingBookSession.insertMany(sessionData);
    
    // Also reset all books to available to fix the "1 borrowed" issue
    await Book.updateMany({}, { available: true });

    res.json({ message: "Human Library seeded and books reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/fix-books", async (req, res) => {
  try {
    const result = await Book.updateMany({}, { available: true });
    res.json({ message: `Successfully updated ${result.modifiedCount} books to available.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registration
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, phone, studentId } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      studentId,
      role: email.includes("admin") ? "admin" : "member" 
    });
    
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    // Fallback for plain text password (if seeded)
    if (!isMatch && password === user.password) {
      // Auto-migrate to hashed password
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    } else if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login Specific (optional convenience)
app.post("/api/auth/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(401).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password === user.password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    } else if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google Auth
app.post("/api/auth/google", async (req, res) => {
  const { accessToken } = req.body;
  try {
    // Fetch user info from Google API using access token
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const payload = await response.json();
    
    if (!payload || payload.error) throw new Error("Invalid token");
    const { sub, email, name } = payload;

    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });

    if (!user) {
      user = new User({
        name,
        email,
        googleId: sub,
        role: email.toLowerCase().includes("admin") ? "admin" : "member",
        joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        avatarColor: "#2563EB",
        totalBorrowed: 0,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Google authentication failed" });
  }
});

app.get("/", (req, res) => res.send("HPL Backend API is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
