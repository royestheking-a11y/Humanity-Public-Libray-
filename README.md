# Humanity Public Library

Humanity Public Library is a premium, inclusive digital library platform designed to empower communities through knowledge and education. Built with a focus on accessibility and resilience, it serves as a gateway to thousands of resources for readers of all abilities, particularly those in coastal and underserved regions of Bangladesh.

## 🚀 Key Features

### 🌟 Inclusive Education Module
- **Audiobook System**: Over 12,000+ AI-narrated audiobooks for visually impaired users.
- **Voice Navigation**: Hands-free library browsing for enhanced accessibility.
- **OpenDyslexic Font**: One-click dyslexia-friendly mode for improved readability.
- **WCAG 2.1 AA Compliant**: High-contrast modes and accessible design patterns.

### 🛡️ Climate Resilience
- **Cyclone Impact Documentation**: Dedicated sections documenting the history and resilience of coastal communities in Khulna (Bhola, Sidr, Aila, Amphan, Mocha).
- **Empowerment Through Education**: Focused on helping children learn and communities rebuild stronger against climate disasters.

### 📚 Library Management
- **Extensive Collection**: Thousands of books across genres (Literature, History, Science, Philosophy, etc.).
- **Smart Dashboard**: Comprehensive user and admin dashboards for tracking reading progress and managing requests.
- **Living Books**: A unique "Human Library" feature where users can connect with storytellers and narrators.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Media**: Cloudinary (Image & PDF storage).
- **Deployment**: Vercel (Frontend) & Render (Backend).

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
cd server && npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5001
```

### 4. Running Locally
```bash
# Start both frontend and backend
npm run dev
```

## 🌍 Deployment

### Frontend (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` (Point to your Render backend URL)

### Backend (Render)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

---

**Designed and Developed by [Rizqara Tech](https://www.rizqara.tech)**
*Empowering your digital vision with state-of-the-art technology.*