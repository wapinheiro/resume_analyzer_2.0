'use client';

import React from 'react';

export function RMSBenchmarkTeaser() {
    return (
        <section className="w-full max-w-5xl mx-auto py-12 px-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-semibold text-[#002E5D] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                        Risk-Mitigation Score (RMS)
                    </span>
                    <h2 className="text-3xl font-bold text-[#002E5D] mt-3 mb-3">
                        Where Does Your Resume Benchmark?
                    </h2>
                    <p className="text-slate-600 text-sm">
                        Recruiters hire to minimize risk. Your RMS score (0-100) measures how effectively your resume mitigates Competence, Cultural, and Retention risk.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Market Ready */}
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl font-black text-emerald-700">90 - 100</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    Low Risk
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Market Ready Engineer</h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                Flawless ATS compliance, 100% CAR formula bullets, clear specialist narrative, and proven 2026 tech stack.
                            </p>
                        </div>
                        <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 pt-3 border-t border-emerald-200">
                            <span>✨ Instant Callback Potential</span>
                        </div>
                    </div>

                    {/* The Tourist */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl font-black text-amber-700">75 - 89</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    Moderate Risk
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">The Tourist Profile</h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                Good foundation, but unfocused narrative, generic project descriptions, and missing hard metrics.
                            </p>
                        </div>
                        <div className="text-xs text-amber-700 font-semibold flex items-center gap-1.5 pt-3 border-t border-amber-200">
                            <span>⚠️ Needs Quantification &amp; Focus</span>
                        </div>
                    </div>

                    {/* The Student */}
                    <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl font-black text-rose-700">&lt; 75</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    High Risk
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">The Student Profile</h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                Heavy focus on coursework/duties rather than outcomes, multi-column formatting issues, or outdated tech.
                            </p>
                        </div>
                        <div className="text-xs text-rose-700 font-semibold flex items-center gap-1.5 pt-3 border-t border-rose-200">
                            <span>🚨 Requires Structural Overhaul</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
