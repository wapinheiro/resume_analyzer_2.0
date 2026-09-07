"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, AlertCircle, Loader2, ArrowLeft, UserPlus, LogIn } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams ? searchParams.get('callbackUrl') || '/' : '/';

    const [mode, setMode] = useState<'signin' | 'signup'>('signup');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (mode === 'signup') {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                setIsLoading(false);
                return;
            }
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://resume-analyzer-backend-87294979859.us-central1.run.app/api/v1';

            if (mode === 'signup') {
                // Register / sync user profile in backend database
                const syncRes = await fetch(`${API_URL}/users/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name,
                        avatar_url: null,
                    }),
                });

                if (!syncRes.ok) {
                    throw new Error("Failed to register user record");
                }
            }

            // Authenticate session via NextAuth credentials
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                if (mode === 'signup') {
                    // For newly created accounts, complete redirect
                    router.push(callbackUrl);
                    router.refresh();
                } else {
                    setError("Invalid email or password");
                }
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = (provider: string) => {
        setOauthLoading(provider);
        signIn(provider, { callbackUrl });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient glowing background shapes */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0047BA] mb-6 transition-colors gap-1.5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#002E5D] font-black text-xl mb-3 shadow-md shadow-blue-500/5">
                        RA
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#002E5D]">
                        Resume Analyzer
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        {mode === 'signup' ? 'Create your account to start reviewing your resume' : 'Sign in to access your analysis history & advisor tools'}
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 sm:px-10">
                    
                    {/* Top: Default One-Click Social OAuth Options */}
                    <div className="space-y-3 mb-6">
                        <p className="text-xs font-semibold text-center text-slate-600">
                            Fastest One-Click Sign-In
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleOAuth("google")}
                                disabled={oauthLoading !== null}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 disabled:opacity-50 transition-all group"
                            >
                                {oauthLoading === "google" ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                ) : (
                                    <>
                                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Google
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handleOAuth("github")}
                                disabled={oauthLoading !== null}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-800 rounded-xl shadow-sm bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white disabled:opacity-50 transition-all"
                            >
                                {oauthLoading === "github" ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                ) : (
                                    <>
                                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        GitHub
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-slate-500 font-medium">Or continue with email</span>
                        </div>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 mb-6">
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(''); }}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                mode === 'signup' ? 'bg-[#0047BA] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Create Account
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signin'); setError(''); }}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                mode === 'signin' ? 'bg-[#0047BA] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            Sign In
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-700">{error}</p>
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email address</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    placeholder="you@byu.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0047BA] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : mode === 'signup' ? (
                                "Create Account"
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading auth...</div>}>
            <LoginForm />
        </Suspense>
    );
}

