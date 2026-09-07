'use client';

import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Search, Hash, User, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

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
                    <span>BYU CS Resume Review Guide</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-[#002E5D] mb-4 tracking-tight">
                    How Resume Analyzer Reviews Your Resume
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    This tool reviews your resume in 5 simple steps to make sure it is clear, easy to read, and highlights your technical skills effectively.
                </p>
            </div>

            {/* Sticky Section Navigation Bar */}
            <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-y border-slate-200 shadow-sm py-3 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto text-xs font-bold text-slate-600">
                    <a href="#five-part-review" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-blue-600" />
                        <span>1. 5 Resume Checks</span>
                    </a>
                    <a href="#overall-score" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-indigo-600" />
                        <span>2. Resume Score</span>
                    </a>
                    <a href="#resume-emphasis" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        <span>3. Role Focus</span>
                    </a>
                    <a href="#optimized-version" className="px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>4. Rewritten Draft</span>
                    </a>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

                {/* Section 1: 5 Resume Checks */}
                <section id="five-part-review" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Part 1</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">The 5 Resume Checks</h2>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Your resume is checked across 5 key areas to make sure it covers what technical recruiters look for:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Layer 1 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    20% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Check 1</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Formatting &amp; Readability</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Checks that resume scanners and recruiters can easily read your file, with clear contact info, working GitHub links, and a clean layout.
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Clean, single-column layout</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Working links to LinkedIn and GitHub</span>
                                </li>
                            </ul>
                        </div>

                        {/* Layer 2 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                                    15% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Check 2</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Technical Skills &amp; Tools</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Checks that your programming languages, frameworks, databases, and tools are clearly listed and easy to find.
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Skills grouped by category (Languages, Frameworks, DBs)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Focused on technical tools without soft-skill buzzwords</span>
                                </li>
                            </ul>
                        </div>

                        {/* Layer 3 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    25% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Check 3</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Action Bullet Points &amp; Results</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Looks for strong action verbs and specific results (numbers, percentages, scale) to show what you built and accomplished.
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Action verbs (Built, Engineered, Scaled, Automated)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Numbers and metrics that show real outcomes</span>
                                </li>
                            </ul>
                        </div>

                        {/* Layer 4 */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                    25% Weight
                                </span>
                                <span className="text-xs font-bold text-slate-400">Check 4</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Clear Role Focus</h3>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Makes sure your experience and projects point toward a clear focus area (like Backend, Full-Stack, or Systems Engineering).
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Clear primary focus area (e.g., Backend Engineer)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Projects that support your main target role</span>
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
                            <span className="text-xs font-bold text-slate-400">Check 5</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">5. Side Projects &amp; Initiative</h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                            Highlights personal side projects and problem-solving beyond required classwork to show curiosity and initiative.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Personal or unassigned side projects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Explanations of why you chose specific tools</span>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200" />

                {/* Section 2: Overall Score */}
                <section id="overall-score" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                            <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Part 2</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">Your Resume Score (0–100)</h2>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Your score measures how complete and clear your resume is across all 5 checks:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-sm">
                            <span className="text-2xl font-black text-emerald-700 block mb-1">90 – 100</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block mb-3">
                                Strong Resume
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Ready to Apply</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Clean formatting, action-driven bullet points, clear technical focus, and organized skills.
                            </p>
                        </div>

                        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-sm">
                            <span className="text-2xl font-black text-amber-700 block mb-1">75 – 89</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 inline-block mb-3">
                                Moderate
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Needs Minor Adjustments</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Good foundation, but needs more numbers, clearer bullet points, or better skill organization.
                            </p>
                        </div>

                        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-sm">
                            <span className="text-2xl font-black text-rose-700 block mb-1">&lt; 75</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 inline-block mb-3">
                                Needs Work
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Needs Major Overhaul</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Focuses too much on course lists or generic task descriptions instead of concrete project results.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200" />

                {/* Section 3: Role Focus */}
                <section id="resume-emphasis" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Part 3</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">Primary Role Focus</h2>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-md">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">Clear Technical Identity</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            Recruiters like to see what area of software engineering you specialize in (such as Full-Stack, Backend, or Systems Engineering). This section highlights the main technical focus of your projects and skills.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-bold text-[#002E5D] block mb-1">Detected Specialty</span>
                                <p className="text-slate-600">Identifies your main engineering focus based on your technical projects and skills.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-bold text-[#002E5D] block mb-1">Focus Clarity</span>
                                <p className="text-slate-600">Measures how consistently your projects and bullet points support your main target role.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200" />

                {/* Section 4: Rewritten Version */}
                <section id="optimized-version" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Part 4</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#002E5D]">Rewritten Resume Draft</h2>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Along with your review, the tool generates an updated draft of your resume formatted according to BYU CS guidelines:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">1. Clean Header &amp; Layout</span>
                                <p className="text-slate-600">Organizes contact info and section headers into a clean, standard layout: Education, Skills, Experience, Projects.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">2. Action-First Bullet Points</span>
                                <p className="text-slate-600">Rewrites bullet points to start with strong action verbs (Built, Engineered, Optimized).</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">3. Metric Placeholders [X]</span>
                                <p className="text-slate-600">Adds `[X]` placeholders (like `[X]% latency reduction`) so you can easily fill in your project numbers.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Call to Action */}
                <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center shadow-lg">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#002E5D] mb-3">
                        Ready to Review Your Resume?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed">
                        Upload your PDF resume to receive your 5-part review, score, and rewritten draft in seconds.
                    </p>
                    <Link
                        href="/#upload-zone"
                        className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-[#0047BA] hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
                    >
                        <span>Review Your Resume Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
