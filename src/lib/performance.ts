export interface DomainPerformance {
  domain: string
  correct: number
  incorrect: number
  streak: number
  lastSeen: number
}

const STORAGE_KEY = "domainPerformance"
const ANSWERED_KEY = "answeredCorrectIds"
const ALL_SEEN_KEY = "allSeenQuestionIds"
const TOPICS_KEY = "seenTopics"

export function getPerformance(): DomainPerformance[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function updatePerformance(domain: string, isCorrect: boolean): DomainPerformance[] {
  const perf = getPerformance()
  let entry = perf.find((p) => p.domain === domain)
  if (!entry) {
    entry = { domain, correct: 0, incorrect: 0, streak: 0, lastSeen: 0 }
    perf.push(entry)
  }
  if (isCorrect) {
    entry.correct++
    entry.streak++
  } else {
    entry.incorrect++
    entry.streak = 0
  }
  entry.lastSeen = Date.now()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(perf))
  } catch {}
  return perf
}

export function getWeakestDomains(count: number = 5): string[] {
  const perf = getPerformance()
  return perf
    .filter((p) => p.correct + p.incorrect >= 2)
    .sort((a, b) => {
      const accA = a.correct / Math.max(a.correct + a.incorrect, 1)
      const accB = b.correct / Math.max(b.correct + b.incorrect, 1)
      return accA - accB
    })
    .slice(0, count)
    .map((p) => p.domain)
}

export function getDomainAccuracy(domain: string): number | null {
  const perf = getPerformance()
  const entry = perf.find((p) => p.domain === domain)
  if (!entry || entry.correct + entry.incorrect === 0) return null
  return Math.round((entry.correct / (entry.correct + entry.incorrect)) * 100)
}

export function getDomainStreak(domain: string): number {
  const perf = getPerformance()
  return perf.find((p) => p.domain === domain)?.streak ?? 0
}

export function getAnsweredCorrectIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const stored = localStorage.getItem(ANSWERED_KEY)
    return new Set(stored ? JSON.parse(stored) : [])
  } catch {
    return new Set()
  }
}

export function markAnsweredCorrect(questionId: string): void {
  if (typeof window === "undefined") return
  try {
    const ids = getAnsweredCorrectIds()
    ids.add(questionId)
    localStorage.setItem(ANSWERED_KEY, JSON.stringify([...ids]))
  } catch {}
}

export function getAnsweredCorrectCount(): number {
  return getAnsweredCorrectIds().size
}

export function getAllAnsweredIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const stored = localStorage.getItem(ALL_SEEN_KEY)
    return new Set(stored ? JSON.parse(stored) : [])
  } catch {
    return new Set()
  }
}

export function markAnswered(questionId: string): void {
  if (typeof window === "undefined") return
  try {
    const ids = getAllAnsweredIds()
    ids.add(questionId)
    localStorage.setItem(ALL_SEEN_KEY, JSON.stringify([...ids]))
  } catch {}
}

export function getSeenTopics(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(TOPICS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function markTopicSeen(questionText: string): void {
  if (typeof window === "undefined") return
  try {
    const topics = getSeenTopics()
    const words = questionText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4 && !["which", "following", "would", "should", "their", "about", "after", "before", "during", "without", "between", "through"].includes(w))
    const key = words.slice(0, 5).join(" ")
    if (key.length < 10) return
    if (!topics.includes(key)) {
      topics.push(key)
      localStorage.setItem(TOPICS_KEY, JSON.stringify(topics.slice(-200)))
    }
  } catch {}
}
