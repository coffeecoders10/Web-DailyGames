"use client";

import { Button } from "@/components/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100dvh", padding: "1rem", textAlign: "center" }}>
      <div style={{ display: "grid", gap: "1rem", justifyItems: "center" }}>
        <h1 style={{ fontFamily: "var(--font-mono)", color: "var(--error)" }}>Build failed.</h1>
        <p style={{ color: "var(--text-muted)" }}>Something went wrong loading the game.</p>
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
