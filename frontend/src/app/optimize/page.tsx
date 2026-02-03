import { Navbar } from '@/components/ui/Navbar';
import { ResumePreview } from '@/components/ui/ResumePreview';
import { OptimizedResumePreview } from '@/components/ui/OptimizedResumePreview';
import Link from 'next/link';

export default function OptimizePage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/analysis" className="text-gray-400 hover:text-white transition-colors">
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-bold">The Vision</h1>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-surface hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700">
                            Copy All Changes
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                            Download Optimized PDF
                        </button>
                    </div>
                </div>

                {/* Split View */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">

                    {/* Left: Original */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-4">
                            <span className="text-gray-400 font-medium">Original</span>
                            <span className="text-red-400 font-mono text-sm">Score: 62</span>
                        </div>
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden opacity-80 scale-[0.98]">
                            <ResumePreview />
                        </div>
                    </div>

                    {/* Right: Optimized */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-4">
                            <span className="text-emerald-400 font-medium flex items-center gap-2">
                                ✨ Optimized Version
                            </span>
                            <span className="text-emerald-400 font-mono text-sm">Score: 94</span>
                        </div>
                        <div className="bg-white rounded-lg shadow-2xl overflow-hidden ring-4 ring-emerald-500/20 shadow-emerald-500/20">
                            <OptimizedResumePreview />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
