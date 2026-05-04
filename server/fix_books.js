import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js";

dotenv.config();

async function fixBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Set all books to available
    const result = await Book.updateMany({}, { available: true });
    console.log(`Updated ${result.modifiedCount} books to available.`);

    process.exit(0);
  } catch (error) {
    console.error("Error updating books:", error);
    process.exit(1);
  }
}

fixBooks();
