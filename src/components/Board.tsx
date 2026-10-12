"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useRef, useState, type CSSProperties, type FormEvent, type SyntheticEvent } from "react";
import { MAX_ATTEMPTS, PUZZLE_LENGTH } from "@/game/config";
import { findRepeats, sanitize, type Guess, type Mode } from "@/game/logic";
import { BugIcon, CompileIcon, ErrorIcon } from "./Icons";
import { Tile } from "./Tile";
import styles from "./Board.module.css";

/** The guess form lives in the board; its Submit button sits below the grid and points here. */
export const GUESS_FORM_ID = "guess-form";

const SLOTS = Array.from({ length: PUZZLE_LENGTH }, (_, i) => i);

type ChipKind = "compile" | "bug" | "error";

const CHIPS: { kind: ChipKind; field: "compiles" | "bugs" | "errors"; singular: string; plural: string }[] = [
  { kind: "compile", field: "compiles", singular: "compile", plural: "compiles" },
  { kind: "bug", field: "bugs", singular: "bug", plural: "bugs" },
  { kind: "error", field: "errors", singular: "error", plural: "errors" },
];

function ChipIcon({ kind }: { kind: ChipKind }) {
  if (kind === "compile") return <CompileIcon />;
  if (kind === "bug") return <BugIcon />;
  return <ErrorIcon />;
}

export function Legend({ compact }: { compact?: boolean }) {
  return (
    <ul className={`${styles.legend} ${compact ? styles.compact : ""}`} aria-label="What the feedback means">
      <li data-kind="compile">
        <span className={styles.legendName}>
          <CompileIcon /> Compiles
        </span>
        <span className={styles.legendHint}>Right spot</span>
      </li>
      <li data-kind="bug">
        <span className={styles.legendName}>
          <BugIcon /> Bugs
        </span>
        <span className={styles.legendHint}>Wrong spot</span>
      </li>
      <li data-kind="error">
        <span className={styles.legendName}>
          <ErrorIcon /> Errors
        </span>
        <span className={styles.legendHint}>Not in answer</span>
      </li>
    </ul>
  );
}

export function GuessRow({ guess, number }: { guess: Guess; number: number }) {
  const summary = CHIPS.map(
    ({ field, singular, plural }) => `${guess[field]} ${guess[field] === 1 ? singular : plural}`,
  ).join(", ");

  return (
    <li className={styles.line}>
      <VisuallyHidden.Root>
        Guess {number}: {guess.value.split("").join(" ")}. {summary}.
      </VisuallyHidden.Root>
      <div className={styles.tiles} aria-hidden="true">
        {SLOTS.map((i) => (
          <Tile key={i} char={guess.value[i]} />
        ))}
      </div>
      <div className={styles.chips} aria-hidden="true">
        {CHIPS.map(({ kind, field }, n) => (
          <span
            key={kind}
            className={styles.chip}
            data-kind={kind}
            data-zero={guess[field] === 0 || undefined}
            style={{ "--n": n } as CSSProperties}
          >
            <ChipIcon kind={kind} />
            {guess[field]}
          </span>
        ))}
      </div>
    </li>
  );
}

function GhostChips() {
  return (
    <div className={styles.chips} aria-hidden="true">
      {CHIPS.map(({ kind }) => (
        <span key={kind} className={styles.chip} data-ghost>
          –
        </span>
      ))}
    </div>
  );
}

function EmptyRow() {
  return (
    <li className={styles.line} aria-hidden="true">
      <div className={styles.tiles}>
        {SLOTS.map((i) => (
          <Tile key={i} state="empty" />
        ))}
      </div>
      <GhostChips />
    </li>
  );
}

type ActiveRowProps = {
  mode: Mode;
  number: number;
  value: string;
  onChange: (value: string) => void;
  /** Returns false when the guess was rejected, so the row can shake. */
  onSubmit: () => boolean;
  autoFocus: boolean;
  describedBy: string;
};

function ActiveRow({ mode, number, value, onChange, onSubmit, autoFocus, describedBy }: ActiveRowProps) {
  const [focused, setFocused] = useState(false);
  const tilesRef = useRef<HTMLDivElement>(null);
  const repeats = findRepeats(value);
  const full = value.length === PUZZLE_LENGTH;
  const noun = mode === "number" ? "digits" : "letters";

  function shake() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tilesRef.current?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 280, easing: "ease-out" },
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!onSubmit()) shake();
  }

  // The caret is hidden, so keep it at the end: typing always appends.
  function keepCaretAtEnd(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const end = input.value.length;
    if (input.selectionStart !== end || input.selectionEnd !== end) {
      input.setSelectionRange(end, end);
    }
  }

  return (
    <li className={styles.activeItem}>
      <form id={GUESS_FORM_ID} className={styles.line} onSubmit={handleSubmit} noValidate>
        <div className={styles.tiles} ref={tilesRef}>
          {SLOTS.map((i) => {
            const char = value[i];
            const isRepeat = char !== undefined && repeats.has(char);
            return (
              <Tile
                key={`${i}-${char ?? ""}`}
                pop={char !== undefined}
                char={char}
                state={isRepeat ? "repeat" : char ? "filled" : "empty"}
                active={focused && (full || i === value.length)}
              />
            );
          })}
          <input
            className={styles.input}
            value={value}
            onChange={(event) => onChange(sanitize(mode, event.target.value))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSelect={keepCaretAtEnd}
            autoFocus={autoFocus}
            inputMode={mode === "number" ? "numeric" : "text"}
            enterKeyHint="go"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize={mode === "number" ? "off" : "characters"}
            spellCheck={false}
            maxLength={PUZZLE_LENGTH}
            aria-label={`Guess ${number} of ${MAX_ATTEMPTS}: ${PUZZLE_LENGTH} different ${noun}`}
            aria-describedby={describedBy}
          />
        </div>
        <GhostChips />
      </form>
    </li>
  );
}

type BoardProps = {
  mode: Mode;
  /** Changes with every new puzzle so the input remounts (and regains focus). */
  gameId: number;
  guesses: Guess[];
  /** False while the puzzle is loading or the round is over. */
  accepting: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => boolean;
  autoFocus: boolean;
  describedBy: string;
};

export function Board({ mode, gameId, guesses, accepting, draft, onDraftChange, onSubmit, autoFocus, describedBy }: BoardProps) {
  return (
    <ol className={styles.board} aria-label="Your guesses">
      {Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
        const guess = guesses[i];
        if (guess) return <GuessRow key={i} guess={guess} number={i + 1} />;
        if (accepting && i === guesses.length) {
          return (
            <ActiveRow
              key={`${gameId}-${i}`}
              mode={mode}
              number={i + 1}
              value={draft}
              onChange={onDraftChange}
              onSubmit={onSubmit}
              autoFocus={autoFocus}
              describedBy={describedBy}
            />
          );
        }
        return <EmptyRow key={i} />;
      })}
    </ol>
  );
}
