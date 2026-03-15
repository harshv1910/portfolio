"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Mail,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code,
  Sparkles,
  Play,
  Image as ImageIcon,
  Linkedin,
  Award,
  Users,
  TrendingUp,
  Check,
  Menu,
  X,
  Instagram,
  MessageCircle,
} from "lucide-react";
import ThumbnailShowcase, { ThumbnailSliderCSS, ThumbnailSliderEnhanced, ThumbnailSliderMotion, ThumbnailSliderSwiper } from "./components/Thumbnailslider";
import LinkedInBannerSlider from "./components/LinkedinBannerSlider";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import Services from "./components/Services";
import { ShortsSection } from "./components/Shortssection";
// import LongForm from "./components/LongForm";
import { LongFormSection } from "./components/LongFormSection";
import { WhyWorkWithMe } from "./components/WhyWorkWIthMe";
import CTASection from "./components/Ctasection";
import Footer from "./components/Footer";

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  const whatsappNumber = "919068737471";
  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your services. Let's discuss my project."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Animated Background with Mesh Gradients */}
      <div className="fixed inset-0 bg-black">
        {/* Floating Orbs - Purple mesh gradients */}
        <motion.div
          className="absolute w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[150px]"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] bg-purple-500/12 rounded-full blur-[120px]"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "10%", right: "5%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] bg-purple-400/8 rounded-full blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "50%", left: "50%" }}
        />

        {/* Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(139, 92, 246, 0.3) 80px, rgba(139, 92, 246, 0.3) 81px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(139, 92, 246, 0.3) 80px, rgba(139, 92, 246, 0.3) 81px)`,
          }}
        />

        {/* Paper Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Mouse Follow Light */}
        <motion.div
          className="absolute w-[800px] h-[800px] bg-purple-500/[0.04] rounded-full blur-[150px] pointer-events-none"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 150 }}
        />
      </div>

      

      {/* Content Container */}
      <div className="relative z-10">

        <Hero />
        <AboutSection />
        <Services />
                    <div id="social-media-design"/>
            <SocialPostSlider />
            <div id="thumbnail"/>
            <ThumbnailSliderCSS/>
            <div id="banner"/>
            <LinkedInBannerSlider/>
            <div id="short-form-video-editing"/>
            <ShortsSection/>
            <div id="long-form-video-editing"/>

            <LongFormSection />

        <WhyWorkWithMe />
        <CTASection whatsappLink={whatsappLink}/>
        <Footer whatsappLink={whatsappLink}/>
      


       









      </div>
    </main>
  );
}

