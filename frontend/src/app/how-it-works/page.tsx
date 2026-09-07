'use client';

import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Search, Hash, User, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, FileText, Zap, Award, Target } from 'lucide-react';

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />

            {/* Header Hero */}
            <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto text-center">
                <Link
                    href="/"
                    className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0047BA] mb-6 transition-colors gap-1.5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Resume Upload
                </Link>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#002E5D] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>BYU Computer Science Evaluation Rubric</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-[#002E5D] mb-4 tracking-tight">
                    How Resume Analyzer Evaluates Your Resume
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Built for BYU Computer Science students, this tool audits your resume using 5 structured review layers, quantitative root-mean-square (RMS) risk scoring, and technical resume standards.
                </p>
            </div>

            {/* Sticky Section Navigation Bar */}
            <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-y border-slate-200 shadow-sm py-3 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto text-xs font-bold text-slate-600">
                    <a href="#five-part-review" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-blue-600" />
                        <span>1. 5-Part Review</span>
                    </a>
                    <a href="#overall-score" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-indigo-600" />
                        <span>2. Overall Score (RMS)</span>
                    </a>
                    <a href="#resume-emphasis" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        <span>3. Specialist Identity</span>
                    </a>
                    <a href="#optimized-version" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>4. Optimized Version</span>
                    </a>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

                {/* Section 1: 5-Part Review */}
                <section id="five-part-review" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Deliverable #1</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">A 5-Part Sequential Layer Audit</h2>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Resumes are evaluated through a structured 5-step review process. The evaluation pipeline follows this systematic rubric:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Layer 1 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    20% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Step 1</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Layer 1: Foundation (ATS Integrity)</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Audits machine readability, ATS parser compatibility, single-column reverse-chronological flow, digital footprint links (LinkedIn, GitHub), and typography.
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Single-column, standard ATS section flow</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Verified hyperlinks to GitHub repositories</span>
                                </li>
                            </ul>
                        </div>

                        {/* Layer 2 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                                    15% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Step 2</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Layer 2: Core Spec (Technical Readiness)</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Evaluates technical skill categories (Languages, Frameworks, Cloud, Databases) against standard CS domain expectations, flagging missing technical skills.
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Categorized tech stack (Python, React, Docker, SQL)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Elimination of soft-skill fillers & legacy fluff</span>
                                </li>
                            </ul>
                        </div>

                        {/* Layer 3 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    25% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Step 3</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Layer 3: Impact (CAR Formula & Metrics)</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Scans bullet points for the Challenge-Action-Result (CAR) formula and hard metrics (percentages, request scale, latency, user counts).
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Strong active verbs (Architected, Engineered, Scaled)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>3+ quantifiable engineering metrics per experience role</span>
                                </li>
                            </ul>
                        </div>

                        {/* Layer 4 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                    25% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Step 4</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Layer 4: Storyline (Narrative Signal)</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Evaluates how clearly your candidate profile communicates a specific technical specialization (e.g. Backend, Systems, Full-Stack).
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Instant role categorization (e.g., Full-Stack Engineer)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Cohesive project focus matching target specialization</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Layer 5 Full Width */}
                    <div className="mt-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                15% Weight
                            </span>
                            <span className="text-xs font-bold text-slate-400">Step 5</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Layer 5: The X-Factor (Agency &amp; Architectural Growth)</h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                            Looks beyond basic coursework for unassigned personal projects built out of technical curiosity, system trade-off reasoning, and engineering agency.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Self-directed unassigned projects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Explicit engineering trade-offs (Why X over Y)</span>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200" />

                {/* Section 2: Overall Score (RMS) */}
                <section id="overall-score" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                            <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Deliverable #2</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">Quantitative Risk-Mitigation Score (RMS)</h2>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Recruiters hire to <strong>minimize risk</strong>. Your RMS Score (0–100) measures how effectively your resume mitigates Competence, Cultural, and Retention risk in front of engineering hiring managers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-sm">
                            <span className="text-2xl font-black text-emerald-700 block mb-1">90 – 100</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block mb-3">
                                Low Hiring Risk
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Market Ready Engineer</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Flawless ATS compliance, 100% CAR formula bullets, clear specialist narrative, and categorized technical stack.
                            </p>
                        </div>

                        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-sm">
                            <span className="text-2xl font-black text-amber-700 block mb-1">75 – 89</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 inline-block mb-3">
                                Moderate Risk
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">The Tourist Profile</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Solid technical foundation, but narrative lacks focus, bullet points miss hard impact metrics, or tech stack skills are unorganized.
                            </p>
                        </div>

                        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-sm">
                            <span className="text-2xl font-black text-rose-700 block mb-1">&lt; 75</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 inline-block mb-3">
                                High Risk
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">The Student Profile</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Heavy focus on coursework or generic duties rather than concrete engineering outcomes. Requires structural bullet &amp; formatting overhaul.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200" />

                {/* Section 3: What Your Resume Emphasizes (CPI) */}
                <section id="resume-emphasis" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Deliverable #3</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">Specialist Identity &amp; Emphasis Signal (CPI)</h2>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-md">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">The 6-Second Recruiter Label</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            When a recruiter opens your resume, they spend 6 seconds attempting to place you into a single specific bucket (e.g., <em>Full-Stack Software Engineer</em>, <em>Systems Engineer</em>, <em>Data Infrastructure Engineer</em>). If your resume tries to be everything at once, it gets passed over.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-bold text-[#002E5D] block mb-1">Candidate Performance Index (CPI)</span>
                                <p className="text-slate-600">Determines the primary specialist identity your experience project history communicates to recruiters.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-bold text-[#002E5D] block mb-1">Signal Confidence Score</span>
                                <p className="text-slate-600">Measures the statistical clarity (0-100%) of your specialist narrative across technical projects and bullet points.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200" />

                {/* Section 4: Optimized Version */}
                <section id="optimized-version" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Deliverable #4</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">BYU Golden Template Optimized Resume</h2>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Alongside your audit, the engine generates a fully rewritten version of your resume strictly complying with the <strong>BYU CS Golden Template Standard</strong>:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">1. Strict Header &amp; Section Flow</span>
                                <p className="text-slate-600">Consolidates contact rows and formats section titles in clean, uppercase ATS-friendly hierarchy: Executive Summary, Education, Skills, Experience.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">2. CAR Bullet Rewrites</span>
                                <p className="text-slate-600">Replaces passive verb openings (&quot;Worked on&quot;) with technical action verbs (*Architected, *Engineered, *Optimized) and Challenge-Action-Result structure.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">3. Metric Placeholders [X]</span>
                                <p className="text-slate-600">Wraps estimated metrics in clear `[X]` brackets (e.g. `[X]% latency reduction`) so you can fill in your exact figures before submitting.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Call to Action */}
                <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center shadow-lg">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#002E5D] mb-3">
                        Ready to Audit Your Resume?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed">
                        Upload your PDF resume to receive your 5-part audit, RMS marketability score, and optimized BYU template in seconds.
                    </p>
                    <Link
                        href="/#upload-zone"
                        className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-[#0047BA] hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
                    >
                        <span>Audit Your Resume Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
