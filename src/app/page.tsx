import Link from "next/link"
import Logo from "@/components/Logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decoration grid and glow elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col justify-between relative z-10">
        <header className="flex items-center justify-between py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Logo size={36} className="animate-pulse" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">Sec+ Prep</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase mt-1">SY0-701 Companion</span>
            </div>
          </div>
          <Link
            href="/exam"
            className="px-5 py-2 bg-white text-slate-950 rounded-lg text-sm font-semibold hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          >
            Start Exam
          </Link>
        </header>

        <main className="py-16 lg:py-24 my-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                CompTIA Security+ SY0-701 Exam Prep
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Ace Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-sm">
                  CompTIA Security+
                </span>{" "}
                Certification
              </h1>
              <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
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
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  View Performance Dashboard
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20 pointer-events-none" />
              <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6 hover:border-indigo-500/20 transition-all duration-300 group">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center justify-between">
                  <span>Interactive Engine Specs</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono">ONLINE SYNC</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors duration-200">
                    <span className="text-xl text-emerald-400 select-none pt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Adaptive Performance Radar</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Custom spider charts color-coded dynamically mapping actual exam weightage.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors duration-200">
                    <span className="text-xl text-indigo-400 select-none pt-0.5">💡</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">AI Teaching Lessons</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Get customized tutoring explanations instantly when a question is answered incorrectly.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors duration-200">
                    <span className="text-xl text-amber-400 select-none pt-0.5">🔄</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Concept Reinforcement</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Identifies mistakes and injects specialized review sessions to lock in key concepts.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors duration-200">
                    <span className="text-xl text-rose-400 select-none pt-0.5">⏱</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Official Exam Simulation</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Timed formats aligned exactly to CompTIA SY0-701 guidelines and domain distributions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CompTIA Security+ SY0-701 Prep. Made with premium developer aesthetics.
        </footer>
      </div>
    </div>
  )
}
