import React, { useRef, useEffect, useState } from 'react';

interface ResponsiveTextProps {
    text: string;
    maxWidth: number;
    minFontSize?: number;
    maxFontSize?: number;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Text component that shrinks font size to fit within maxWidth
 */
export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
    text,
    maxWidth,
    minFontSize = 10,
    maxFontSize = 16,
    className,
    style
}) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const [fontSize, setFontSize] = useState(maxFontSize);

    useEffect(() => {
        const element = textRef.current;
        if (!element) return;

        // Start with max font size
        let currentSize = maxFontSize;
        element.style.fontSize = `${currentSize}px`;

        // Shrink until it fits or hits minimum
        while (element.scrollWidth > maxWidth && currentSize > minFontSize) {
            currentSize -= 1;
            element.style.fontSize = `${currentSize}px`;
        }

        setFontSize(currentSize);
    }, [text, maxWidth, minFontSize, maxFontSize]);

    return (
        <span
            ref={textRef}
            className={className}
            style={{
                ...style,
                fontSize: `${fontSize}px`,
                display: 'inline-block',
                maxWidth: `${maxWidth}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
        >
            {text}
        </span>
    );
};
