'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, TrendingUp, Lightbulb } from 'lucide-react';

type ScoreData = {
    date: string;
    average_score: number;
    count: number;
};

type ScoreResponse = {
    data: ScoreData[];
    insight: string;
};

export default function ScoresAnalytics() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [data, setData] = useState<ScoreResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [major, setMajor] = useState('');
    const [gradYear, setGradYear] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true);
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                const token = (session as any)?.accessToken;

                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const url = new URL(`${API_URL}/advisors/analytics/scores`);
                if (major) url.searchParams.append('major', major);
                if (gradYear) url.searchParams.append('grad_year', gradYear);

                const res = await fetch(url.toString(), { headers });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch score analytics", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchScores();
        }
    }, [status, major, gradYear]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/advisor/dashboard" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium px-4 py-2 bg-blue-50 rounded-lg">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        Score Evolution Trend
                    </h1>
                </div>

                <div className="glass-panel p-6 rounded-2xl mb-8 border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-[#6E7CA0] uppercase tracking-wider mb-2">Filter by Major</label>
                            <select
                                className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={major}
                                onChange={(e) => setMajor(e.target.value)}
                            >
                                <option value="">All Majors</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Systems">Information Systems</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-[#6E7CA0] uppercase tracking-wider mb-2">Filter by Grad Year</label>
                            <select
                                className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={gradYear}
                                onChange={(e) => setGradYear(e.target.value)}
                            >
                                <option value="">All Years</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    )}

                    <div className="p-8">
                        {data?.insight && (
                            <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4 items-start">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                    <Lightbulb className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900 mb-1">AI Insight</h4>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        {data.insight}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="w-full h-[400px]">
                            {data && data.data.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis dataKey="date" stroke="#6E7CA0" tick={{ fill: '#6E7CA0' }} />
                                        <YAxis domain={[0, 100]} stroke="#6E7CA0" tick={{ fill: '#6E7CA0' }} label={{ value: 'Average RMS Score', angle: -90, position: 'insideLeft', fill: '#6E7CA0' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number) => [value, 'Avg Score']}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="average_score"
                                            name="Average RMS Score"
                                            stroke="#0047BA"
                                            strokeWidth={3}
                                            dot={{ r: 4, strokeWidth: 2 }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    {!loading && "No data available for the selected filters."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
