import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  studentId: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  joinDate: { type: String },
  totalBorrowed: { type: Number, default: 0 },
  avatarColor: { type: String, default: "#2563EB" },
  savedBooks: [{ type: String }],
  readingProgress: { type: Map, of: Number, default: {} },
  points: { type: Number, default: 1250 },
  streak: { type: Number, default: 7 },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
