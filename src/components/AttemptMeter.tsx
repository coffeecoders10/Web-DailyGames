import * as Progress from "@radix-ui/react-progress";
import { MAX_ATTEMPTS } from "@/game/config";
import styles from "./AttemptMeter.module.css";

const SEGMENTS = Array.from({ length: MAX_ATTEMPTS }, (_, i) => i);

type AttemptMeterProps = {
  used: number;
  outcome?: "win" | "lose";
};

/** One segment per attempt. Radix Progress supplies the progressbar semantics. */
export function AttemptMeter({ used, outcome }: AttemptMeterProps) {
  return (
    <Progress.Root
      className={styles.meter}
      value={used}
      max={MAX_ATTEMPTS}
      getValueLabel={(value, max) => `${value} of ${max} attempts used`}
      aria-label="Attempts used"
      data-outcome={outcome}
    >
      {SEGMENTS.map((i) => (
        <span key={i} className={styles.segment} data-used={i < used || undefined} />
      ))}
    </Progress.Root>
  );
}
