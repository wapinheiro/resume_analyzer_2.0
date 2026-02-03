interface ResumePreviewProps {
    candidateName?: string | null;
    candidateEmail?: string | null;
    cpi?: string | null;
}

export function ResumePreview({ candidateName, candidateEmail, cpi }: ResumePreviewProps) {
    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg min-h-[800px] font-sans text-sm relative">
            {/* Disclaimer Overlay */}
            <div className="absolute top-0 right-0 p-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded border border-amber-300">
                    Visualizer Demo (Layout Mock)
                </span>
            </div>

            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-4">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-center">
                    {candidateName || "Candidate Name"}
                </h1>
                <p className="text-center mt-2 text-gray-600">
                    {candidateEmail || "email@example.com"} | {cpi || "Role Target"}
                </p>
            </div>

            {/* Education */}
            <div className="mb-6 opacity-75 blur-[1px] hover:blur-0 transition-all duration-500">
                <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Education</h2>
                <div className="flex justify-between font-bold">
                    <span>Brigham Young University</span>
                    <span>Provo, UT</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Bachelor of Science in Computer Science</span>
                    <span>Apr 2027</span>
                </div>
                <p className="text-gray-600 mt-1">GPA: 3.84</p>
            </div>

            {/* Experience */}
            <div className="mb-6 opacity-75 blur-[1px] hover:blur-0 transition-all duration-500">
                <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Experience</h2>

                {/* Google Intern */}
                <div className="mb-4">
                    <div className="flex justify-between font-bold">
                        <span>Google</span>
                        <span>Mountain View, CA</span>
                    </div>
                    <div className="flex justify-between text-gray-700 italic">
                        <span>Software Engineering Intern</span>
                        <span>May 2025 - Aug 2025</span>
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li className="bg-yellow-200/50 -ml-1 pl-1 pr-1 rounded cursor-pointer border border-yellow-400">
                            Worked on the backend system using Python and Django to improve performance.
                        </li>
                        <li>Collaborated with senior engineers to design new APIs.</li>
                        <li>Wrote tests to ensure code quality.</li>
                    </ul>
                </div>
            </div>

            {/* Projects */}
            <div className="mb-6 opacity-75 blur-[1px] hover:blur-0 transition-all duration-500">
                <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Projects</h2>

                <div className="mb-4">
                    <div className="flex justify-between font-bold">
                        <span>E-commerce Web App</span>
                        <span>React, Node.js, MongoDB</span>
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Built a full-stack application for selling products online.</li>
                        <li className="bg-red-200/50 -ml-1 pl-1 pr-1 rounded cursor-pointer border border-red-400">
                            Implemented authentication securely.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 text-blue-800 text-center rounded border border-blue-200 text-xs">
                <p><strong>Note:</strong> This visualizer is a demo of how your resume <em>could</em> look with optimization.</p>
                <p>Layout engine integration coming in Phase 4.</p>
            </div>
        </div>
    );
}
