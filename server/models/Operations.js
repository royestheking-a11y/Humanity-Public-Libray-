import mongoose from "mongoose";

const volunteerRoleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  commitment: { type: String },
  skills: [String],
  openings: { type: Number },
  icon: { type: String },
}, { timestamps: true });

export const VolunteerRole = mongoose.model("VolunteerRole", volunteerRoleSchema);

const bookRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  userPhone: { type: String },
  bookId: { type: String, required: true },
  bookTitle: { type: String },
  bookAuthor: { type: String },
  bookCover: { type: String },
  bookGenre: { type: String },
  requestDate: { type: String },
  expectedReturnDate: { type: String },
  borrowDays: { type: Number },
  status: { type: String, enum: ["pending", "approved", "borrowed", "returned", "rejected"], default: "pending" },
  adminNote: { type: String },
  approvedDate: { type: String },
  returnedDate: { type: String },
}, { timestamps: true });

export const BookRequest = mongoose.model("BookRequest", bookRequestSchema);

const paymentRecordSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  userPhone: { type: String },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["bkash", "nagad"] },
  transactionId: { type: String },
  purpose: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  date: { type: String },
  tier: { type: String },
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentRecordSchema);

const volunteerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  role: { type: String },
  experience: { type: String },
  motivation: { type: String },
  date: { type: String },
}, { timestamps: true });

export const VolunteerApplication = mongoose.model("VolunteerApplication", volunteerApplicationSchema);
