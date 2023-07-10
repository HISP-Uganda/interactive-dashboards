import React from "react";
import { ChartProps } from "../../interfaces";
import ThemedDigitalClock from 'themed-digital-clock';
import DigitalClock from "./DigitalClock";

export default function ClockVisualisation({ dataProperties }: ChartProps) {
    return (
        <>
            <DigitalClock />
        </>
    );
}
