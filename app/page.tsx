"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const fullScreenVariants: Variants = {
  closed: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  open: {
    opacity: 0,
    scale: 1.05,
    filter: "blur(20px)",
    transition: {
      duration: 2.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function WeddingInvite() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const firework = () => {
    const duration = 2000; // Dauer des Feuerwerks in ms
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Zwei Salven pro Intervall an zufälligen Positionen
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#d1c4b4", "#ffffff", "#4a4a4a"], // Elegante Farben passend zu deinem Design
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#d1c4b4", "#ffffff", "#4a4a4a"],
      });
    }, 250);
  };

  const handleStart = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Feuerwerk starten
    firework();

    // Wechselt nach der Animation zur Detail-Seite
    setTimeout(() => {
      router.push("/details");
    }, 3200); // Etwas länger warten, damit das Feuerwerk wirken kann
  };

  return (
    <main
      className="viewport-wrapper"
      onClick={handleStart}
      style={{ overflow: "hidden" }}
    >
      <motion.img
        src="/brief.png"
        alt="Einladung Vollbild"
        className="full-screen-image"
        variants={fullScreenVariants}
        initial="closed"
        animate={isTransitioning ? "open" : "closed"}
      />
    </main>
  );
}
