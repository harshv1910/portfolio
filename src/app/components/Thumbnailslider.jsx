"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink, Pause, Play } from "lucide-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const thumbnails = Array.from({ length: 26 }, (_, i) => ({
  src: `/thumbnails/${i + 1}.png`,
  id: i + 1,
}));

/* ─────────────────────────────────────────────
   Modal
───────────────────────────────────────────── */
function Modal({ thumbnail, onClose, onPrev, onNext }) {
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
        className="absolute inset-0 bg-black/85 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all"
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
          className={`absolute ${side} z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hidden sm:flex`}
        >
          <Icon className="w-6 h-6" />
        </button>
      ))}

      {/* Card */}
      <motion.div
        key={thumbnail.id}
        className="relative z-10 flex flex-col items-center gap-4 w-full max-w-4xl"
        initial={{ scale: 0.9, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        {/* 16:9 image */}
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{ aspectRatio: "16/9" }}
        >
          <img
            src={thumbnail.src}
            alt={`Thumbnail #${thumbnail.id}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between w-full px-1">
          <span className="text-xs font-mono text-white/40 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            #{thumbnail.id} / 26
          </span>

          {/* Mobile nav */}
          <div className="flex gap-2 sm:hidden">
            <button onClick={onPrev} className="p-2 rounded-full bg-white/10 text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={onNext} className="p-2 rounded-full bg-white/10 text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <a
            href={thumbnail.src}
            download
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
          >
            Download
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Thumbnail card
───────────────────────────────────────────── */
function ThumbCard({ thumbnail, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
      style={{
        width: "clamp(260px, 32vw, 420px)",
        aspectRatio: "16/9",
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      aria-label={`Open thumbnail #${thumbnail.id}`}
    >
      <img
        src={thumbnail.src}
        alt={`YouTube Thumbnail ${thumbnail.id}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        draggable={false}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Border glow */}
      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-red-500/50 transition-all duration-300 ring-0 group-hover:ring-1 group-hover:ring-red-500/20" />

      {/* Expand icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Badge */}
      <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        #{thumbnail.id}
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function ThumbnailSliderCSS() {
  const [isPaused, setIsPaused] = useState(false);
  const [modalThumb, setModalThumb] = useState(null);

  const currentIndex = modalThumb ? thumbnails.findIndex((t) => t.id === modalThumb.id) : -1;

  const handlePrev = useCallback(() => {
    setModalThumb(thumbnails[(currentIndex - 1 + thumbnails.length) % thumbnails.length]);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setModalThumb(thumbnails[(currentIndex + 1) % thumbnails.length]);
  }, [currentIndex]);

  // Tripled for seamless CSS loop
  const tripled = [...thumbnails, ...thumbnails, ...thumbnails];

  return (
    <div
    id="thumbnails"
      className="w-full overflow-hidden py-10 sm:py-16"
      style={{
        background: "transparent",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital@1&display=swap');

        @keyframes scroll-thumbnails {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        .thumb-track {
          display: flex;
          gap: clamp(12px, 1.5vw, 24px);
          width: max-content;
          animation: scroll-thumbnails 55s linear infinite;
        }

        .thumb-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-red-400/70 mb-2">
                Creative Portfolio
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
              >
                YouTube{" "}
                <span
                  className="text-red-300"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  Thumbnails
                </span>
              </h2>
              <p className="mt-1.5 text-white/35 text-sm sm:text-base">
                26 designs · click any to preview
              </p>
            </div>

            <button
              onClick={() => setIsPaused((p) => !p)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 text-white"
              style={{
                background: isPaused ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
                borderColor: isPaused ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.1)",
              }}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span className="text-sm hidden sm:inline">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 fill-white/60" />
                  <span className="text-sm hidden sm:inline text-white/50">Pause</span>
                </>
              )}
            </button>
          </div>

          <div
            className="mt-6 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }}
          />
        </div>

        {/* Edge fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #080a0f, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #080a0f, transparent)" }}
        />

        {/* Slider track */}
        <div className="py-3 sm:py-4">
          <div className={`thumb-track${isPaused ? " paused" : ""}`}>
            {tripled.map((thumb, idx) => (
              <ThumbCard
                key={`${thumb.id}-${idx}`}
                thumbnail={thumb}
                onClick={() => setModalThumb(thumb)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalThumb && (
          <Modal
            thumbnail={modalThumb}
            onClose={() => setModalThumb(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}