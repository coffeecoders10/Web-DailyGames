import type { ReactNode } from "react";
import styles from "./Window.module.css";

type WindowProps = {
  title: string;
  /** Left side of the status bar. */
  status: ReactNode;
  /** Right side of the status bar. */
  detail: string;
  outcome?: "win" | "lose";
  children: ReactNode;
};

/** The guess log, framed like a small code editor with a status bar. */
export function Window({ title, status, detail, outcome, children }: WindowProps) {
  return (
    <div className={styles.window}>
      <div className={styles.titlebar} aria-hidden="true">
        <span className={styles.dots}>
          <i data-kind="error" />
          <i data-kind="bug" />
          <i data-kind="compile" />
        </span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.statusbar} data-outcome={outcome}>
        <span>{status}</span>
        <span>{detail}</span>
      </div>
    </div>
  );
}
