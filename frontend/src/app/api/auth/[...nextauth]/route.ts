import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });

                    if (res.ok) {
                        const user = await res.json();
                        // user object from db contains id, email, name, avatar_url, role
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            image: user.avatar_url,
                            role: user.role
                        };
                    }
                    return null;
                } catch (e) {
                    console.error("Login verification failed:", e);
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    pages: {
        signIn: '/login',
    },
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
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            if (!token.accessToken && token.id) {
                const jwt = require("jsonwebtoken");
                token.accessToken = jwt.sign(
                    { sub: token.id, role: token.role },
                    process.env.NEXTAUTH_SECRET as string,
                    { algorithm: 'HS256' }
                );
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session as any).accessToken = token.accessToken;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
