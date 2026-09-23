'use client';

import { useState, useEffect } from 'react';
import { fetchLeaderboard } from '@/services/api';
import { 
    Trophy, 
    Sparkles, 
    Gamepad2, 
    Zap, 
    Filter, 
    ArrowDown 
} from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    score: number;
    name: string;
    major: string;
    badge: 'MARKET READY' | 'INTERN READY' | 'TOURIST';
    year: string;
}

interface LeaderboardProps {
    onActionClick?: () => void;
}

export function Leaderboard({ onActionClick }: LeaderboardProps) {
    const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
    const [selectedYear, setSelectedYear] = useState<string>('ALL');
    const [isCRTMode, setIsCRTMode] = useState<boolean>(true);
    const [scores, setScores] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        const loadScores = async () => {
            setIsLoading(true);
            const data = await fetchLeaderboard(selectedMajor, selectedYear);
            if (isMounted) {
                if (data && data.leaderboard) {
                    setScores(data.leaderboard);
                } else {
                    setScores([]);
                }
                setIsLoading(false);
            }
        };

        loadScores();
        return () => { isMounted = false; };
    }, [selectedMajor, selectedYear]);

    const handleAction = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (onActionClick) {
            onActionClick();
        } else {
            const uploadElement = document.getElementById('upload-zone');
            if (uploadElement) {
                const yOffset = -90;
                const y = uploadElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return 'text-white font-extrabold';
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
        <div className="w-full max-w-4xl mx-auto text-left">
            {/* Top Eyebrow & CRT Controls */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-cyan-300 text-[11px] font-mono shadow-sm">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>BYU CS • Official Resume Leaderboard</span>
                </div>

                <button
                    type="button"
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

            {/* Compact Arcade Box */}
            <div className={`relative rounded-2xl border-2 border-[#002E5D] bg-[#000E1A] p-3 sm:p-5 shadow-2xl overflow-hidden
                ${isCRTMode ? 'shadow-cyan-900/20 ring-1 ring-cyan-500/30' : ''}`}
            >
                {/* CRT Scanline Filter & Monitor Glass Overlay */}
                {isCRTMode && (
                    <>
                        <div 
                            className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay opacity-50"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.7) 50%)',
                                backgroundSize: '100% 4px'
                            }}
                        />
                        <div 
                            className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_40px_rgba(0,255,255,0.18)] border border-cyan-500/30 rounded-2xl"
                        />
                    </>
                )}

                {/* Compact Arcade Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 pb-3 border-b border-blue-900/60">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400 animate-pulse shrink-0" />
                        <div>
                            <h2 className="text-lg sm:text-2xl font-mono font-extrabold tracking-wider text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
                                BYU CS RESUME LEADERBOARD
                            </h2>
                            <p className="text-[11px] font-mono text-yellow-300/80">
                                Top Resume Marketability Scores (RMS 0–100) • 5-Layer Audit
                            </p>
                        </div>
                    </div>

                    {/* Filter Tabs Container */}
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        {/* Major Filter Tabs */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-start md:justify-end">
                            <span className="text-[10px] font-mono text-cyan-400/80 mr-0.5 font-bold tracking-wider">MAJOR:</span>
                            {[
                                { id: 'ALL', label: 'ALL MAJORS' },
                                { id: 'CS', label: 'COMP SCI' },
                                { id: 'CYBER', label: 'CYBER' },
                                { id: 'DS', label: 'DATA SCI' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedMajor(tab.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer z-10
                                        ${selectedMajor === tab.id
                                            ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/20'
                                            : 'bg-blue-950/60 border border-blue-900/60 text-slate-300 hover:border-cyan-500/50'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Year / Class Standing Filter Tabs */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-start md:justify-end">
                            <span className="text-[10px] font-mono text-amber-400/80 mr-0.5 font-bold tracking-wider">YEAR:</span>
                            {[
                                { id: 'ALL', label: 'ALL YEARS' },
                                { id: 'FRESHMAN', label: 'FRESHMAN' },
                                { id: 'SOPHOMORE', label: 'SOPHOMORE' },
                                { id: 'JUNIOR', label: 'JUNIOR' },
                                { id: 'SENIOR', label: 'SENIOR' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedYear(tab.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer z-10
                                        ${selectedYear === tab.id
                                            ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                                            : 'bg-blue-950/60 border border-blue-900/60 text-slate-300 hover:border-amber-500/50'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table View */}
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
                            {scores.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400 font-mono">
                                        <p className="text-amber-400 text-sm font-bold mb-1">🎮 NO LEADERBOARD ENTRIES YET</p>
                                        <p className="text-xs text-slate-400">Be the first BYU student to audit your resume and claim rank #1!</p>
                                    </td>
                                </tr>
                            ) : (
                                scores.map((entry) => (
                                    <tr
                                        key={`${entry.rank}-${entry.name}`}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* GAMIFICATION HOOK ACTION BAR */}
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

                    <button
                        type="button"
                        onClick={handleAction}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-mono font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 group cursor-pointer z-10"
                    >
                        <Zap className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
                        <span>INSERT RESUME TO CHECK RANK</span>
                        <ArrowDown className="w-3.5 h-3.5 animate-pulse" />
                    </button>
                </div>
            </div>
        </div>
    );
}
