'use client';

import { Navbar } from '@/components/ui/Navbar';
import { MOCK_ANALYSIS } from '@/data/mock';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Simple Circular Score Component (Internal for now)
function ScoreGauge({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (score / 100) * circumference;

    let color = 'text-red-500';
    if (score >= 90) color = 'text-emerald-500';
    else if (score >= 70) color = 'text-amber-500';

    return (
        <div className="relative flex items-center justify-center">
            <svg className="transform -rotate-90 w-48 h-48">
                <circle
                    cx="96"
                    cy="96"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-800"
                />
                <circle
                    cx="96"
                    cy="96"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${color} transition-all duration-1000 ease-out`}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-5xl font-bold ${color}`}>{score}</span>
                <span className="text-sm text-gray-400">RMS</span>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState<any>(null); // Replace 'any' with your interface later

    useEffect(() => {
        // Hydrate from local storage
        const stored = localStorage.getItem('analysisResult');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            // Optional: fallback to mock if nothing found
            setData(MOCK_ANALYSIS);
        }
    }, []);

    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;

    // Normalize data (backend might use snake_case vs mock camelCase)
    // Backend returns: rms_score, cpi...
    const score = data.rms_score || data.rms || 0;
    const identityTitle = data.cpi || data.identity?.title || "Unknown";
    const confidence = 85; // Backend doesn't return confidence yet, hardcode for UI

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    {data.candidate_name ? `Analysis for ${data.candidate_name}` : 'Dashboard'}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Main Score Card */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                        <h2 className="text-xl font-semibold mb-6 text-gray-300">Resume Marketability Score</h2>
                        <ScoreGauge score={score} />
                        <div className="mt-6">
                            <p className="text-gray-400 max-w-sm mx-auto">
                                You are in the <span className="text-white font-semibold">top {score > 80 ? '10%' : '40%'}</span>.
                                Fix critical errors to improve.
                            </p>
                            <Link
                                href="/analysis"
                                className="mt-6 inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                            >
                                View Detailed Report
                            </Link>
                        </div>
                    </div>

                    {/* Identity & Quick Stats */}
                    <div className="space-y-6">
                        <div className="glass-panel p-8 rounded-2xl">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Identity Detected</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-white">{identityTitle}</span>
                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">
                                    {confidence}% Conf
                                </span>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-2xl">
                            <h3 className="text-lg font-medium text-gray-400 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white">Current Upload</span>
                                    <span className="text-emerald-400 font-mono">Score: {score}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
