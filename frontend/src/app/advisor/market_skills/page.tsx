'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Edit2, X, Check, Save } from 'lucide-react';

type MarketSkill = {
    id: string;
    name: string;
    category: string;
    major: string | null;
    importance: number;
};

export default function MarketSkillsManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [skills, setSkills] = useState<MarketSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form state for adding/editing
    const [newSkill, setNewSkill] = useState<Partial<MarketSkill>>({
        name: '',
        category: 'Programming Languages',
        major: '',
        importance: 3
    });
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<MarketSkill>>({});

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const token = (session as any)?.accessToken;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/advisors/market-skills`, { headers });
            if (res.ok) {
                const data = await res.json();
                setSkills(data);
            }
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchSkills();
        }
    }, [status]);

    const handleCreate = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const token = (session as any)?.accessToken;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/advisors/market-skills`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    ...newSkill,
                    major: newSkill.major || null
                })
            });

            if (res.ok) {
                setIsAdding(false);
                setNewSkill({ name: '', category: 'Programming Languages', major: '', importance: 3 });
                fetchSkills();
            }
        } catch (error) {
            console.error("Failed to create skill:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this skill from the reference dataset?")) return;

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const token = (session as any)?.accessToken;
            const headers: HeadersInit = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/advisors/market-skills/${id}`, {
                method: 'DELETE',
                headers
            });

            if (res.ok) {
                fetchSkills();
            }
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
    };

    const startEditing = (skill: MarketSkill) => {
        setEditingId(skill.id);
        setEditForm({ ...skill });
    };

    const handleUpdate = async (id: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
            const token = (session as any)?.accessToken;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/advisors/market-skills/${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                setEditingId(null);
                fetchSkills();
            }
        } catch (error) {
            console.error("Failed to update skill:", error);
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/advisor/dashboard" className="text-[#0047BA] hover:text-[#002E5D] transition-colors text-sm font-medium px-4 py-2 bg-blue-50 rounded-lg">
                            ← Back
                        </Link>
                        <h1 className="text-3xl font-bold">Skills Reference Management</h1>
                    </div>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-[#0047BA] text-white px-6 py-2 rounded-xl hover:bg-[#002E5D] transition-all shadow-lg hover:shadow-blue-200/50 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Add New Skill
                    </button>
                </div>

                {/* Add Skill Form (Inline Modal Style) */}
                {isAdding && (
                    <div className="glass-panel p-8 rounded-2xl mb-8 border-2 border-blue-500 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#002E5D]">Register New Market Requirement</h2>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-[#6E7CA0] uppercase mb-2">Skill Name</label>
                                <input 
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="e.g. RAG, Kubernetes"
                                    value={newSkill.name}
                                    onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-[#6E7CA0] uppercase mb-2">Category</label>
                                <select 
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newSkill.category}
                                    onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                                >
                                    <option>Programming Languages</option>
                                    <option>AI/ML</option>
                                    <option>DevOps</option>
                                    <option>Architecture</option>
                                    <option>Cloud</option>
                                    <option>Database</option>
                                    <option>Security</option>
                                    <option>Frontend</option>
                                    <option>Data</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-[#6E7CA0] uppercase mb-2">Major Focus (Optional)</label>
                                <input 
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="e.g. Computer Science"
                                    value={newSkill.major || ''}
                                    onChange={e => setNewSkill({...newSkill, major: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-[#6E7CA0] uppercase mb-2">Importance (1-5)</label>
                                <input 
                                    type="number" min="1" max="5"
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newSkill.importance}
                                    onChange={e => setNewSkill({...newSkill, importance: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-8 gap-4">
                            <button onClick={() => setIsAdding(false)} className="px-6 py-2 text-gray-500 font-medium hover:text-gray-700">Cancel</button>
                            <button 
                                onClick={handleCreate}
                                disabled={!newSkill.name}
                                className="bg-[#0047BA] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#002E5D] disabled:opacity-50 transition-colors"
                            >
                                Register Skill
                            </button>
                        </div>
                    </div>
                )}

                {/* Skills Table */}
                <div className="glass-panel rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-[#6E7CA0] border-b border-gray-100">
                                    <th className="p-6 font-semibold">Skill Name</th>
                                    <th className="p-6 font-semibold">Category</th>
                                    <th className="p-6 font-semibold">Major Focus</th>
                                    <th className="p-6 font-semibold">Importance</th>
                                    <th className="p-6 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {skills.map((skill) => (
                                    <tr key={skill.id} className="hover:bg-gray-50/20 transition-colors group">
                                        <td className="p-6">
                                            {editingId === skill.id ? (
                                                <input 
                                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                                />
                                            ) : (
                                                <span className="font-bold text-[#002E5D]">{skill.name}</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            {editingId === skill.id ? (
                                                <select 
                                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                                    value={editForm.category}
                                                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                                                >
                                                    <option>Programming Languages</option>
                                                    <option>AI/ML</option>
                                                    <option>DevOps</option>
                                                    <option>Architecture</option>
                                                    <option>Cloud</option>
                                                    <option>Database</option>
                                                    <option>Security</option>
                                                    <option>Frontend</option>
                                                    <option>Data</option>
                                                </select>
                                            ) : (
                                                <span className="text-gray-600">{skill.category}</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            {editingId === skill.id ? (
                                                <input 
                                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                                    value={editForm.major || ''}
                                                    onChange={e => setEditForm({...editForm, major: e.target.value})}
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-[#6E7CA0]">{skill.major || 'Global'}</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            {editingId === skill.id ? (
                                                <input 
                                                    type="number" min="1" max="5"
                                                    className="w-16 border border-gray-300 rounded px-2 py-1"
                                                    value={editForm.importance}
                                                    onChange={e => setEditForm({...editForm, importance: parseInt(e.target.value)})}
                                                />
                                            ) : (
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-2 h-2 rounded-full ${i < skill.importance ? 'bg-amber-500' : 'bg-gray-200'}`} />
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {editingId === skill.id ? (
                                                    <>
                                                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-gray-600">
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleUpdate(skill.id)} className="p-2 text-emerald-600 hover:text-emerald-700">
                                                            <Save className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEditing(skill)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {skills.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-500">
                                            No canonical skills registered. Click "Add New Skill" to begin seeding.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
