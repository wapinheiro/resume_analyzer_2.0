import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
            <Navbar />

            <div className="relative isolate pt-14">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                            Is your resume <span className="text-gradient">Market Ready?</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-400">
                            Stop guessing. Get an instant, AI-powered audit of your resume based on
                            recruiters' hidden criteria. 100% Free for students.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/dashboard"
                                className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105"
                            >
                                Analyze My Resume
                            </Link>
                            <a href="#" className="text-sm font-semibold leading-6 text-white hover:text-blue-400 transition-colors">
                                View sample report <span aria-hidden="true">→</span>
                            </a>
                        </div>

                        {/* Drag Drop Placeholder */}
                        <div className="mt-16 p-10 border-2 border-dashed border-gray-700 rounded-2xl bg-surface/50 backdrop-blur-sm hover:border-blue-500/50 transition-colors cursor-pointer group">
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <div className="mt-4 flex text-sm leading-6 text-gray-400 justify-center">
                                    <span className="relative rounded-md font-semibold text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                        Upload a file
                                    </span>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-500">PDF up to 10MB</p>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Trust Badges Placeholder */}
                            <span className="text-sm font-semibold text-gray-500">TRUSTED BY STUDENTS AT TOP UNIVERSITIES</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
