'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { FrameworkGrid } from '@/components/home/FrameworkGrid';
import { RMSBenchmarkTeaser } from '@/components/home/RMSBenchmarkTeaser';
import { useSession } from 'next-auth/react';
import { analyzeResume } from '@/services/api';
import { Search, Hash, User, Sparkles, Calendar, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function Home() {
    const { data: session } = useSession();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFile = async (file: File) => {
        if (!session?.user) {
            router.push('/login?callbackUrl=/');
            return;
        }

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        setIsAnalyzing(true);
        setLoadingStep('Uploading PDF...');

        try {
            const data = await analyzeResume(file, (session as any)?.accessToken, (message) => {
                setLoadingStep(message);
            });

            localStorage.setItem('analysisResult', JSON.stringify(data));
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Analysis failed. Please try again.');
            setIsAnalyzing(false);
            setLoadingStep('');
        }
    };

    const handleClick = () => {
        if (!session?.user) {
            router.push('/login?callbackUrl=/');
            return;
        }
        if (!isAnalyzing) fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!session?.user) {
            router.push('/login?callbackUrl=/');
            return;
        }
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const acuityUrl = process.env.NEXT_PUBLIC_ACUITY_URL || "https://app.acuityscheduling.com/schedule/adb4b746/appointment/79892735/calendar/12255014?ref=email";

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative isolate pt-12 pb-16 overflow-hidden">
                {/* Glowing gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none -z-10" />

                <div className="mx-auto max-w-4xl px-6 pt-12 sm:pt-16 pb-12 text-center flex flex-col items-center">

                    {/* Top Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>BYU Computer Science • A Thread tool</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-3xl">
                        Resume Analyzer
                    </h1>

                    <div className="text-center max-w-xl mb-10">
                        <p className="text-base sm:text-lg font-medium text-slate-200 mb-4">
                            Upload your resume and get:
                        </p>
                        <ul className="text-sm sm:text-base text-slate-300 space-y-2.5 inline-block text-left">
                            <li className="flex items-center gap-3">
                                <Search className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>A 5-part review</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Hash className="w-4 h-4 text-indigo-400 shrink-0" />
                                <span>An overall score</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <User className="w-4 h-4 text-sky-400 shrink-0" />
                                <span>What your resume emphasizes</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>An optimized version you can use</span>
                            </li>
                        </ul>
                    </div>

                    {/* Authenticated Welcome Banner */}
                    {session?.user && (
                        <div className="w-full max-w-2xl mb-8 bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 sm:p-6 text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <span>Welcome back, {session.user.name || session.user.email}</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Ready to re-review your resume or check advisor feedback?
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={acuityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Schedule Advisor</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Conditional Upload Box: Unauthenticated vs Authenticated */}
                    {!session?.user ? (
                        <div
                            id="upload-zone"
                            onClick={() => router.push('/login?callbackUrl=/')}
                            className="w-full max-w-xl border-2 border-dashed border-blue-500/40 rounded-3xl p-10 sm:p-12 flex flex-col items-center justify-center gap-5 transition-all duration-300 cursor-pointer shadow-2xl relative backdrop-blur-md bg-slate-900/80 hover:border-blue-400 hover:bg-slate-900/95 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-110 transition-transform">
                                <Lock className="w-8 h-8" />
                            </div>
                            <div className="text-center max-w-md">
                                <p className="text-xl font-bold text-white mb-2">Sign In to Review Your Resume</p>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                                    Sign in with Google, GitHub, or Email to upload your resume, calculate your overall score, and store your analysis history.
                                </p>
                                <Link
                                    href="/login?callbackUrl=/"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#0047BA] hover:bg-blue-600 rounded-xl transition-all shadow-lg shadow-blue-500/25"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Log In or Create Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div
                            id="upload-zone"
                            onClick={handleClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`w-full max-w-xl border-2 border-dashed rounded-3xl p-10 sm:p-14 flex flex-col items-center justify-center gap-6 transition-all duration-300 cursor-pointer shadow-2xl relative backdrop-blur-md
                                ${isAnalyzing ? 'border-blue-500/60 bg-blue-500/10 cursor-wait' : ''}
                                ${isDragging ? 'border-blue-400 bg-blue-500/20 scale-[1.02]' : ''}
                                ${!isAnalyzing && !isDragging ? 'border-slate-700/80 bg-slate-900/70 hover:border-blue-500/70 hover:bg-slate-900/90' : ''}
                            `}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="application/pdf"
                            />

                            {isAnalyzing ? (
                                <div className="py-4 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-blue-400 font-semibold text-lg animate-pulse mb-1">{loadingStep}</p>
                                    <p className="text-xs text-slate-400">Generating your 5-part review &amp; score...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-white mb-1.5">Upload Resume to Review</p>
                                        <p className="text-xs sm:text-sm text-slate-400">Drag &amp; drop or click to select a PDF file</p>
                                    </div>
                                    <div className="px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-medium text-slate-400">
                                        PDF format • &lt; 10MB
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 5-Layer Framework Grid */}
            <FrameworkGrid />

            {/* RMS Benchmark Teaser */}
            <RMSBenchmarkTeaser />

            {/* Footer */}
            <footer className="border-t border-slate-800/80 py-12 px-6 text-center">
                <p className="text-sm font-serif italic text-slate-400 tracking-wide mb-2">
                    &quot;making weak things become strong&quot;
                </p>
                <p className="text-xs text-slate-500">
                    BYU Computer Science Career Development Platform &copy; 2026
                </p>
            </footer>
        </main>
    );
}
