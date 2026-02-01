"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AppState = "initial" | "success";

// Floating hearts for celebration
function FloatingHearts() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    size: 16 + Math.random() * 16,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-rose-400"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-100vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

// Button that flees from cursor
function FleeingButton({ onClick }: { onClick: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasEscaped, setHasEscaped] = useState(false);

  const flee = useCallback(() => {
    if (!buttonRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();

    // Calculate maximum possible movement within viewport
    const maxX = Math.min(window.innerWidth - button.width - 20, 200);
    const maxY = Math.min(window.innerHeight - button.height - 20, 150);

    // Random direction to flee
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;

    setPosition({ x: newX, y: newY });
    setHasEscaped(true);
  }, []);

  return (
    <div ref={containerRef} className="relative h-16">
      <motion.button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={flee}
        onTouchStart={flee}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute left-1/2 -translate-x-1/2 px-8 py-3 border-2 border-[#6B4C9A]/30 text-[#6B4C9A] font-serif text-lg rounded hover:bg-[#6B4C9A]/5 transition-colors"
        style={{ fontFamily: "Georgia, Times New Roman, serif" }}
      >
        {hasEscaped ? "You Cannot Escape!" : "I Cannot"}
      </motion.button>
    </div>
  );
}

// Society Paper styled card
function SocietyPaper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-[#FDF6E3] border-4 border-double border-[#6B4C9A]/40 p-8 md:p-12 max-w-2xl mx-4 shadow-2xl ${className}`}
    >
      {/* Corner flourishes */}
      <div className="absolute top-2 left-2 text-[#6B4C9A]/30 text-2xl">❧</div>
      <div className="absolute top-2 right-2 text-[#6B4C9A]/30 text-2xl rotate-90">
        ❧
      </div>
      <div className="absolute bottom-2 left-2 text-[#6B4C9A]/30 text-2xl -rotate-90">
        ❧
      </div>
      <div className="absolute bottom-2 right-2 text-[#6B4C9A]/30 text-2xl rotate-180">
        ❧
      </div>
      {children}
    </div>
  );
}

export default function BridgertonValentineV2() {
  const [state, setState] = useState<AppState>("initial");
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => setShowGif(true), 500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleYes = () => {
    setState("success");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E6E6FA] to-[#FDF6E3] flex items-center justify-center py-8">
      <AnimatePresence mode="wait">
        {state === "initial" && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SocietyPaper>
              {/* Header */}
              <div className="text-center border-b-2 border-[#6B4C9A]/20 pb-6 mb-6">
                <h1
                  className="text-3xl md:text-4xl text-[#6B4C9A] mb-2 tracking-wide"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  Lady Whistledown&apos;s
                </h1>
                <h2
                  className="text-xl md:text-2xl text-[#6B4C9A]/80 italic"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  Society Papers
                </h2>
                <div className="mt-4 text-sm text-[#6B4C9A]/60 tracking-widest">
                  ✦ FEBRUARY 14TH ✦
                </div>
              </div>

              {/* Body */}
              <div className="text-center mb-8">
                <p
                  className="text-lg md:text-xl text-[#6B4C9A]/90 leading-relaxed mb-6"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  Dearest Gentle Reader,
                </p>
                <p
                  className="text-base md:text-lg text-[#6B4C9A]/80 leading-relaxed mb-6"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  This author has it on the highest authority that a certain
                  someone harbors feelings most ardent for{" "}
                  <span className="italic font-semibold">you</span>.
                </p>
                <p
                  className="text-base md:text-lg text-[#6B4C9A]/80 leading-relaxed"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  The question remains: Will you be their Valentine?
                </p>
              </div>

              {/* Divider */}
              <div className="text-center text-[#6B4C9A]/30 mb-8">
                ❦ ❦ ❦
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <div className="text-center">
                  <motion.button
                    onClick={handleYes}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-[#6B4C9A] text-[#FDF6E3] font-serif text-lg rounded shadow-lg hover:bg-[#5a3d87] transition-colors"
                    style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                  >
                    I Burn For You (Yes)
                  </motion.button>
                </div>
                <FleeingButton onClick={() => {}} />
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-[#6B4C9A]/20 text-center">
                <p
                  className="text-sm text-[#6B4C9A]/50 italic"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  — Your Secret Admirer
                </p>
              </div>
            </SocietyPaper>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <FloatingHearts />
            <SocietyPaper>
              <div className="text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl text-[#6B4C9A] mb-2"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  Flawless, My Dear!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-[#6B4C9A]/80 mb-8"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  This author knew you would make the right choice.
                </motion.p>

                <AnimatePresence>
                  {showGif && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center"
                    >
                      <img
                        src="/anthony-bridgerton.gif"
                        alt="Anthony Bridgerton"
                        className="rounded-lg shadow-xl border-4 border-[#6B4C9A]/20 max-w-full h-auto"
                        style={{ maxHeight: "300px" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-8 text-[#6B4C9A]/30"
                >
                  ❦ ❦ ❦
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="mt-4 text-sm text-[#6B4C9A]/50 italic"
                  style={{ fontFamily: "Georgia, Times New Roman, serif" }}
                >
                  — Lady Whistledown
                </motion.p>
              </div>
            </SocietyPaper>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
