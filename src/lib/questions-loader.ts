import { Question } from "@/types"
import { questionBank } from "@/lib/questions-bank"
import { getFallbackQuestions } from "@/lib/fallback-questions"
import { DomainPerformance } from "@/lib/performance"
import { SY0_701_WEIGHTAGE } from "@/lib/weightage"

const DECK_URL = "https://raw.githubusercontent.com/PR0CK0/quizzical/main/decks/security-plus-full.json"
const SUPABASE_URL = "https://yqqdntluzslbquzddapx.supabase.co/rest/v1/questions?test_type=eq.security"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxcWRudGx1enNsYnF1emRkYXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxOTE2NjgsImV4cCI6MjA4MTc2NzY2OH0.Pf5lOHAuJEyy4Gw-ZjVI4gxbuSfWVKB66d2NhdsBjOc"

const domainMapping: Record<string, string> = {
  "General Security Concepts": "General Security Concepts",
  "Threats, Vulnerabilities, and Mitigations": "Threats, Vulnerabilities, and Mitigations",
  "Security Architecture": "Security Architecture",
  "Security Operations": "Security Operations",
  "Security Program Management": "Security Program Management and Oversight",
  "Security Program Management and Oversight": "Security Program Management and Oversight",
  "Cryptography": "Security Architecture"
}

const studyIoDomainMapping: Record<string, string> = {
  "architecture-design": "Security Architecture",
  "cryptography": "General Security Concepts",
  "governance-compliance": "Security Program Management and Oversight",
  "identity-access-management": "Security Architecture",
  "implementation": "Security Architecture",
  "operations-incident-response": "Security Operations",
  "risk-management": "Security Program Management and Oversight",
  "threats-vulnerabilities": "Threats, Vulnerabilities, and Mitigations"
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
  const correctAnswer = q.answers.find((a: any) => a?.isCorrect)
  const wrongAnswers = q.answers.filter((a: any) => !a?.isCorrect)
  const all = [...wrongAnswers]
  const correctIdx = Math.floor(Math.random() * Math.min(4, all.length + 1))
  all.splice(correctIdx, 0, correctAnswer)
  return {
    ...q,
    answers: all.map((a: any, i: number) => ({
      id: ids[i] || i.toString(),
      text: a?.text || "",
      isCorrect: a?.isCorrect || false,
    })),
  }
}

async function fetchSupabaseQuestions(signal?: AbortSignal): Promise<Question[]> {
  const res = await fetch(SUPABASE_URL, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Accept": "application/json"
    },
    signal
  })
  if (!res.ok) {
    throw new Error(`Supabase HTTP error ${res.status}: ${res.statusText}`)
  }
  const data = await res.json()
  if (!Array.isArray(data)) {
    throw new Error("Invalid structure: expected array from Supabase")
  }

  const ids = ["a", "b", "c", "d"]
  return data.map((q: any, idx: number) => {
    const answers = (q.options || []).map((optText: string, oIdx: number) => ({
      id: ids[oIdx] || oIdx.toString(),
      text: optText,
      isCorrect: oIdx === q.correct_answer,
    }))

    return {
      id: `studyio_${q.id ?? idx}`,
      type: "mcq",
      domain: studyIoDomainMapping[q.category] || "General Security Concepts",
      text: q.question || "",
      answers,
      explanation: q.explanation || "",
    }
  })
}

async function fetchGitQuestions(signal?: AbortSignal): Promise<Question[]> {
  const res = await fetch(DECK_URL, { signal })
  if (!res.ok) {
    throw new Error(`Git deck HTTP error ${res.status}: ${res.statusText}`)
  }
  const data = await res.json()
  if (!data || !Array.isArray(data.questions)) {
    throw new Error("Invalid structure: questions array missing in Git deck")
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
}

export async function fetchQuestionsFromInternet(): Promise<Question[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000)

  try {
    const results = await Promise.allSettled([
      fetchSupabaseQuestions(controller.signal),
      fetchGitQuestions(controller.signal)
    ])
    clearTimeout(timeoutId)

    const allQuestions: Question[] = []
    const seenSignatures = new Set<string>()

    results.forEach((result) => {
      if (result.status === "fulfilled" && Array.isArray(result.value)) {
        result.value.forEach((q) => {
          // Unique signature: normalize lowercase letters and numbers
          const sig = q.text.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 100)
          if (!seenSignatures.has(sig)) {
            seenSignatures.add(sig)
            allQuestions.push(q)
          }
        })
      } else if (result.status === "rejected") {
        console.error("Fetcher error:", result.reason)
      }
    })

    console.log(`Fetched ${allQuestions.length} unique questions from the internet`)
    return allQuestions
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

