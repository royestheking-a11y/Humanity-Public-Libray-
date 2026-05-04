import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String },
  date: { type: String },
  time: { type: String },
  location: { type: String },
  cover: { type: String },
  description: { type: String },
  attendees: { type: Number, default: 0 },
  capacity: { type: Number },
  tags: [String],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String },
  author: { type: String },
  date: { type: String },
  readTime: { type: String },
  cover: { type: String },
  tags: [String],
}, { timestamps: true });

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  avatar: { type: String },
  quote: { type: String },
  rating: { type: Number, default: 5 },
  location: { type: String },
}, { timestamps: true });

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
