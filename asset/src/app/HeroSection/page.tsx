"use client"
import { motion } from "framer-motion";
import { QrCode, ShieldCheck } from "lucide-react";
import heroBg from "@/app/Images/hero-bg.jpg";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroBg}
          alt="Campus verification"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 gradient-hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6"
        >
          Smart Laptop Asset Verification System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-primary-foreground/90 font-body italic mb-10 max-w-2xl mx-auto"
        >
          Secure and efficient university exit control using QR code and
          AI-powered facial verification
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* <a
            href="#overview"
            className="flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-lg font-heading font-bold text-lg hover:brightness-110 transition-all shadow-lg"
          >
            <QrCode className="h-5 w-5" />
            Register Asset
          </a> */}
          <a
            href="/Contact"
            className="flex items-center gap-2 border-2 border-primary-foreground/60 text-primary-foreground px-8 py-3.5 rounded-lg font-heading font-bold text-lg hover:bg-primary-foreground/10 transition-all"
          >
            <ShieldCheck className="h-5 w-5" />
            Start Verification
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
