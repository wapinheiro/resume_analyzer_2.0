'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { LoginButton } from './LoginButton';

export function Navbar() {
    const { data: session } = useSession();
    const [hasAnalysis, setHasAnalysis] = useState(false);

    useEffect(() => {
        setHasAnalysis(!!localStorage.getItem('analysisResult'));
    }, []);

    const role = (session?.user as any)?.role;

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-[#001f42]" style={{ backgroundColor: '#002E5D' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-white tracking-tight">
                            Resume Analyzer 2.0
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {role === 'admin' && (
                                <Link href="/admin" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                            {role === 'advisor' && (
                                <Link href="/advisor/dashboard" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Advisor Dashboard
                                </Link>
                            )}
                            {hasAnalysis && role !== 'admin' && role !== 'advisor' && (
                                <Link href="/dashboard" className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            <LoginButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
