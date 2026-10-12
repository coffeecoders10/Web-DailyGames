import { MAX_ATTEMPTS, PUZZLE_LENGTH } from "./config";
import type { Guess, Mode } from "./logic";
import { PUZZLES, type Puzzle } from "./puzzles";

const ROUND_KEY = "cbe:round:v1";
const HELP_KEY = "cbe:help-seen:v1";

export type SavedRound = { mode: Mode; puzzle: Puzzle; guesses: Guess[] };

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // private mode, blocked storage, etc.
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Persistence is a nicety; the game works without it.
  }
}

/** The round in progress, restored only if it still matches a puzzle in the current lists. */
export function loadRound(): SavedRound | null {
  const raw = read(ROUND_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { mode?: Mode; answer?: string; guesses?: Guess[] };
    if (data.mode !== "number" && data.mode !== "word") return null;
    const puzzle = PUZZLES[data.mode].find((p) => p.answer === data.answer);
    if (!puzzle || !Array.isArray(data.guesses) || data.guesses.length > MAX_ATTEMPTS) return null;
    const valid = data.guesses.every(
      (g) =>
        typeof g.value === "string" &&
        g.value.length === PUZZLE_LENGTH &&
        [g.compiles, g.bugs, g.errors].every(Number.isInteger),
    );
    return valid ? { mode: data.mode, puzzle, guesses: data.guesses } : null;
  } catch {
    return null;
  }
}

export function saveRound({ mode, puzzle, guesses }: SavedRound) {
  write(ROUND_KEY, JSON.stringify({ mode, answer: puzzle.answer, guesses }));
}

export function hasSeenHelp(): boolean {
  return read(HELP_KEY) === "1";
}

export function markHelpSeen() {
  write(HELP_KEY, "1");
}
