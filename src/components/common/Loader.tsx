import React from "react";

interface LoaderProps {
    size?: "sm" | "md" | "lg" | "xl";
    fullScreen?: boolean;
    text?: string;
    variant?:
        | "spinner"
        | "dots"
        | "pulse"
        | "bars"
        | "wave"
        | "orbit"
        | "ripple"
        | "cube"
        | "gradient";
}

/**
 * Creative and modern loader component with multiple animation styles
 */
export default function Loader({
    size = "md",
    fullScreen = false,
    text,
    variant = "spinner",
}: LoaderProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const containerClasses = fullScreen
        ? "fixed inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white backdrop-blur-md flex flex-col items-center justify-center z-50"
        : "flex flex-col items-center justify-center p-8";

    const renderLoader = () => {
        switch (variant) {
            case "dots":
                return (
                    <div className="flex items-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 animate-bounce`}
                                style={{
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: "0.6s",
                                }}
                            ></div>
                        ))}
                    </div>
                );

            case "pulse":
                return (
                    <div className="relative">
                        <div
                            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 animate-ping`}
                        ></div>
                        <div
                            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-500 to-orange-600 absolute top-0 left-0 animate-pulse`}
                        ></div>
                    </div>
                );

            case "bars":
                return (
                    <div className="flex items-end gap-1.5 h-12">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-2.5 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600 rounded-t-md shadow-md shadow-orange-500/30 animate-bounce"
                                style={{
                                    height: `${[100, 80, 100, 60, 100][i]}%`,
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: "0.8s",
                                }}
                            ></div>
                        ))}
                    </div>
                );

            case "wave":
                return (
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-8 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-600 rounded-full animate-wave"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            ></div>
                        ))}
                    </div>
                );

            case "orbit":
                return (
                    <div className={`relative ${sizeClasses[size]}`}>
                        <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/50"></div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                            <div className="w-2 h-2 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full shadow-md shadow-orange-500/30"></div>
                        </div>
                    </div>
                );

            case "ripple":
                return (
                    <div className="relative">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-orange-500 animate-ripple`}
                                style={{
                                    animationDelay: `${i * 0.3}s`,
                                    opacity: 1 - i * 0.3,
                                }}
                            ></div>
                        ))}
                        <div
                            className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/50`}
                        ></div>
                    </div>
                );

            case "cube":
                return (
                    <div className="relative perspective-1000">
                        <div className="cube-container animate-cube-rotate">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className={`cube-face bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/50`}
                                    style={{
                                        transform: `rotateY(${
                                            i * 60
                                        }deg) translateZ(${
                                            size === "sm"
                                                ? "10px"
                                                : size === "md"
                                                ? "20px"
                                                : size === "lg"
                                                ? "30px"
                                                : "40px"
                                        })`,
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                );

            case "gradient":
                return (
                    <div className="relative">
                        <div
                            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-[length:200%_100%] animate-gradient-x shadow-lg shadow-orange-500/50`}
                        ></div>
                        <div
                            className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin`}
                            style={{ animationDuration: "2s" }}
                        ></div>
                    </div>
                );

            case "spinner":
            default:
                return (
                    <div className="relative">
                        <div
                            className={`${sizeClasses[size]} border-4 border-orange-100 rounded-full`}
                        ></div>
                        <div
                            className={`${sizeClasses[size]} border-4 border-transparent border-t-orange-500 border-r-orange-400 rounded-full animate-spin absolute top-0 left-0`}
                            style={{ animationDuration: "0.8s" }}
                        ></div>
                        <div
                            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-b-orange-600 border-l-orange-300 rounded-full animate-spin`}
                            style={{
                                animationDuration: "1.2s",
                                animationDirection: "reverse",
                            }}
                        ></div>
                    </div>
                );
        }
    };

    return (
        <div className={containerClasses}>
            {renderLoader()}
            {text && (
                <p className="mt-6 text-gray-700 font-medium text-sm animate-fade-in-up">
                    {text}
                </p>
            )}
        </div>
    );
}

