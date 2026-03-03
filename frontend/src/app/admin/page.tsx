"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/ui/Navbar";
import { Users, Shield, User, GraduationCap, Clock, Save, Loader2 } from "lucide-react";

interface DatabaseUser {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    role: string;
    last_login: string | null;
    created_at: string;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<DatabaseUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    useEffect(() => {
        if (status === "authenticated") {
            fetchUsers();
        }
    }, [status]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/users`, {
                headers: {
                    "Authorization": `Bearer ${(session as any)?.accessToken}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setSavingId(userId);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${(session as any)?.accessToken}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                // Update local state instantly
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role");
            }
        } catch (error) {
            console.error("Failed to update role", error);
        } finally {
            setSavingId(null);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="w-4 h-4 text-purple-600" />;
            case 'advisor': return <User className="w-4 h-4 text-blue-600" />;
            default: return <GraduationCap className="w-4 h-4 text-slate-600" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return "bg-purple-100 text-purple-700 border-purple-200";
            case 'advisor': return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                            <Users className="w-6 h-6 text-blue-600" />
                            User Management
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Manage system access and permissions</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
                        Total Users: {users.length}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{user.name || "Unknown User"}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {user.last_login ? new Date(user.last_login).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {savingId === user.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                                                ) : (
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className="text-sm border border-slate-300 rounded-lg py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="advisor">Advisor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
