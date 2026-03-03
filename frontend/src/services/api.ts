const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function analyzeResume(file: File, token?: string, onProgress?: (msg: string) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/analyze/analyze`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to analyze resume');
    }

    if (!response.body) throw new Error('ReadableStream not supported');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let resultData = null;
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const lines = buffer.split('\n');
            // Keep the last line in the buffer as it might be incomplete
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim() === '') continue;
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

        // Process any remaining buffer after stream ends
        if (buffer.trim() !== '') {
            try {
                const message = JSON.parse(buffer);
                if (message.type === 'result') resultData = message.data;
                else if (message.type === 'error') throw new Error(message.message);
            } catch (e) {
                console.warn('Failed to parse final buffer:', buffer);
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
