'use client';

import Link from 'next/link';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from 'react';

export function Navbar() {
    const [hasAnalysis, setHasAnalysis] = useState(false);

    useEffect(() => {
        setHasAnalysis(!!localStorage.getItem('analysisResult'));
    }, []);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-gray-800 glass-panel">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Resume Analyzer 2.0
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {hasAnalysis && (
                                <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Dashboard
                                </Link>
                            )}

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                        Login
                                    </button>
                                </SignInButton>
                            </SignedOut>

                            <SignedIn>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
