import React from "react";

interface SpinnerProps {
    size?: "xs" | "sm" | "md" | "lg";
    color?: "white" | "orange" | "gray";
    className?: string;
    variant?: "default" | "pulse" | "gradient";
}

/**
 * Creative compact spinner for buttons and inline use
 */
export default function Spinner({
    size = "sm",
    color = "white",
    className = "",
    variant = "default",
}: SpinnerProps) {
    const sizeClasses = {
        xs: "w-3 h-3 border-2",
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-3",
        lg: "w-8 h-8 border-4",
    };

    const colorClasses = {
        white: "border-white border-t-transparent",
        orange: "border-orange-500 border-t-transparent",
        gray: "border-gray-400 border-t-transparent",
    };

    const gradientClasses = {
        white: "border-white border-t-transparent",
        orange: "border-transparent border-t-orange-500 border-r-orange-400",
        gray: "border-gray-400 border-t-transparent",
    };

    if (variant === "pulse") {
        return (
            <div className="relative" role="status" aria-label="Loading">
                <div
                    className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-orange-600 animate-ping ${className}`}
                    style={{ animationDuration: "1s" }}
                ></div>
                <div
                    className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-500 to-orange-600 ${className}`}
                ></div>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (variant === "gradient") {
        return (
            <div
                className={`${sizeClasses[size]} ${gradientClasses[color]} rounded-full animate-spin ${className}`}
                style={{ animationDuration: "0.8s" }}
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
            style={{ animationDuration: "0.8s" }}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

