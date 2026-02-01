"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

// Corner flourish SVG component
function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
    >
      <path d="M0,0 Q30,0 50,20 Q70,40 70,70 Q40,70 20,50 Q0,30 0,0 M10,10 Q20,10 30,20 Q40,30 40,40 Q30,40 20,30 Q10,20 10,10" />
      <circle cx="60" cy="15" r="4" />
      <circle cx="75" cy="25" r="3" />
      <circle cx="85" cy="40" r="2" />
    </svg>
  );
}

// Decorative pamphlet border
function PamphletBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-8 md:p-12">
      {/* Outer decorative border */}
      <div className="absolute inset-0 border-4 border-wisteria/30 rounded-lg" />
      <div className="absolute inset-2 border-2 border-wisteria/20 rounded-lg" />
      <div className="absolute inset-4 border border-wisteria/10 rounded-lg" />

      {/* Corner flourishes */}
      <CornerFlourish className="absolute top-2 left-2 w-12 h-12 text-wisteria/40" />
      <CornerFlourish className="absolute top-2 right-2 w-12 h-12 text-wisteria/40 -scale-x-100" />
      <CornerFlourish className="absolute bottom-2 left-2 w-12 h-12 text-wisteria/40 -scale-y-100" />
      <CornerFlourish className="absolute bottom-2 right-2 w-12 h-12 text-wisteria/40 -scale-x-100 -scale-y-100" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Floating heart/petal component for celebration
function FloatingElement({
  delay,
  type,
}: {
  delay: number;
  type: "heart" | "petal";
}) {
  const randomX = Math.random() * 100;
  const randomDuration = 3 + Math.random() * 4;
  const randomSize = type === "heart" ? 16 + Math.random() * 16 : 12 + Math.random() * 12;

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{
        x: `${randomX}vw`,
        y: -50,
        rotate: 0,
        opacity: 0,
      }}
      animate={{
        y: "110vh",
        rotate: [0, 360, 720],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: "linear",
        rotate: {
          duration: randomDuration,
          ease: "linear",
        },
        opacity: {
          times: [0, 0.1, 0.8, 1],
          duration: randomDuration,
        },
      }}
      style={{
        left: 0,
      }}
    >
      {type === "heart" ? (
        <Heart
          size={randomSize}
          className="text-rose fill-rose/50"
        />
      ) : (
        <div
          className="rounded-full bg-wisteria-light/60"
          style={{
            width: randomSize,
            height: randomSize * 0.6,
            transform: `rotate(${Math.random() * 45}deg)`,
          }}
        />
      )}
    </motion.div>
  );
}

// Fleeing button component
function FleeingButton({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const [fleeCount, setFleeCount] = useState(0);
  const FLEE_THRESHOLD = 120;

  const flee = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!buttonRef.current || !containerRef.current) return;

      const button = buttonRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();

      const buttonCenterX = button.left + button.width / 2;
      const buttonCenterY = button.top + button.height / 2;

      const distance = Math.sqrt(
        Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
      );

      if (distance < FLEE_THRESHOLD) {
        // Calculate escape direction (away from mouse)
        const angle = Math.atan2(buttonCenterY - mouseY, buttonCenterX - mouseX);
        const escapeDistance = 100 + Math.random() * 50;

        // Add some randomness to the escape angle
        const randomAngle = angle + (Math.random() - 0.5) * 0.5;

        let newX = x.get() + Math.cos(randomAngle) * escapeDistance;
        let newY = y.get() + Math.sin(randomAngle) * escapeDistance;

        // Calculate bounds relative to container
        const maxX = container.width - button.width - 32;
        const maxY = container.height - button.height - 32;
        const minX = -(button.left - container.left - 16);
        const minY = -(button.top - container.top - 16);

        // If cornered, teleport to random position
        const isCornered =
          (newX <= minX || newX >= maxX) && (newY <= minY || newY >= maxY);

        if (isCornered || fleeCount > 3) {
          newX = minX + Math.random() * (maxX - minX);
          newY = minY + Math.random() * (maxY - minY);
          setFleeCount(0);
        } else {
          // Constrain to bounds
          newX = Math.max(minX, Math.min(maxX, newX));
          newY = Math.max(minY, Math.min(maxY, newY));
          setFleeCount((c) => c + 1);
        }

        x.set(newX);
        y.set(newY);
      }
    },
    [x, y, fleeCount, containerRef]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      flee(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [flee]);

  // Handle touch for mobile
  const handleTouch = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      flee(touch.clientX, touch.clientY);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      className="px-6 py-3 bg-parchment border-2 border-wisteria/30 text-wisteria
                 font-[family-name:var(--font-cormorant)] text-lg font-semibold
                 rounded-lg shadow-md hover:border-wisteria/50 transition-colors
                 cursor-not-allowed select-none"
      whileHover={{ scale: 0.95 }}
    >
      I Cannot
    </motion.button>
  );
}

// Success state component
function SuccessState() {
  const [floatingElements] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      type: Math.random() > 0.5 ? "heart" : "petal" as "heart" | "petal",
      delay: i * 0.15,
    }))
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {floatingElements.map((el) => (
        <FloatingElement key={el.id} delay={el.delay} type={el.type} />
      ))}
    </div>
  );
}

// Main component
export default function BridgertonValentine() {
  const [state, setState] = useState<"initial" | "success">("initial");
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleYes = () => {
    setState("success");
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-parchment flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #6B4C9A 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {state === "initial" ? (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg relative z-10"
          >
            <div className="bg-parchment/80 backdrop-blur-sm rounded-xl shadow-2xl shadow-wisteria/10">
              <PamphletBorder>
                {/* Header flourish */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-2 text-wisteria/60">
                    <div className="w-16 h-px bg-wisteria/30" />
                    <Sparkles size={20} />
                    <div className="w-16 h-px bg-wisteria/30" />
                  </div>
                </div>

                {/* Greeting */}
                <p className="font-[family-name:var(--font-cormorant)] text-xl text-wisteria text-center italic mb-4">
                  Dearest Reader,
                </p>

                {/* Body text */}
                <p className="font-[family-name:var(--font-cormorant)] text-lg text-ink/80 text-center leading-relaxed mb-8">
                  This Author has it on excellent authority that a most distinguished
                  suitor seeks your favor this Valentine&apos;s Day.
                </p>

                {/* Main question */}
                <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-wisteria text-center mb-8">
                  Will You Be My Valentine?
                </h1>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[120px]">
                  <motion.button
                    onClick={handleYes}
                    className="px-8 py-3 bg-wisteria text-parchment
                             font-[family-name:var(--font-cormorant)] text-lg font-semibold
                             rounded-lg shadow-lg shadow-wisteria/30
                             hover:bg-wisteria-dark transition-colors"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    I Burn For You
                  </motion.button>

                  {prefersReducedMotion ? (
                    <button
                      className="px-6 py-3 bg-parchment border-2 border-wisteria/30 text-wisteria
                               font-[family-name:var(--font-cormorant)] text-lg font-semibold
                               rounded-lg shadow-md cursor-not-allowed opacity-50"
                      disabled
                    >
                      I Cannot
                    </button>
                  ) : (
                    <FleeingButton containerRef={containerRef} />
                  )}
                </div>

                {/* Footer signature */}
                <div className="mt-8 text-center">
                  <p className="font-[family-name:var(--font-playfair)] text-sm text-wisteria/60 italic">
                    &mdash; Lady Whistledown
                  </p>
                </div>
              </PamphletBorder>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg relative z-10"
          >
            <div className="bg-parchment/80 backdrop-blur-sm rounded-xl shadow-2xl shadow-wisteria/10">
              <PamphletBorder>
                {/* Celebration header */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Heart size={48} className="text-rose fill-rose" />
                  </motion.div>
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-wisteria text-center mb-6"
                >
                  Flawless, My Dear!
                </motion.h1>

                {/* Success message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-[family-name:var(--font-cormorant)] text-xl text-ink/80 text-center leading-relaxed mb-6"
                >
                  This Author is positively delighted to announce that you have
                  made the most excellent choice. It is official.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="font-[family-name:var(--font-playfair)] text-2xl text-wisteria text-center font-semibold mb-8"
                >
                  You are now spoken for.
                </motion.p>

                {/* Signature */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-center"
                >
                  <p className="font-[family-name:var(--font-playfair)] text-lg text-wisteria/80 italic">
                    &mdash; Lady Whistledown
                  </p>
                </motion.div>
              </PamphletBorder>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating elements for success state */}
      {state === "success" && !prefersReducedMotion && <SuccessState />}
    </div>
  );
}
