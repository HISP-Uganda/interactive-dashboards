import React, { useEffect, useRef, useState } from "react";

export function AutoFontSizeDiv({
    text,
    maxWidth,
    maxHeight,
}: {
    text: string;
    maxWidth: number;
    maxHeight: number;
}) {
    const [fontSize, setFontSize] = useState(40); // Starting font size
    const divRef = useRef<HTMLDivElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const div = divRef.current;
        const span = spanRef.current;

        if (div && span) {
            // Update the span's font size
            span.style.fontSize = fontSize + "px";

            // Check if the span fits within the div's dimensions
            if (span.offsetWidth > maxWidth || span.offsetHeight > maxHeight) {
                // Decrease font size until it fits
                while (
                    span.offsetWidth > maxWidth ||
                    span.offsetHeight > maxHeight
                ) {
                    setFontSize((prevFontSize) => prevFontSize - 1);
                    span.style.fontSize = fontSize - 1 + "px";
                }
            }
        }
    }, [fontSize, maxWidth, maxHeight]);

    return (
        <div
            ref={divRef}
            style={{ height: maxHeight, width: maxWidth, overflow: "hidden" }}
        >
            <span ref={spanRef} style={{ whiteSpace: "nowrap" }}>
                {text}
            </span>
        </div>
    );
}
