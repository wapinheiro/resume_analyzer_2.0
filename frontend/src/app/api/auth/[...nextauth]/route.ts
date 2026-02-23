import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false;

            try {
                // Sync user with FastAPI backend
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/sync`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name || null,
                        avatar_url: user.image || null,
                    }),
                });

                if (res.ok) {
                    const dbUser = await res.json();
                    // Embed postgres id and role onto the user object temporarily
                    // so the jwt callback can pick them up
                    user.id = dbUser.id;
                    (user as any).role = dbUser.role;
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error syncing user with backend:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            // First time jwt callback is run, user object is available
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
