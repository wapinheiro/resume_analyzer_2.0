'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Shared inline bold parser — applies to all block types
function renderInline(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : part
    );
}

// Markdown renderer with full inline bold support
function MarkdownViewer({ content }: { content: string }) {
    if (!content) return <div className="text-gray-500 italic">No optimized content available yet.</div>;

    const lines = content.split('\n');
    return (
        <div className="prose prose-invert max-w-none text-black font-sans">
            {lines.map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 uppercase tracking-wider border-b-2 border-black pb-2">{renderInline(line.replace(/^# /, ''))}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-3 mt-6 uppercase border-b border-gray-300">{renderInline(line.replace(/^## /, ''))}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mb-2 mt-4">{renderInline(line.replace(/^### /, ''))}</h3>;
                if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-5 mb-1 list-disc">{renderInline(line.substring(2))}</li>;
                if (line.trim() === '') return <br key={i} />;
                return (
                    <p key={i} className="mb-2 leading-relaxed">
                        {renderInline(line)}
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
                        <Link href="/analysis" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium">
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-bold">What Your Resume Could Look Like</h1>
                    </div>

                    <div className="flex gap-4">
                        <button
                            disabled
                            title="PDF download coming soon"
                            className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 cursor-not-allowed opacity-60"
                        >
                            Download (Coming Soon)
                        </button>
                    </div>
                </div>

                {/* Split View */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">

                    {/* Left: Original (Text focus) */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-4">
                            <span className="text-[#6E7CA0] font-medium">Key Findings</span>
                            <span className="text-red-400 font-mono text-sm">Score: {data?.rms_score || 0}</span>
                        </div>
                        <div className="glass-panel p-8 rounded-2xl flex-1 overflow-auto max-h-[800px]">
                            <h3 className="text-red-400 font-bold mb-4 uppercase tracking-widest text-xs">Critical Risks to Mitigate</h3>
                            <ul className="space-y-4">
                                {(data?.top_risks || data?.raw_json?.top_risks || []).map((risk: any, i: number) => (
                                    <li key={i} className="border-l-2 border-red-500/30 pl-4 py-1">
                                        <p className="text-[#002E5D] font-semibold text-sm">{risk.risk}</p>
                                        <p className="text-[#6E7CA0] text-xs mt-1">{risk.reason}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-[#6E7CA0] text-sm leading-relaxed">
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
                                onClick={() => {
                                    const raw = data?.revised_resume_text || data?.raw_json?.revised_resume_text || '';
                                    const plain = raw.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^#{1,3} /gm, '').replace(/^[-*] /gm, '• ');
                                    navigator.clipboard.writeText(plain);
                                }}
                                className="text-emerald-500 hover:text-emerald-400 text-xs font-mono transition-colors"
                            >
                                [COPY AS PLAIN TEXT]
                            </button>
                        </div>
                        {/* Disclaimer Banner */}
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3 mb-2 flex items-start gap-3">
                            <span className="text-amber-400 text-lg mt-0.5">⚠️</span>
                            <p className="text-amber-700 text-xs leading-relaxed">
                                <strong>AI-generated illustration.</strong> This is not your actual resume. Content in brackets (e.g., <code>[X]%</code>) is estimated or example data. Use this as a structural guide — do not submit as-is.
                            </p>
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
