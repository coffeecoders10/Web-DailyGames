import type { Mode } from "@/game/logic";
import styles from "./ModeSwitch.module.css";

const OPTIONS: { value: Mode; label: string }[] = [
  { value: "number", label: "Numbers" },
  { value: "word", label: "Words" },
];

type ModeSwitchProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <fieldset className={styles.switch}>
      <legend className="sr-only">Puzzle type</legend>
      {OPTIONS.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="radio"
            name="mode"
            className={styles.input}
            value={option.value}
            checked={mode === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
