export interface DomainWeightage {
  domain: string
  weight: number  // percentage of exam (e.g., 28 for 28%)
  targetQuestions: number // how many out of 90 should be from this domain
  subtopics: string[]
}

export const SY0_701_WEIGHTAGE: DomainWeightage[] = [
  {
    domain: "General Security Concepts",
    weight: 12,
    targetQuestions: 11,
    subtopics: [
      "CIA triad", "defense in depth", "least privilege", "separation of duties",
      "zero trust", "non-repudiation", "authentication", "authorization",
      "accounting", "key management", "physical security controls",
      "access control models (MAC, DAC, RBAC, ABAC)",
    ],
  },
  {
    domain: "Threats, Vulnerabilities, and Mitigations",
    weight: 22,
    targetQuestions: 20,
    subtopics: [
      "malware types", "social engineering", "phishing attacks",
      "DDoS attacks", "on-path attacks", "replay attacks",
      "pass-the-hash", "wireless attacks", "application attacks",
      "SQL injection", "XSS", "buffer overflow", "vulnerability scanning",
      "penetration testing", "threat actors", "attack vectors",
    ],
  },
  {
    domain: "Security Architecture",
    weight: 18,
    targetQuestions: 16,
    subtopics: [
      "cloud models (IaaS, PaaS, SaaS)", "network segmentation",
      "DMZ", "VPNs", "firewalls (packet, stateful, NGFW, proxy)",
      "IDS/IPS", "WAF", "NAC", "load balancing", "backup types",
      "high availability", "resiliency", "RAID", "secure baselines",
      "virtualization security", "container security",
    ],
  },
  {
    domain: "Security Operations",
    weight: 28,
    targetQuestions: 25,
    subtopics: [
      "incident response lifecycle", "forensics", "SIEM", "SOAR",
      "playbooks", "log management", "MFA factors", "password security",
      "identity management", "PAM", "endpoint security", "DLP",
      "CASB", "antivirus", "patch management", "vulnerability management",
      "change management", "configuration management",
    ],
  },
  {
    domain: "Security Program Management and Oversight",
    weight: 20,
    targetQuestions: 18,
    subtopics: [
      "risk management", "risk assessment", "risk strategies",
      "business continuity", "disaster recovery", "RTO", "RPO",
      "compliance frameworks (PCI DSS, HIPAA, GDPR, SOX)",
      "policies and standards", "third-party risk", "data governance",
      "data lifecycle", "training and awareness", "audits",
    ],
  },
]

export function getDomainWeightage(domain: string): DomainWeightage | undefined {
  return SY0_701_WEIGHTAGE.find((d) => d.domain === domain)
}

export interface WeightageProgress {
  domain: string
  target: number
  answered: number
  correct: number
  accuracy: number | null
  completed: number // % of target covered
}

export function calculateWeightageProgress(
  domainStats: { domain: string; correct: number; incorrect: number }[]
): WeightageProgress[] {
  return SY0_701_WEIGHTAGE.map((w) => {
    const stat = domainStats.find((d) => d.domain === w.domain)
    const answered = stat ? stat.correct + stat.incorrect : 0
    const correct = stat ? stat.correct : 0
    return {
      domain: w.domain,
      target: w.targetQuestions,
      answered,
      correct,
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : null,
      completed: Math.min(100, Math.round((answered / w.targetQuestions) * 100)),
    }
  })
}

export function getNextRecommendedDomain(
  domainStats: { domain: string; correct: number; incorrect: number }[]
): { domain: string; reason: string; priority: number } {
  const progress = calculateWeightageProgress(domainStats)

  const scored = progress.map((p) => {
    // Priority score: higher = more important to study
    let score = 0
    // Low completion = high priority
    score += (100 - p.completed) * 2
    // Low accuracy = high priority
    if (p.accuracy !== null) {
      score += (100 - p.accuracy) * 1.5
    }
    // Higher weightage = higher priority
    score += SY0_701_WEIGHTAGE.find((w) => w.domain === p.domain)?.weight ?? 0
    // If never studied, boost moderately
    if (p.answered === 0) score += 150

    let reason = ""
    if (p.answered === 0) {
      reason = `Unstudied — ${p.target} questions needed (${SY0_701_WEIGHTAGE.find((w) => w.domain === p.domain)?.weight}% of exam)`
    } else if (p.completed < 50) {
      reason = `Low coverage — only ${p.completed}% of target reached`
    } else if (p.accuracy !== null && p.accuracy < 70) {
      reason = `Weak area — ${p.accuracy}% accuracy needs improvement`
    } else {
      reason = `In progress — ${p.completed}% complete`
    }

    return { domain: p.domain, reason, priority: score }
  })

  scored.sort((a, b) => b.priority - a.priority)
  return scored[0]
}

export function formatWeightageBreakdown(): string {
  return SY0_701_WEIGHTAGE.map(
    (d) => `${d.domain}: ${d.weight}% (${d.targetQuestions} of 90 questions)`
  ).join("\n")
}
