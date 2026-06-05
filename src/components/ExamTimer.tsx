"use client"

import { useState, useEffect } from "react"

interface ExamTimerProps {
  seconds: number
  onTimeUp: () => void
}

export default function ExamTimer({ seconds, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  const isWarning = timeLeft < 300

  return (
    <div className={`text-lg font-mono font-bold tracking-wider px-3 py-1.5 rounded-xl border ${
      isWarning 
        ? "text-rose-600 dark:text-rose-400 border-rose-500/20 bg-rose-50 dark:bg-rose-950/25 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.15)]" 
        : "text-slate-850 dark:text-slate-300 border-black/5 dark:border-white/5 bg-slate-100 dark:bg-slate-950/30"
    }`}>
      ⏱ {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  )
}
