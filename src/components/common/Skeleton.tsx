import React from "react";

interface SkeletonProps {
    variant?: "text" | "circular" | "rectangular" | "card";
    width?: string | number;
    height?: string | number;
    className?: string;
    count?: number;
}

/**
 * Modern skeleton loader for content placeholders
 */
export default function Skeleton({
    variant = "text",
    width,
    height,
    className = "",
    count = 1,
}: SkeletonProps) {
    const baseClasses =
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

    const variantClasses = {
        text: "rounded h-4",
        circular: "rounded-full",
        rectangular: "rounded",
        card: "rounded-xl",
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === "number" ? `${width}px` : width;
    if (height)
        style.height = typeof height === "number" ? `${height}px` : height;

    const skeletonElement = (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        ></div>
    );

    if (count === 1) {
        return skeletonElement;
    }

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>{skeletonElement}</React.Fragment>
            ))}
        </>
    );
}

/**
 * Pre-built skeleton components for common layouts
 */
export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide"></div>
            </div>
            <div className="p-6 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-full"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-2/3"></div>
                <div className="flex gap-2 mt-4">
                    <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full w-16"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full w-20"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 pb-3 border-b">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                        key={i}
                        variant="text"
                        width="25%"
                        height={20}
                        className="h-5"
                    />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    {[1, 2, 3, 4].map((j) => (
                        <Skeleton
                            key={j}
                            variant="text"
                            width="25%"
                            height={16}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

