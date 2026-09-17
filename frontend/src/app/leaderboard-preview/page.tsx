'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { 
    Trophy, 
    Sparkles, 
    Upload, 
    Gamepad2, 
    Zap,
    Filter,
    ChevronDown,
    ArrowDown
} from 'lucide-react';

// Mock Leaderboard Data for Design Validation
interface HighScoreEntry {
    rank: number;
    score: number;
    name: string;
    major: string;
    badge: 'MARKET READY' | 'INTERN READY' | 'TOURIST';
    year: string;
}

const MOCK_LEADERBOARD: HighScoreEntry[] = [
    { rank: 1, score: 99, name: 'Wagner Pinheiro', major: 'Computer Science', badge: 'MARKET READY', year: 'Senior' },
    { rank: 2, score: 97, name: 'Ryan Richards', major: 'Computer Science', badge: 'MARKET READY', year: 'Junior' },
    { rank: 3, score: 96, name: 'James Teuscher', major: 'Cybersecurity', badge: 'MARKET READY', year: 'Senior' },
    { rank: 4, score: 95, name: 'Sarah Kim', major: 'Data Science', badge: 'INTERN READY', year: 'Sophomore' },
    { rank: 5, score: 94, name: 'Tyler Bennett', major: 'Computer Science', badge: 'INTERN READY', year: 'Senior' },
    { rank: 6, score: 93, name: 'Michael Miller', major: 'Computer Science', badge: 'INTERN READY', year: 'Junior' },
    { rank: 7, score: 92, name: 'Will Johnson', major: 'Cybersecurity', badge: 'INTERN READY', year: 'Senior' },
    { rank: 8, score: 91, name: 'Steven Vance', major: 'Data Science', badge: 'INTERN READY', year: 'Freshman' },
    { rank: 9, score: 90, name: 'William Hostettler', major: 'Computer Science', badge: 'INTERN READY', year: 'Senior' },
    { rank: 10, score: 89, name: 'Taylor Reynolds', major: 'Computer Science', badge: 'TOURIST', year: 'Junior' },
];

export default function LeaderboardPreviewPage() {
    const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
    const [isCRTMode, setIsCRTMode] = useState<boolean>(true);

    const filteredScores = MOCK_LEADERBOARD.filter(entry => {
        if (selectedMajor === 'ALL') return true;
        if (selectedMajor === 'CS') return entry.major === 'Computer Science';
        if (selectedMajor === 'CYBER') return entry.major === 'Cybersecurity';
        if (selectedMajor === 'DS') return entry.major === 'Data Science';
        return true;
    });

    const scrollToUpload = () => {
        const uploadElement = document.getElementById('upload-zone');
        if (uploadElement) {
            uploadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return 'text-white font-extrabold shadow-sm';
            case 2: return 'text-[#FF4D4D] font-bold'; // Arcade Red
            case 3: return 'text-[#FF9900] font-bold'; // Neon Orange
            case 4: return 'text-[#FFB8FF] font-semibold'; // Pinky Pink
            case 5:
            case 6: return 'text-[#FFFF33] font-semibold'; // Pac-Man Yellow
            default: return 'text-[#00FF66] font-medium'; // Arcade Bright Green
        }
    };

    const getBadgeStyle = (badge: string) => {
        switch (badge) {
            case 'MARKET READY':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
            case 'INTERN READY':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
            default:
                return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        }
    };

    return (
        <main className="min-h-screen bg-[#001428] text-slate-100 selection:bg-cyan-500 selection:text-black">
            <Navbar />

            {/* Sandbox Notice Banner */}
            <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5 text-center text-xs font-mono text-amber-300 flex items-center justify-center gap-2">
                <Gamepad2 className="w-4 h-4 animate-bounce" />
                <span>DESIGN VALIDATION SANDBOX: Compact Pac-Man Leaderboard (/leaderboard-preview)</span>
            </div>

            {/* SECTION 1: COMPACT HERO LEADERBOARD */}
            <section className="relative isolate pt-6 pb-6 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Eyebrow Pill & CRT Controls */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-cyan-300 text-[11px] font-mono">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>BYU CS • Official Resume Leaderboard</span>
                        </div>

                        <button
                            onClick={() => setIsCRTMode(!isCRTMode)}
                            className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-all flex items-center gap-1.5
                                ${isCRTMode 
                                    ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/20' 
                                    : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                        >
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>CRT: {isCRTMode ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>

                    {/* Compact Arcade Screen Box */}
                    <div className={`relative rounded-2xl border-2 border-[#002E5D] bg-[#000E1A] p-3 sm:p-5 shadow-2xl overflow-hidden
                        ${isCRTMode ? 'shadow-cyan-900/20 ring-1 ring-cyan-500/30' : ''}`}
                    >
                        {/* CRT Scanline Filter Overlay */}
                        {isCRTMode && (
                            <div 
                                className="pointer-events-none absolute inset-0 z-20 opacity-25"
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                                    backgroundSize: '100% 4px'
                                }}
                            />
                        )}

                        {/* Compact Arcade Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 pb-3 border-b border-blue-900/60">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-400 animate-pulse shrink-0" />
                                <div>
                                    <h1 className="text-lg sm:text-2xl font-mono font-extrabold tracking-wider text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
                                        BYU CS RESUME LEADERBOARD
                                    </h1>
                                    <p className="text-[11px] font-mono text-yellow-300/80">
                                        Top Resume Marketability Scores (RMS 0–100) • 5-Layer Audit
                                    </p>
                                </div>
                            </div>

                            {/* Compact Major Filter Tabs */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {[
                                    { id: 'ALL', label: 'ALL MAJORS' },
                                    { id: 'CS', label: 'COMP SCI' },
                                    { id: 'CYBER', label: 'CYBER' },
                                    { id: 'DS', label: 'DATA SCI' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedMajor(tab.id)}
                                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all
                                            ${selectedMajor === tab.id
                                                ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/20'
                                                : 'bg-blue-950/60 border border-blue-900/60 text-slate-300 hover:border-cyan-500/50'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compact High Scores Table (NO INIT COLUMN) */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse font-mono text-xs">
                                <thead>
                                    <tr className="border-b border-blue-900/80 text-[#FFFF00] tracking-wider text-[11px]">
                                        <th className="py-1.5 px-2.5">RANK</th>
                                        <th className="py-1.5 px-2.5">RMS SCORE</th>
                                        <th className="py-1.5 px-2.5">STUDENT NAME</th>
                                        <th className="py-1.5 px-2.5">MAJOR</th>
                                        <th className="py-1.5 px-2.5">BADGE</th>
                                        <th className="py-1.5 px-2.5 text-right">YEAR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredScores.map((entry) => (
                                        <tr
                                            key={entry.rank}
                                            className={`border-b border-blue-950/40 hover:bg-blue-900/30 transition-colors ${getRankColor(entry.rank)}`}
                                        >
                                            <td className="py-1.5 px-2.5 font-bold">
                                                {entry.rank === 1 ? '🥇 1ST' : entry.rank === 2 ? '🥈 2ND' : entry.rank === 3 ? '🥉 3RD' : `${entry.rank}TH`}
                                            </td>
                                            <td className="py-1.5 px-2.5 font-bold text-amber-300">
                                                {entry.score}/100
                                            </td>
                                            <td className="py-1.5 px-2.5 font-semibold">
                                                {entry.name}
                                            </td>
                                            <td className="py-1.5 px-2.5 text-slate-300 text-xs">
                                                {entry.major}
                                            </td>
                                            <td className="py-1.5 px-2.5">
                                                <span className={`px-2 py-0.5 rounded text-[10px] border font-sans font-semibold tracking-wide ${getBadgeStyle(entry.badge)}`}>
                                                    {entry.badge}
                                                </span>
                                            </td>
                                            <td className="py-1.5 px-2.5 text-right text-slate-400 text-xs">
                                                {entry.year}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* GAMIFICATION HOOK ACTION BAR - IMMEDIATELY FOLLOWS LEADERBOARD */}
                        <div className="mt-3 pt-3 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-950/40 p-3 rounded-xl border border-amber-500/30">
                            <div className="flex items-center gap-2 text-left">
                                <Gamepad2 className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                                <div>
                                    <p className="text-xs font-mono font-bold text-amber-300 tracking-wide">
                                        CAN YOUR RESUME BEAT THE HIGH SCORE?
                                    </p>
                                    <p className="text-[11px] text-slate-300">
                                        Test your PDF resume to calculate your 5-layer RMS score &amp; claim your place on the leaderboard.
                                    </p>
                                </div>
                            </div>

                            {/* Action Button that Smooth-Scrolls Down to Upload Zone */}
                            <button
                                onClick={scrollToUpload}
                                className="w-full sm:w-auto px-5 py-2.5 text-xs font-mono font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 group"
                            >
                                <Zap className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
                                <span>INSERT RESUME TO CHECK RANK</span>
                                <ArrowDown className="w-3.5 h-3.5 animate-pulse" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: ACTIONABLE RESUME UPLOAD ZONE */}
            <section id="upload-zone" className="py-10 px-4 sm:px-6 bg-[#000E1A] border-y border-blue-900/50 scroll-mt-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Resume Upload Zone</span>
                    </div>

                    <h2 className="text-xl sm:text-3xl font-mono font-extrabold text-white mb-2 tracking-tight">
                        Upload Your Resume
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                        Calculate your 5-layer RMS marketability score and see where you rank among active BYU CS students.
                    </p>

                    {/* Upload Drop Zone Box */}
                    <div className="w-full border-2 border-dashed border-cyan-400/70 hover:border-cyan-300 rounded-3xl p-8 sm:p-10 bg-blue-950/40 hover:bg-blue-900/30 transition-all cursor-pointer shadow-xl shadow-cyan-500/5 flex flex-col items-center justify-center gap-3 group">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-mono font-bold text-cyan-300 mb-1">
                                SELECT PDF RESUME FILE
                            </p>
                            <p className="text-xs text-slate-400">
                                Drag &amp; drop your PDF or click to browse (PDF format • &lt; 10MB)
                            </p>
                        </div>
                        <button className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 text-xs font-mono font-bold text-white bg-[#0047BA] hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/20">
                            <span>SELECT FILE &amp; ANALYZE</span>
                        </button>
                    </div>
                    
                    <p className="text-[11px] font-mono text-slate-400 mt-4">
                        🔒 FERPA Compliant • Private &amp; Secure • BYU CS Platform
                    </p>
                </div>
            </section>

            {/* SECTION 3: PRODUCT OVERVIEW & 5-LAYER CHECKS */}
            <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-1">
                        How The 5-Layer Resume Audit Works
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Our sequential evaluation engine checks your hiring signal across recruiters and automated ATS screeners.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-10">
                    {[
                        { num: '01', title: 'ATS Format & Flow', desc: 'Evaluates reverse-chronological structure, margin flow, and digital contact links.', color: 'border-cyan-500/40 text-cyan-300' },
                        { num: '02', title: '2026 Core Skills', desc: 'Flags legacy noise and verifies high-signal engineering toolchains (RAG, Vector DBs, Cloud).', color: 'border-blue-500/40 text-blue-300' },
                        { num: '03', title: 'Impact (CAR Formula)', desc: 'Audits bullet points for Action Verbs, Context, and quantified performance metrics.', color: 'border-amber-500/40 text-amber-300' },
                        { num: '04', title: '6-Sec Storyline', desc: 'Identifies your specialist bucket (Full-Stack, Backend, Systems, AI/ML) in 6 seconds.', color: 'border-purple-500/40 text-purple-300' },
                        { num: '05', title: 'X-Factor Rationale', desc: 'Verifies architectural explanations and engineering choices under technical constraints.', color: 'border-emerald-500/40 text-emerald-300' },
                    ].map(layer => (
                        <div key={layer.num} className={`p-4 rounded-2xl bg-blue-950/40 border ${layer.color} shadow-sm`}>
                            <span className="text-xl font-mono font-bold block mb-1 opacity-70">{layer.num}</span>
                            <h4 className="text-xs font-bold text-white mb-1">{layer.title}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{layer.desc}</p>
                        </div>
                    ))}
                </div>

                {/* RMS Benchmarks */}
                <div className="p-5 rounded-2xl bg-[#000E1A] border border-blue-900/60 text-center max-w-xl mx-auto">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
                        Resume Marketability Score (RMS) Benchmarks
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                            <span className="font-bold block text-xs sm:text-sm">90 - 100</span>
                            <span className="text-[10px] text-emerald-400/80">MARKET READY</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300">
                            <span className="font-bold block text-xs sm:text-sm">75 - 89</span>
                            <span className="text-[10px] text-blue-400/80">INTERN READY</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300">
                            <span className="font-bold block text-xs sm:text-sm">&lt; 75</span>
                            <span className="text-[10px] text-amber-400/80">THE TOURIST</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-blue-900/50 bg-[#000A14] py-6 text-center text-xs text-slate-500">
                <p className="font-serif italic mb-1 text-slate-400">&quot;making weak things become strong&quot;</p>
                <p>BYU Computer Science Career Development Platform &copy; 2026</p>
            </footer>
        </main>
    );
}
