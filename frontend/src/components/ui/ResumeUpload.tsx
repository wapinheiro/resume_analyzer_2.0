'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeResume } from '@/services/api';

export function ResumeUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files?.length) {
            handleFile(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        setIsUploading(true);
        try {
            const data = await analyzeResume(file);
            console.log('Analysis result:', data);
            // In a real app, we'd store this in global state/context
            // For now, let's just push to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Upload failed. Is the backend running?');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-12 p-12 border-2 border-dashed rounded-2xl backdrop-blur-sm transition-all cursor-pointer group max-w-xl mx-auto
                ${isDragging ? 'border-blue-500 bg-surface/50' : 'border-gray-700 bg-surface/30'}
                ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-500/50 hover:bg-surface/50'}
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
                accept="application/pdf"
            />

            <div className="text-center">
                {isUploading ? (
                    <div className="animate-pulse">
                        <div className="mx-auto h-12 w-12 text-blue-400">
                            {/* Spinner or similar icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </div>
                        <div className="mt-4 text-sm font-semibold text-blue-400">
                            Analyzing...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <div className="mt-4 flex text-sm leading-6 text-gray-400 justify-center">
                            <span className="font-semibold text-blue-400">
                                Drag & Drop PDF here
                            </span>
                        </div>
                        <p className="text-xs leading-5 text-gray-500 mt-2">No account needed initially</p>
                    </>
                )}
            </div>
        </div>
    );
}
