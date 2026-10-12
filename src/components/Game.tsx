"use client";

import { useState, useSyncExternalStore } from "react";
import { MAX_ATTEMPTS, PUZZLE_LENGTH } from "@/game/config";
import {
  findRepeats,
  pickPuzzle,
  scoreGuess,
  validateGuess,
  type Guess,
  type Mode,
} from "@/game/logic";
import type { Puzzle } from "@/game/puzzles";
import { Board, Legend } from "./Board";
import { Button } from "./Button";
import { RefreshIcon } from "./Icons";
import { ModeSwitch } from "./ModeSwitch";
import { Tile } from "./Tile";
import styles from "./Game.module.css";

const HINT_ID = "guess-hint";
const subscribeNever = () => () => {};
const PIPS = Array.from({ length: MAX_ATTEMPTS }, (_, i) => i);

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function Game() {
  const [mode, setMode] = useState<Mode>("number");
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [gameId, setGameId] = useState(0);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [draft, setDraft] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // Pop the on-screen keyboard only once the player has engaged (or has a physical keyboard).
  const [autoFocus, setAutoFocus] = useState(false);

  // A random puzzle can't be part of the prerendered HTML, so the first one is picked on the client
  // once hydration is done (false on the server and during hydration, true afterwards).
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  if (hydrated && puzzle === null) {
    setPuzzle(pickPuzzle(mode));
    setAutoFocus(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }

  const won = guesses.at(-1)?.compiles === PUZZLE_LENGTH;
  const lost = !won && guesses.length >= MAX_ATTEMPTS;
  const over = won || lost;
  const attemptsLeft = MAX_ATTEMPTS - guesses.length;
  const noun = mode === "number" ? "digit" : "letter";

  const problem = validateGuess(mode, draft);
  const hasRepeat = findRepeats(draft).size > 0;
  const showProblem = problem !== null && (hasRepeat || submitAttempted);

  function startGame(nextMode: Mode) {
    setMode(nextMode);
    setPuzzle(pickPuzzle(nextMode, puzzle?.answer));
    setGuesses([]);
    setDraft("");
    setSubmitAttempted(false);
    setGameId((id) => id + 1);
    setAutoFocus(true);
  }

  function handleDraftChange(value: string) {
    setDraft(value);
    setSubmitAttempted(false);
  }

  function handleSubmit(): boolean {
    if (!puzzle || problem) {
      setSubmitAttempted(true);
      return false;
    }
    setGuesses((previous) => [...previous, { value: draft, ...scoreGuess(puzzle.answer, draft) }]);
    setDraft("");
    setSubmitAttempted(false);
    setAutoFocus(true);
    return true;
  }

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span data-kind="compile">Compiled</span>, <span data-kind="bug">Bugs</span>, and{" "}
          <span data-kind="error">Errors</span>
        </h1>
        <div className={styles.controls}>
          <ModeSwitch mode={mode} onChange={startGame} />
          <Button
            variant={over ? "primary" : "secondary"}
            onClick={() => startGame(mode)}
          >
            <RefreshIcon />
            New puzzle
          </Button>
        </div>
      </header>

      <section className={styles.clue} aria-busy={!puzzle}>
        {puzzle ? (
          <p>
            <span className={styles.comment} aria-hidden="true">
              {"//"}
            </span>{" "}
            {puzzle.clue}
          </p>
        ) : (
          <div className={styles.skeleton} aria-label="Loading puzzle" />
        )}
      </section>

      <section className={styles.answer} aria-label="Answer">
        <span className="sr-only">
          {over && puzzle
            ? `The answer is ${puzzle.answer.split("").join(" ")}.`
            : `Hidden answer: ${PUZZLE_LENGTH} ${noun}s.`}
        </span>
        <div className={styles.answerTiles}>
          {Array.from({ length: PUZZLE_LENGTH }, (_, i) => (
            <Tile
              key={i}
              index={i}
              char={over && puzzle ? puzzle.answer[i] : "?"}
              state={over ? (won ? "win" : "lose") : "hidden"}
              reveal={over}
            />
          ))}
        </div>

        <div className={styles.status} role="status" data-outcome={over ? (won ? "win" : "lose") : undefined}>
          {won ? (
            <>
              <p className={styles.statusTitle}>Compiled!</p>
              <p className={styles.statusDetail}>Solved in {plural(guesses.length, "attempt")}.</p>
            </>
          ) : lost ? (
            <>
              <p className={styles.statusTitle}>Build failed.</p>
              <p className={styles.statusDetail}>Out of attempts. The answer is revealed.</p>
            </>
          ) : (
            <p className={styles.statusDetail}>
              {attemptsLeft === 1 ? "Last attempt" : `${plural(attemptsLeft, "attempt")} left`}
            </p>
          )}
          {over && puzzle?.explanation && <p className={styles.explanation}>{puzzle.explanation}</p>}
        </div>

        <div className={styles.pips} aria-hidden="true">
          {PIPS.map((i) => (
            <span key={i} data-used={i < guesses.length || undefined} />
          ))}
        </div>
      </section>

      <section className={styles.play} aria-label="Guesses">
        <Legend />
        <Board
          mode={mode}
          gameId={gameId}
          guesses={guesses}
          accepting={!!puzzle && !over}
          draft={draft}
          onDraftChange={handleDraftChange}
          onSubmit={handleSubmit}
          autoFocus={autoFocus}
          describedBy={HINT_ID}
        />
        <p id={HINT_ID} className={styles.hint} data-problem={showProblem || undefined} aria-live="polite">
          {showProblem
            ? problem
            : over
              ? "Start another round with New puzzle."
              : `Type ${PUZZLE_LENGTH} different ${noun}s, then press Enter.`}
        </p>
      </section>
    </div>
  );
}
