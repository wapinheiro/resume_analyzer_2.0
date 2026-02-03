'use client';

import { Navbar } from '@/components/ui/Navbar';
import { ResumePreview } from '@/components/ui/ResumePreview';
import { MOCK_ANALYSIS } from '@/data/mock';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AnalysisPage() {
    const { layers } = MOCK_ANALYSIS;
    const [activeLayer, setActiveLayer] = useState('impact');

    const layerList = Object.values(layers);
    const activeLayerData = layerList.find(l => l.id === activeLayer) || layers.format;

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex pt-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">

                {/* Sidebar: Layers */}
                <div className="w-64 flex-shrink-0 pt-8 pr-8 border-r border-gray-800 hidden md:block">
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white mb-6 block">
                        ← Back to Dashboard
                    </Link>
                    <h2 className="text-lg font-bold mb-4">Analysis Layers</h2>
                    <div className="space-y-2">
                        {layerList.map((layer) => (
                            <button
                                key={layer.id}
                                onClick={() => setActiveLayer(layer.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${activeLayer === layer.id
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50'
                                    : 'text-gray-400 hover:bg-surface hover:text-white'
                                    }`}
                            >
                                <span>{layer.name}</span>
                                <span className={
                                    layer.score >= 8 ? 'text-emerald-500' :
                                        layer.score >= 5 ? 'text-amber-500' : 'text-red-500'
                                }>{layer.score}/10</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <Link
                            href="/optimize"
                            className="w-full block text-center bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                            Visualize Optimized Resume
                        </Link>
                    </div>
                </div>

                {/* Main Content: Split View */}
                <div className="flex-1 flex flex-col md:flex-row gap-8 pt-8">

                    {/* Middle: Resume Preview */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden opacity-95">
                            <ResumePreview />
                        </div>
                    </div>

                    {/* Right: Feedback Panel */}
                    <div className="w-80 flex-shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="text-blue-400">{activeLayerData.name}</span>
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                <span>Status:</span>
                                <span className={`uppercase font-bold ${activeLayerData.status === 'good' ? 'text-emerald-500' :
                                    activeLayerData.status === 'warning' ? 'text-amber-500' : 'text-red-500'
                                    }`}>{activeLayerData.status}</span>
                            </div>

                            {activeLayerData.issues.length === 0 ? (
                                <div className="glass-panel p-6 rounded-xl border-emerald-500/30">
                                    <p className="text-emerald-400">No issues found in this layer! Great job.</p>
                                </div>
                            ) : (
                                activeLayerData.issues.map((issue) => (
                                    <div key={issue.id} className="glass-panel p-5 rounded-xl border border-red-500/20 group hover:border-red-500/50 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded font-mono uppercase">
                                                {issue.type}
                                            </span>
                                            <span className="text-xs text-gray-500">{issue.impact} Impact</span>
                                        </div>
                                        <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                                            {issue.description}
                                        </p>
                                        <div className="bg-black/30 p-3 rounded-lg border-l-2 border-emerald-500">
                                            <p className="text-xs text-gray-500 mb-1">Suggestion:</p>
                                            <p className="text-sm text-emerald-100 font-medium">
                                                "{issue.fix}"
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
