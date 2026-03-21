"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { submitForm } from "../actions";

// Sanfter Cross-Fade für die Bilder
const fastEnterVariants: Variants = {
  enter: { opacity: 0, scale: 1.02 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 1.2, ease: "easeIn" },
  },
};

export default function DetailsPage() {
  const router = useRouter();
  const images = ["/haus1.jpg", "/haus2.jpg", "/haus3.jpg"];
  const [currentImg, setCurrentImg] = useState(0);
  const [sentStatus, setSentStatus] = useState("");

  // --- DIASHOW TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  // --- COUNTDOWN LOGIK ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-06-15T16:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- KALENDER EXPORT ---
  const addToCalendar = () => {
    const event = {
      title: "Richtfest Seevetal",
      start: "20260615T160000",
      end: "20260615T220000",
      location: "Am Baufeld 12, 21217 Seevetal",
    };
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${event.start}\nDTEND:${event.end}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Richtfest.ics");
    link.click();
  };

  // --- FORMULAR MIT KONFETTI ---
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSentStatus("Wird gesendet...");

    const formData = new FormData(e.currentTarget);

    try {
      // Wir rufen die Server-Funktion auf, der Key ist hier nicht sichtbar!
      const res = await submitForm(formData);

      if (res.success) {
        setSentStatus("Erfolgreich gesendet! 🎉");
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d1c4b4", "#4a4a4a", "#ffffff"],
        });
        (e.target as HTMLFormElement).reset();
        setTimeout(() => router.push("/"), 5000);
      } else {
        setSentStatus("Fehler beim Senden.");
      }
    } catch (error) {
      setSentStatus("Verbindungsfehler.");
    }
  };

  return (
    <main className="details-viewport plain-bg">
      <motion.div
        className="details-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* DIASHOW */}
        <div className="slideshow-container">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImg}
              src={images[currentImg]}
              variants={fastEnterVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="slide-img"
            />
          </AnimatePresence>
        </div>

        <h1 className="details-title typewriter">Richtfest Einladung</h1>
        <div className="details-divider"></div>

        {/* INFOS & KARTE */}
        <div className="info-section">
          <p>
            <strong>WANN:</strong> 15. Juni 2026, 16:00 Uhr
          </p>
          <p>
            <strong>WO:</strong> Am Baufeld 12, Seevetal
          </p>

          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=Hinter+dem+Dorfe,+21258+Heidenau&t=&z=17&ie=UTF8&iwloc=&output=embed"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="button-group">
            <button className="mini-btn" onClick={addToCalendar}>
              📅 TERMIN SPEICHERN
            </button>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="countdown-container">
          <div className="countdown-item">
            <span>{timeLeft.days}</span>Tage
          </div>
          <div className="countdown-item">
            <span>{timeLeft.hours}</span>Std
          </div>
          <div className="countdown-item">
            <span>{timeLeft.minutes}</span>Min
          </div>
          <div className="countdown-item">
            <span>{timeLeft.seconds}</span>Sek
          </div>
        </div>

        {/* RSVP FORMULAR */}
        <div className="form-container">
          <h3 className="typewriter">Zusagen / Absagen</h3>
          <form className="rsvp-form-simple" onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Dein Name"
              required
              className="form-input"
            />
            <select name="status" className="form-input">
              <option value="Zusage">Ich komme gerne 🎉</option>
              <option value="Absage">Leider nicht möglich 😢</option>
            </select>
            <input
              type="number"
              name="personen"
              placeholder="Personen"
              min="1"
              max="10"
              className="form-input"
            />
            <textarea
              name="nachricht"
              placeholder="Nachricht..."
              className="form-input"
              rows={3}
            ></textarea>
            <button
              type="submit"
              className="submit-btn"
              disabled={sentStatus.includes("Erfolgreich")}
            >
              {sentStatus.includes("Erfolgreich")
                ? "GESENDET ✓"
                : "ANTWORT ABSCHICKEN"}
            </button>
          </form>
          {sentStatus && <p className="status-msg">{sentStatus}</p>}
        </div>

        <button className="back-link" onClick={() => router.push("/")}>
          ZURÜCK
        </button>
      </motion.div>
    </main>
  );
}
