"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Pause, Play, Instagram, Twitter, Facebook } from "lucide-react";

/* ─────────────────────────────────────────────
   Data  –  update count / paths to match yours
───────────────────────────────────────────── */
const TOTAL = 18;

const posts = Array.from({ length: TOTAL }, (_, i) => ({
  src: `/social-posts/${i + 1}.png` ,
  id: i + 1,
  // Optional: tag each post with a platform label
  platform: ["Instagram", "Twitter", "Facebook"][i % 3],
}));

const PLATFORM_ICON = {
  Instagram: Instagram,
  Twitter: Twitter,
  Facebook: Facebook,
};

/* ─────────────────────────────────────────────
   Modal
───────────────────────────────────────────── */
function Modal({ post, onClose, onPrev, onNext, total }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const PlatformIcon = PLATFORM_ICON[post.platform] ?? Instagram;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/88 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full border text-white transition-all"
        style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev / Next (desktop) */}
      {[
        { onClick: onPrev, Icon: ChevronLeft, side: "left-4 sm:left-8", label: "Previous" },
        { onClick: onNext, Icon: ChevronRight, side: "right-4 sm:right-8", label: "Next" },
      ].map(({ onClick, Icon, side, label }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label}
          className={`absolute ${side} z-20 p-3 rounded-full border text-white transition-all hidden sm:flex`}
          style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
        >
          <Icon className="w-6 h-6" />
        </button>
      ))}

      {/* Card */}
      <motion.div
        key={post.id}
        className="relative z-10 flex flex-col items-center gap-4 w-full"
        style={{ maxWidth: "420px" }}
        initial={{ scale: 0.88, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
      >
        {/* 1:1 image */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            aspectRatio: "",
            border: "1px solid rgba(74,222,128,0.18)",
            boxShadow: "0 0 60px rgba(74,222,128,0.08)",
          }}
        >
          <img
            src={post.src}
            alt={`Social post #${post.id}`}
            className="w-full h-full object-fit"
          />
          {/* Platform badge overlay */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#4ade80",
            }}
          >
            <PlatformIcon className="w-3 h-3" />
            {post.platform}
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between w-full px-1">
          <span
            className="text-xs font-mono px-3 py-1.5 rounded-full"
            style={{
              color: "rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            #{post.id} / {total}
          </span>

          {/* Mobile nav */}
          <div className="flex gap-2 sm:hidden">
            <button
              onClick={onPrev}
              className="p-2 rounded-full text-white"
              style={{ background: "rgba(255,255,255,0.09)" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNext}
              className="p-2 rounded-full text-white"
              style={{ background: "rgba(255,255,255,0.09)" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <a
            href={post.src}
            download
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm rounded-full text-white transition-all"
            style={{
              background: "rgba(74,222,128,0.12)",
              border: "1px solid rgba(74,222,128,0.3)",
              color: "#4ade80",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Post card
───────────────────────────────────────────── */
function PostCard({ post, onClick }) {
  const PlatformIcon = PLATFORM_ICON[post.platform] ?? Instagram;

  return (
    <motion.button
      onClick={onClick}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer focus:outline-none"
      style={{
        width: "clamp(220px, 24vw, 340px)",
        aspectRatio: "1/1",
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      aria-label={`Open post #${post.id}`}
    >
      <img
        src={post.src}
        alt={`Social post ${post.id}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
        loading="lazy"
        draggable={false}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)" }}
      />

      {/* Green border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          border: "1px solid rgba(74,222,128,0.45)",
          boxShadow: "inset 0 0 0 1px rgba(74,222,128,0.15), 0 0 24px rgba(74,222,128,0.12)",
        }}
      />

      {/* Platform icon top-right */}
      <div
        className="absolute top-2.5 right-2.5 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      >
        <PlatformIcon className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
      </div>

      {/* Badge bottom-left */}
      <div
        className="absolute bottom-2.5 left-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: "#4ade80" }}
      >
        #{post.id}
      </div>

      {/* Expand hint bottom-right */}
      <div
        className="absolute bottom-2.5 right-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        tap to preview
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function SocialPostSlider() {
  const [isPaused, setIsPaused] = useState(false);
  const [modalPost, setModalPost] = useState(null);

  const currentIndex = modalPost
    ? posts.findIndex((p) => p.id === modalPost.id)
    : -1;

  const handlePrev = useCallback(() => {
    setModalPost(posts[(currentIndex - 1 + posts.length) % posts.length]);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setModalPost(posts[(currentIndex + 1) % posts.length]);
  }, [currentIndex]);

  // Tripled for seamless CSS loop
  const tripled = [...posts, ...posts, ...posts];

  return (
    <div
      id="social-posts"
      className="w-full overflow-hidden py-10 sm:py-16 bg-linear-1200 from-[#080a0f] via-[#11331d] to-[#080a0f] relative"
      style={{ background: "", fontFamily: "'Syne', sans-serif" }}
    >
      <style>{`
       

        @keyframes scroll-posts {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .post-track {
          display: flex;
          gap: clamp(10px, 1.2vw, 20px);
          width: max-content;
          animation: scroll-posts 50s linear infinite;
        }
        .post-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative">
        {/* ── Header ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-2"
                style={{ color: "rgba(74,222,128,0.65)", fontFamily: "'Syne', sans-serif" }}
              >
                Creative Portfolio
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
              >
                Social{" "}
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#4ade80",
                  }}
                >
                  Posts
                </span>
              </h2>
              <p className="mt-1.5 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.3)" }}>
                {TOTAL} designs · Instagram, Twitter & Facebook
              </p>
            </div>

            {/* Pause / Resume */}
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 text-white"
              style={{
                background: isPaused ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)",
                borderColor: isPaused ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.09)",
              }}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" style={{ fill: "#4ade80", color: "#4ade80" }} />
                  <span className="text-sm hidden sm:inline" style={{ color: "#4ade80" }}>
                    Resume
                  </span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" style={{ fill: "rgba(255,255,255,0.45)", color: "rgba(255,255,255,0.45)" }} />
                  <span className="text-sm hidden sm:inline" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Pause
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div
            className="mt-6 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(74,222,128,0.12), transparent)",
            }}
          />
        </div>

        {/* ── Edge fades ── */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #080a0f, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #080a0f, transparent)" }}
        />

        {/* ── Slider track ── */}
        <div className="py-3 sm:py-4">
          <div className={`post-track${isPaused ? " paused" : ""}`}>
            {tripled.map((post, idx) => (
              <PostCard
                key={`${post.id}-${idx}`}
                post={post}
                onClick={() => setModalPost(post)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalPost && (
          <Modal
            post={modalPost}
            total={TOTAL}
            onClose={() => setModalPost(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}