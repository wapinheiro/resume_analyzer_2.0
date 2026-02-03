import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
            <Navbar />

            <div className="relative isolate pt-14">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">

                        {/* Wireframe Headline: Code Style */}
                        <div className="font-mono text-left inline-block bg-surface/50 p-6 sm:p-10 rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm mb-8 transform hover:scale-[1.02] transition-transform duration-500">
                            <p className="text-emerald-400 text-xl sm:text-4xl font-bold tracking-tight mb-4">
                                passed_ats_filters = <span className="text-blue-400">True</span>
                            </p>
                            <p className="text-emerald-400 text-xl sm:text-4xl font-bold tracking-tight">
                                human_impressed = <span className="text-blue-400">True</span>
                            </p>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/dashboard"
                                className="rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105"
                            >
                                Analyze My Resume (Free)
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
                            <p className="text-sm font-semibold text-gray-500 tracking-wider mb-6 uppercase">Trusted by students at</p>
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
