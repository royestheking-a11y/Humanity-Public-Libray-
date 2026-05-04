import mongoose from "mongoose";
import dotenv from "dotenv";
import { LivingBook } from "./models/Extras.js";

dotenv.config();

const livingBooksData = [
  {
    title: "My home is underwater",
    narrator: "Fatema Khatun",
    category: "Climate migration · erosion",
    icon: "Waves",
    description: "A story of losing three homes to the rising tides of the Bay of Bengal."
  },
  {
    title: "The sea used to give",
    narrator: "Abdul Jalil",
    category: "Fisher community · salinity",
    icon: "Fish",
    description: "How the changing salinity of our rivers turned a bountiful life into a struggle for survival."
  },
  {
    title: "The night of the cyclone",
    narrator: "Marium Begum",
    category: "Disaster survivor · Dacope",
    icon: "Wind",
    description: "A harrowing account of surviving the strongest storm in a generation."
  },
  {
    title: "A craft no one buys",
    narrator: "Shyamol Sutradhar",
    category: "Local artisan · heritage",
    icon: "Palette",
    description: "The fading art of traditional wood carving in the coastal villages."
  },
  {
    title: "I was 13",
    narrator: "Tania Akter",
    category: "Early marriage · education",
    icon: "Heart",
    description: "A journey from being a child bride to an advocate for girls' education."
  },
  {
    title: "Our ancestors' land",
    narrator: "Joyanto Munda",
    category: "Indigenous community",
    icon: "History",
    description: "Preserving the culture and land rights of the Munda people in the Sundarbans."
  },
  {
    title: "Walking miles for water",
    narrator: "Sufia Bibi",
    category: "Water crisis · salinity",
    icon: "Droplets",
    description: "The daily struggle of coastal women to find a single pot of drinkable water."
  },
  {
    title: "I stayed to help",
    narrator: "Rezaul Karim",
    category: "Social worker · resilience",
    icon: "Handshake",
    description: "Why I chose to stay in my vulnerable village to build a better future for the next generation."
  }
];

async function seedLivingBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing
    await LivingBook.deleteMany({});
    console.log("Cleared existing living books");

    // Insert new
    await LivingBook.insertMany(livingBooksData);
    console.log("Seed data for Living Books inserted successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedLivingBooks();
