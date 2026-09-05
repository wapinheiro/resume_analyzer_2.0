'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Info, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const renderActionText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*[a-zA-Z0-9_-]+)/g);
    return parts.map((part, index) => {
        if (part.startsWith('*')) {
            return <span key={index} className="bg-amber-100 text-amber-800 font-bold px-1 rounded mx-0.5">{part.substring(1)}</span>;
        }
        return <span key={index}>{part}</span>;
    });
};

const LAYER_DESCRIPTIONS: Record<string, string> = {
    'format': 'Foundation: Analyzes ATS compatibility, reverse-chronological flow, and visual hierarchy.',
    'core': 'Core Spec: Evaluates high-signal skills (RAG, Vector DBs, Cloud Native) and flags legacy noise.',
    'impact': 'Impact: Checks bullet points for the CAR formula and hard, quantified metrics.',
    'story': 'Storyline: Identifies your specialist identity—the "6-Second Label" technical recruiters look for.',
    'xfactor': 'X-Factor: Searches for unassigned projects and evidence of engineering passion beyond coursework.',
};

export default function HistoricalAnalysisPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [data, setData] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!params?.id) return;

            try {
                setLoading(true);
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                const token = (session as any)?.accessToken;
                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                // Fetch Analysis
                const res = await fetch(`${API_URL}/analyze/${params.id}`, { headers });
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                    
                    // Fetch User Profile to check if we should show the banner
                    const userRes = await fetch(`${API_URL}/users/sync`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            email: session?.user?.email,
                            name: session?.user?.name,
                            avatar_url: session?.user?.image
                        })
                    });
                    
                    if (userRes.ok) {
                        const profile = await userRes.json();
                        setUserProfile(profile);
                        
                        // Show banner if profile is missing major OR grad year
                        // AND the analysis has extracted them
                        if ((!profile.major || !profile.graduation_year) && (result.major || result.predicted_grad_date)) {
                            setShowBanner(true);
                        }
                    }
                } else if (res.status === 403) {
                     router.push('/dashboard');
                }
            } catch (error) {
                console.error("Failed to fetch historical analysis", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchAnalysis();
        }
    }, [params?.id, status, session, router]);

    if (loading || status === 'loading') {
        return <div className="min-h-screen bg-background flex items-center justify-center text-gray-700">Loading analysis...</div>;
    }

    if (!data) {
        return (
            <main className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 pt-24 pb-12 px-6 max-w-4xl mx-auto w-full text-center">
                    <h1 className="text-3xl font-bold mb-4">Analysis Not Found</h1>
                    <Link href="/dashboard" className="text-[#0047BA] font-medium">Return to Dashboard</Link>
                </div>
            </main>
        );
    }

    const layers = data.raw_json?.layers || data.layers || {};
    const layerList = Object.entries(layers).map(([key, value]: [string, any]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: value.score,
        status: value.status,
        issues: value.issues || []
    }));

    const topRisks = data.top_risks || data.raw_json?.top_risks || [];
    const cpi = data.cpi || data.raw_json?.cpi || "Unknown";
    const confidenceScore = data.confidence_score ?? data.raw_json?.confidence_score;
    const confidenceReasoning = data.confidence_reasoning ?? data.raw_json?.confidence_reasoning ?? "Reasoning not provided.";

    const getSignalColor = (score: number) => {
        if (score >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (score >= 50) return "bg-amber-100 text-amber-700 border-amber-200";
        return "bg-red-100 text-red-700 border-red-200";
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
                {showBanner && (
                    <div className="mb-8 bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#002E5D]">Complete your Student Profile?</h3>
                                <p className="text-blue-700 font-medium">
                                    We detected you are a <span className="font-black underlineDecoration-blue-300">{data.major || 'Computer Science'}</span> student 
                                    graduating in <span className="font-black underline decoration-blue-300">{data.predicted_grad_date || '2026'}</span>.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={async () => {
                                    setConfirming(true);
                                    try {
                                        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                                        const token = (session as any)?.accessToken;
                                        const headers: HeadersInit = { 'Content-Type': 'application/json' };
                                        if (token) headers['Authorization'] = `Bearer ${token}`;
                                        
                                        // Attempt to parse year
                                        const yearMatch = data.predicted_grad_date?.match(/\d{4}/);
                                        const year = yearMatch ? parseInt(yearMatch[0]) : null;

                                        await fetch(`${API_URL}/users/me/profile`, {
                                            method: 'PATCH',
                                            headers,
                                            body: JSON.stringify({
                                                major: data.major,
                                                graduation_year: year
                                            })
                                        });
                                        setShowBanner(false);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setConfirming(false);
                                    }
                                }}
                                disabled={confirming}
                                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                            >
                                {confirming ? 'Saving...' : <>Confirm Details <CheckCircle className="w-4 h-4" /></>}
                            </button>
                            <Link 
                                href="/profile"
                                className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:border-slate-300 transition-all text-center flex items-center justify-center gap-2"
                            >
                                Edit <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium">
                            ← Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold">Historical Analysis</h1>
                    </div>
                    
                    <button
                        onClick={async () => {
                            try {
                                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                                const token = (session as any)?.accessToken;
                                const headers: HeadersInit = {};
                                if (token) headers['Authorization'] = `Bearer ${token}`;
                                
                                const res = await fetch(`${API_URL}/analyze/${params.id}/resume`, { headers });
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
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0047BA] text-white font-bold rounded-xl hover:bg-[#002E5D] transition-all shadow-md hover:shadow-lg text-sm"
                    >
                        View Original PDF
                    </button>
                </div>

                <div className="space-y-6 mb-12">
                    <div className="glass-panel p-8 rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-bold text-[#6E7CA0] uppercase tracking-wider">The &quot;6-Second Label&quot;</h3>
                            {confidenceScore !== undefined && (
                                <div className={`px-3 py-1 rounded text-xs font-bold border flex items-center gap-1 ${getSignalColor(confidenceScore)}`} title={confidenceReasoning}>
                                    <Info className="w-4 h-4" />
                                    Signal Strength: {confidenceScore}/100
                                </div>
                            )}
                        </div>
                        <p className="text-4xl font-bold text-[#002E5D] mb-3">{cpi}</p>
                        <p className="text-base text-[#6E7CA0]">Performance recorded on {new Date(data.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl border border-gray-200">
                        <h3 className="text-sm font-bold text-[#6E7CA0] uppercase tracking-wider mb-6">Top 3 Hiring Risks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {topRisks.length > 0 ? topRisks.map((risk: any, i: number) => (
                                <div key={i} className="space-y-2 bg-red-50/50 p-5 rounded-xl border border-red-100 h-full">
                                    <p className="text-red-600 font-bold text-base flex items-center gap-2">
                                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm">#{i + 1}</span>
                                        {risk.risk}
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed">{risk.reason}</p>
                                </div>
                            )) : (
                                <p className="text-[#6E7CA0] italic text-sm">No significant risks identified.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-16">
                    {layerList.map((layer, index) => (
                        <div key={layer.id} className="pt-10 border-t-2 border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold flex items-center gap-4">
                                        <span className="text-[#0047BA]/30 font-mono text-2xl">0{index + 1}</span>
                                        <span className="text-[#002E5D]">{layer.name} Analysis</span>
                                    </h3>
                                    <p className="text-[#6E7CA0] text-base mt-2">
                                        {LAYER_DESCRIPTIONS[layer.id] || "Detailed component analysis."}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="text-xl font-bold">
                                        <span className={layer.score >= 8 ? 'text-emerald-500' : layer.score >= 5 ? 'text-amber-500' : 'text-red-500'}>
                                            Score: {layer.score}/10
                                        </span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border ${layer.status === 'good' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                        layer.status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
                                        }`}>
                                        {layer.status}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel rounded-2xl overflow-hidden border border-gray-200 mt-6">
                                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <span className="text-sm font-bold text-[#6E7CA0] uppercase tracking-widest">Referenced Text from Resume</span>
                                </div>
                                <div className="p-6 md:p-8 bg-white">
                                    <blockquote className="text-lg text-slate-700 italic border-l-4 border-amber-400 pl-6 py-2 leading-relaxed font-serif">
                                        &quot;{layers[layer.id]?.referenced_text || "Snippet not available for this historical record."}&quot;
                                    </blockquote>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-sm font-bold text-[#6E7CA0] uppercase tracking-widest mb-4">Actionable Fixes</h4>
                                {layer.issues.length === 0 ? (
                                    <div className="glass-panel p-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-center flex flex-col items-center justify-center space-y-3">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">✓</div>
                                        <p className="text-emerald-700 font-bold text-lg">Layer is optimized.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {layer.issues.map((issue: any, idx: number) => (
                                            <div key={idx} className="glass-panel p-6 rounded-2xl border border-gray-200 flex flex-col bg-white">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="bg-red-50 text-red-500 border border-red-100 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                                                        {issue.type || 'Fix Required'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 text-sm mb-6 flex-1 leading-relaxed">
                                                    {issue.reason || issue.description || issue.fix}
                                                </p>
                                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                                                    <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1.5 tracking-widest flex items-center gap-1">
                                                        <span>★</span> Recommended Action
                                                    </p>
                                                    <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                                                        {renderActionText(issue.fix)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Call to Actions */}
                <div className="mt-20 pt-12 border-t-2 border-slate-200 max-w-2xl mx-auto text-center space-y-6">
                    <h2 className="text-2xl font-bold text-[#002E5D]">Ready to see the difference?</h2>
                    <p className="text-slate-500 text-sm mb-8">
                        View our AI-generated rewrite of your resume or discuss these findings with a career advisor.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/optimize"
                            className="w-full sm:w-auto block text-center bg-[#0047BA] hover:bg-[#002E5D] text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-sm"
                        >
                            View RMS Optimized Version
                        </Link>
                        <a
                            href={process.env.NEXT_PUBLIC_ACUITY_URL || "https://app.acuityscheduling.com/schedule/adb4b746/appointment/79892735/calendar/12255014?ref=email"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto block text-center bg-white border-2 border-[#0047BA] hover:bg-slate-50 text-[#0047BA] font-semibold py-4 px-8 rounded-xl transition-colors shadow-sm"
                        >
                            Schedule with an Advisor
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
