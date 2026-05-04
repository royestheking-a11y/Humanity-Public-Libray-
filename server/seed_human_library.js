import mongoose from "mongoose";
import dotenv from "dotenv";
import { LivingBook } from "./models/Extras.js";
import { LivingBookSession } from "./models/Operations.js";

dotenv.config();

const livingBooksData = [
  {
    title: "My home is underwater",
    narrator: "Climate migration · erosion",
    category: "Climate migration · erosion",
    icon: "🌊",
    description: "A story of losing three homes to the rising tides of the Bay of Bengal."
  },
  {
    title: "The sea used to give",
    narrator: "Fisher community · salinity",
    category: "Fisher community · salinity",
    icon: "🐟",
    description: "How the changing salinity of our rivers turned a bountiful life into a struggle for survival."
  },
  {
    title: "The night of the cyclone",
    narrator: "Disaster survivor · Dacope",
    category: "Disaster survivor · Dacope",
    icon: "🌀",
    description: "A harrowing account of surviving the strongest storm in a generation."
  },
  {
    title: "A craft no one buys",
    narrator: "Local artisan · heritage",
    category: "Local artisan · heritage",
    icon: "🎨",
    description: "The fading art of traditional wood carving in the coastal villages."
  },
  {
    title: "I was 13",
    narrator: "Early marriage · education",
    category: "Early marriage · education",
    icon: "💍",
    description: "A journey from being a child bride to an advocate for girls' education."
  },
  {
    title: "Our ancestors' land",
    narrator: "Indigenous community",
    category: "Indigenous community",
    icon: "🏺",
    description: "Preserving the culture and land rights of the Munda people in the Sundarbans."
  },
  {
    title: "Walking miles for water",
    narrator: "Water crisis · salinity",
    category: "Water crisis · salinity",
    icon: "💧",
    description: "The daily struggle of coastal women to find a single pot of drinkable water."
  },
  {
    title: "I stayed to help",
    narrator: "Social worker · resilience",
    category: "Social worker · resilience",
    icon: "🤝",
    description: "Why I chose to stay in my vulnerable village to build a better future for the next generation."
  }
];

const sessionData = [
  {
    bookTitle: "The night of the cyclone",
    userName: "Disaster survivor",
    userEmail: "hpl@humanity.org",
    date: "12 JUL",
    time: "6:00 PM · 45 min",
    location: "Hosted by Humanity Public Library",
    type: "Online",
    status: "approved"
  },
  {
    bookTitle: "My home is underwater",
    userName: "Climate migrant",
    userEmail: "hpl@humanity.org",
    date: "19 JUL",
    time: "10:00 AM · 30 min",
    location: "Nalian Library, Dacope",
    type: "In-person",
    status: "approved"
  },
  {
    bookTitle: "Researcher field visit",
    userName: "Coastal community",
    userEmail: "hpl@humanity.org",
    date: "26 JUL",
    time: "Full day",
    location: "Nalian village · Max 6 participants",
    type: "Field visit",
    status: "approved"
  }
];

async function seedHumanLibrary() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing
    await LivingBook.deleteMany({});
    console.log("Cleared existing living books");
    await LivingBookSession.deleteMany({});
    console.log("Cleared existing sessions");

    // Insert new
    await LivingBook.insertMany(livingBooksData);
    console.log("Seed data for Living Books inserted successfully!");
    await LivingBookSession.insertMany(sessionData);
    console.log("Seed data for Sessions inserted successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedHumanLibrary();
