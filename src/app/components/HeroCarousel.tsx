import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";

export function HeroCarousel() {
  const { carouselSlides } = useApp();
  const activeSlides = carouselSlides.filter((s) => s.active);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + activeSlides.length) % activeSlides.length);
    },
    [activeSlides.length]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  // prev removed

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    timerRef.current = setInterval(() => next(), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, next, activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const slide = activeSlides[current % activeSlides.length];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "600px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide content */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay — deep navy / blue themed */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(4,10,22,0.92) 0%, rgba(6,15,35,0.85) 30%, rgba(14,40,100,0.60) 60%, rgba(29,78,216,0.35) 100%)",
              }}
            />
            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-48"
              style={{ background: "linear-gradient(to top, rgba(4,10,22,0.85), transparent)" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
              <div className="max-w-3xl">
                {/* Badge pill */}
                {slide.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{
                      background: "rgba(96,165,250,0.15)",
                      border: "1px solid rgba(96,165,250,0.4)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />
                    <span
                      className="text-sm"
                      style={{ color: "#60A5FA", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                    >
                      {slide.badge}
                    </span>
                  </motion.div>
                )}

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-white mb-5 leading-tight"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2.4rem, 6vw, 5rem)",
                    lineHeight: 1.1,
                    textShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {slide.title.split(" ").map((word, i, arr) =>
                    i === arr.length - 1 ? (
                      <span
                        key={i}
                        style={{
                          background: "linear-gradient(135deg, #60A5FA, #93C5FD)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {" "}{word}
                      </span>
                    ) : (
                      <span key={i}>{i > 0 ? " " : ""}{word}</span>
                    )
                  )}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="text-white/70 mb-10 leading-relaxed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    maxWidth: "600px",
                  }}
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #60A5FA, #2563EB)",
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1rem",
                      boxShadow: "0 8px 32px rgba(96,165,250,0.3)",
                    }}
                  >
                    {slide.ctaText} <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/library"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm transition-all hover:bg-white/20"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1rem",
                      border: "1px solid rgba(255,255,255,0.2)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <BookOpen size={18} /> Browse Library
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows Removed */}

      {/* Dot indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {activeSlides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "32px" : "8px",
                height: "8px",
                background: i === current ? "#60A5FA" : "rgba(255,255,255,0.4)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter Removed */}

      {/* Progress bar */}
      {!isPaused && activeSlides.length > 1 && (
        <motion.div
          key={`progress-${current}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 6, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 z-20 origin-left"
          style={{ width: "100%", background: "linear-gradient(90deg, #60A5FA, #2563EB)" }}
        />
      )}
    </div>
  );
}