'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, Users } from 'lucide-react';

type VolumeData = {
    period: string;
    scan_count: number;
};

type VolumeResponse = {
    group_by: string;
    data: VolumeData[];
};

export default function VolumeAnalytics() {
    const { status } = useSession();
    const router = useRouter();

    const [data, setData] = useState<VolumeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [groupBy, setGroupBy] = useState('month');
    const [major, setMajor] = useState('');
    const [gradYear, setGradYear] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchVolume = async () => {
            try {
                setLoading(true);
                const url = new URL('/api/v1/advisors/analytics/volume', window.location.origin);
                url.searchParams.append('group_by', groupBy);
                if (major) url.searchParams.append('major', major);
                if (gradYear) url.searchParams.append('grad_year', gradYear);

                const res = await fetch(url.toString());
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch volume analytics", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchVolume();
        }
    }, [status, groupBy, major, gradYear]);

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
                        <Users className="w-8 h-8 text-emerald-600" />
                        Scan Volume
                    </h1>
                </div>

                <div className="glass-panel p-6 rounded-2xl mb-8 border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-[#6E7CA0] uppercase tracking-wider mb-2">Group By</label>
                            <select
                                className="border rounded-lg px-4 py-2 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value)}
                            >
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="semester">Semester</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-[#6E7CA0] uppercase tracking-wider mb-2">Filter by Major</label>
                            <select
                                className="border rounded-lg px-4 py-2 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                                className="border rounded-lg px-4 py-2 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="w-full h-[400px]">
                            {data && data.data.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                                        <XAxis dataKey="period" stroke="#6E7CA0" tick={{ fill: '#6E7CA0' }} />
                                        <YAxis stroke="#6E7CA0" tick={{ fill: '#6E7CA0' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#e5e7eb', opacity: 0.4 }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="scan_count"
                                            name="Total Scans"
                                            fill="#10B981"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
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
