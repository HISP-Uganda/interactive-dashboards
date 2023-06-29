import React from "react";
import { ChartProps } from "../../interfaces";
import ThemedDigitalClock from 'themed-digital-clock';

export default function ClockVisualisation({ dataProperties }: ChartProps) {
    return (
        <>
            <ThemedDigitalClock
                description="The time now in New York"
                timezoneName="America/New_York"
                useDarkTheme={true}
                size={400}
            />
        </>
    );
}
