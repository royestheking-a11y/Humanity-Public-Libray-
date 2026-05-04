import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
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
import { VolunteerRole, BookRequest, Payment, VolunteerApplication } from "./models/Operations.js";
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
createCRUD(Stat, "stats");
createCRUD(DonationTier, "donation-tiers");
createCRUD(Leaderboard, "leaderboard");
createCRUD(VolunteerApplication, "volunteer-applications");

// Specific Auth Routes (Simple version for migration)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) { // In production use bcrypt
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("HPL Backend API is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
