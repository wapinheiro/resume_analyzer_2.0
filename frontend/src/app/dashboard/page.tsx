'use client';

import { Navbar } from '@/components/ui/Navbar';
import { MOCK_ANALYSIS } from '@/data/mock';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

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
                    className="text-gray-200"
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
                <div className="flex items-center gap-1 group relative">
                    <span className="text-sm text-[#6E7CA0]">RMS</span>
                    <button className="text-gray-500 hover:text-gray-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-[#002E5D] text-xs text-white rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-[#001f42]">
                        Resume Marketability Score: A quantitative measure of how well your resume mitigates hiring risks for a specific role.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [data, setData] = useState<any>(null); 
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        // 1. Load current result from local storage (immediate feedback after scan)
        const stored = localStorage.getItem('analysisResult');
        if (stored) {
            setData(JSON.parse(stored));
        }

        // 2. Fetch history from backend
        const fetchHistory = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                const token = (session as any)?.accessToken;
                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`${API_URL}/users/me/analyses`, { headers });
                if (res.ok) {
                    const result = await res.json();
                    setHistory(result);
                    
                    // If no local data, use the latest from history
                    if (!stored && result.length > 0) {
                        setData(result[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch scan history", error);
            }
        };

        if (status === 'authenticated') {
            fetchHistory();
        } else if (status === 'unauthenticated' && !stored) {
            setData(MOCK_ANALYSIS);
        }
    }, [session, status]);

    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-gray-700">Loading...</div>;

    const score = data.rms_score || data.rms || 0;
    const identityTitle = data.cpi || data.identity?.title || "Unknown";
    const candidateName = data.candidate_name || data.raw_json?.candidate_name || null;
    const confidence = data.confidence_score || 85; 

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    {candidateName ? `Welcome back, ${candidateName.split(' ')[0]}` : 'Student Dashboard'}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Main Score Card */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                        <h2 className="text-lg font-semibold mb-6 text-[#6E7CA0]">Latest Marketability Score</h2>
                        <ScoreGauge score={score} />
                        <div className="mt-6">
                            <p className="text-[#6E7CA0] max-w-sm mx-auto">
                                You are in the <span className="text-[#002E5D] font-semibold">top {score > 80 ? '10%' : '40%'}</span>.
                                Fix critical errors to improve your hiring signal.
                            </p>
                            <Link
                                href={data.id ? `/analysis/${data.id}` : "/analysis"}
                                className="mt-6 inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                            >
                                View Full Report
                            </Link>
                        </div>
                    </div>

                    {/* Identity & History */}
                    <div className="space-y-6">
                        <div className="glass-panel p-8 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2 group relative">
                                <h3 className="text-base font-medium text-[#6E7CA0] mb-2">Detected Identity</h3>
                                <button className="text-[#6E7CA0] hover:text-[#002E5D]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-full mb-2 left-0 w-64 p-3 bg-[#002E5D] text-xs text-white rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-[#001f42]">
                                    CPI: The professional role a recruiter will categorize you in under 6 seconds.
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-[#002E5D]">{identityTitle}</span>
                                <span className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                                    {confidence}% Match
                                </span>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-2xl">
                            <h3 className="text-base font-medium text-[#6E7CA0] mb-4">Past Scans</h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {history.length > 0 ? history.map((scan) => (
                                    <div key={scan.id} className="flex items-center gap-2 w-full group">
                                        <Link 
                                            href={`/analysis/${scan.id}`}
                                            className="flex-1 flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[#002E5D] font-semibold text-sm">{scan.cpi || "General Analysis"}</span>
                                                <span className="text-xs text-[#6E7CA0]">{format(new Date(scan.created_at), 'MMM d, yyyy')}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold ${scan.rms_score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {scan.rms_score}
                                                </span>
                                                <span className="text-slate-300 group-hover/link:text-blue-500 transition-colors">→</span>
                                            </div>
                                        </Link>
                                        
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                                                    const token = (session as any)?.accessToken;
                                                    const headers: HeadersInit = {};
                                                    if (token) headers['Authorization'] = `Bearer ${token}`;
                                                    
                                                    const res = await fetch(`${API_URL}/analyze/${scan.id}/resume`, { headers });
                                                    if (res.ok) {
                                                        const blob = await res.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        window.open(url, '_blank');
                                                    }
                                                } catch (err) {
                                                    console.error("Error opening resume:", err);
                                                }
                                            }}
                                            className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                            title="View Original PDF"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-[#6E7CA0] italic">No previous scans found.</p>
                                        <Link href="/" className="text-xs text-blue-600 font-bold mt-2 inline-block">Upload your first resume</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
