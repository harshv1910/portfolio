"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause, Youtube } from "lucide-react";

/* ─────────────────────────────────────────────
   Data — replace with your real YouTube Short links & titles
───────────────────────────────────────────── */
const shorts = [
  { id: "ZYK8-MGhde4", title: "Short 1" },
  { id: "0qgcRSixSV0", title: "Short 2" },
  { id: "TsNyzW5qkeA", title: "Short 3" },
  { id: "Sop9QqvaZCA", title: "Short 4" },
  { id: "MFGfvoNU57A", title: "Short 5" },
  { id: "LL36AKBbJrI", title: "Short 6" },
  { id: "iCpLcj0Qi6M", title: "Short 7" },
  { id: "UZjm1c6zN00", title: "Short 8" },
  { id: "-poUrXp0UDQ", title: "Short 9" },
  { id: "j0-Qj-iSDPc", title: "Short 10" },
  { id: "TtJlRcJKU3U", title: "Short 11" },
  { id: "tLehqxRvfB4", title: "Short 12" },
  { id: "O5R5AuKWl6w", title: "Short 13" },
  { id: "OXtY7fb_ABg", title: "Short 14" },
  { id: "FLfvSnd9Rv8", title: "Short 15" },
  { id: "D-zcT6g9c6o", title: "Short 16" },
  { id: "h0ySWWg2pGc", title: "Short 17" },
  { id: "sBIQSyfVPMc", title: "Short 18" },
  { id: "_B01p1ZCMRQ", title: "Short 19" },
  { id: "3TdrLCCRoeg", title: "Short 20" },
  { id: "Mw6ovR8QsH4", title: "Short 21" },
  { id: "m6vVlqsyiU0", title: "Short 22" },
  { id: "0EX_tkLFw8s", title: "Short 23" },
  { id: "LM7hslCaU-o", title: "Short 24" },
  { id: "pMeRGNilDTk", title: "Short 25" },
  { id: "1BJGP6Q19Tw", title: "Short 26" },
];

// YouTube auto-generated thumbnail (maxresdefault or hqdefault as fallback)
const thumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const shortUrl = (id) => `https://www.youtube.com/shorts/${id}`;

/* ─────────────────────────────────────────────
   Spotlight Modal — embeds the YouTube Short
───────────────────────────────────────────── */
function SpotlightModal({ short, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
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
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Nav arrows */}
      <button
        onClick={onPrev}
        className="absolute left-5 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hidden sm:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-5 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hidden sm:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Phone frame + embed */}
      <motion.div
        key={short.id}
        className="relative z-10 flex flex-col items-center gap-5"
        initial={{ scale: 0.88, y: 20, opacity: 0 }}
        animate={{ scale: 1,    y: 0,  opacity: 1 }}
        exit={{    scale: 0.88, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {/* Phone shell */}
        <div
          className="relative rounded-[2.4rem] overflow-hidden border-4 shadow-2xl"
          style={{
            width: "min(340px, 88vw)",
            aspectRatio: "9/16",
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "0 0 60px rgba(255,50,50,0.18), 0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0&modestbranding=1`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
            title={short.title}
          />
        </div>

        {/* Title + open link */}
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <p className="text-white font-semibold text-base tracking-tight max-w-xs leading-snug">
            {short.title}
          </p>
          <a
            href={shortUrl(short.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: "rgba(255,40,40,0.12)",
              borderColor: "rgba(255,40,40,0.35)",
              color: "#ff6b6b",
            }}
          >
            <Youtube className="w-3.5 h-3.5" />
            Watch on YouTube
          </a>
        </div>

        {/* Mobile nav */}
        <div className="flex gap-3 sm:hidden">
          <button onClick={onPrev} className="p-2.5 rounded-full bg-white/10 text-white border border-white/10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={onNext} className="p-2.5 rounded-full bg-white/10 text-white border border-white/10">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Row thumbnail card (9:16 portrait)
───────────────────────────────────────────── */
function RowCard({ short, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden group focus:outline-none"
      style={{
        width: "clamp(120px, 16vw, 175px)",
        aspectRatio: "9/16",
      }}
      whileHover={{ scale: 1.06, zIndex: 10 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      <img
        src={thumb(short.id)}
        alt={short.title}
        className="w-full h-full object-cover"
        loading="lazy"
        draggable={false}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Active ring */}
      <div
        className="absolute inset-0 rounded-2xl border-2 transition-all duration-300"
        style={{
          borderColor: isActive ? "rgba(255,80,80,0.8)" : "transparent",
          boxShadow: isActive ? "0 0 18px rgba(255,60,60,0.35)" : "none",
        }}
      />

      {/* Play icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
        <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
      </div>

      {/* Title */}
      <p className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-[11px] font-semibold leading-snug text-left line-clamp-2">
        {short.title}
      </p>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function ShortsSection() {
  const [featured, setFeatured] = useState(shorts[0]);
  const [modalShort, setModalShort] = useState(null);
  const rowRef = useRef(null);

  const currentIndex = modalShort
    ? shorts.findIndex((s) => s.id === modalShort.id)
    : -1;

  const handlePrev = useCallback(() => {
    setModalShort(shorts[(currentIndex - 1 + shorts.length) % shorts.length]);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setModalShort(shorts[(currentIndex + 1) % shorts.length]);
  }, [currentIndex]);

  const scrollRow = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div
      className="w-full py-12 sm:py-20"
      style={{
        background: "transparent",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital@1&display=swap');

        .shorts-row::-webkit-scrollbar { display: none; }
        .shorts-row { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(255,60,60,0.45); }
          70%  { box-shadow: 0 0 0 10px rgba(255,60,60,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,60,60,0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* ── Section header ── */}
        <div className="mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-red-400/70 mb-2">
            Short Form
          </p>
          <div className="flex items-end justify-between gap-4">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontWeight: 700 }}
            >
              YouTube{" "}
              <span
                className="text-red-300"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                Shorts
              </span>
            </h2>
            <p className="text-white/30 text-sm mb-1 hidden sm:block">
              {shorts.length} videos · click to watch
            </p>
          </div>
          <div
            className="mt-5 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }}
          />
        </div>

        {/* ── Spotlight + Row layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Featured spotlight ── */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-4">
            <motion.div
              key={featured.id}
              className="relative rounded-3xl overflow-hidden cursor-pointer group"
              style={{
                width: "clamp(220px, 30vw, 310px)",
                aspectRatio: "9/16",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(255,50,50,0.12)",
              }}
              onClick={() => setModalShort(featured)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Thumbnail */}
              <img
                src={thumb(featured.id)}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Red accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ background: "linear-gradient(to right, #ff3c3c, #ff8c42)" }}
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="p-5 rounded-full border border-white/30 bg-white/15 backdrop-blur-sm"
                  style={{ animation: "pulse-ring 2s ease-out infinite" }}
                  whileHover={{ scale: 1.12 }}
                >
                  <Play className="w-7 h-7 text-white fill-white" />
                </motion.div>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2"
                  style={{ background: "rgba(255,50,50,0.25)", color: "#ff8080", border: "1px solid rgba(255,60,60,0.35)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  Shorts
                </div>
                <p className="text-white font-semibold text-base leading-snug">
                  {featured.title}
                </p>
              </div>
            </motion.div>

            {/* Open on YouTube link */}
            <a
              href={shortUrl(featured.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <Youtube className="w-3.5 h-3.5" />
              Open on YouTube
            </a>
          </div>

          {/* ── RIGHT: scrollable row ── */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">

            {/* Row header + scroll arrows */}
            <div className="flex items-center justify-between">
              <p className="text-white/50 text-sm font-medium">All Shorts</p>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRow(-1)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 text-white/60 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRow(1)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 text-white/60 hover:text-white transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable portrait cards */}
            <div
              ref={rowRef}
              className="shorts-row flex gap-3 overflow-x-auto pb-2"
            >
              {shorts.map((short) => (
                <RowCard
                  key={short.id}
                  short={short}
                  isActive={short.id === featured.id}
                  onClick={() => {
                    setFeatured(short);
                    setModalShort(short);
                  }}
                />
              ))}
            </div>

            {/* Hint */}
            <p className="text-white/20 text-xs mt-1">
              Click a short to spotlight · click again to watch
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalShort && (
          <SpotlightModal
            short={modalShort}
            onClose={() => setModalShort(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}