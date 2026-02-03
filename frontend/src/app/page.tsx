'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { TypewriterEffect } from '@/components/ui/TypewriterEffect';
import { ResumeUpload } from '@/components/ui/ResumeUpload';
import { analyzeResume } from '@/services/api';

export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const router = useRouter();

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setLoadingStep('Uploading PDF...');

        // Simulate progress steps while waiting for real response
        const steps = ['Extracting Text...', 'AI Analyzing Profile...', 'Calculating Score...', 'Finalizing Report...'];
        let stepIndex = 0;

        const progressInterval = setInterval(() => {
            if (stepIndex < steps.length) {
                setLoadingStep(steps[stepIndex]);
                stepIndex++;
            }
        }, 2000); // Update text every 2 seconds

        try {
            const data = await analyzeResume(selectedFile);
            clearInterval(progressInterval);
            setLoadingStep('Done! Redirecting...');

            console.log('Analysis result:', data);
            localStorage.setItem('analysisResult', JSON.stringify(data));
            router.push('/dashboard');
        } catch (error) {
            clearInterval(progressInterval);
            console.error(error);
            alert('Analysis failed. Please try again.');
            setIsAnalyzing(false);
            setLoadingStep('');
        }
    };

    return (
        <main className="min-h-screen bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
            <Navbar />

            <div className="relative isolate pt-14">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">

                        {/* Wireframe Headline: CLI / Terminal Code Style */}
                        <div className="font-mono text-left inline-block bg-slate-950 p-6 rounded-lg border border-slate-800 shadow-2xl mb-8 min-w-[300px] sm:min-w-[450px]">
                            {/* Terminal Dots */}
                            <div className="flex gap-2 mb-4 opacity-50">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>

                            <div className="space-y-2 text-sm sm:text-base">
                                <p className="text-emerald-500">
                                    <span className="text-slate-500 mr-2">$</span>
                                    <TypewriterEffect text="pass_ats_filters = True" delay={40} />
                                </p>
                                <p className="text-emerald-500">
                                    <span className="text-slate-500 mr-2">$</span>
                                    <TypewriterEffect text="impress_human = True" delay={40} startDelay={1000} />
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={handleAnalyze}
                                disabled={!selectedFile || isAnalyzing}
                                className={`rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all min-w-[200px]
                                    ${!selectedFile
                                        ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                                        : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-500 hover:scale-105'
                                    }
                                    ${isAnalyzing ? 'animate-pulse cursor-wait' : ''}
                                `}
                            >
                                {isAnalyzing ? loadingStep : 'Analyze My Resume'}
                            </button>
                        </div>

                        {/* Functional Drag & Drop */}
                        <ResumeUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />

                        <div className="mt-20">
                            <p className="text-xl font-serif italic text-gray-400 tracking-wide mb-6">making weak things become strong</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
