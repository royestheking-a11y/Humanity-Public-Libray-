import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  cover: { type: String },
  rating: { type: Number, default: 0 },
  pages: { type: Number },
  available: { type: Boolean, default: true },
  audioAvailable: { type: Boolean, default: false },
  description: { type: String },
  year: { type: Number },
  category: { type: String },
  downloads: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  pdfUrl: { type: String },
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
