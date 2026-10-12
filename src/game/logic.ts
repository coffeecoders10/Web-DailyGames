import { PUZZLE_LENGTH } from "./config";
import { PUZZLES, type Puzzle } from "./puzzles";

export type Mode = "number" | "word";

export type Feedback = {
  /** Correct character in the correct position. */
  compiles: number;
  /** Correct character in the wrong position. */
  bugs: number;
  /** Character that is not in the answer. */
  errors: number;
};

export type Guess = Feedback & { value: string };

const NOUN: Record<Mode, string> = { number: "digit", word: "letter" };

/** Score a guess against the answer. Both must have unique characters. */
export function scoreGuess(answer: string, guess: string): Feedback {
  let compiles = 0;
  let shared = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) compiles++;
    if (answer.includes(guess[i])) shared++;
  }
  return { compiles, bugs: shared - compiles, errors: guess.length - shared };
}

/** Strip anything the mode doesn't allow and cap the length. Words are uppercased. */
export function sanitize(mode: Mode, raw: string): string {
  const cleaned =
    mode === "number" ? raw.replace(/\D/g, "") : raw.toUpperCase().replace(/[^A-Z]/g, "");
  return cleaned.slice(0, PUZZLE_LENGTH);
}

/** Characters that appear more than once in the value. */
export function findRepeats(value: string): Set<string> {
  const seen = new Set<string>();
  const repeats = new Set<string>();
  for (const char of value) {
    if (seen.has(char)) repeats.add(char);
    seen.add(char);
  }
  return repeats;
}

/** Returns a message explaining what's wrong with the guess, or null if it can be submitted. */
export function validateGuess(mode: Mode, value: string): string | null {
  const noun = NOUN[mode];
  const [firstRepeat] = findRepeats(value);
  if (firstRepeat) {
    return `Each ${noun} can only be used once. “${firstRepeat}” repeats.`;
  }
  const missing = PUZZLE_LENGTH - value.length;
  if (missing > 0) {
    return `Enter ${missing} more ${noun}${missing === 1 ? "" : "s"}.`;
  }
  return null;
}

/** Pick a random puzzle of the given mode, avoiding the one currently on screen. */
export function pickPuzzle(mode: Mode, currentAnswer?: string): Puzzle {
  const pool = PUZZLES[mode].filter((puzzle) => puzzle.answer !== currentAnswer);
  return pool[Math.floor(Math.random() * pool.length)];
}
