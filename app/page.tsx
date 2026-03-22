"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
// Wir importieren die Schriftart direkt aus Google Fonts via Next.js
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const fullScreenVariants: Variants = {
  closed: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  open: {
    opacity: 0,
    scale: 2.2,
    filter: "blur(12px)",
    transition: {
      duration: 3.5,
      ease: [0.45, 0.05, 0.55, 0.95],
    },
  },
};

// Varianten für das fließende Schreiben der einzelnen Buchstaben
const letterVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

export default function WeddingInvite() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const infoText = "Für weitere Infos bitte klicken...";

  const firework = () => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 15,
      spread: 360,
      ticks: 400,
      zIndex: 100,
      gravity: 0.3,
      scalar: 1.2,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 30 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#d1c4b4", "#ffffff", "#f9f7f5"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#d1c4b4", "#ffffff", "#f9f7f5"],
      });
    }, 500);
  };

  const handleStart = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    firework();
    setTimeout(() => {
      router.push("/details");
    }, 5500); // Zeit erhöht, damit das Feuerwerk wirken kann
  };

  return (
    <main
      onClick={handleStart}
      style={{
        overflow: "hidden",
        cursor: isTransitioning ? "default" : "pointer",
        backgroundColor: "#e5e5e5",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* DER SCHREIBTEXT (über dem Bild) */}
      {!isTransitioning && (
        <motion.div
          className={dancingScript.className}
          style={{
            position: "absolute",
            zIndex: 30, // Höher als das Bild
            fontSize: "2.2rem",
            color: "#4a4a4a",
            textAlign: "center",
            bottom: "35%", // Position über dem unteren Teil des Bildes
            pointerEvents: "none", // Klicks gehen durch zum Main-Container
            display: "flex",
            justifyContent: "center",
            width: "100%",
            transform: "rotate(-19deg)",
          }}
          initial="hidden"
          animate="visible"
        >
          {infoText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              transition={{
                delay: 0.8 + index * 0.08, // Startverzögerung + Schreibgeschwindigkeit
                duration: 0.4,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* DAS BILD */}
      <motion.img
        src="/brief.png"
        alt="Einladung"
        variants={fullScreenVariants}
        initial="closed"
        animate={isTransitioning ? "open" : "closed"}
        style={{
          marginBottom: "280px",
          maxHeight: "70vh",
          width: "auto",
          height: "auto",
          zIndex: 10,
          display: "block",
          filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.08))",
        }}
      />
    </main>
  );
}
