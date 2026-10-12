"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MAX_ATTEMPTS, PUZZLE_LENGTH } from "@/game/config";
import { scoreGuess } from "@/game/logic";
import { GuessRow, Legend } from "./Board";
import { Button } from "./Button";
import { ErrorIcon, HelpIcon } from "./Icons";
import styles from "./HelpDialog.module.css";

const EXAMPLE_ANSWER = "10958";
const EXAMPLE_GUESS = "10873";

type HelpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className={styles.trigger} aria-label="How to play">
          <HelpIcon />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Close className={styles.close} aria-label="Close">
            <ErrorIcon />
          </Dialog.Close>
          <Dialog.Title className={styles.title}>How to play</Dialog.Title>
          <Dialog.Description className={styles.lead}>
            Crack the hidden {PUZZLE_LENGTH}-character code in {MAX_ATTEMPTS} builds. The clue points the
            way, and every character, in the answer and in your guesses, is different.
          </Dialog.Description>

          <Legend />

          <div className={styles.example}>
            <p className={styles.exampleLabel}>
              If the answer is <b>{EXAMPLE_ANSWER}</b> and you guess <b>{EXAMPLE_GUESS}</b>:
            </p>
            <ol className={styles.exampleRow}>
              <GuessRow
                guess={{ value: EXAMPLE_GUESS, ...scoreGuess(EXAMPLE_ANSWER, EXAMPLE_GUESS) }}
                number={1}
              />
            </ol>
            <p className={styles.exampleNote}>
              1 and 0 are in the right place, 8 is in the answer but elsewhere, and 7 and 3 aren&apos;t in it.
              You only see the counts, never which characters they belong to.
            </p>
          </div>

          <Dialog.Close asChild>
            <Button variant="primary" className={styles.done}>
              Got it
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
