'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { Users, TrendingUp, AlertTriangle, ChevronRight, ArrowDown, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';

type Student = {
    id: string;
    name: string | null;
    email: string;
    last_scan_date: string | null;
    latest_score: number | null;
    status: string;
    major?: string;
    grad_year?: string;
};

type Analytics = {
    average_score: number;
    total_scans_30d: number;
    top_missing_skill: string | null;
};

export default function AdvisorDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [students, setStudents] = useState<Student[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterMajor, setFilterMajor] = useState('');
    const [filterGradYear, setFilterGradYear] = useState('');
    const [sortColumn, setSortColumn] = useState<'date' | 'score' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        }
    }, [search, status]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const token = (session as any)?.accessToken;

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Construct URLs
            const studentUrl = new URL(`${API_URL}/advisors/students`);
            if (search) studentUrl.searchParams.append('search', search);

            const [studentsRes, analyticsRes] = await Promise.all([
                fetch(studentUrl.toString(), { headers }),
                fetch(`${API_URL}/advisors/analytics`, { headers })
            ]);

            if (studentsRes.ok) {
                const data = await studentsRes.json();
                setStudents(data.students || data); // handle API format
            }

            if (analyticsRes.ok) {
                const data = await analyticsRes.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen bg-background flex text-gray-700 items-center justify-center">Loading...</div>;
    }

    const filteredStudents = students.filter(student => {
        if (filterMajor && student.major !== filterMajor) return false;
        if (filterGradYear && student.grad_year !== filterGradYear) return false;

        // Also apply text search
        if (search) {
            const searchLower = search.toLowerCase();
            const nameMatch = student.name?.toLowerCase().includes(searchLower) || false;
            const emailMatch = student.email.toLowerCase().includes(searchLower);
            if (!nameMatch && !emailMatch) return false;
        }

        return true;
    });

    const sortedAndFilteredStudents = [...filteredStudents].sort((a, b) => {
        if (!sortColumn) return 0;

        if (sortColumn === 'date') {
            const dateA = a.last_scan_date ? new Date(a.last_scan_date).getTime() : 0;
            const dateB = b.last_scan_date ? new Date(b.last_scan_date).getTime() : 0;
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (sortColumn === 'score') {
            const scoreA = a.latest_score || 0;
            const scoreB = b.latest_score || 0;
            return sortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
        }

        return 0;
    });

    const handleSort = (col: 'date' | 'score') => {
        if (sortColumn === col) {
            if (sortDirection === 'desc') {
                setSortDirection('asc');
            } else {
                setSortColumn(null); // Reset after asc
                setSortDirection('desc');
            }
        } else {
            setSortColumn(col);
            setSortDirection('desc'); // First click sorts descending
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Career Advisor Dashboard</h1>

                {/* Analytics Overview Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Link href="/advisor/analytics/scores" className="block transform transition-transform hover:-translate-y-1">
                            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-transparent hover:border-blue-500/50">
                                <div className="p-4 bg-blue-600 rounded-xl text-white">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#6E7CA0] font-medium">Avg RMS Score (All-time)</p>
                                    <p className="text-3xl font-bold text-[#002E5D]">{Math.round(analytics.average_score)}</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/advisor/analytics/volume" className="block transform transition-transform hover:-translate-y-1">
                            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-transparent hover:border-blue-500/50">
                                <div className="p-4 bg-emerald-600 rounded-xl text-white">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#6E7CA0] font-medium">Total Scans (30d)</p>
                                    <p className="text-3xl font-bold text-[#002E5D]">{analytics.total_scans_30d}</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/advisor/analytics/skills" className="block transform transition-transform hover:-translate-y-1">
                            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-transparent hover:border-blue-500/50">
                                <div className="p-4 bg-amber-600 rounded-xl text-white">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#6E7CA0] font-medium">Top Missing Skill</p>
                                    <p className="text-xl font-bold text-[#002E5D] truncate">{analytics.top_missing_skill || "N/A"}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Students Table */}
                <div className="glass-panel rounded-2xl overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-semibold">Student Roster</h2>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <select
                                className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-black focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm w-full sm:w-auto"
                                value={filterMajor}
                                onChange={(e) => setFilterMajor(e.target.value)}
                            >
                                <option value="">All Majors</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Systems">Information Systems</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Finance">Finance</option>
                            </select>
                            <select
                                className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-black focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm w-full sm:w-auto"
                                value={filterGradYear}
                                onChange={(e) => setFilterGradYear(e.target.value)}
                            >
                                <option value="">All Years</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                            </select>
                            <div className="relative w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="pl-10 pr-4 py-2 border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 bg-transparent text-black placeholder-gray-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#002E5D] text-xs uppercase tracking-wider text-white border-b border-[#002E5D]">
                                    <th className="p-6 font-semibold">Student</th>
                                    <th
                                        className="p-6 font-semibold cursor-pointer hover:bg-[#001f40] transition-colors select-none group"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Last Scan
                                            <span className="text-white/50 group-hover:text-white">
                                                {sortColumn === 'date' ? (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : null}
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="p-6 font-semibold cursor-pointer hover:bg-[#001f40] transition-colors select-none group"
                                        onClick={() => handleSort('score')}
                                    >
                                        <div className="flex items-center gap-1">
                                            RMS Score
                                            <span className="text-white/50 group-hover:text-white">
                                                {sortColumn === 'score' ? (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : null}
                                            </span>
                                        </div>
                                    </th>
                                    <th className="p-6 font-semibold">Status</th>
                                    <th className="p-6 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {sortedAndFilteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                        <td className="p-6">
                                            <div className="font-medium text-[#002E5D]">{student.name || "Unknown"}</div>
                                            <div className="text-sm text-[#6E7CA0]">{student.email}</div>
                                        </td>
                                        <td className="p-6 text-sm">
                                            {student.last_scan_date ? format(new Date(student.last_scan_date), 'MMM d, yyyy') : 'Never'}
                                        </td>
                                        <td className="p-6">
                                            {student.latest_score !== null ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.latest_score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                                                    student.latest_score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {student.latest_score}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">N/A</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Link href={`/advisor/student/${student.id}`} className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {sortedAndFilteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-500">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
