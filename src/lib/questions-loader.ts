import { Question } from "@/types"
import { questionBank } from "@/lib/questions-bank"
import { getFallbackQuestions } from "@/lib/fallback-questions"
import { DomainPerformance } from "@/lib/performance"
import { SY0_701_WEIGHTAGE } from "@/lib/weightage"

const DECK_URL = "https://raw.githubusercontent.com/PR0CK0/quizzical/main/decks/security-plus-full.json"

const domainMapping: Record<string, string> = {
  "General Security Concepts": "General Security Concepts",
  "Threats, Vulnerabilities, and Mitigations": "Threats, Vulnerabilities, and Mitigations",
  "Security Architecture": "Security Architecture",
  "Security Operations": "Security Operations",
  "Security Program Management": "Security Program Management and Oversight",
  "Security Program Management and Oversight": "Security Program Management and Oversight",
  "Cryptography": "Security Architecture"
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffleQuestionAnswers(q: any): Question {
  const ids = ["a", "b", "c", "d"]
  const correctAnswer = q.answers.find((a: any) => a.isCorrect)
  const wrongAnswers = q.answers.filter((a: any) => !a.isCorrect)
  const all = [...wrongAnswers]
  const correctIdx = Math.floor(Math.random() * Math.min(4, all.length + 1))
  all.splice(correctIdx, 0, correctAnswer)
  return {
    ...q,
    answers: all.map((a: any, i: number) => ({
      id: ids[i] || i.toString(),
      text: a.text,
      isCorrect: a.isCorrect,
    })),
  }
}

export async function fetchQuestionsFromInternet(): Promise<Question[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)

  try {
    const res = await fetch(DECK_URL, { signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
    }
    
    const data = await res.json()
    if (!data || !Array.isArray(data.questions)) {
      throw new Error("Invalid structure: questions array missing")
    }

    const ids = ["a", "b", "c", "d"]
    return data.questions.map((q: any, idx: number) => {
      const answers = (q.answers || []).map((ansText: string, aIdx: number) => ({
        id: ids[aIdx] || aIdx.toString(),
        text: ansText,
        isCorrect: ansText.trim() === q.correct.trim(),
      }))

      return {
        id: `online_${q.id ?? idx}`,
        type: "mcq",
        domain: domainMapping[q.domain] || q.domain || "General Security Concepts",
        text: q.question || "",
        answers,
        explanation: q.explanation || "",
      }
    })
  } catch (error) {
    clearTimeout(timeoutId)
    console.error("Error fetching online questions, using local offline fallback:", error)
    return []
  }
}

export async function loadClientQuestions({
  count = 35,
  mode = "adaptive",
  perf = [],
  answeredIds = new Set<string>(),
  seenIds = new Set<string>()
}: {
  count?: number
  mode?: string
  perf?: DomainPerformance[]
  answeredIds?: Set<string>
  seenIds?: Set<string>
}): Promise<Question[]> {
  
  // Try to fetch latest questions from the internet, fallback to local bank if offline or failed
  let activeQuestionBank = await fetchQuestionsFromInternet()
  if (activeQuestionBank.length === 0) {
    console.log("Using local offline fallback question bank")
    activeQuestionBank = questionBank
  }

  // Filter out already-seen questions
  let pool = activeQuestionBank.filter((q) => !seenIds.has(q.id))

  // If all questions have been seen, reset (reshuffle the full bank)
  if (pool.length < 10) {
    pool = [...activeQuestionBank]
  }

  // Determine domain distribution
  let domainDistribution: { domain: string; count: number }[] = []

  if (mode === "adaptive" && perf.length > 0) {
    try {
      const totalAnswered = perf.reduce((s, p) => s + p.correct + p.incorrect, 0)

      if (totalAnswered > 0) {
        const scored = SY0_701_WEIGHTAGE.map((w) => {
          const p = perf.find((d) => d.domain === w.domain)
          const answered = p ? p.correct + p.incorrect : 0
          const accuracy = p && answered > 0 ? p.correct / answered : 0.5
          const weakness = answered === 0 ? 2.0 : 1.0 - accuracy + 0.3
          return { domain: w.domain, score: w.weight * weakness }
        })
        const totalScore = scored.reduce((s, x) => s + x.score, 0)
        domainDistribution = scored.map((d) => ({
          domain: d.domain,
          count: Math.max(1, Math.round((d.score / totalScore) * count)),
        }))
      }
    } catch (e) {
      console.error("Adaptive weightage calculation failed, falling back to static", e)
    }
  }

  if (domainDistribution.length === 0) {
    domainDistribution = SY0_701_WEIGHTAGE.map((w) => ({
      domain: w.domain,
      count: Math.max(1, Math.round((w.weight / 100) * count)),
    }))
  }

  // Adjust total to match requested count
  const totalAllocated = domainDistribution.reduce((s, d) => s + d.count, 0)
  if (totalAllocated > count) {
    const sorted = [...domainDistribution].sort((a, b) => b.count - a.count)
    sorted[0].count -= totalAllocated - count
  } else if (totalAllocated < count) {
    const sorted = [...domainDistribution].sort((a, b) => b.count - a.count)
    sorted[0].count += count - totalAllocated
  }

  // Pick questions per domain from the pool
  let questions: Question[] = []
  for (const { domain, count: domainCount } of domainDistribution) {
    const poolForDomain = pool
      .filter((q) => q.domain === domain)
      .map((q) => shuffleQuestionAnswers(q))

    const shuffled = shuffleArray(poolForDomain)
    questions = [...questions, ...shuffled.slice(0, domainCount)]
  }

  // Shuffle final order (mix domains)
  questions = shuffleArray(questions)

  // If we somehow have too few, top up from fallback
  if (questions.length < 10) {
    questions = shuffleArray(getFallbackQuestions(count, answeredIds))
  }

  return questions
}
