interface OptimizedResumePreviewProps {
    candidateName?: string | null;
    candidateEmail?: string | null;
    cpi?: string | null;
}

export function OptimizedResumePreview({ candidateName, candidateEmail, cpi }: OptimizedResumePreviewProps) {
    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg min-h-[800px] font-sans text-sm border-2 border-emerald-500/50 relative overflow-hidden">

            {/* AI Badge */}
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 font-bold rounded-bl-lg shadow-sm">
                AI OPTIMIZED
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
            <div className="mb-6">
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
            <div className="mb-6">
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
                        <li className="bg-emerald-100 -ml-1 pl-1 pr-1 rounded border border-emerald-300">
                            <strong>Engineered</strong> a scalable backend system using Python and Django, reducing API latency by <strong>40%</strong>.
                        </li>
                        <li>Collaborated with senior engineers to design RESTful APIs serving 1M+ daily users.</li>
                        <li>Authored comprehensive unit tests, achieving 95% code coverage.</li>
                    </ul>
                </div>
            </div>

            {/* Projects */}
            <div className="mb-6">
                <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Projects</h2>

                <div className="mb-4">
                    <div className="flex justify-between font-bold">
                        <span>E-commerce Web App</span>
                        <span>React, Node.js, MongoDB</span>
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Built a full-stack application for selling products online.</li>
                        <li className="bg-emerald-100 -ml-1 pl-1 pr-1 rounded border border-emerald-300">
                            <strong>Architected</strong> a secure JWT authentication system, effectively preventing unauthorized access for 5,000+ users.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
