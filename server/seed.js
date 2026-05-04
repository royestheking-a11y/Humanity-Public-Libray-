import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Book from "./models/Book.js";
import User from "./models/User.js";
import { Event, BlogPost, Testimonial } from "./models/Content.js";
import { VolunteerRole, BookRequest, Payment } from "./models/Operations.js";
import { CarouselSlide, LivingBook, Badge, Stat, DonationTier, Leaderboard } from "./models/Extras.js";

dotenv.config();

const BOOKS = [
  { title: "The Light Within", author: "Anisul Hoque", genre: "Fiction", language: "English", cover: "https://images.unsplash.com/photo-1752243751485-28462bdee57a?w=400&q=80", rating: 4.8, pages: 342, available: true, audioAvailable: true, description: "A profound tale of resilience and hope set in the heartlands of Bangladesh. This award-winning novel follows three generations of a family navigating the tides of change.", year: 2023, category: "Literature", downloads: 12450, saves: 3200, pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { title: "Pathways of Science", author: "Dr. Farida Begum", genre: "Science", language: "English", cover: "https://images.unsplash.com/photo-1732304720116-4195b021d8d0?w=400&q=80", rating: 4.9, pages: 512, available: true, audioAvailable: true, description: "An accessible guide to modern science covering physics, chemistry, biology and environmental studies. Designed for students in developing nations with limited lab access.", year: 2022, category: "Education", downloads: 18920, saves: 5400, pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { title: "Bangladesh Itihas", author: "Professor Moinul Islam", genre: "History", language: "Bangla", cover: "https://images.unsplash.com/photo-1764509422504-f9aee0a1dd76?w=400&q=80", rating: 4.7, pages: 678, available: true, audioAvailable: true, description: "A comprehensive history of Bangladesh from ancient times to the modern era. Covers culture, politics, liberation war and socioeconomic development in Bangla language.", year: 2021, category: "History", downloads: 22100, saves: 7800 },
  { title: "Philosophy of Mind", author: "Dr. Rashidul Hasan", genre: "Philosophy", language: "English", cover: "https://images.unsplash.com/photo-1761319115156-d758b22ed57b?w=400&q=80", rating: 4.6, pages: 290, available: true, audioAvailable: false, description: "An introduction to philosophical questions about consciousness, identity, and the nature of thought. Written for general readers with no prior philosophy background.", year: 2023, category: "Philosophy", downloads: 8350, saves: 2100 },
  { title: "Digital Futures", author: "Tarek Masud", genre: "Technology", language: "English", cover: "https://images.unsplash.com/photo-1753613648109-791ed9c85b82?w=400&q=80", rating: 4.9, pages: 410, available: true, audioAvailable: true, description: "How technology is reshaping education, healthcare and economy in the Global South. Essential reading for policymakers, entrepreneurs and students.", year: 2024, category: "Technology", downloads: 31200, saves: 9600 },
  { title: "Shishu Golpo Shomogro", author: "Sukumar Ray", genre: "Children", language: "Bangla", cover: "https://images.unsplash.com/photo-1760062744828-64801c56a039?w=400&q=80", rating: 4.8, pages: 180, available: true, audioAvailable: true, description: "A beloved collection of children's stories in Bangla, filled with imagination, humor and moral lessons. Perfect for young readers aged 6-12.", year: 2020, category: "Children", downloads: 45600, saves: 18900 },
  { title: "Health for All", author: "Dr. Salma Khanam", genre: "Health", language: "English", cover: "https://images.unsplash.com/photo-1660220939045-55d36e8800de?w=400&q=80", rating: 4.7, pages: 354, available: true, audioAvailable: true, description: "Practical health guidance for communities without regular access to medical professionals. Covers nutrition, preventive care, maternal health and mental wellness.", year: 2022, category: "Health", downloads: 29800, saves: 11200 },
  { title: "Voices of the River", author: "Selina Hossain", genre: "Fiction", language: "Bangla", cover: "https://images.unsplash.com/photo-1772165305999-fca56e4b29eb?w=400&q=80", rating: 4.9, pages: 498, available: true, audioAvailable: true, description: "A national bestseller following the lives of fishermen along the Padma River. A moving portrayal of resilience, community and environmental change.", year: 2023, category: "Literature", downloads: 19400, saves: 6700 },
  { title: "Mathematics Made Easy", author: "Prof. Kamrul Ahsan", genre: "Education", language: "English", cover: "https://images.unsplash.com/photo-1773243906471-909ac5d3496e?w=400&q=80", rating: 4.8, pages: 432, available: true, audioAvailable: false, description: "From basic arithmetic to calculus — this comprehensive guide makes mathematics accessible to rural and underprivileged students across South Asia.", year: 2022, category: "Education", downloads: 38900, saves: 14500 },
  { title: "Climate Change & Us", author: "Hasina Akter", genre: "Environment", language: "English", cover: "https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?w=400&q=80", rating: 4.6, pages: 276, available: true, audioAvailable: true, description: "Exploring how climate change uniquely impacts Bangladesh and the broader Global South, with community-led solutions and adaptation strategies.", year: 2024, category: "Environment", downloads: 14600, saves: 4800 },
  { title: "Entrepreneurship Pathways", author: "Mohammad Ali", genre: "Business", language: "English", cover: "https://images.unsplash.com/photo-1585693991691-d6d7d4b642c4?w=400&q=80", rating: 4.7, pages: 320, available: true, audioAvailable: false, description: "A practical guide to starting and scaling businesses in emerging markets. Features case studies from successful Bangladeshi and South Asian entrepreneurs.", year: 2023, category: "Business", downloads: 22300, saves: 8100 },
  { title: "Kobita Shomogro", author: "Jibanananda Das", genre: "Poetry", language: "Bangla", cover: "https://images.unsplash.com/photo-1761963108315-739eb365d446?w=400&q=80", rating: 5.0, pages: 245, available: true, audioAvailable: true, description: "The complete collection of Jibanananda Das — Bangladesh's most celebrated poet. A timeless journey through nature, longing and the Bengali soul.", year: 2020, category: "Poetry", downloads: 67800, saves: 28900 },
];

const TESTIMONIALS = [
  { name: "Fatema Begum", role: "Student, Dhaka University", avatar: "https://images.unsplash.com/photo-1734554118661-29139b63546c?w=200&q=80", quote: "Humanity Public Library changed my life. As a visually impaired student, the audiobook system and accessible interface allowed me to complete my degree. I'm forever grateful.", rating: 5, location: "Dhaka, Bangladesh" },
  { name: "Rafiqul Islam", role: "Rural Teacher, Sylhet", avatar: "https://images.unsplash.com/photo-1761963108315-739eb365d446?w=200&q=80", quote: "In our remote village school, we had no books. Now my students access thousands of educational materials in Bangla and English. This platform is a miracle for our community.", rating: 5, location: "Sylhet, Bangladesh" },
  { name: "Dr. Nasrin Sultana", role: "Educator & Author", avatar: "https://images.unsplash.com/photo-1758685848006-1bc450061624?w=200&q=80", quote: "The platform's commitment to inclusive education is world-class. The WCAG 2.1 AA compliance and multi-language support show genuine care for every learner.", rating: 5, location: "Chittagong, Bangladesh" },
];

const BLOG_POSTS = [
  { title: "How Digital Libraries Are Transforming Rural Education in Bangladesh", excerpt: "A deep dive into the impact of accessible digital learning resources on communities that have historically been underserved by traditional education systems.", category: "Impact Stories", author: "Editorial Team", date: "April 20, 2026", readTime: "8 min", cover: "https://images.unsplash.com/photo-1773243906471-909ac5d3496e?w=800&q=80", tags: ["Education", "Bangladesh", "Digital Access"] },
  { title: "WCAG 2.1 AA: Building for Every User, Every Ability", excerpt: "Understanding our commitment to accessibility standards and how inclusive design principles guide every decision we make in building this platform.", category: "Accessibility", author: "Tech Team", date: "April 15, 2026", readTime: "6 min", cover: "https://images.unsplash.com/photo-1660220939045-55d36e8800de?w=800&q=80", tags: ["Accessibility", "WCAG", "Design"] },
];

const EVENTS = [
  { title: "National Book Fair 2026", type: "In-Person", date: "May 15–20, 2026", time: "10:00 AM – 8:00 PM", location: "Bangladesh Shilpakala Academy, Dhaka", cover: "https://images.unsplash.com/photo-1772165305999-fca56e4b29eb?w=800&q=80", description: "Join us at Bangladesh's largest digital literacy event. Explore new books, meet authors, attend workshops on accessible reading and celebrate the joy of learning.", attendees: 2400, capacity: 5000, tags: ["Books", "Culture", "Education"], featured: true },
];

const USERS = [
  { name: "Rashida Khanam", email: "rashida@example.com", phone: "01712345678", password: "pass123", studentId: "STU001", joinDate: "Mar 10, 2026", totalBorrowed: 4, avatarColor: "#2563EB", role: "user" },
  { name: "Admin User", email: "admin@hpl.com", phone: "01700000000", password: "hpl202525", role: "admin", joinDate: "Jan 01, 2026" },
];

const CAROUSEL_SLIDES = [
  {
    image: "/assets/carousel_bangladesh_1.png",
    title: "Discover Bangladeshi Literature",
    subtitle: "Explore a vast collection of books from the heart of Bangladesh, preserving our heritage and culture.",
    ctaText: "Browse Collection",
    ctaLink: "/library",
    badge: "Heritage",
    active: true
  },
  {
    image: "/assets/carousel_library_2.png",
    title: "Empowering Through Knowledge",
    subtitle: "Your gateway to thousands of educational resources, accessible to everyone, everywhere.",
    ctaText: "Start Learning",
    ctaLink: "/library",
    badge: "Education",
    active: true
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected for seeding...");

    await Book.deleteMany({});
    await Book.insertMany(BOOKS);
    console.log("Books seeded");

    await Testimonial.deleteMany({});
    await Testimonial.insertMany(TESTIMONIALS);
    console.log("Testimonials seeded");

    await BlogPost.deleteMany({});
    await BlogPost.insertMany(BLOG_POSTS);
    console.log("Blog posts seeded");

    await Event.deleteMany({});
    await Event.insertMany(EVENTS);
    console.log("Events seeded");

    await User.deleteMany({});
    // Hash passwords before seeding
    const hashedUsers = await Promise.all(USERS.map(async (u) => {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      return { ...u, password: hashedPassword };
    }));
    await User.insertMany(hashedUsers);
    console.log("Users seeded with hashed passwords");

    await CarouselSlide.deleteMany({});
    await CarouselSlide.insertMany(CAROUSEL_SLIDES);
    console.log("Carousel slides seeded");

    await Stat.deleteMany({});
    await Stat.create({
      totalBooks: 52840,
      audioBooks: 18920,
      activeUsers: 248600,
      visuallyImpairedUsers: 34200,
      volunteers: 1847,
      donations: 892400,
      countriesServed: 47,
      languagesAvailable: 12,
    });
    console.log("Stats seeded");

    console.log("Seeding complete!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
