export interface Issue {
    id: string;
    type: string;
    location: string; // e.g., "Bullet 3, Experience"
    description: string;
    fix: string;
    impact: 'High' | 'Medium' | 'Low';
}

export interface LayerResult {
    id: string;
    name: string;
    score: number; // 0-10
    status: 'good' | 'warning' | 'critical';
    issues: Issue[];
}

export interface AnalysisResult {
    rms: number; // 0-100
    identity: {
        title: string;
        confidence: number; // 0-100
    };
    layers: {
        format: LayerResult;
        skills: LayerResult;
        impact: LayerResult;
        story: LayerResult;
        xfactor: LayerResult;
    };
    summary: {
        topStrength: string;
        topWeakness: string;
    }
}

export const MOCK_ANALYSIS: AnalysisResult = {
    rms: 62,
    identity: {
        title: "Full Stack Developer",
        confidence: 85
    },
    layers: {
        format: {
            id: 'format',
            name: 'Format & ATS',
            score: 9,
            status: 'good',
            issues: []
        },
        skills: {
            id: 'skills',
            name: 'Tech Stack',
            score: 8,
            status: 'good',
            issues: []
        },
        impact: {
            id: 'impact',
            name: 'Impact & Metrics',
            score: 4,
            status: 'critical',
            issues: [
                {
                    id: 'i1',
                    type: 'Weak Verb',
                    location: 'Experience: Google Intern',
                    description: '"Worked on" is a passive verb that diminishes your contribution.',
                    fix: 'Replace with "Engineered", "Architected", or "Developed".',
                    impact: 'High'
                },
                {
                    id: 'i2',
                    type: 'Missing Metrics',
                    location: 'Project: E-commerce App',
                    description: 'Claiming "improved performance" is vague without numbers.',
                    fix: 'Add a metric, e.g., "reduced latency by 40%".',
                    impact: 'High'
                }
            ]
        },
        story: {
            id: 'story',
            name: 'Coherence',
            score: 6,
            status: 'warning',
            issues: [
                {
                    id: 's1',
                    type: 'Identity Mismatch',
                    location: 'Summary',
                    description: 'Summary mentions "Data Science" but projects are 100% Web Dev.',
                    fix: 'Align summary to "Full Stack Engineering" focus.',
                    impact: 'Medium'
                }
            ]
        },
        xfactor: {
            id: 'xfactor',
            name: 'X-Factor',
            score: 3,
            status: 'critical',
            issues: [
                {
                    id: 'x1',
                    type: 'Low Agency',
                    location: 'Projects',
                    description: 'All projects listed are class assignments.',
                    fix: 'Add one independent personal project outside of coursework.',
                    impact: 'High'
                }
            ]
        }
    },
    summary: {
        topStrength: "Strong, modern Tech Stack definitions.",
        topWeakness: "Lack of quantitative metrics in Experience section."
    }
};

export const MOCK_HISTORY = [
    { version: 'v1', date: 'Jan 22', score: 45 },
    { version: 'v2', date: 'Feb 01', score: 62 }, // Current
    { version: 'v3', date: 'Future', score: 78 }, // Projected
];
