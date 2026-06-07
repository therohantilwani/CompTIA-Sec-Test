"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import ExamQuestion from "@/components/ExamQuestion"
import TeachingLesson from "@/components/TeachingLesson"
import SpiderChart from "@/components/SpiderChart"
import { Question } from "@/types"
import Logo from "@/components/Logo"
import ThemeToggle from "@/components/ThemeToggle"
import ExamTimer from "@/components/ExamTimer"
import { loadClientQuestions, fetchQuestionsFromInternet } from "@/lib/questions-loader"
import { questionBank } from "@/lib/questions-bank"
import { getPerformance, updatePerformance, getDomainAccuracy, getDomainStreak, getAnsweredCorrectIds, markAnsweredCorrect, markAnswered, getAllAnsweredIds, markTopicSeen } from "@/lib/performance"
import { SY0_701_WEIGHTAGE, calculateWeightageProgress, getNextRecommendedDomain } from "@/lib/weightage"



const domainChartColors: Record<string, string> = {
  "General Security Concepts": "#3b82f6",
  "Threats, Vulnerabilities, and Mitigations": "#ef4444",
  "Security Architecture": "#8b5cf6",
  "Security Operations": "#22c55e",
  "Security Program Management and Oversight": "#f97316",
}

export default function ExamPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | null>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    score: number
    total: number
    percentage: number
    passed: boolean
    domainResults: { domain: string; correct: number; total: number }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState("")
  const [teachingQuestion, setTeachingQuestion] = useState<Question | null>(null)
  const [showWeightage, setShowWeightage] = useState(false)
  const [showSpider, setShowSpider] = useState(false)
  const [mode, setMode] = useState<"exam" | "study">("study")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  // Reinforcement learning state
  const [reinforceQuestions, setReinforceQuestions] = useState<Question[]>([])
  const [reinforceAnswers, setReinforceAnswers] = useState<Record<string, string | null>>({})
  const [reinforceLoading, setReinforceLoading] = useState(false)
  const [showReinforce, setShowReinforce] = useState(false)
  const prevDomainRef = useRef<string | null>(null)
  const wrongQuestionRef = useRef<Question | null>(null)
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weightageProgress = useMemo(() => calculateWeightageProgress(getPerformance()), [questions, answers])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextDomain = useMemo(() => getNextRecommendedDomain(getPerformance()), [questions, answers])
  
  const spiderData = useMemo(() => {
    const perf = getPerformance()
    return SY0_701_WEIGHTAGE.map((w) => {
      const stat = perf.find((p) => p.domain === w.domain)
      const correct = stat?.correct ?? 0
      const total = stat ? stat.correct + stat.incorrect : 0
      const value = total > 0 ? Math.round((correct / total) * 100) : 0
      return {
        label: w.domain,
        value,
        target: 75,
        color: domainChartColors[w.domain] ?? "#6366f1",
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, answers])

  useEffect(() => {
    loadQuestions()
  }, [])

  async function loadQuestions(): Promise<void> {
    try {
      const p = getPerformance()
      const answeredIds = new Set<string>(getAnsweredCorrectIds())
      const seenIds = new Set<string>(getAllAnsweredIds())
      
      const loaded = await loadClientQuestions({
        count: 90,
        mode: "adaptive",
        perf: p,
        answeredIds,
        seenIds
      })
      
      if (loaded.length === 0) throw new Error("No questions loaded")
      setQuestions(loaded)
      setTimeLeft(90 * 60)
      prevDomainRef.current = loaded[0].domain
    } catch (e) {
      console.error("Failed to load questions:", e)
      setLoadingError("Could not load questions. Please try again.")
    }
    setLoading(false)
  }

  async function fetchReinforce(wrongQ: Question, wrongAnswerId: string) {
    setReinforceLoading(true)
    setShowReinforce(true)
    
    try {
      const correctAnswer = wrongQ.answers.find((a) => a.isCorrect)
      const wrongAnswer = wrongQ.answers.find((a) => a.id === wrongAnswerId)
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "reinforce",
          domains: [wrongQ.domain],
          count: 2,
          questionText: wrongQ.text,
          correctAnswer: correctAnswer?.text ?? "",
          wrongAnswer: wrongAnswer?.text ?? "",
          explanation: wrongQ.explanation,
        }),
      })

      if (!res.ok) throw new Error("Ollama endpoint not available")
      const d = await res.json()
      if (d.questions && d.questions.length > 0) {
        setReinforceQuestions(d.questions)
        setReinforceLoading(false)
        return
      }
    } catch {
      console.log("Ollama AI reinforcement endpoint unavailable, falling back to static questions pool")
    }

    // Static fallback: pick 2 alternate questions of the same domain from the database
    try {
      let pool = await fetchQuestionsFromInternet()
      if (pool.length === 0) pool = questionBank

      const sameDomain = pool.filter(
        (q) => q.domain === wrongQ.domain && q.id !== wrongQ.id
      )
      
      const shuffled = sameDomain.sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 2).map((q, idx) => ({
        ...q,
        id: `reinforce_${wrongQ.id}_${idx}`
      }))
      
      setQuestions((prev) => {
        // Just verify if we have duplicates, if not we add
        return prev
      })
      setReinforceQuestions(selected)
    } catch (err) {
      console.error("Static reinforcement fallback failed:", err)
    }
    setReinforceLoading(false)
  }

  const handleAnswer = useCallback(
    (questionId: string, answerId: string) => {
      setAnswers((prev) => {
        if (prev[questionId] != null) return prev
        return { ...prev, [questionId]: answerId }
      })

      const q = questions.find((qq) => qq.id === questionId)
      if (!q) return
      const isCorrect = q.answers.find((a) => a.id === answerId)?.isCorrect ?? false

      updatePerformance(q.domain, isCorrect)
      markAnswered(questionId)
      markTopicSeen(q.text)
      if (isCorrect) markAnsweredCorrect(questionId)

      if (mode === "study") {
        if (!isCorrect) {
          setTeachingQuestion(q)
          wrongQuestionRef.current = q
          fetchReinforce(q, answerId)
        } else {
          setTeachingQuestion(null)
          setShowReinforce(false)
        }
      }
    },
    [questions, mode]
  )

  const handleReinforceAnswer = useCallback(
    (questionId: string, answerId: string) => {
      setReinforceAnswers((prev) => {
        if (prev[questionId] != null) return prev
        return { ...prev, [questionId]: answerId }
      })

      const q = reinforceQuestions.find((qq) => qq.id === questionId)
      if (!q) return
      const isCorrect = q.answers.find((a) => a.id === answerId)?.isCorrect ?? false
      updatePerformance(q.domain, isCorrect)
      markAnswered(questionId)
      markTopicSeen(q.text)
      if (isCorrect) markAnsweredCorrect(questionId)
    },
    [reinforceQuestions]
  )

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    let score = 0
    const domainMap: Record<string, { correct: number; total: number }> = {}
    for (const question of questions) {
      if (!domainMap[question.domain]) {
        domainMap[question.domain] = { correct: 0, total: 0 }
      }
      domainMap[question.domain].total++
      const answerId = answers[question.id]
      if (answerId && question.answers.find((a) => a.id === answerId)?.isCorrect) {
        score++
        domainMap[question.domain].correct++
      }
    }

    const total = questions.length
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0
    const passed = percentage >= 75
    const domainResults = Object.entries(domainMap).map(([domain, stats]) => ({ domain, ...stats }))

    setResult({ score, total, percentage, passed, domainResults })

    const stored = localStorage.getItem("examAttempts")
    const attempts = stored ? JSON.parse(stored) : []
    attempts.unshift({
      id: crypto.randomUUID(),
      score,
      total,
      percentage,
      domainResults,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("examAttempts", JSON.stringify(attempts.slice(0, 50)))
  }, [questions, answers])

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length
  const tooFewQuestions = !loading && questions.length < 10

  const handleTimeUp = useCallback(() => {
    if (!submitted) {
      alert("Time is up! Your exam will be submitted automatically.")
      handleSubmit()
    }
  }, [submitted, handleSubmit])

  // Timer countdown hook for Exam mode
  useEffect(() => {
    if (mode !== "exam" || submitted || loading || tooFewQuestions || timeLeft === null) {
      return
    }

    if (timeLeft <= 0) {
      setTimeout(() => handleTimeUp(), 0)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return null
        if (t <= 1) {
          clearInterval(timer)
          setTimeout(() => handleTimeUp(), 0)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [mode, submitted, loading, tooFewQuestions, timeLeft, handleTimeUp])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-gradient text-foreground relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="text-center relative z-10 space-y-4">
          {loadingError ? (
            <div className="p-6 max-w-md theme-card backdrop-blur-xl border border-rose-500/20 rounded-2xl shadow-xl">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-rose-400 font-bold mb-2">Questions Sync Failed</p>
              <p className="text-xs theme-text-muted mb-4">{loadingError}</p>
              <button
                onClick={() => {
                  setLoading(true)
                  setLoadingError("")
                  loadQuestions()
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Retry Fetch
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
              <p className="theme-text-muted text-xs font-semibold tracking-widest uppercase">Syncing Live SY0-701 Exam Deck...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-gradient text-foreground flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-theme-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      <header className="theme-nav backdrop-blur-md relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={28} className="cursor-pointer hover:scale-105 transition-all" onClick={() => router.push("/")} />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">Sec+ Exam Client</span>
              <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-bold tracking-widest uppercase mt-0.5">Adaptive Session</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto sm:justify-end">
            <ThemeToggle />
            <div className="text-xs font-mono font-bold theme-text-muted">
              Q: {currentIndex + 1} / {questions.length}
            </div>
            <div className="text-xs font-mono">
              <span className="text-emerald-500 dark:text-emerald-400 font-bold">{answeredCount}</span>
              <span className="theme-text-muted">/{questions.length} answered</span>
            </div>

            {mode === "exam" && !submitted && timeLeft !== null && (
              <ExamTimer timeLeft={timeLeft} />
            )}

            {/* Premium Sliding Toggle */}
            <div className="flex bg-slate-200 dark:bg-slate-950 rounded-lg p-0.5 text-xs font-bold border theme-border shadow-inner">
              <button
                onClick={() => setMode("study")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === "study" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10" : "theme-text-muted hover:text-foreground"
                }`}
              >
                Study
              </button>
              <button
                onClick={() => setMode("exam")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === "exam" ? "bg-rose-600 text-white shadow-md shadow-rose-500/10" : "theme-text-muted hover:text-foreground"
                }`}
              >
                Exam
              </button>
            </div>

            <button
              onClick={() => router.push("/")}
              className="text-xs theme-text-muted hover:text-foreground font-semibold transition-colors cursor-pointer ml-auto sm:ml-0"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Dynamic Weightage Progress Tracking */}
        {!submitted && (
          <div className="max-w-5xl mx-auto px-6 pb-2.5">
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-950 p-0.5 border theme-border">
              {weightageProgress.map((p) => {
                const w = SY0_701_WEIGHTAGE.find((d) => d.domain === p.domain)
                const color = domainChartColors[p.domain] ?? "#6366f1"
                const pct = p.answered > 0 ? Math.round((p.answered / p.target) * 100) : 4
                return (
                  <div
                    key={p.domain}
                    className="relative transition-all h-full"
                    style={{ width: `${w?.weight ?? 20}%` }}
                    title={`${p.domain}: ${p.answered}/${p.target} questions (${pct}%)`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: color,
                        opacity: p.answered > 0 ? 0.95 : 0.2,
                        boxShadow: p.answered > 0 ? `0 0 6px ${color}` : "none"
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-1 text-xs font-bold theme-text-muted">
              <button
                onClick={() => setShowWeightage(!showWeightage)}
                className="hover:text-foreground transition-colors uppercase tracking-wider cursor-pointer"
              >
                {showWeightage ? "Hide" : "Show"} Domain Breakdown
              </button>
              <button
                onClick={() => setShowSpider(!showSpider)}
                className="hover:text-foreground transition-colors uppercase tracking-wider cursor-pointer"
              >
                {showSpider ? "Hide" : "Show"} Performance Radar
              </button>
            </div>

            {nextDomain && (
              <div className="mt-2 p-2 bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/15 dark:border-indigo-500/10 rounded-xl text-xs text-indigo-600 dark:text-indigo-300 flex items-center gap-2 font-semibold">
                <span>🎯</span>
                <span className="font-bold">Suggested Focus:</span>
                <span>{nextDomain.domain}</span>
                <span className="theme-text-muted">— {nextDomain.reason}</span>
              </div>
            )}
          </div>
        )}

        {/* Question Selector List Grid */}
        {!submitted && (
          <div className="max-w-5xl mx-auto px-6 pb-4 overflow-x-auto">
            <div className="flex gap-1.5 flex-nowrap min-w-max">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] != null
                const isCurrent = i === currentIndex
                const streak = getDomainStreak(q.domain)
                
                let borderColor = "border-black/5 dark:border-white/5"
                if (streak >= 3) borderColor = "border-amber-400 animate-pulse"
                
                const acc = getDomainAccuracy(q.domain)
                if (acc !== null && acc < 50) borderColor = "border-rose-500/60"
                else if (acc !== null && acc >= 80) borderColor = "border-emerald-500/60"
                
                let btnStyle = "bg-slate-100 dark:bg-slate-900/60 theme-text-muted border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-800"
                if (isCurrent) {
                  btnStyle = "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] border-indigo-400"
                } else if (isAnswered) {
                  btnStyle = "bg-indigo-500/10 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-500/20"
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`flex-shrink-0 w-8 h-8 text-xs rounded-lg font-bold transition-all border cursor-pointer ${btnStyle} ${borderColor}`}
                    title={`${q.domain} #${i + 1}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Dynamic Weightage Area */}
      {showWeightage && !submitted && (
        <div className="max-w-5xl mx-auto px-6 pt-4 w-full relative z-10">
          <div className="p-5 theme-card backdrop-blur-xl rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider">Exam weightage breakdown</h3>
            <div className="space-y-3.5">
              {SY0_701_WEIGHTAGE.map((w) => {
                const prog = weightageProgress.find((p) => p.domain === w.domain)
                const color = domainChartColors[w.domain] ?? "#6366f1"
                return (
                  <div key={w.domain} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="font-bold text-foreground/90 truncate">{w.domain}</span>
                      </div>
                      <div className="flex items-center gap-2.5 theme-text-muted text-xs flex-shrink-0 font-mono font-semibold">
                        <span>{w.weight}% of exam</span>
                        <span>{prog?.answered ?? 0}/{w.targetQuestions} answered</span>
                        {prog && prog.accuracy !== null && (
                          <span className={prog.accuracy >= 75 ? "text-emerald-500 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400 font-bold"}>
                            {prog.accuracy}% accuracy
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border theme-border">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, prog?.completed ?? 0)}%`, backgroundColor: color, opacity: 0.8 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Spider Radar */}
      {showSpider && !submitted && (
        <div className="max-w-5xl mx-auto px-6 pt-4 w-full relative z-10">
          <div className="p-5 theme-card backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Domain Performance Radar</h3>
            <p className="text-xs theme-text-muted mb-4 font-semibold">Benchmark Zone matches 75% Passing Threshold</p>
            <SpiderChart data={spiderData} size={240} />
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-6 w-full flex-1 relative z-10 flex flex-col justify-between">
        {tooFewQuestions && (
          <div className="p-8 theme-card backdrop-blur-xl rounded-2xl text-center space-y-4 my-auto shadow-2xl">
            <div className="text-5xl animate-bounce">📭</div>
            <h2 className="text-lg font-bold">No questions available</h2>
            <p className="text-xs theme-text-muted max-w-sm mx-auto font-semibold">
              Only {questions.length} new questions could be generated. Reset answered questions database to recycle exam pools.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={async () => {
                  setLoading(true)
                  setLoadingError("")
                  try {
                    const loaded = await loadClientQuestions({
                      count: 90,
                      mode: "adaptive",
                      perf: getPerformance(),
                      answeredIds: new Set(getAnsweredCorrectIds()),
                      seenIds: new Set(getAllAnsweredIds())
                    })
                    if (loaded.length >= 10) {
                      setQuestions(loaded)
                      setCurrentIndex(0)
                      setTimeLeft(90 * 60)
                    }
                  } catch {}
                  setLoading(false)
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Generate Questions
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("answeredCorrectIds")
                  window.location.reload()
                }}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-750 text-foreground dark:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Reset Progress Database
              </button>
            </div>
          </div>
        )}

        {!tooFewQuestions && !submitted && (
          <div className="space-y-6">
            <div className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-colors ${
              mode === "study" ? "bg-indigo-950/20 text-indigo-300 border-indigo-500/20" : "bg-rose-950/20 text-rose-300 border-rose-500/20"
            }`}>
              {mode === "study"
                ? "📖 STUDY MODE — Wrong answers trigger real-time AI explanations and Concept Reinforcement queries."
                : "📝 EXAM MODE — Standard evaluation simulation. Scoring reports compile once all questions are completed."}
            </div>

            {currentQuestion && (
              <ExamQuestion
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id] ?? null}
                showResult={answers[currentQuestion.id] != null}
                onAnswer={handleAnswer}
              />
            )}

            {/* AI Teaching Lesson */}
            {teachingQuestion && mode === "study" && (
              <TeachingLesson
                question={teachingQuestion}
                selectedAnswerId={answers[teachingQuestion.id] ?? ""}
                onClose={() => setTeachingQuestion(null)}
              />
            )}

            {/* Reinforcement Questions */}
            {showReinforce && mode === "study" && reinforceQuestions.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 border-b theme-border pb-2">
                  <span className="text-lg">🔄</span>
                  <h3 className="font-bold text-foreground text-xs tracking-wider uppercase">Reinforce Your Understanding</h3>
                  <span className="text-[10px] theme-text-muted font-mono">Review session for wrong answer</span>
                </div>
                <div className="space-y-6">
                  {reinforceQuestions.map((rq) => {
                    const isAnswered = reinforceAnswers[rq.id] != null
                    return (
                      <div key={rq.id} className="border-l-4 border-indigo-500/50 pl-4">
                        <ExamQuestion
                          question={rq}
                          selectedAnswer={reinforceAnswers[rq.id] ?? null}
                          showResult={isAnswered}
                          onAnswer={handleReinforceAnswer}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {reinforceLoading && mode === "study" && showReinforce && (
              <div className="mt-6 p-4 bg-indigo-500/5 dark:bg-indigo-950/20 rounded-xl border border-indigo-500/15 dark:border-indigo-500/20 flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
                <span className="text-xs text-indigo-650 dark:text-indigo-300 font-bold">AI Tutor Generating Reinforce Questions...</span>
              </div>
            )}
          </div>
        )}

        {/* Footer controls for navigation */}
        {!tooFewQuestions && !submitted && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0 || submitted}
                className="px-4 py-2.5 text-xs font-bold text-foreground bg-slate-100 dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIndex === questions.length - 1 || submitted}
                className="px-4 py-2.5 text-xs font-bold text-foreground bg-slate-100 dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Next →
              </button>
              
              {currentIndex === questions.length - 1 && answers[questions[currentIndex]?.id] != null && (
                <button
                  onClick={async () => {
                    try {
                      const loaded = await loadClientQuestions({
                        count: 30,
                        mode: "adaptive",
                        perf: getPerformance(),
                        answeredIds: new Set(getAnsweredCorrectIds()),
                        seenIds: new Set(getAllAnsweredIds())
                      })
                      if (loaded.length > 0) {
                        setQuestions((prev) => [...prev, ...loaded])
                      }
                    } catch {}
                  }}
                  className="px-4 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/20 transition-all"
                >
                  + Load More Questions
                </button>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                allAnswered
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 text-white cursor-pointer"
                  : "bg-slate-100 dark:bg-slate-850 border theme-border text-slate-400 dark:text-slate-500 cursor-not-allowed"
              }`}
            >
              {mode === "exam" ? "Submit Exam" : "Finish Session"} ({questions.length - answeredCount} unanswered)
            </button>
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div className="mt-6 space-y-6 my-auto">
            <div className="p-6 theme-card backdrop-blur-xl rounded-2xl shadow-2xl relative">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-3xl opacity-65 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b theme-border pb-6">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider">Exam Grading Report</h2>
                  <p className="text-xs theme-text-muted font-mono mt-0.5 font-bold">COMPTIA SECURITY+ SY0-701 EVALUATION</p>
                </div>
                <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border theme-border">
                  <SpiderChart
                    data={SY0_701_WEIGHTAGE.map((w) => {
                      const dr = result.domainResults.find((r) => r.domain === w.domain)
                      const pct = dr && dr.total > 0 ? Math.round((dr.correct / dr.total) * 100) : 0
                      return {
                        label: w.domain,
                        value: pct,
                        target: 75,
                        color: domainChartColors[w.domain] ?? "#6366f1",
                      }
                    })}
                    size={160}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-950/40 border theme-border rounded-xl">
                  <div className="text-2xl font-black">{result.score}/{result.total}</div>
                  <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Correct Answers</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-950/40 border theme-border rounded-xl">
                  <div className="text-2xl font-black">{result.percentage}%</div>
                  <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Your Percentage</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-950/40 border theme-border rounded-xl">
                  <div className={`text-2xl font-black ${result.passed ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
                    {result.passed ? "PASSED" : "FAILED"}
                  </div>
                  <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Passing Mark: 75%</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-950/40 border theme-border rounded-xl">
                  <div className="text-2xl font-black">{result.total - result.score}</div>
                  <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Incorrect Answers</div>
                </div>
              </div>

              <div className="border-t theme-border pt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider">Domain Performance Log</h3>
                <div className="space-y-3.5">
                  {SY0_701_WEIGHTAGE.map((w) => {
                    const dr = result.domainResults.find((r) => r.domain === w.domain)
                    const answered = dr?.total ?? 0
                    const correct = dr?.correct ?? 0
                    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0
                    const color = domainChartColors[w.domain] ?? "#6366f1"
                    return (
                      <div key={w.domain} className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 md:w-56 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="font-bold text-foreground/90 truncate">{w.domain}</span>
                        </div>
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border theme-border">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: color,
                              opacity: answered > 0 ? 0.8 : 0.15,
                              boxShadow: answered > 0 ? `0 0 6px ${color}` : "none"
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-4 md:w-44 justify-end text-xs theme-text-muted font-mono font-semibold">
                          <span className="font-bold text-foreground/80">
                            {answered > 0 ? `${correct}/${answered} (${pct}%)` : "0 questions"}
                          </span>
                          <span>Target: {w.targetQuestions}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-750 text-foreground dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Try Another Exam
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
