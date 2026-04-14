'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

export default function AdvisorStudentView() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [analyses, setAnalyses] = useState<any[]>([]);
    const [studentProfile, setStudentProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeLayer, setActiveLayer] = useState('format');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchAnalyses = async () => {
            if (!params?.id) return;

            try {
                setLoading(true);
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                const token = (session as any)?.accessToken;
                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`${API_URL}/advisors/students/${params.id}/analyses`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    setAnalyses(data);
                    
                    // Also get student info from the first analysis or another endpoint
                    // Let's assume we can at least get name/email from the first analysis' resume user
                    // or just use the first analysis if we had the user object included.
                    // Actually, let's fetch basic user info if we had an endpoint.
                    // For now, let's just use the metadata from the analysis if available.
                }
            } catch (error) {
                console.error("Failed to fetch student analyses", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchAnalyses();
        }
    }, [params?.id, status]);

    if (loading || status === 'loading') {
        return <div className="min-h-screen bg-background flex items-center justify-center text-gray-700">Loading student data...</div>;
    }

    if (analyses.length === 0) {
        return (
            <main className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 pt-24 pb-12 px-6 max-w-4xl mx-auto w-full text-center">
                    <Link href="/advisor/dashboard" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium block mb-8 text-left">
                        ← Back to Roster
                    </Link>
                    <h1 className="text-3xl font-bold mb-4">No Scans Found</h1>
                    <p className="text-[#6E7CA0]">This student has not analyzed any resumes yet.</p>
                </div>
            </main>
        );
    }

    // Use the most recent analysis for display
    const data = analyses[0];
    const layers = data.raw_json?.layers || {};

    const layerList = Object.entries(layers).map(([key, value]: [string, any]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: value.score,
        status: value.status,
        issues: value.issues || []
    }));

    const activeLayerData = layerList.find(l => l.id === activeLayer) || layerList[0] || { name: 'Unknown', status: 'unknown', issues: [] };
    const topRisks = data.top_risks || data.raw_json?.top_risks || [];
    const cpi = data.cpi || data.raw_json?.cpi || "Unknown";
    const score = data.rms_score || 0;

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/advisor/dashboard" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium px-4 py-2 bg-blue-50 rounded-lg">
                            ← Back to Roster
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-[#002E5D]">{analyses[0]?.resume?.user?.name || "Student Analysis Result"}</h1>
                            {analyses[0]?.resume?.user?.major && (
                                <p className="text-sm text-[#6E7CA0] font-medium mt-1">
                                    {analyses[0]?.resume?.user?.major} • Class of {analyses[0]?.resume?.user?.graduation_year}
                                </p>
                            )}
                        </div>
                        
                        <button
                            onClick={async () => {
                                try {
                                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                                    const token = (session as any)?.accessToken;
                                    const headers: HeadersInit = {};
                                    if (token) headers['Authorization'] = `Bearer ${token}`;
                                    
                                    const res = await fetch(`${API_URL}/analyze/${data.id}/resume`, { headers });
                                    if (res.ok) {
                                        const blob = await res.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        window.open(url, '_blank');
                                    } else {
                                        alert("Failed to fetch resume. Please try again.");
                                    }
                                } catch (err) {
                                    console.error("Error opening resume:", err);
                                }
                            }}
                            className="inline-flex items-center justify-center px-6 py-2 bg-[#0047BA] text-white font-bold rounded-lg hover:bg-[#002E5D] transition-all shadow-sm text-sm"
                        >
                            View Original PDF
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-[#6E7CA0] font-medium">Scan Date</p>
                        <p className="font-semibold text-[#002E5D]">{format(new Date(data.created_at), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                </div>

                {/* Global Stats: CPI & Top Risks */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-2xl lg:col-span-1 border-emerald-500/20 shadow-sm border">
                        <h3 className="text-xs font-bold text-[#6E7CA0] uppercase tracking-wider mb-2">RMS Score</h3>
                        <p className="text-4xl font-bold text-emerald-600 mb-2">{score}</p>
                        <p className="text-sm text-[#6E7CA0]">Marketability Score</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl lg:col-span-1 shadow-sm border border-gray-100">
                        <h3 className="text-xs font-bold text-[#6E7CA0] uppercase tracking-wider mb-2">The &quot;6-Second Label&quot;</h3>
                        <p className="text-xl font-bold text-[#002E5D] mb-2">{cpi}</p>
                        <p className="text-sm text-[#6E7CA0]">Career Profile Identity</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl lg:col-span-2 shadow-sm border border-gray-100">
                        <h3 className="text-xs font-bold text-[#6E7CA0] uppercase tracking-wider mb-4">Top Hiring Risks</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {topRisks.length > 0 ? topRisks.slice(0, 2).map((risk: any, i: number) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-red-500 font-bold text-sm truncate">#{(i + 1)} {risk.risk}</p>
                                    <p className="text-xs text-[#6E7CA0] line-clamp-2">{risk.reason}</p>
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
                        {layerList.length > 0 ? layerList.map((layer) => (
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
                        )) : (
                            <p className="text-sm text-gray-500">No layer data available for this scan.</p>
                        )}
                    </div>

                    {/* Main Content: Active Layer Details */}
                    {layerList.length > 0 && (
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

                            {/* Fixes / Issues */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-[#6E7CA0] uppercase tracking-widest">Identified Issues</h4>
                                {activeLayerData.issues.length === 0 ? (
                                    <div className="glass-panel p-8 rounded-2xl border-emerald-500/20 text-center shadow-sm">
                                        <p className="text-emerald-600 font-medium">Layer is optimized. No critical fixes required.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                        {activeLayerData.issues.map((issue: any, idx: number) => (
                                            <div key={idx} className="glass-panel p-6 rounded-2xl border border-gray-200 flex flex-col shadow-sm bg-white dark:bg-gray-800/80">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest">
                                                        {issue.type || 'Fix'}
                                                    </span>
                                                </div>
                                                <p className="text-[#002E5D] dark:text-gray-200 text-sm mb-6 flex-1">
                                                    {issue.reason || issue.description || "Issue detail not provided."}
                                                </p>
                                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                                    <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1 tracking-widest">Action Recommended</p>
                                                    <p className="text-sm text-emerald-800 font-medium">
                                                        {issue.fix}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
