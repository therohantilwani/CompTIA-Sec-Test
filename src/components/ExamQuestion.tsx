"use client"

import { Question } from "@/types"

interface ExamQuestionProps {
  question: Question
  selectedAnswer: string | null
  showResult: boolean
  onAnswer: (questionId: string, answerId: string) => void
}

function parseScenario(scenario: string) {
  const parts = scenario.split("\n\n")
  if (parts.length < 2) return null
  const leftItems: string[] = []
  const rightItems: string[] = []

  const leftMatch = parts[0].match(/\((\d+)\)\s*([^(]+)/g)
  if (leftMatch) {
    leftMatch.forEach((item) => {
      const cleaned = item.replace(/\(\d+\)\s*/, "").trim()
      if (cleaned) leftItems.push(cleaned)
    })
  }

  for (let i = 1; i < parts.length; i++) {
    const rightMatch = parts[i].match(/[A-Z]\.\s*(.+)/g)
    if (rightMatch) {
      rightMatch.forEach((item) => {
        const cleaned = item.replace(/^[A-Z]\.\s*/, "").trim()
        if (cleaned) rightItems.push(cleaned)
      })
    }
  }

  return leftItems.length > 0 && rightItems.length > 0 ? { leftItems, rightItems } : null
}

const domainColors: Record<string, string> = {
  "General Security Concepts": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Threats, Vulnerabilities, and Mitigations": "bg-red-500/10 text-red-400 border-red-500/20",
  "Security Architecture": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Security Operations": "bg-green-500/10 text-green-400 border-green-500/20",
  "Security Program Management and Oversight": "bg-orange-500/10 text-orange-400 border-orange-500/20",
}

export default function ExamQuestion({ question, selectedAnswer, showResult, onAnswer }: ExamQuestionProps) {
  const prefix = question.type === "pbq" ? "📋 Performance PBQ" : "❓ Single MCQ"
  const domainColor = domainColors[question.domain] ?? "bg-slate-800 text-slate-300 border-white/10"
  const parsed = question.type === "pbq" && question.scenario ? parseScenario(question.scenario) : null

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{prefix}</span>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${domainColor}`}>
          {question.domain}
        </span>
      </div>

      <h2 className="text-lg md:text-xl font-bold text-white leading-snug">{question.text}</h2>

      {parsed && (
        <div className="p-5 bg-slate-950/60 rounded-xl border border-white/5 space-y-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Diagnostic Mapping Scenario:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {parsed.leftItems.map((item, i) => (
                <div key={i} className="p-3 bg-slate-900 border border-white/5 rounded-lg text-xs font-semibold text-slate-300 shadow-inner flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-[10px] border border-white/5">{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {parsed.rightItems.map((item, i) => (
                <div key={i} className="p-3 bg-slate-900 border border-white/5 rounded-lg text-xs font-medium text-slate-400 shadow-inner flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-[10px] border border-white/5">{String.fromCharCode(65 + i)}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!parsed && question.scenario && (
        <div className="p-4 bg-amber-950/15 border border-amber-500/10 rounded-xl text-xs font-semibold text-amber-300 leading-relaxed">
          {question.scenario}
        </div>
      )}

      <div className="space-y-3.5">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswer === answer.id
          let answerStyle = "border-white/5 bg-slate-950/30 text-slate-300 hover:bg-slate-900/40 hover:border-indigo-500/35 hover:text-white"
          let badgeStyle = "bg-slate-900 border-white/5 text-slate-400"

          if (showResult) {
            if (answer.isCorrect) {
              answerStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              badgeStyle = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]"
            } else if (isSelected) {
              answerStyle = "border-rose-500 bg-rose-950/20 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              badgeStyle = "bg-rose-600 border-rose-400 text-white shadow-[0_0_8px_rgba(244,63,94,0.3)]"
            } else {
              answerStyle = "border-white/[0.02] opacity-40 text-slate-500 pointer-events-none"
            }
          } else if (isSelected) {
            answerStyle = "border-indigo-500 bg-indigo-950/20 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            badgeStyle = "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_8px_rgba(99,102,241,0.3)]"
          }

          return (
            <button
              key={answer.id}
              onClick={() => !showResult && onAnswer(question.id, answer.id)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ease-out cursor-pointer ${answerStyle}`}
            >
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-black uppercase font-mono transition-all ${badgeStyle}`}>
                  {answer.id}
                </span>
                <span className="text-[15px] font-semibold leading-relaxed pt-0.5">{answer.text}</span>
                {showResult && answer.isCorrect && (
                  <span className="ml-auto flex-shrink-0 text-xs font-bold text-emerald-400 uppercase tracking-widest pt-0.5">✓ Correct</span>
                )}
                {showResult && isSelected && !answer.isCorrect && (
                  <span className="ml-auto flex-shrink-0 text-xs font-bold text-rose-400 uppercase tracking-widest pt-0.5">✗ Incorrect</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {showResult && (
        <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-500/20 text-blue-200 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Tutor Explanation:</p>
          <p className="text-xs leading-relaxed font-medium">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
