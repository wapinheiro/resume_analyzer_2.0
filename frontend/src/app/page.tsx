import { Navbar } from '@/components/ui/Navbar';
import { TypewriterEffect } from '@/components/ui/TypewriterEffect';
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

                        {/* Drag Drop Placeholder */}
                        <div className="mt-12 p-12 border-2 border-dashed border-gray-700 rounded-2xl bg-surface/30 backdrop-blur-sm hover:border-blue-500/50 hover:bg-surface/50 transition-all cursor-pointer group max-w-xl mx-auto">
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <div className="mt-4 flex text-sm leading-6 text-gray-400 justify-center">
                                    <span className="font-semibold text-blue-400">
                                        Drag & Drop PDF here
                                    </span>
                                </div>
                                <p className="text-xs leading-5 text-gray-500 mt-2">No account needed initially</p>
                            </div>
                        </div>

                        <div className="mt-20">
                            <p className="text-lg font-serif italic text-gray-500 tracking-wide mb-6">making weak things become strong</p>
                            <div className="flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Trust Badges: Text based for strict wireframe match */}
                                <div className="flex gap-4 sm:gap-12">
                                    <span className="text-xl font-bold text-gray-300 font-serif">[ BYU ]</span>
                                    <span className="text-xl font-bold text-gray-300 font-serif">[ MIT ]</span>
                                    <span className="text-xl font-bold text-gray-300 font-serif">[ Stanford ]</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
