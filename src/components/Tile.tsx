import type { CSSProperties } from "react";
import styles from "./Tile.module.css";

export type TileState = "empty" | "filled" | "hidden" | "repeat" | "win" | "lose";

type TileProps = {
  char?: string;
  state?: TileState;
  /** The slot being typed into (or, when the row is full, every slot while the input has focus). */
  active?: boolean;
  /** Position in the row, used to stagger the reveal animation. */
  index?: number;
  /** Play the flip animation. */
  reveal?: boolean;
};

export function Tile({ char, state = "filled", active, index = 0, reveal }: TileProps) {
  return (
    <span
      className={styles.tile}
      data-state={state}
      data-active={active || undefined}
      data-reveal={reveal || undefined}
      style={{ "--i": index } as CSSProperties}
      aria-hidden="true"
    >
      {char}
    </span>
  );
}
