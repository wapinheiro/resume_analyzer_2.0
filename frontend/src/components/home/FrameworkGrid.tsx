'use client';

import React from 'react';

interface Layer {
    number: number;
    title: string;
    weight: string;
    badgeColor: string;
    icon: string;
    summary: string;
    checklist: string[];
}

const LAYERS: Layer[] = [
    {
        number: 1,
        title: "Foundation (ATS Integrity)",
        weight: "20% Weight",
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        icon: "🛡️",
        summary: "Ensures your resume passes machine gatekeepers and initial recruiter scans without layout glitches.",
        checklist: [
            "Single-column, reverse-chronological layout",
            "Clickable LinkedIn & pinned GitHub links",
            "Clean contact info & standard typography"
        ]
    },
    {
        number: 2,
        title: "Core Spec (Technical Readiness)",
        weight: "15% Weight",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        icon: "⚡",
        summary: "Proves shelf-ready readiness for the 2026 software engineering market.",
        checklist: [
            "Skills categorized (Languages, Frameworks, Cloud, DBs)",
            "High-signal tech (AI/RAG, AWS, Docker, Pytest)",
            "Eliminates legacy noise & soft-skill fillers"
        ]
    },
    {
        number: 3,
        title: "Impact Layer (Tone & Metrics)",
        weight: "25% Weight",
        badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: "📈",
        summary: "Transforms bullets from 'duty descriptions' into quantified engineering accomplishments.",
        checklist: [
            "Challenge-Action-Result (CAR) bullet formula",
            "Strong active verbs (Engineered, Automated, Scaled)",
            "3+ hard metrics per role (%, $, scale, latency)"
        ]
    },
    {
        number: 4,
        title: "Storyline (Narrative Signal)",
        weight: "25% Weight",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        icon: "🎯",
        summary: "Establishes a crisp specialist identity in the recruiter's 6-second scan.",
        checklist: [
            "Instant 6-second label (e.g., Backend Engineer)",
            "Cohesive 'Red Thread' across projects & skills",
            "Eliminates off-target, high-cognitive-load noise"
        ]
    },
    {
        number: 5,
        title: "The X-Factor (Agency & Growth)",
        weight: "15% Weight",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: "🚀",
        summary: "Demonstrates high agency, technical trade-offs, and critical thinking.",
        checklist: [
            "Unassigned personal projects built out of curiosity",
            "Engineering reasoning & trade-off explanations",
            "Teaching, mentorship, and non-technical translation"
        ]
    }
];

export function FrameworkGrid() {
    return (
        <section className="w-full max-w-6xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                    Research-Backed Evaluation
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                    The 5-Layered Analysis Framework
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base">
                    Every resume is systematically audited through 5 sequential layers to eliminate recruiter risk and maximize hireability.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LAYERS.map((layer) => (
                    <div
                        key={layer.number}
                        className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl">{layer.icon}</span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${layer.badgeColor}`}>
                                    {layer.weight}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                Layer {layer.number}: {layer.title}
                            </h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                {layer.summary}
                            </p>
                        </div>

                        <div className="border-t border-slate-800/80 pt-4 mt-auto">
                            <ul className="space-y-2">
                                {layer.checklist.map((item, idx) => (
                                    <li key={idx} className="flex items-start text-xs text-slate-300 gap-2">
                                        <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6 flex flex-col justify-center text-center items-center shadow-xl">
                    <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-2xl mb-4 text-blue-400">
                        ⚡
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        Instant 6-Second Audit
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                        Get clear, actionable before &amp; after rewrites that turn weak bullet points into market-ready evidence.
                    </p>
                    <a
                        href="#upload-zone"
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/25"
                    >
                        Audit Your Resume Now
                    </a>
                </div>
            </div>
        </section>
    );
}
