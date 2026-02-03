'use client';

import { useState, useRef } from 'react';

export interface ResumeUploadProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export function ResumeUpload({ onFileSelect, selectedFile }: ResumeUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files?.length) {
            validateAndSelect(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            validateAndSelect(e.target.files[0]);
        }
    };

    const validateAndSelect = (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }
        onFileSelect(file);
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-12 p-12 border-2 border-dashed rounded-2xl backdrop-blur-sm transition-all cursor-pointer group max-w-xl mx-auto
                ${isDragging ? 'border-blue-500 bg-surface/50' : 'border-gray-700 bg-surface/30'}
                ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/10' : 'hover:border-blue-500/50 hover:bg-surface/50'}
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
                {selectedFile ? (
                    <>
                        <div className="mx-auto h-12 w-12 text-emerald-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="mt-4 text-sm font-semibold text-emerald-400">
                            Ready to Analyze
                        </div>
                        <p className="text-xs leading-5 text-gray-400 mt-2">{selectedFile.name}</p>
                        <p className="text-xs leading-5 text-gray-500 mt-1">Click to change file</p>
                    </>
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
