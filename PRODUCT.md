# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Casual puzzle players taking a short break, on a phone or at a desktop. Desktop matters as much as mobile: the game must look good and feel visual on a large screen, not just work. Some players are developers who enjoy code jokes and hex/binary trivia, but no programming knowledge is required to play.

## Product Purpose
"Compiled, Bugs, and Errors" is a single-page code-breaking puzzle. The game hides a 5-character answer (a number or a word, every character unique) behind a one-line clue. The player has 7 attempts and gets counts only: Compiles (right character, right place), Bugs (right character, wrong place), Errors (not in the answer). Success is a quick, satisfying round that is solved or lost in a few minutes with no pressure.

## Positioning
Mastermind-style deduction where the feedback vocabulary is the build output of a program, and every puzzle ships with a human clue, so reasoning from the clue and from the counts work together.

## Operating Context
Everything happens on one page: one puzzle visible at a time, its clue, the input, and previous guesses with their counts. Puzzles are stored locally. No database, accounts, or external APIs.

## Capabilities and Constraints
- Two puzzle types, numbers and words. "New puzzle" picks the type at random and a small badge shows which one it is; there is no mode switch.
- 5 unique characters per answer and per guess; guesses with repeats or the wrong length are rejected.
- Attempt limit is a code constant (default 7).
- "New puzzle" loads another random puzzle and resets the round. Each puzzle has a clue and an optional explanation shown when the round ends.
- Stack: Next.js (App Router), React, CSS Modules. No Tailwind. Radix UI primitives for interactive components.
- Not a portal, collection or dashboard. No scores, streaks, stats or accounts.

## Brand Commitments
Name: "Compiled, Bugs, and Errors". Dark theme with a subtle coding/developer aesthetic. Light gamification (colour, icons, feedback, small animations) without excess.

## Evidence on Hand
Starter puzzle lists live in `src/game/puzzles.ts` (22 numbers, 34 words). No testimonials, usage data or external assets exist.

## Product Principles
1. One puzzle, one page, nothing else competing for attention.
2. Feedback must be understood at a glance and never by colour alone.
3. A round is quick and pressure-free: no timers, streaks or guilt.
4. Equally good on a phone and on a large desktop screen.
5. Small, satisfying moments of delight over decoration.

## Accessibility & Inclusion
Keyboard-complete, visible focus, screen-reader readable guess history and feedback, reduced-motion respected, contrast at least 4.5:1 for text.
