const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function analyzeResume(file: File, onProgress?: (msg: string) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/resumes/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to analyze resume');
    }

    if (!response.body) throw new Error('ReadableStream not supported');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let resultData = null;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                try {
                    const message = JSON.parse(line);

                    if (message.type === 'log') {
                        if (onProgress) onProgress(message.message);
                        console.log('Server Log:', message.message);
                    } else if (message.type === 'result') {
                        resultData = message.data;
                    } else if (message.type === 'error') {
                        throw new Error(message.message);
                    }
                } catch (e) {
                    console.warn('Failed to parse stream chunk:', line);
                }
            }
        }
    } finally {
        reader.releaseLock();
    }

    if (!resultData) {
        throw new Error('Analysis completed but no result returned');
    }

    return resultData;
}
