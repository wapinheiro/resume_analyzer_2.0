'use client';

import { useState, useEffect } from 'react';

interface TypewriterEffectProps {
    text: string;
    delay?: number;
    startDelay?: number;
    cursor?: boolean;
}

export function TypewriterEffect({
    text,
    delay = 50,
    startDelay = 0,
    cursor = true
}: TypewriterEffectProps) {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStarted(true);
        }, startDelay);

        return () => clearTimeout(timeout);
    }, [startDelay]);

    useEffect(() => {
        if (!started) return;

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, started, text]);

    return (
        <span>
            {currentText}
            {cursor && currentIndex < text.length && (
                <span className="animate-pulse">_</span>
            )}
        </span>
    );
}
