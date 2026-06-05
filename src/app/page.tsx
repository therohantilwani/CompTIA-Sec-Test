import Link from "next/link"
import Logo from "@/components/Logo"
import ThemeToggle from "@/components/ThemeToggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-theme-gradient text-foreground flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background decoration grid and glow elements */}
      <div className="absolute inset-0 bg-theme-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col justify-between relative z-10">
        <header className="flex items-center justify-between py-6 border-b theme-border">
          <div className="flex items-center gap-3">
            <Logo size={36} className="animate-pulse" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none">Sec+ Prep</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase mt-1">SY0-701 Companion</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/exam"
              className="px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Start Exam
            </Link>
          </div>
        </header>

        <main className="py-16 lg:py-24 my-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-900/10 dark:bg-indigo-900/40 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping" />
                CompTIA Security+ SY0-701 Exam Prep
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Ace Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 shadow-sm">
                  CompTIA Security+
                </span>{" "}
                Certification
              </h1>
              <p className="text-base md:text-lg theme-text-muted max-w-xl leading-relaxed font-medium">
                Practice with hundreds of verified exam questions including interactive performance-based scenarios (PBQs). Our smart adaptive learning engine targets your weakest domains automatically, ensuring optimized study paths.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/exam"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-750 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] active:scale-95 transition-all"
                >
                  Start Practice Exam
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 text-foreground rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  View Performance Dashboard
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20 pointer-events-none" />
              <div className="relative theme-card backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-6 hover:border-indigo-500/20 transition-all duration-300 group">
                <h3 className="text-sm font-bold theme-text-muted uppercase tracking-widest border-b theme-border pb-3 flex items-center justify-between">
                  <span>Interactive Engine Specs</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono font-bold">ONLINE SYNC</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors duration-200">
                    <span className="text-xl text-emerald-500 dark:text-emerald-400 select-none pt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold">Adaptive Performance Radar</h4>
                      <p className="text-[11px] theme-text-muted mt-0.5 leading-normal">Custom spider charts color-coded dynamically mapping actual exam weightage.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors duration-200">
                    <span className="text-xl text-indigo-500 dark:text-indigo-400 select-none pt-0.5">💡</span>
                    <div>
                      <h4 className="text-xs font-bold">AI Teaching Lessons</h4>
                      <p className="text-[11px] theme-text-muted mt-0.5 leading-normal">Get customized tutoring explanations instantly when a question is answered incorrectly.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors duration-200">
                    <span className="text-xl text-amber-500 dark:text-amber-400 select-none pt-0.5">🔄</span>
                    <div>
                      <h4 className="text-xs font-bold">Concept Reinforcement</h4>
                      <p className="text-[11px] theme-text-muted mt-0.5 leading-normal">Identifies mistakes and injects specialized review sessions to lock in key concepts.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors duration-200">
                    <span className="text-xl text-rose-500 dark:text-rose-400 select-none pt-0.5">⏱</span>
                    <div>
                      <h4 className="text-xs font-bold">Official Exam Simulation</h4>
                      <p className="text-[11px] theme-text-muted mt-0.5 leading-normal">Timed formats aligned exactly to CompTIA SY0-701 guidelines and domain distributions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t theme-border text-center text-xs theme-text-muted">
          © {new Date().getFullYear()} CompTIA Security+ SY0-701 Prep. Made with premium developer aesthetics.
        </footer>
      </div>
    </div>
  )
}
