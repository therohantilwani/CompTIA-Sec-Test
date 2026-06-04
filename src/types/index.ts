export type QuestionType = "mcq" | "pbq"

export interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  type: QuestionType
  domain: string
  text: string
  scenario?: string
  answers: Answer[]
  explanation: string
}

export interface ExamResult {
  score: number
  total: number
  percentage: number
  passed: boolean
  answers: Record<string, string | null>
  questions: Question[]
  timestamp: Date
}
