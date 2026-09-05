'use client';

import { Navbar } from '@/components/ui/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, GraduationCap, Briefcase, UserCheck, Save, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    const [profile, setProfile] = useState({
        major: '',
        graduation_year: '',
        student_status: 'active_student'
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (status !== 'authenticated') return;
            
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
                const token = (session as any)?.accessToken;
                const headers: HeadersInit = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                // Actually we can get it from the session user if we update the session sync
                // but for now let's just fetch from /sync to get the latest record
                const res = await fetch(`${API_URL}/users/sync`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        email: session.user?.email,
                        name: session.user?.name,
                        avatar_url: session.user?.image
                    })
                });

                if (res.ok) {
                    const userData = await res.json();
                    setProfile({
                        major: userData.major || '',
                        graduation_year: userData.graduation_year?.toString() || '',
                        student_status: userData.student_status || 'active_student'
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, session]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const token = (session as any)?.accessToken;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/users/me/profile`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    major: profile.major,
                    graduation_year: profile.graduation_year ? parseInt(profile.graduation_year) : null,
                    student_status: profile.student_status
                })
            });

            if (res.ok) {
                setSaved(true);
                // Optionally update the session if role or status changed
                // but here it's mostly metadata
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || status === 'loading') {
        return <div className="min-h-screen bg-background flex items-center justify-center text-gray-700 font-medium">Loading Profile...</div>;
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Navbar />

            <div className="flex-1 pt-32 pb-12 px-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                        <User className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#002E5D]">Profile Settings</h1>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                                <GraduationCap className="w-4 h-4" />
                                Academic Major
                            </label>
                            <input
                                type="text"
                                value={profile.major}
                                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                                placeholder="e.g. Computer Science"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-lg font-medium transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                                <Briefcase className="w-4 h-4" />
                                Graduation Year
                            </label>
                            <input
                                type="number"
                                value={profile.graduation_year}
                                onChange={(e) => setProfile({ ...profile, graduation_year: e.target.value })}
                                placeholder="e.g. 2026"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-lg font-medium transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                                <UserCheck className="w-4 h-4" />
                                Current Status
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { id: 'active_student', label: 'Active Student' },
                                    { id: 'alumni', label: 'Alumni' },
                                    { id: 'non_student', label: 'Staff/Tester' }
                                ].map((status) => (
                                    <button
                                        key={status.id}
                                        type="button"
                                        onClick={() => setProfile({ ...profile, student_status: status.id })}
                                        className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                            profile.student_status === status.id
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                                        }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${
                                    saved 
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                                        : 'bg-[#0047BA] hover:bg-[#002E5D] text-white shadow-lg shadow-blue-200'
                                } active:scale-[0.98] disabled:opacity-70`}
                            >
                                {saving ? (
                                    'Saving Changes...'
                                ) : saved ? (
                                    <>
                                        <CheckCircle2 className="w-6 h-6" />
                                        Profile Updated!
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6" />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-slate-400 font-medium text-sm">
                    This data helps your advisors provide targeted feedback based on your specific major and year.
                </p>
            </div>
        </main>
    );
}
