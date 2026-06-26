"use client";
import { useState, useEffect, useCallback } from "react";

// A 1-second countdown with pause / resume / stop.
// Initializes to `totalSeconds` and ticks down while `running` is true.
export function useCountdown(totalSeconds) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearTimeout(id);
  }, [running, timeLeft]);

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);

  return { timeLeft, running, expired: timeLeft <= 0, pause, resume, stop };
}
