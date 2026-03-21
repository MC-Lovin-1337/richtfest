"use client";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation"; // Für die Weiterleitung

const envelopeVariants: Variants = {
  closed: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  open: {
    opacity: 0,
    scale: 1.1, // Leichter Zoom-Effekt beim Verschwinden
    filter: "blur(10px)", // Wird leicht unscharf für einen edlen Übergang
    transition: {
      duration: 1.2, // Schön langsam und elegant
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

export default function WeddingInvite() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setIsTransitioning(true);

    // Warte, bis die Animation fast fertig ist, dann leite weiter
    setTimeout(() => {
      router.push("/details"); // Hier den Namen deiner Zielseite eintragen (z.B. /einladung)
    }, 1200);
  };

  return (
    <div className="main-container">
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="invite-content"
          >
            <div className="perspective-container">
              <div className="invite-wrapper" onClick={handleOpen}>
                {/* DEIN BILD: brief.png */}
                <motion.img
                  src="/brief.png"
                  alt="Umschlag"
                  className="envelope-main-img"
                  variants={envelopeVariants}
                  initial="closed"
                  animate={isTransitioning ? "open" : "closed"}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optionaler Ladeindikator oder Hintergrund, der währenddessen schon durchscheint */}
      <div className="background-overlay"></div>
    </div>
  );
}
