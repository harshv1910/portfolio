"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Youtube, Clock } from "lucide-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const videos = [
  { id: "bzXDuVfLlnY", title: "Video Title 1"  },
  { id: "Iu8U9eFnjxE", title: "Video Title 2"  },
  { id: "LPoVRIo-iDU", title: "Video Title 3"  },
  { id: "Nktf6KuWmTg", title: "Video Title 4"  },
  { id: "lS98Vqp9Bug", title: "Video Title 5"  },
  { id: "SO3_TzWDf2U", title: "Video Title 6"  },
  { id: "lqyBUsROsww", title: "Video Title 7"  },
  { id: "pzaljP0zc24", title: "Video Title 8"  },
  { id: "Xyy7LxSu8so", title: "Video Title 9"  },
  { id: "QTL0wVKHvQc", title: "Video Title 10" },
  { id: "iOU8y2qQhxw", title: "Video Title 11" },
];

const thumb    = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
const videoUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

/* ─────────────────────────────────────────────
   Modal — full embed
───────────────────────────────────────────── */
function VideoModal({ video, onClose, onPrev, onNext }) {
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div className="absolute inset-0 bg-black/92 backdrop-blur-2xl" onClick={onClose} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Nav */}
      {[
        { fn: onPrev, Icon: ChevronLeft,  pos: "left-5 sm:left-8",  label: "Previous" },
        { fn: onNext, Icon: ChevronRight, pos: "right-5 sm:right-8", label: "Next"     },
      ].map(({ fn, Icon, pos, label }) => (
        <button
          key={label}
          onClick={fn}
          className={`absolute ${pos} z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hidden sm:flex`}
        >
          <Icon className="w-6 h-6" />
        </button>
      ))}

      {/* Card */}
      <motion.div
        key={video.id}
        className="relative z-10 flex flex-col items-center gap-5 w-full max-w-5xl"
        initial={{ scale: 0.9, y: 18, opacity: 0 }}
        animate={{ scale: 1,   y: 0,  opacity: 1 }}
        exit={{    scale: 0.9, y: 18, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {/* 16:9 embed */}
        <div
          className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          style={{
            aspectRatio: "16/9",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.7)",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
            title={video.title}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between w-full px-1">
          <p className="text-white font-semibold text-sm sm:text-base truncate max-w-md">
            {video.title}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {/* Mobile nav */}
            <div className="flex gap-2 sm:hidden">
              <button onClick={onPrev} className="p-2 rounded-full bg-white/10 text-white border border-white/10">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={onNext} className="p-2 rounded-full bg-white/10 text-white border border-white/10">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <a
              href={videoUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all"
              style={{
                background: "rgba(255,40,40,0.12)",
                borderColor: "rgba(255,40,40,0.35)",
                color: "#ff7070",
              }}
            >
              <Youtube className="w-3.5 h-3.5" />
              YouTube
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Row card — 16:9 landscape
───────────────────────────────────────────── */
function RowCard({ video, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex-shrink-0 rounded-xl overflow-hidden group focus:outline-none"
      style={{ width: "clamp(200px, 24vw, 300px)", aspectRatio: "16/9" }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      <img
        src={thumb(video.id)}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Active ring */}
      <div
        className="absolute inset-0 rounded-xl border-2 transition-all duration-300"
        style={{
          borderColor: isActive ? "rgba(255,80,80,0.85)" : "transparent",
          boxShadow:   isActive ? "0 0 20px rgba(255,60,60,0.3)" : "none",
        }}
      />

      {/* Play */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
      </div>

      {/* Title */}
      <p className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold leading-snug text-left line-clamp-2">
        {video.title}
      </p>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function LongFormSection() {
  const [featured, setFeatured]   = useState(videos[0]);
  const [modalVideo, setModalVideo] = useState(null);
  const rowRef = useRef(null);

  const currentIndex = modalVideo
    ? videos.findIndex((v) => v.id === modalVideo.id)
    : -1;

  const handlePrev = useCallback(() => {
    setModalVideo(videos[(currentIndex - 1 + videos.length) % videos.length]);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setModalVideo(videos[(currentIndex + 1) % videos.length]);
  }, [currentIndex]);

  const scrollRow = (dir) => rowRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div
      className="w-full py-12 sm:py-20 bg-red-300/5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital@1&display=swap');
        .videos-row::-webkit-scrollbar { display: none; }
        .videos-row { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* ── Section header ── */}
        <div className="mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-red-400/70 mb-2">
            Long Form
          </p>
          <div className="flex items-end justify-between gap-4">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontWeight: 700 }}
            >
              YouTube{" "}
              <span
                className="text-red-500"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                Videos
              </span>
            </h2>
            <p className="text-white/30 text-sm mb-1 hidden sm:block">
              {videos.length} videos · click to watch
            </p>
          </div>
          <div
            className="mt-5 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }}
          />
        </div>

        {/* ── Featured spotlight ── */}
        <motion.div
          key={featured.id}
          className="relative w-full rounded-3xl overflow-hidden cursor-pointer group mb-6"
          style={{
            aspectRatio: "16/9",
            maxHeight: "520px",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 40px 100px rgba(0,0,0,0.55), 0 0 60px rgba(255,50,50,0.08)",
          }}
          onClick={() => setModalVideo(featured)}
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Thumbnail */}
          <img
            src={thumb(featured.id)}
            alt={featured.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: "linear-gradient(to right, #ff3c3c, #ff8c42, transparent)" }}
          />

          {/* Center play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="p-6 rounded-full border border-white/25 bg-white/15 backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-10 h-10 text-white fill-white" />
            </motion.div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3"
                style={{
                  background: "rgba(255,50,50,0.2)",
                  color: "#ff8080",
                  border: "1px solid rgba(255,60,60,0.35)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                Featured
              </div>
              <p className="text-white font-bold text-xl sm:text-2xl md:text-3xl leading-snug max-w-2xl">
                {featured.title}
              </p>
            </div>
            <a
              href={videoUrl(featured.id)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background: "rgba(255,40,40,0.15)",
                borderColor: "rgba(255,40,40,0.4)",
                color: "#ff7070",
              }}
            >
              <Youtube className="w-4 h-4" />
              Watch on YouTube
            </a>
          </div>
        </motion.div>

        {/* ── Scrollable row ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-white/50 text-sm font-medium">All Videos</p>
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

          <div ref={rowRef} className="videos-row flex gap-3 overflow-x-auto pb-2">
            {videos.map((video) => (
              <RowCard
                key={video.id}
                video={video}
                isActive={video.id === featured.id}
                onClick={() => {
                  setFeatured(video);
                  setModalVideo(video);
                }}
              />
            ))}
          </div>

          <p className="text-white/20 text-xs">
            Click a video to spotlight · click again to watch
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalVideo && (
          <VideoModal
            video={modalVideo}
            onClose={() => setModalVideo(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}