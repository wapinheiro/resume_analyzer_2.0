'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { analyzeResume } from '@/services/api';

export default function Home() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        setIsAnalyzing(true);
        setLoadingStep('Uploading PDF...');

        try {
            const data = await analyzeResume(file, (message) => {
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
        if (!isAnalyzing) fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <main className="min-h-screen bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
            <Navbar />

            <div className="relative isolate pt-14">
                <div className="mx-auto max-w-3xl px-6 py-24 sm:py-36 lg:px-8 flex flex-col items-center text-center">

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        Resume Analyzer 2.0
                    </h1>
                    <p className="text-lg text-[#6E7CA0] mb-12">
                        Optimize for the 2026 CS job market.
                    </p>

                    {/* Mega-Button Upload Zone */}
                    <div
                        onClick={handleClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center gap-6 transition-all cursor-pointer
                            ${isAnalyzing ? 'border-blue-500/50 bg-blue-500/5 cursor-wait' : ''}
                            ${isDragging ? 'border-blue-500 bg-blue-500/10' : ''}
                            ${!isAnalyzing && !isDragging ? 'border-gray-700 hover:border-blue-500/70 hover:bg-surface/50' : ''}
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
                            <>
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-blue-400 font-semibold text-lg animate-pulse">{loadingStep}</p>
                            </>
                        ) : (
                            <>
                                <svg className="w-14 h-14 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <div>
                                    <p className="text-xl font-semibold text-[#002E5D] mb-1">Upload Resume to Begin</p>
                                    <p className="text-sm text-[#6E7CA0]">Drag &amp; drop or click to select a PDF</p>
                                </div>
                            </>
                        )}
                    </div>

                    <p className="mt-12 text-sm font-serif italic text-[#6E7CA0] tracking-wide">
                        making weak things become strong
                    </p>
                </div>
            </div>
        </main>
    );
}
