'use client';

import { Navbar } from '@/components/ui/Navbar';
import { MOCK_ANALYSIS } from '@/data/mock';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AnalysisPage() {
    const [data, setData] = useState<any>(null);
    const [activeLayer, setActiveLayer] = useState('format');

    useEffect(() => {
        const stored = localStorage.getItem('analysisResult');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            setData(MOCK_ANALYSIS);
        }
    }, []);

    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-gray-700">Loading...</div>;

    const layers = data.raw_json?.layers || data.layers || MOCK_ANALYSIS.layers;

    // Convert to array and ensure ID property exists (backend might key it but not include id in value)
    const layerList = Object.entries(layers).map(([key, value]: [string, any]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: value.score,
        status: value.status,
        issues: value.issues || []
    }));

    const activeLayerData = layerList.find(l => l.id === activeLayer) || layerList[0];

    const topRisks = data.top_risks || data.raw_json?.top_risks || [];
    const cpi = data.cpi || data.raw_json?.cpi || "Unknown";

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium">
                        ← Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Detailed Analysis</h1>
                </div>

                {/* Global Stats: CPI & Top Risks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-2xl lg:col-span-1">
                        <h3 className="text-xs font-bold text-[#6E7CA0] uppercase tracking-wider mb-2">The &quot;6-Second Label&quot;</h3>
                        <p className="text-2xl font-bold text-[#002E5D] mb-2">{cpi}</p>
                        <p className="text-sm text-[#6E7CA0]">How a technical recruiter first categorizes you.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
                        <h3 className="text-xs font-bold text-[#6E7CA0] uppercase tracking-wider mb-4">Top 3 Hiring Risks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topRisks.length > 0 ? topRisks.map((risk: any, i: number) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-red-400 font-bold text-sm">#{(i + 1)} {risk.risk}</p>
                                    <p className="text-xs text-[#6E7CA0] leading-relaxed">{risk.reason}</p>
                                </div>
                            )) : (
                                <p className="text-[#6E7CA0] italic text-sm">No significant risks identified.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar: Layers */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                        <h2 className="text-lg font-bold mb-4">Analysis Layers</h2>
                        {layerList.map((layer) => (
                            <button
                                key={layer.id}
                                onClick={() => setActiveLayer(layer.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${activeLayer === layer.id
                                        ? 'bg-[#0047BA]/10 text-[#0047BA] border border-[#0047BA]/40'
                                        : 'text-[#6E7CA0] hover:bg-gray-100 hover:text-[#002E5D] border border-transparent'
                                    }`}
                            >
                                <span>{layer.name}</span>
                                <span className={
                                    layer.score >= 8 ? 'text-emerald-500' :
                                        layer.score >= 5 ? 'text-amber-500' : 'text-red-500'
                                }>{layer.score}/10</span>
                            </button>
                        ))}

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <Link
                                href="/optimize"
                                className="w-full block text-center bg-[#0047BA] hover:bg-[#002E5D] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                            >
                                View Suggested Rewrite
                            </Link>
                        </div>
                    </div>

                    {/* Main Content: Active Layer Details */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <span className="text-blue-400 font-mono">0{layerList.findIndex(l => l.id === activeLayer) + 1}</span>
                                <span>{activeLayerData.name} Analysis</span>
                            </h3>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${activeLayerData.status === 'good' ? 'bg-emerald-500/10 text-emerald-500' :
                                activeLayerData.status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                {activeLayerData.status}
                            </div>
                        </div>

                        {/* Referenced Text Snippet */}
                        <div className="glass-panel rounded-2xl overflow-hidden border border-gray-200">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-[#6E7CA0] uppercase tracking-widest">Referenced Text from Resume</span>
                                <span className="text-[10px] text-gray-400">SOURCE EXTRACT</span>
                            </div>
                            <div className="p-8">
                                <blockquote className="text-base text-[#002E5D] italic border-l-4 border-[#0047BA]/30 pl-6 py-2 leading-relaxed">
                                    &quot;{layers[activeLayer]?.referenced_text || "Analysis in progress or snippet not available."}&quot;
                                </blockquote>
                            </div>
                        </div>

                        {/* Fixes / Issues */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-[#6E7CA0] uppercase tracking-widest">Actionable Fixes</h4>
                            {activeLayerData.issues.length === 0 ? (
                                <div className="glass-panel p-8 rounded-2xl border-emerald-500/20 text-center">
                                    <p className="text-emerald-400">Layer is optimized. No critical fixes required.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {activeLayerData.issues.map((issue: any, idx: number) => (
                                        <div key={idx} className="glass-panel p-6 rounded-2xl border border-gray-200 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                                                    {issue.type || 'Fix'}
                                                </span>
                                            </div>
                                            <p className="text-[#002E5D] text-sm mb-6 flex-1">
                                                {issue.reason || issue.description || issue.fix}
                                            </p>
                                            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                                                <p className="text-[10px] text-emerald-500 uppercase font-bold mb-1 tracking-widest">Recommended Action</p>
                                                <p className="text-sm text-emerald-700 font-medium">
                                                    {issue.fix}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
