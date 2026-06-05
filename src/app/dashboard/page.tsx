"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getPerformance, getWeakestDomains } from "@/lib/performance"
import SpiderChart from "@/components/SpiderChart"
import { SY0_701_WEIGHTAGE } from "@/lib/weightage"
import Logo from "@/components/Logo"
import ThemeToggle from "@/components/ThemeToggle"

interface Attempt {
  id: string
  score: number
  total: number
  percentage: number
  domainResults?: { domain: string; correct: number; total: number }[]
  createdAt: string
}

const domainColors: Record<string, string> = {
  "General Security Concepts": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Threats, Vulnerabilities, and Mitigations": "bg-red-500/10 text-red-400 border-red-500/20",
  "Security Architecture": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Security Operations": "bg-green-500/10 text-green-400 border-green-500/20",
  "Security Program Management and Oversight": "bg-orange-500/10 text-orange-400 border-orange-500/20",
}

export default function Dashboard() {
  const router = useRouter()
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [domainPerf, setDomainPerf] = useState<{ domain: string; correct: number; incorrect: number; streak: number; accuracy: number | null }[]>([])
  const [weakestDomains, setWeakestDomains] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("examAttempts")
    if (stored) setAttempts(JSON.parse(stored))

    const perf = getPerformance()
    setDomainPerf(
      perf.map((p) => ({
        domain: p.domain,
        correct: p.correct,
        incorrect: p.incorrect,
        streak: p.streak,
        accuracy:
          p.correct + p.incorrect > 0
            ? Math.round((p.correct / (p.correct + p.incorrect)) * 100)
            : null,
      }))
    )
    setWeakestDomains(getWeakestDomains(5))
  }, [])

  const stats = {
    total: attempts.length,
    average: attempts.length
      ? Math.round(attempts.reduce((a, b) => a + b.percentage, 0) / attempts.length)
      : 0,
    best: attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0,
  }

  return (
    <div className="min-h-screen bg-theme-gradient text-foreground flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-theme-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      <nav className="theme-nav backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={28} className="cursor-pointer hover:scale-105 transition-all" onClick={() => router.push("/")} />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">Sec+ Prep Dashboard</span>
              <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold tracking-widest uppercase mt-0.5">Performance Center</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => router.push("/exam")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-750 text-white rounded-lg text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Start Smart Exam
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-xs theme-text-muted hover:text-foreground font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 w-full flex-1 relative z-10 space-y-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="theme-card backdrop-blur-xl p-5 rounded-2xl hover:border-indigo-500/25 transition-all shadow-lg group">
            <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">Exams Taken</div>
            <div className="text-2xl md:text-3xl font-extrabold mt-1.5">{stats.total}</div>
          </div>
          <div className="theme-card backdrop-blur-xl p-5 rounded-2xl hover:border-purple-500/25 transition-all shadow-lg group">
            <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Average Score</div>
            <div className="text-2xl md:text-3xl font-extrabold mt-1.5">
              {stats.total > 0 ? `${stats.average}%` : "-"}
            </div>
          </div>
          <div className="theme-card backdrop-blur-xl p-5 rounded-2xl hover:border-emerald-500/25 transition-all shadow-lg group">
            <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">Best Score</div>
            <div className="text-2xl md:text-3xl font-extrabold mt-1.5">
              {stats.total > 0 ? `${stats.best}%` : "-"}
            </div>
          </div>
          <div className="theme-card backdrop-blur-xl p-5 rounded-2xl hover:border-orange-500/25 transition-all shadow-lg group">
            <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">Questions Answered</div>
            <div className="text-2xl md:text-3xl font-extrabold mt-1.5">
              {domainPerf.reduce((s, p) => s + p.correct + p.incorrect, 0)}
            </div>
          </div>
        </div>

        {/* Weakest Domains Alert */}
        {weakestDomains.length > 0 && (
          <div className="p-5 rounded-2xl border border-rose-500/25 bg-rose-500/5 dark:bg-rose-950/10 backdrop-blur-lg flex flex-col md:flex-row md:items-center justify-between gap-4 pulse-glow-red">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span className="font-bold text-rose-500 dark:text-rose-400 text-sm tracking-wide uppercase">Critical Focus Areas</span>
              </div>
              <p className="text-xs theme-text-muted leading-relaxed font-semibold">
                You have low accuracy scores in the following domains. Practice these areas to stabilize your score:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {weakestDomains.map((d) => (
                  <span
                    key={d}
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      domainColors[d] ?? "bg-slate-800 text-slate-300 border-white/10"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push("/exam")}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-900/20 self-start md:self-center transition-all cursor-pointer"
            >
              Practice Weak Areas
            </button>
          </div>
        )}

        {/* Radar Chart + Weightage         {domainPerf.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 theme-card backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/25 transition-colors">
              <div>
                <h2 className="text-sm font-bold tracking-wide uppercase mb-1">Performance Radar</h2>
                <p className="text-[10px] theme-text-muted font-semibold">Outer Ring = 100% | Dashed Zone = 75% Passing Threshold</p>
              </div>
              <div className="flex justify-center my-6">
                <SpiderChart
                  data={domainPerf.map((p) => {
                    const w = SY0_701_WEIGHTAGE.find((d) => d.domain === p.domain)
                    return {
                      label: p.domain.split(",")[0],
                      value: p.accuracy ?? 0,
                      target: 75,
                      color: w
                        ? ({
                            "General Security Concepts": "#3b82f6",
                            "Threats, Vulnerabilities, and Mitigations": "#ef4444",
                            "Security Architecture": "#8b5cf6",
                            "Security Operations": "#22c55e",
                            "Security Program Management and Oversight": "#f97316",
                          } as Record<string, string>)[w.domain] ?? "#6366f1"
                        : "#6366f1",
                    }
                  })}
                  size={210}
                />
              </div>
              <div className="text-center text-[10px] theme-text-muted font-semibold">
                Interactive Chart: Hover vertices to isolate domain performance details.
              </div>
            </div>
            
            <div className="lg:col-span-3 theme-card backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/25 transition-colors">
              <div>
                <h2 className="text-sm font-bold tracking-wide uppercase mb-1">SY0-701 Exam Weightage</h2>
                <p className="text-[10px] theme-text-muted mb-4 font-semibold">Target answered volume to simulate actual exam balance</p>
              </div>
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {SY0_701_WEIGHTAGE.map((w) => {
                  const p = domainPerf.find((d) => d.domain === w.domain)
                  const color = ({
                    "General Security Concepts": "#3b82f6",
                    "Threats, Vulnerabilities, and Mitigations": "#ef4444",
                    "Security Architecture": "#8b5cf6",
                    "Security Operations": "#22c55e",
                    "Security Program Management and Oversight": "#f97316",
                  } as Record<string, string>)[w.domain] ?? "#6366f1"
                  
                  const targetPercent = p ? Math.min(100, Math.round(((p.correct + p.incorrect) / w.targetQuestions) * 100)) : 0
 
                   return (
                    <div key={w.domain} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="font-bold text-foreground/95 truncate">{w.domain}</span>
                        </div>
                        <div className="flex items-center gap-2.5 theme-text-muted font-mono text-[10px] flex-shrink-0 font-semibold">
                          <span>{w.weight}% weight</span>
                          <span>({p ? p.correct + p.incorrect : 0}/{w.targetQuestions})</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border theme-border relative">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${targetPercent}%`,
                            backgroundColor: color,
                            opacity: p ? 0.8 : 0.15,
                            boxShadow: p ? `0 0 8px ${color}80` : "none"
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}  )}

        {/* Domain Performance */}
        {domainPerf.length > 0 && (
          <div className="theme-card backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b theme-border bg-black/[0.02] dark:bg-white/[0.02]">
              <h2 className="text-sm font-bold tracking-wide uppercase">Domain Mastery Metrics</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainPerf.map((p) => {
                  const total = p.correct + p.incorrect
                  const isLow = p.accuracy !== null && p.accuracy < 50
                  const isHigh = p.accuracy !== null && p.accuracy >= 75
                  
                  const accentColor = isHigh ? "bg-emerald-500" : isLow ? "bg-rose-500" : "bg-amber-500"
                  const ringBorder = isHigh ? "border-emerald-500/20" : isLow ? "border-rose-500/20" : "border-amber-500/20"

                  return (
                    <div
                      key={p.domain}
                      className={`p-4 rounded-xl border ${ringBorder} bg-black/5 dark:bg-slate-950/30 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-800 transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border leading-relaxed truncate ${
                            domainColors[p.domain] ?? "bg-slate-800 text-slate-300 border-white/10"
                          }`}
                        >
                          {p.domain}
                        </span>
                        {p.streak >= 3 && (
                          <span className="text-[10px] text-amber-500 font-bold flex-shrink-0 animate-pulse">
                            🔥 {p.streak} streak
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black leading-none">
                          {p.accuracy !== null ? `${p.accuracy}%` : "-"}
                        </span>
                        <span className="text-[10px] font-mono theme-text-muted font-semibold">
                          ({p.correct}/{total} correct)
                        </span>
                      </div>

                      <div className="h-1.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border theme-border">
                        <div
                          className={`h-full rounded-full ${accentColor}`}
                          style={{
                            width: p.accuracy !== null ? `${p.accuracy}%` : "0%",
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Exam History */}
        <div className="theme-card backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b theme-border bg-black/[0.02] dark:bg-white/[0.02]">
            <h2 className="text-sm font-bold tracking-wide uppercase">Exam History Log</h2>
          </div>
          {attempts.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="text-5xl animate-pulse">📝</div>
              <p className="theme-text-muted text-sm font-semibold">No exam sessions logged yet.</p>
              <button
                onClick={() => router.push("/exam")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                Start Your First Exam
              </button>
            </div>
          ) : (
            <div className="divide-y theme-border max-h-[400px] overflow-y-auto">
              {attempts.map((a) => {
                const isPass = a.percentage >= 75
                return (
                  <div key={a.id} className="px-6 py-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold">
                          {new Date(a.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-[10px] font-mono theme-text-muted mt-0.5 font-semibold">
                          Session Score: {a.score} of {a.total} correct
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`text-lg font-black ${
                            isPass ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                          }`}
                        >
                          {a.percentage}%
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[9px] rounded-full font-bold border ${
                            isPass
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25"
                          }`}
                        >
                          {isPass ? "PASSED" : "FAILED"}
                        </span>
                      </div>
                    </div>
                    
                    {a.domainResults && (
                      <div className="flex flex-wrap gap-1.5">
                        {a.domainResults.map((d) => {
                          const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0
                          const scoreColor = pct >= 75 
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/15" 
                            : pct >= 50 
                              ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/15" 
                              : "text-rose-600 dark:text-rose-400 bg-rose-500/5 border-rose-500/15"
                          return (
                            <span
                              key={d.domain}
                              className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${scoreColor}`}
                            >
                              {d.domain.split(",")[0]}: {pct}%
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 border-t theme-border text-center text-xs theme-text-muted relative z-10">
        © {new Date().getFullYear()} CompTIA Security+ SY0-701 Prep. Made with premium developer aesthetics.
      </footer>
    </div>
  )
}
