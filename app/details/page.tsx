"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

// ==========================================
// ZENTRALE EINSTELLUNGEN
const EVENT_DATE = "2026-05-08T17:30:00";
const ADDRESS = "Hinter dem Dorfe, 21258 Heidenau";
const INTERMEDIATE_TEXT = "Wir bauen unser Glück – und ihr seid dabei!";
// ==========================================

// EXTREM LANGSAMES SCHWEBEN FÜR SCROLL-EFFEKTE
const slowScrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 2.5,
      ease: [0.2, 0.6, 0.3, 1],
    },
  },
};

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
  const images = [
    "/haus1.jpg",
    "/haus2.jpg",
    "/haus3.jpg",
    "/haus4.jpg",
    "/haus5.jpg",
    "/haus6.jpg",
  ];
  const [currentImg, setCurrentImg] = useState(0);
  const [sentStatus, setSentStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isAccepted, setIsAccepted] = useState(true);
  const [showNavOptions, setShowNavOptions] = useState(false);

  const formattedDateText = useMemo(() => {
    const d = new Date(EVENT_DATE);
    return (
      d.toLocaleString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " Uhr"
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(EVENT_DATE).getTime();
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
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addToCalendar = () => {
    const d = new Date(EVENT_DATE);
    const formatICS = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const startStr = formatICS(d);
    const endStr = formatICS(new Date(d.getTime() + 4 * 60 * 60 * 1000));
    const event = { title: "Richtfest Ellena und Sven", location: ADDRESS };
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${startStr}\nDTEND:${endStr}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Richtfest.ics");
    link.click();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSentStatus("Wird gesendet...");
    const formData = new FormData(e.currentTarget);
    const statusValue = formData.get("status");
    const checkAccepted = statusValue === "Zusage";
    setIsAccepted(checkAccepted);

    formData.append("access_key", "a48e61a4-1dd6-49fc-8c7d-b125aab36fb5");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setSentStatus("Erfolgreich gesendet! 🎉");
        setShowPopup(true);
        if (checkAccepted) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#d1c4b4", "#4a4a4a", "#ffffff"],
          });
        }
        (e.target as HTMLFormElement).reset();
        setTimeout(() => router.push("/"), 8000);
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
        {/* SLIDESHOW OHNE SCHATTEN UND OHNE ABGERUNDETE KANTEN */}
        <div
          className="slideshow-container"
          style={{
            position: "relative",
            overflow: "hidden",
            height: "400px",
            width: "100%",
            margin: "0 auto 40px",
            // Schatten und Border-Radius entfernt
            boxShadow: "none",
            borderRadius: "0px",
          }}
        >
          {/* Innere Vignette (der weiße Verlauf) wurde komplett entfernt */}

          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImg}
              src={images[currentImg]}
              variants={fastEnterVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="slide-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0px", // Bild-Abrundung ebenfalls entfernt
              }}
            />
          </AnimatePresence>
        </div>

        <h1 className="details-title typewriter">Richtfest Einladung</h1>

        {/* DOPPEL-DIVIDER MIT TEXT DAZWISCHEN */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <motion.div
            className="details-divider"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "80px", opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          ></motion.div>

          <motion.p
            style={{
              margin: "15px 0",
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: "#6b6b6b",
              textAlign: "center",
              maxWidth: "80%",
              lineHeight: "1.4",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
          >
            {INTERMEDIATE_TEXT}
          </motion.p>

          <motion.div
            className="details-divider"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "80px", opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          ></motion.div>
        </div>

        {/* INFO SECTION */}
        <div className="info-section" style={{ marginTop: "60px" }}>
          <p>
            <strong>WANN:</strong> {formattedDateText}
          </p>
          <p>
            <strong>WO:</strong> {ADDRESS}
          </p>

          <div
            className="button-group"
            style={{ marginTop: "40px", marginBottom: "40px" }}
          >
            {" "}
            {/* Kleinerer Abstand nach unten */}
            <motion.button
              className="calendar-btn-premium"
              onClick={addToCalendar}
              whileHover={{
                scale: 1.03,
                backgroundColor: "rgba(209, 196, 180, 0.9)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="btn-content">
                <span>📅</span>
                <span className="btn-main-text">TERMIN SPEICHERN</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* --- AB HIER: LANGSAMES SCHWEBEN BEIM SCROLLEN --- */}

        {/* COUNTDOWN MIT ZUSÄTZLICHEM ABSTAND NACH OBEN */}
        <motion.div
          className="countdown-container"
          style={{ marginTop: "-25px" }} // Hier ist der Margin eingebaut
          variants={slowScrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
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
        </motion.div>

        {/* RSVP FORMULAR */}
        <motion.div
          className="form-container"
          variants={slowScrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="typewriter" style={{ marginBottom: "25px" }}>
            Zusagen / Absagen
          </h3>
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
              disabled={sentStatus.includes("Erfolgreis")}
            >
              {sentStatus.includes("Erfolgreich")
                ? "GESENDET ✓"
                : "ANTWORT ABSCHICKEN"}
            </button>
          </form>
          {sentStatus && <p className="status-msg">{sentStatus}</p>}
        </motion.div>

        {/* KARTE & NAVIGATION */}
        <motion.div
          className="map-section"
          style={{
            marginTop: "100px",
            textAlign: "center",
            paddingBottom: "40px",
          }}
          variants={slowScrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h3
            style={{
              marginBottom: "25px",
              fontSize: "1.3rem",
              color: "#4a4a4a",
              fontWeight: "300",
            }}
          >
            ANFAHRT
          </h3>
          <div
            className="map-container"
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
              height: "400px",
              border: "1px solid #eee",
              marginBottom: "35px",
              maxWidth: "900px",
              marginInline: "auto",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2383.7848522500085!2d9.640762677075488!3d53.311299277344936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b1a06781aec761%3A0xcb79d8f3214ad5a3!2sHinter%20dem%20Dorfe%2C%2021258%20Heidenau!5e0!3m2!1sde!2sde!4v1774142828219!5m2!1sde!2sde`}
            ></iframe>
          </div>

          <div className="button-group" style={{ marginTop: "40px" }}>
            <motion.button
              className="calendar-btn-premium"
              onClick={() => setShowNavOptions(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="btn-content">
                <span>📍</span>
                <span className="btn-main-text">NAVIGATION STARTEN</span>
              </div>
            </motion.button>
          </div>

          {/* DAS ENTSCHEIDUNGS-POPUP */}
          <AnimatePresence>
            {showNavOptions && (
              <motion.div
                className="popup-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNavOptions(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                }}
              >
                <motion.div
                  className="popup-content"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    backgroundColor: "#fff",
                    padding: "30px",
                    borderRadius: "20px",
                    textAlign: "center",
                    width: "85%",
                    maxWidth: "400px",
                  }}
                >
                  <h3 style={{ marginBottom: "20px", color: "#4a4a4a" }}>
                    Wähle deine App
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {/* Google Maps */}
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          ADDRESS,
                        )}`;
                        // _self oder location.href verhindert den leeren Tab
                        window.location.href = url;
                        setShowNavOptions(false);
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        background: "#f9f9f9",
                        cursor: "pointer",
                      }}
                    >
                      🌐 Google Maps
                    </button>

                    {/* Apple Maps */}
                    <button
                      onClick={() => {
                        const isIOS = /iPhone|iPad|iPod/i.test(
                          navigator.userAgent,
                        );
                        if (isIOS) {
                          // Direktes Umleiten ohne neuen Tab
                          window.location.href = `maps://?daddr=${encodeURIComponent(
                            ADDRESS,
                          )}`;
                        } else {
                          window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            ADDRESS,
                          )}`;
                        }
                        setShowNavOptions(false);
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        background: "#f9f9f9",
                        cursor: "pointer",
                      }}
                    >
                      🍎 Apple Maps
                    </button>

                    {/* Waze */}
                    <button
                      onClick={() => {
                        // Waze Universal Link
                        window.location.href = `https://waze.com/ul?q=${encodeURIComponent(
                          ADDRESS,
                        )}&navigate=yes`;
                        setShowNavOptions(false);
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        background: "#f9f9f9",
                        cursor: "pointer",
                      }}
                    >
                      🚙 Waze Navigation
                    </button>
                  </div>

                  <button
                    onClick={() => setShowNavOptions(false)}
                    style={{
                      marginTop: "20px",
                      color: "#888",
                      border: "none",
                      background: "none",
                      textDecoration: "underline",
                    }}
                  >
                    Abbrechen
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <button
          className="back-link"
          onClick={() => router.push("/")}
          style={{ marginTop: "60px", marginBottom: "100px" }}
        >
          ZURÜCK
        </button>
      </motion.div>

      {/* POPUP LOGIK */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="popup-content"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isAccepted ? (
                <>
                  <h2 style={{ color: "#2d5a27" }}>Wie schön! 🎉</h2>
                  <p>Wir freuen uns riesig, dass du dabei bist!</p>
                </>
              ) : (
                <>
                  <h2 style={{ color: "#4a4a4a" }}>Schade! 🏠</h2>
                  <p>Wir haben deine Absage erhalten.</p>
                </>
              )}
              <button
                onClick={() => setShowPopup(false)}
                className="popup-close-btn"
              >
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
