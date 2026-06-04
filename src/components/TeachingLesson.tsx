"use client"

import { useState, useEffect } from "react"
import { Question } from "@/types"

interface TeachingLessonProps {
  question: Question
  selectedAnswerId: string
  onClose: () => void
}

export default function TeachingLesson({ question, selectedAnswerId, onClose }: TeachingLessonProps) {
  const [lesson, setLesson] = useState<{
    miniLesson: string
    keyConcept: string
    relatedTopics: string[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const correctAnswer = question.answers.find((a) => a.isCorrect)
  const selectedAnswer = question.answers.find((a) => a.id === selectedAnswerId)

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch("/api/teach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            selectedAnswerId,
            correctAnswerId: correctAnswer?.id,
            domain: question.domain,
            topic: question.domain,
          }),
        })
        const data = await res.json()
        setLesson(data)
      } catch {
        setLesson({
          miniLesson: question.explanation || "Review the explanation to understand the concept details.",
          keyConcept: "Understand the core security principle and analyze the scenario parameters.",
          relatedTopics: [question.domain],
        })
      }
      setLoading(false)
    }
    fetchLesson()
  }, [question.id, selectedAnswerId, correctAnswer?.id, question.domain])

  return (
    <div className="mt-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md relative z-10 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="text-3xl select-none pt-0.5 animate-pulse">📖</div>
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-400 text-xs tracking-wider uppercase">Interactive AI Teaching Lesson</h3>
            <button
              onClick={onClose}
              className="text-amber-500 hover:text-amber-300 text-2xl leading-none transition-colors cursor-pointer"
            >
              ×
            </button>
          </div>

          {selectedAnswer && (
            <div className="text-xs space-y-1.5 border-b border-amber-500/10 pb-3 font-semibold">
              <div>
                <span className="text-amber-500">Your Selection: </span>
                <span className="text-amber-300">({selectedAnswer.id.toUpperCase()}) {selectedAnswer.text}</span>
              </div>
              {correctAnswer && (
                <div>
                  <span className="text-emerald-400">Correct Target: </span>
                  <span className="text-emerald-300 font-bold">({correctAnswer.id.toUpperCase()}) {correctAnswer.text}</span>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-3 text-xs font-bold text-amber-400">
              <div className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full" />
              AI Assistant composing core concept summary...
            </div>
          ) : lesson ? (
            <div className="space-y-4">
              <p className="text-xs text-amber-100/90 leading-relaxed font-semibold">{lesson.miniLesson}</p>
              
              <div className="p-3.5 bg-slate-950/50 rounded-xl border border-amber-500/10 shadow-inner">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">📌 Key Lesson Takeaway</p>
                <p className="text-xs text-amber-200 font-medium leading-relaxed">{lesson.keyConcept}</p>
              </div>

              {lesson.relatedTopics && lesson.relatedTopics.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest">Recommended Related Concepts:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.relatedTopics.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 bg-slate-900 border border-amber-500/10 text-amber-300 rounded-full text-[9px] font-bold tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
