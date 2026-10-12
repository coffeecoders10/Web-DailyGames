import type { CSSProperties } from "react";
import styles from "./Burst.module.css";

const COLORS = ["var(--compile)", "var(--accent)", "var(--bug)"];

// Fixed, hand-spread values keep the burst identical on every render (no randomness at render time).
const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.18;
  const distance = 70 + ((i * 37) % 70);
  return {
    dx: Math.round(Math.cos(angle) * distance * 1.4),
    dy: Math.round(Math.sin(angle) * distance - 40),
    rot: (i * 83) % 360,
    delay: 380 + (i % 5) * 40,
    color: COLORS[i % COLORS.length],
  };
});

/** A short confetti burst from the answer tiles. Decorative and removed under reduced motion. */
export function Burst() {
  return (
    <span className={styles.burst} aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <i
          key={i}
          style={
            {
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
              "--delay": `${p.delay}ms`,
              background: p.color,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
