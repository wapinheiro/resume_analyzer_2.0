'use client';

import React from 'react';

interface Layer {
    number: number;
    title: string;
    weight: string;
    badgeColor: string;
    summary: string;
    checklist: string[];
}

const LAYERS: Layer[] = [
    {
        number: 1,
        title: "Formatting & Readability",
        weight: "20% Weight",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        summary: "Checks that resume scanners and recruiters can easily read your file, with clear contact info and a clean layout.",
        checklist: [
            "Clean, single-column layout",
            "Clickable LinkedIn & GitHub links",
            "Clear section headers & typography"
        ]
    },
    {
        number: 2,
        title: "Technical Skills & Tools",
        weight: "15% Weight",
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
        summary: "Checks that your programming languages, frameworks, databases, and tools are clearly listed and easy to find.",
        checklist: [
            "Skills grouped by category (Languages, Frameworks, DBs)",
            "Focused on core engineering skills",
            "No soft-skill filler words"
        ]
    },
    {
        number: 3,
        title: "Action Bullets & Results",
        weight: "25% Weight",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        summary: "Looks for strong action verbs and specific results (numbers, percentages, scale) to show what you built and accomplished.",
        checklist: [
            "Action verbs (Built, Engineered, Scaled, Automated)",
            "Numbers and metrics showing real results",
            "Clear outcomes for each project or role"
        ]
    },
    {
        number: 4,
        title: "Clear Role Focus",
        weight: "25% Weight",
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        summary: "Makes sure your experience and projects point toward a clear focus area (like Backend, Full-Stack, or Systems Engineering).",
        checklist: [
            "Clear primary focus area (e.g., Backend Engineer)",
            "Projects that support your main target role",
            "Eliminates off-target or irrelevant distractions"
        ]
    },
    {
        number: 5,
        title: "Projects & Initiative",
        weight: "15% Weight",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        summary: "Highlights personal side projects and problem-solving beyond required classwork to show curiosity and initiative.",
        checklist: [
            "Personal or unassigned side projects",
            "Explanations of why you chose specific tools",
            "Demonstrates technical curiosity"
        ]
    }
];

export function FrameworkGrid() {
    return (
        <section className="w-full max-w-6xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#002E5D] text-xs font-semibold uppercase tracking-wider mb-4">
                    BYU CS Resume Review Guide
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#002E5D] mb-4">
                    The 5 Resume Checks
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-base">
                    Your resume is checked across 5 key areas to make sure it covers what technical recruiters look for.
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
                                {layer.number}. {layer.title}
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
                        Instant Resume Review
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        Get clear feedback and suggested rewrites to turn simple bullet points into strong technical accomplishments.
                    </p>
                    <a
                        href="#upload-zone"
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#0047BA] hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
                    >
                        Review Your Resume Now
                    </a>
                </div>
            </div>
        </section>
    );
}
