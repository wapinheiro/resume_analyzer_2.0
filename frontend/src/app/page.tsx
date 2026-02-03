import { Navbar } from '@/components/ui/Navbar';
import { TypewriterEffect } from '@/components/ui/TypewriterEffect';
import { ResumeUpload } from '@/components/ui/ResumeUpload';
import Link from 'next/link';

export default function Home() {
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
                            <Link
                                href="/dashboard"
                                className="rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105"
                            >
                                Analyze My Resume
                            </Link>
                        </div>

                        {/* Functional Drag & Drop */}
                        <ResumeUpload />

                        <div className="mt-20">
                            <p className="text-xl font-serif italic text-gray-400 tracking-wide mb-6">making weak things become strong</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
