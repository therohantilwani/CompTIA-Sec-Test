"use client"

import { useState, useEffect } from "react"
import { Question } from "@/types"

interface TeachingLessonProps {
  question: Question
  selectedAnswerId: string
  onClose: () => void
}

function renderMarkdown(text: string) {
  return text.split("\n").map((line, idx) => {
    // Check if line is empty
    if (!line.trim()) return <div key={idx} className="h-2" />

    let content: React.ReactNode = line
    
    // Parse bold text: **text**
    const boldRegex = /\*\*(.*?)\*\*/g
    if (boldRegex.test(line)) {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      content = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="text-amber-300 font-bold">{part}</strong> : part
      )
    }

    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      const cleaned = line.trim().replace(/^[\*\-]\s*/, "")
      // Re-apply bold parsing to item content
      let itemContent: React.ReactNode = cleaned
      if (boldRegex.test(cleaned)) {
        const parts = cleaned.split(/\*\*(.*?)\*\*/g)
        itemContent = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="text-amber-300 font-bold">{part}</strong> : part
        )
      }
      return (
        <li key={idx} className="ml-4 list-disc text-xs text-amber-100/90 leading-relaxed font-semibold mb-1">
          {itemContent}
        </li>
      )
    }

    return (
      <p key={idx} className="text-xs text-amber-100/90 leading-relaxed font-semibold mb-2">
        {content}
      </p>
    )
  })
}

export default function TeachingLesson({ question, selectedAnswerId, onClose }: TeachingLessonProps) {
  const [lesson, setLesson] = useState<{
    miniLesson: string
    keyConcept: string
    relatedTopics: string[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [keyInput, setKeyInput] = useState("")

  const correctAnswer = question.answers.find((a) => a.isCorrect)
  const selectedAnswer = question.answers.find((a) => a.id === selectedAnswerId)

  // Load API key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key") || ""
    setApiKey(savedKey)
    setKeyInput(savedKey)
  }, [])

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true)
      
      // If we have a local Gemini API key, use it to get dynamic tutoring
      if (apiKey) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
          
          const prompt = `You are an encouraging CompTIA Security+ SY0-701 study mentor. The student answered a question incorrectly.
Please explain:
1. Why their selected answer is incorrect in this context.
2. Why the correct answer is correct.

Question: "${question.text}"
Their chosen incorrect answer: "${selectedAnswer?.text}"
The correct answer: "${correctAnswer?.text}"
General concept context: "${question.explanation}"

Keep your response structured, concise (around 120-150 words), and formatted with markdown (e.g. bolding key terms).`

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          })

          if (!res.ok) {
            throw new Error(`Gemini API returned status ${res.status}`)
          }

          const data = await res.json()
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (aiText) {
            setLesson({
              miniLesson: aiText,
              keyConcept: `Understand the specific distinction between "${selectedAnswer?.text.substring(0, 40)}..." and "${correctAnswer?.text.substring(0, 40)}...".`,
              relatedTopics: [question.domain],
            })
            setLoading(false)
            return
          }
        } catch (err) {
          console.error("Client-side AI explanation fetch failed, using fallback:", err)
        }
      }

      // Fallback: build a structured text using the static explanation
      const fallbackExplanation = question.explanation || "Review the explanation to understand the concept details."
      const fallbackText = `**Your Selection:** (${selectedAnswer?.id.toUpperCase()}) ${selectedAnswer?.text}\n\n**Correct Answer:** (${correctAnswer?.id.toUpperCase()}) ${correctAnswer?.text}\n\n**Tutor Review:**\n${fallbackExplanation}\n\n*Note: Set a Gemini API key below to get real-time AI tutor lessons explaining exactly why your specific incorrect choice is wrong in this scenario.*`

      setLesson({
        miniLesson: fallbackText,
        keyConcept: "Analyze the difference between the incorrect scenario choices and the target answer.",
        relatedTopics: [question.domain],
      })
      setLoading(false)
    }

    fetchLesson()
  }, [question.id, selectedAnswerId, correctAnswer?.id, question.domain, apiKey])

  const handleSaveKey = () => {
    const trimmed = keyInput.trim()
    localStorage.setItem("gemini_api_key", trimmed)
    setApiKey(trimmed)
  }

  const handleClearKey = () => {
    localStorage.removeItem("gemini_api_key")
    setApiKey("")
    setKeyInput("")
  }

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

          {loading ? (
            <div className="flex items-center gap-3 text-xs font-bold text-amber-400 py-2">
              <div className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full" />
              AI Assistant composing custom concept review...
            </div>
          ) : lesson ? (
            <div className="space-y-4">
              <div className="text-xs text-amber-100/90 leading-relaxed font-semibold">
                {renderMarkdown(lesson.miniLesson)}
              </div>
              
              <div className="p-3.5 bg-slate-950/50 rounded-xl border border-amber-500/10 shadow-inner">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">📌 Key Lesson Takeaway</p>
                <p className="text-xs text-amber-200 font-medium leading-relaxed">{lesson.keyConcept}</p>
              </div>

              {/* Related topics */}
              {lesson.relatedTopics && lesson.relatedTopics.length > 0 && (
                <div className="space-y-1.5 border-b border-white/5 pb-4">
                  <p className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest">Recommended Related Concepts:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.relatedTopics.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 bg-slate-900 border border-amber-500/10 text-amber-300 rounded-full text-[11px] font-bold tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gemini API Key Configuration Panel */}
              {!apiKey ? (
                <div className="p-3.5 bg-slate-950/50 border border-white/5 rounded-xl space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    🔑 Unlock Personal AI Tutor Explanations
                  </p>
                  <p className="text-xs text-slate-500 leading-normal font-semibold">
                    Enter a free Gemini API key to let the AI explain precisely why your selected wrong option is incorrect and why the correct one holds. Stored locally in your browser.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Paste Gemini API Key (AIzaSy...)"
                      className="flex-1 px-3 py-1 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                    />
                    <button
                      onClick={handleSaveKey}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Save Key
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    No key?{" "}
                    <a
                      href="https://aistudio.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      Create a free Gemini API Key in 30 seconds
                    </a>
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-semibold">
                  <span>🤖 AI Tutor Active (Gemini API Integration)</span>
                  <button
                    onClick={handleClearKey}
                    className="hover:text-rose-450 transition-colors uppercase tracking-widest font-black cursor-pointer"
                  >
                    [Deactivate Key]
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

