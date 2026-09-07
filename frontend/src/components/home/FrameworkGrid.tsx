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
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
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
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
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
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
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
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#002E5D] text-xs font-semibold uppercase tracking-wider mb-4">
                    Research-Backed Evaluation
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#002E5D] mb-4">
                    The 5-Layered Analysis Framework
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-base">
                    Every resume is systematically audited through 5 sequential layers to eliminate recruiter risk and maximize hireability.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LAYERS.map((layer) => (
                    <div
                        key={layer.number}
                        className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 shadow-md flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-end mb-4">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${layer.badgeColor}`}>
                                    {layer.weight}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0047BA] transition-colors">
                                Layer {layer.number}: {layer.title}
                            </h3>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                {layer.summary}
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-4 mt-auto">
                            <ul className="space-y-2">
                                {layer.checklist.map((item, idx) => (
                                    <li key={idx} className="flex items-start text-xs text-slate-700 gap-2">
                                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex flex-col justify-center text-center items-center shadow-md">
                    <h3 className="text-xl font-bold text-[#002E5D] mb-2">
                        Instant 6-Second Audit
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        Get clear, actionable before &amp; after rewrites that turn weak bullet points into market-ready evidence.
                    </p>
                    <a
                        href="#upload-zone"
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#0047BA] hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
                    >
                        Audit Your Resume Now
                    </a>
                </div>
            </div>
        </section>
    );
}
