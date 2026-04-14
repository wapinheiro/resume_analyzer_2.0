"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function LoginButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="h-9 w-20 rounded-full bg-white/10 animate-pulse"></div>;
    }

    if (session && session.user) {
        return (
            <div className="flex items-center gap-4">
                {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={session.user.image}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border border-white/20"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {session.user.name?.charAt(0) || "U"}
                    </div>
                )}
                <Link
                    href="/profile"
                    className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Profile
                </Link>
                <button
                    onClick={() => signOut()}
                    className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10 hover:border-white/20"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn()}
            className="bg-[#0047BA] hover:bg-[#003a9e] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
            Login
        </button>
    );
}
