import React from "react";
import { useErrorBoundary } from "react-error-boundary";

export default function ErrorApp() {
    const handleError = useErrorBoundary();
    return <div>ErrorApp</div>;
}
