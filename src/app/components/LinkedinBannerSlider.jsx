import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Pause, Play, X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';

/* ─────────────────────────────────────────────
   Data helpers
───────────────────────────────────────────── */
const slider1Banners = Array.from({ length: 17 }, (_, i) => ({ src: `/banners/${i + 1}.png`, id: i + 1 }));
const slider2Banners = Array.from({ length: 17 }, (_, i) => ({ src: `/banners/${i + 18}.png`, id: i + 18 }));
const slider3Banners = Array.from({ length: 19 }, (_, i) => ({ src: `/banners/${i + 35}.png`, id: i + 35 }));
const allBanners = [...slider1Banners, ...slider2Banners, ...slider3Banners];

const triple = (arr) => [...arr, ...arr, ...arr];

/* ─────────────────────────────────────────────
   Modal
───────────────────────────────────────────── */
function Modal({ banner, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Nav buttons */}
        <button
          onClick={onPrev}
          className="absolute left-3 sm:left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white hidden sm:flex items-center justify-center"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-3 sm:right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white hidden sm:flex items-center justify-center"
          aria-label="Next banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4 max-w-5xl w-full"
          initial={{ scale: 0.88, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.88, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          key={banner.id}
        >
          {/* Image */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ aspectRatio: '4/1', maxHeight: '280px' }}>
            <Image
              src={banner.src}
              alt={`LinkedIn Banner #${banner.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>

          {/* Caption bar */}
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/40 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                #{banner.id} / 53
              </span>
              <span className="text-sm text-white/60 hidden sm:block">LinkedIn Banner</span>
            </div>
            {/* Mobile nav */}
            <div className="flex gap-2 sm:hidden">
              <button onClick={onPrev} className="p-2 rounded-full bg-white/10 text-white"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={onNext} className="p-2 rounded-full bg-white/10 text-white"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <a
                href={banner.src}
                download
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   Single slider row — CSS animation (no jank)
───────────────────────────────────────────── */
function SliderRow({ banners, direction, isPaused, duration, onBannerClick }) {
  // CSS keyframe animation via inline style
  const animName = `scroll-${direction}-${duration}`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg-color), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg-color), transparent)' }} />

      <div
        className="flex gap-4 sm:gap-6 w-max"
        style={{
          animation: `${animName} ${duration}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
          direction: direction === 'left' ? 'reverse' : 'normal',
        }}
      >
        <style>{`
          @keyframes ${animName} {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
        {triple(banners).map((banner, idx) => (
          <BannerCard
            key={`${banner.id}-${idx}`}
            banner={banner}
            onClick={() => onBannerClick(banner)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Banner card
───────────────────────────────────────────── */
function BannerCard({ banner, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{
        width: 'clamp(280px, 40vw, 720px)',
        height: 'clamp(70px, 10vw, 180px)',
      }}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-label={`Open banner #${banner.id}`}
    >
      <Image
        src={banner.src}
        alt={`LinkedIn Banner ${banner.id}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 280px, (max-width: 1280px) 40vw, 720px"
        draggable={false}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Badge */}
      <motion.div
        className="absolute bottom-2.5 left-3 text-white text-xs font-semibold tracking-wider opacity-0 group-hover:opacity-100"
        initial={false}
        transition={{ duration: 0.2 }}
      >
        #{banner.id}
      </motion.div>

      {/* Click hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export default function LinkedInBannerSlider() {
  const [isPaused, setIsPaused] = useState(false);
  const [modalBanner, setModalBanner] = useState(null);

  const currentIndex = modalBanner ? allBanners.findIndex(b => b.id === modalBanner.id) : -1;

  const handlePrev = useCallback(() => {
    const prev = (currentIndex - 1 + allBanners.length) % allBanners.length;
    setModalBanner(allBanners[prev]);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    const next = (currentIndex + 1) % allBanners.length;
    setModalBanner(allBanners[next]);
  }, [currentIndex]);

  return (
    <div
      className="relative w-full min-h-screen py-10 sm:py-16 overflow-hidden"
      style={{
        '--bg-color': '#080a0f',
        background: '#080a0f',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Playfair+Display:ital@1&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,82,255,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Header */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 mb-10 sm:mb-14">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-blue-400/70 mb-2">
              Professional Collection
            </p>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
              className="text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
              LinkedIn Banner{' '}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}
                className="text-blue-300">
                Gallery
              </span>
            </h1>
            <p className="mt-2 text-white/40 text-sm sm:text-base">
              53 professional designs · click any to preview
            </p>
          </div>

          <button
            onClick={() => setIsPaused(p => !p)}
            className="flex-shrink-0 group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200"
            style={{
              background: isPaused ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
              borderColor: isPaused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)',
              color: 'white',
            }}
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused
              ? <><Play className="w-4 h-4 fill-white" /><span className="text-sm hidden sm:inline">Resume</span></>
              : <><Pause className="w-4 h-4 fill-white/70" /><span className="text-sm hidden sm:inline text-white/60">Pause</span></>
            }
          </button>
        </div>

        {/* Subtle divider */}
        <div className="mt-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* Sliders */}
      <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
        <SliderRow
          banners={slider1Banners}
          direction="right"
          isPaused={isPaused}
          duration={60}
          onBannerClick={setModalBanner}
        />
        <SliderRow
          banners={slider2Banners}
          direction="left"
          isPaused={isPaused}
          duration={70}
          onBannerClick={setModalBanner}
        />
        <SliderRow
          banners={slider3Banners}
          direction="right"
          isPaused={isPaused}
          duration={80}
          onBannerClick={setModalBanner}
        />
      </div>

      {/* Footer count */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 mt-10 sm:mt-14">
        <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
        <div className="flex items-center justify-between text-white/25 text-xs sm:text-sm">
          <span>© LinkedIn Banner Gallery</span>
          <span>53 designs total</span>
        </div>
      </div>

      {/* Modal */}
      {modalBanner && (
        <Modal
          banner={modalBanner}
          onClose={() => setModalBanner(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}