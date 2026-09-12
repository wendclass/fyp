"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHRASES = [
  "un anniversaire inoubliable 🎂",
  "la personne de ta vie ❤️",
  "célébrer une grande réussite 🏆",
  "dire un immense merci 🙏",
  "féliciter un proche ✨",
  "surprendre sans te tromper 🎁",
];

export function HeroAnimatedText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block relative h-[1.3em] overflow-hidden align-top text-fuchsia-brand min-w-[280px] sm:min-w-[380px] md:min-w-[460px] text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 whitespace-nowrap font-display font-extrabold tracking-tight drop-shadow-sm"
        >
          {PHRASES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
