"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
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
import { hasSeenHelp, loadRound, markHelpSeen, saveRound } from "@/game/storage";
import { AttemptMeter } from "./AttemptMeter";
import { Board, GUESS_FORM_ID, Legend } from "./Board";
import { Burst } from "./Burst";
import { Button } from "./Button";
import { HelpDialog } from "./HelpDialog";
import { EnterIcon, RefreshIcon } from "./Icons";
import { Tile } from "./Tile";
import { Window } from "./Window";
import styles from "./Game.module.css";

const HINT_ID = "guess-hint";
const subscribeNever = () => () => {};

function randomMode(): Mode {
  return Math.random() < 0.5 ? "number" : "word";
}

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
  const [helpOpen, setHelpOpen] = useState(false);

  // Random puzzles and saved rounds can't be part of the prerendered HTML, so the first round is set up
  // on the client once hydration is done (false on the server and during hydration, true afterwards).
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  if (hydrated && puzzle === null) {
    const saved = loadRound();
    if (saved) {
      setMode(saved.mode);
      setPuzzle(saved.puzzle);
      setGuesses(saved.guesses);
    } else {
      const firstMode = randomMode();
      setMode(firstMode);
      setPuzzle(pickPuzzle(firstMode));
    }
    const firstVisit = !hasSeenHelp();
    setHelpOpen(firstVisit);
    setAutoFocus(!firstVisit && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }

  // Keep the round across refreshes.
  useEffect(() => {
    if (puzzle) saveRound({ mode, puzzle, guesses });
  }, [mode, puzzle, guesses]);

  const won = guesses.at(-1)?.compiles === PUZZLE_LENGTH;
  const lost = !won && guesses.length >= MAX_ATTEMPTS;
  const over = won || lost;
  const attemptsLeft = MAX_ATTEMPTS - guesses.length;
  const noun = mode === "number" ? "digit" : "letter";

  const problem = validateGuess(mode, draft);
  const hasRepeat = findRepeats(draft).size > 0;
  const showProblem = problem !== null && (hasRepeat || submitAttempted);

  function startGame() {
    const nextMode = randomMode();
    setMode(nextMode);
    setPuzzle(pickPuzzle(nextMode, puzzle?.answer));
    setGuesses([]);
    setDraft("");
    setSubmitAttempted(false);
    setGameId((id) => id + 1);
    setAutoFocus(true);
  }

  function handleHelpChange(open: boolean) {
    setHelpOpen(open);
    if (!open) markHelpSeen();
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

  const outcome = over ? (won ? "win" : "lose") : undefined;
  const statusText = won
    ? "Build succeeded"
    : lost
      ? "Build failed"
      : `Attempt ${guesses.length + 1}/${MAX_ATTEMPTS}`;

  return (
    <div className={styles.game}>
      <div className={styles.intro}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <h1 className={styles.title}>
              <span data-kind="compile">Compiled,</span> <span data-kind="bug">Bugs,</span>{" "}
              <span>
                and <span data-kind="error">Errors</span>
              </span>
            </h1>
            <p className={styles.tagline}>
              Crack the {PUZZLE_LENGTH}-character code in {MAX_ATTEMPTS} builds.
            </p>
          </div>
          <HelpDialog open={helpOpen} onOpenChange={handleHelpChange} />
        </header>

        <div className={styles.controls}>
          <span className={styles.badge} data-ready={!!puzzle || undefined}>
            <span className={styles.badgeGlyph} aria-hidden="true">
              {mode === "number" ? "#" : "Aa"}
            </span>
            {mode === "number" ? "Number" : "Word"} puzzle
          </span>
          <Button variant="secondary" onClick={startGame}>
            <RefreshIcon />
            New puzzle
          </Button>
        </div>

        <section className={styles.clue} aria-busy={!puzzle}>
          <span className={styles.gutter} aria-hidden="true">
            1
          </span>
          {puzzle ? (
            <p>
              <span className={styles.comment} aria-hidden="true">
                {"//"}
              </span>{" "}
              {puzzle.clue}
              {over && puzzle.explanation && (
                <span className={`${styles.clueNote} ${styles.mobileOnly}`}>{puzzle.explanation}</span>
              )}
            </p>
          ) : (
            <div className={styles.skeleton} aria-label="Loading puzzle" />
          )}
        </section>

        <section className={styles.answer} aria-label="Answer">
          <VisuallyHidden.Root>
            {over && puzzle
              ? `The answer is ${puzzle.answer.split("").join(" ")}.`
              : `Hidden answer: ${PUZZLE_LENGTH} ${noun}s.`}
          </VisuallyHidden.Root>
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
          {won && <Burst />}

          <AttemptMeter used={guesses.length} outcome={outcome} />

          <div className={styles.status} role="status" data-outcome={outcome}>
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
        </section>
      </div>

      <Window
        title="guesses.log"
        status={statusText}
        detail={`${mode === "number" ? "numbers" : "words"} · ${PUZZLE_LENGTH} ${noun}s`}
        outcome={outcome}
      >
        <Legend compact />
        <p id={HINT_ID} className={styles.hint} data-problem={showProblem || undefined} aria-live="polite">
          {showProblem ? (
            problem
          ) : over ? (
            <>
              <span className={styles.mobileOnly}>
                {won ? `Compiled! Solved in ${plural(guesses.length, "attempt")}.` : "Build failed. The answer is revealed."}
              </span>
              <span className={styles.desktopOnly}>Start another round with New puzzle.</span>
            </>
          ) : (
            `Type ${PUZZLE_LENGTH} different ${noun}s, then press Enter.`
          )}
        </p>
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
        {over ? (
          <Button variant="primary" className={styles.action} onClick={startGame}>
            <RefreshIcon />
            New puzzle
          </Button>
        ) : (
          <Button type="submit" form={GUESS_FORM_ID} variant="primary" className={styles.action} disabled={!puzzle}>
            Submit
            <EnterIcon />
          </Button>
        )}
      </Window>
    </div>
  );
}
