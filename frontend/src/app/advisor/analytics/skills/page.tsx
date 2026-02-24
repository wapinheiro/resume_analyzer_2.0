'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, LayoutGrid, List } from 'lucide-react';

type SkillData = {
    skill: string;
    missing_count: number;
    percentage: number;
};

type SkillsResponse = {
    data: SkillData[];
};

export default function SkillsAnalytics() {
    const { status } = useSession();
    const router = useRouter();

    const [data, setData] = useState<SkillsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // View Toggle
    const [viewMode, setViewMode] = useState<'cloud' | 'table'>('cloud');

    // Filters
    const [major, setMajor] = useState('');
    const [gradYear, setGradYear] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const url = new URL('/api/v1/advisors/analytics/skills', window.location.origin);
                if (major) url.searchParams.append('major', major);
                if (gradYear) url.searchParams.append('grad_year', gradYear);

                const res = await fetch(url.toString());
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch skills analytics", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchSkills();
        }
    }, [status, major, gradYear]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // A simple CSS-based word cloud implementation
    const renderWordCloud = (skills: SkillData[]) => {
        if (skills.length === 0) return <div className="p-12 text-center text-gray-500">No skills data available.</div>;

        // Find the max occurrence to scale fonts
        const maxCount = Math.max(...skills.map(s => s.missing_count));

        return (
            <div className="flex flex-wrap justify-center items-center gap-6 p-12 min-h-[400px]">
                {skills.map((s, i) => {
                    // Scale font size linearly between 1rem and 4rem based on relative frequency
                    const ratio = s.missing_count / maxCount;
                    const fontSize = Math.max(1, ratio * 4) + 'rem';

                    // Assign semi-random colors from a fixed palette based on index
                    const colors = [
                        'text-amber-600', 'text-amber-500', 'text-amber-400',
                        'text-[#0047BA]', 'text-[#002E5D]', 'text-blue-500',
                        'text-gray-700', 'text-gray-500'
                    ];
                    const color = colors[i % colors.length];

                    return (
                        <div
                            key={s.skill}
                            className={`font-bold transition-transform hover:scale-110 cursor-default ${color}`}
                            style={{ fontSize }}
                            title={`${s.missing_count} students missing this (${s.percentage}%)`}
                        >
                            {s.skill}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderTable = (skills: SkillData[]) => {
        if (skills.length === 0) return <div className="p-12 text-center text-gray-500">No skills data available.</div>;

        return (
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/20 text-xs uppercase tracking-wider text-[#6E7CA0] border-b border-gray-100 dark:border-gray-800">
                            <th className="p-6 font-semibold">Missing Skill / Keyword</th>
                            <th className="p-6 font-semibold text-right">Frequency</th>
                            <th className="p-6 font-semibold text-right">% of Students</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {skills.map((s) => (
                            <tr key={s.skill} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                <td className="p-6 font-bold text-[#002E5D] dark:text-gray-200">{s.skill}</td>
                                <td className="p-6 text-right font-mono text-gray-700 dark:text-gray-300">{s.missing_count}</td>
                                <td className="p-6 text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                                        {s.percentage}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/advisor/dashboard" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium px-4 py-2 bg-blue-50 rounded-lg">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                        Skills Gap Analysis
                    </h1>
                </div>

                <div className="glass-panel p-6 rounded-2xl mb-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-[#6E7CA0] uppercase tracking-wider mb-2">Filter by Major</label>
                            <select
                                className="border rounded-lg px-4 py-2 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                                className="border rounded-lg px-4 py-2 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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

                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('cloud')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'cloud' ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Word Cloud
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List className="w-4 h-4" /> Data Table
                        </button>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                        </div>
                    )}

                    {data?.data ? (
                        viewMode === 'cloud' ? renderWordCloud(data.data) : renderTable(data.data)
                    ) : null}
                </div>
            </div>
        </main>
    );
}
