'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Simple Markdown-ish renderer to keep it dependency-free
function MarkdownViewer({ content }: { content: string }) {
    if (!content) return <div className="text-gray-500 italic">No optimized content available yet.</div>;

    const lines = content.split('\n');
    return (
        <div className="prose prose-invert max-w-none text-black font-sans">
            {lines.map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 uppercase tracking-wider border-b-2 border-black pb-2">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-3 mt-6 uppercase border-b border-gray-300">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mb-2 mt-4">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-5 mb-1 list-disc">{line.substring(2)}</li>;
                if (line.trim() === '') return <br key={i} />;

                // Simple bold parsing
                const parts = line.split(/(\*\*.*?\*\*)/);
                return (
                    <p key={i} className="mb-2 leading-relaxed">
                        {parts.map((part, j) =>
                            part.startsWith('**') && part.endsWith('**')
                                ? <strong key={j}>{part.slice(2, -2)}</strong>
                                : part
                        )}
                    </p>
                );
            })}
        </div>
    );
}

export default function OptimizePage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('analysisResult');
        if (stored) {
            setData(JSON.parse(stored));
        }
    }, []);

    // Helper to get safe values
    const candidateName = data?.candidate_name || data?.raw_json?.candidate_name;
    const candidateEmail = data?.candidate_email || data?.raw_json?.candidate_email;
    const cpi = data?.cpi || data?.raw_json?.cpi;

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/analysis" className="text-gray-400 hover:text-white transition-colors">
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-bold">The Vision</h1>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-surface hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700">
                            Copy All Changes
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                            Download Optimized PDF
                        </button>
                    </div>
                </div>

                {/* Split View */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">

                    {/* Left: Original (Text focus) */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-4">
                            <span className="text-gray-400 font-medium">Key Findings</span>
                            <span className="text-red-400 font-mono text-sm">Score: {data?.rms_score || 0}</span>
                        </div>
                        <div className="glass-panel p-8 rounded-2xl flex-1 overflow-auto max-h-[800px]">
                            <h3 className="text-red-400 font-bold mb-4 uppercase tracking-widest text-xs">Critical Risks to Mitigate</h3>
                            <ul className="space-y-4">
                                {(data?.top_risks || data?.raw_json?.top_risks || []).map((risk: any, i: number) => (
                                    <li key={i} className="border-l-2 border-red-500/30 pl-4 py-1">
                                        <p className="text-white font-semibold text-sm">{risk.risk}</p>
                                        <p className="text-gray-500 text-xs mt-1">{risk.reason}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    The optimized version on the right transforms these risks into high-signal engineering outcomes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Optimized (Text version) */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-4">
                            <span className="text-emerald-400 font-medium flex items-center gap-2">
                                ✨ Optimized Version (RMS 95+)
                            </span>
                            <button
                                onClick={() => navigator.clipboard.writeText(data?.revised_resume_text || data?.raw_json?.revised_resume_text || '')}
                                className="text-emerald-500 hover:text-emerald-400 text-xs font-mono transition-colors"
                            >
                                [COPY MARKDOWN]
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-2xl p-10 overflow-auto max-h-[800px] ring-4 ring-emerald-500/20 shadow-emerald-500/20">
                            <MarkdownViewer content={data?.revised_resume_text || data?.raw_json?.revised_resume_text} />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
