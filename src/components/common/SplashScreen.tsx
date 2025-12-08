import { useEffect, useState } from "react";

interface SplashScreenProps {
    onFinish?: () => void;
    minDisplayTime?: number; // Minimum time to show splash screen in ms
}

/**
 * Modern and creative Splash Screen component with logo animation
 */
export default function SplashScreen({
    onFinish,
    minDisplayTime = 2000,
}: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Wait for minimum display time, then fade out
        const timer = setTimeout(() => {
            setIsAnimating(true);

            // After fade animation completes, hide splash
            setTimeout(() => {
                setIsVisible(false);
                if (onFinish) {
                    onFinish();
                }
            }, 600); // Match fade-out animation duration
        }, minDisplayTime);

        return () => clearTimeout(timer);
    }, [minDisplayTime, onFinish]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-600 ${
                isAnimating ? "opacity-0" : "opacity-100"
            }`}
            style={{
                background:
                    "linear-gradient(135deg, #1B6EF3 0%, #2A8DC4 25%, #3EB5EA 50%, #1B6EF3 75%, #3EB5EA 100%)",
                backgroundSize: "400% 400%",
                animation: "gradientShift 8s ease infinite",
            }}
        >
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Circles */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-20 blur-xl"
                        style={{
                            width: `${100 + i * 50}px`,
                            height: `${100 + i * 50}px`,
                            background: `linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))`,
                            left: `${20 + i * 15}%`,
                            top: `${10 + i * 12}%`,
                            animation: `float${i} ${
                                8 + i * 2
                            }s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Logo Container with Advanced Animation */}
                <div className="relative mb-8">
                    {/* Glowing Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-40 h-40 rounded-full border-4 border-white/30 animate-splash-ring-1"></div>
                        <div className="absolute w-44 h-44 rounded-full border-4 border-white/20 animate-splash-ring-2"></div>
                        <div className="absolute w-48 h-48 rounded-full border-4 border-white/10 animate-splash-ring-3"></div>
                    </div>

                    {/* Logo with Glow Effect */}
                    <div className="relative animate-splash-logo-modern">
                        <div className="absolute inset-0 blur-2xl bg-white/40 rounded-full animate-splash-glow"></div>
                        <img
                            src="/splash-icon.svg"
                            alt="QrTap Logo"
                            className="relative w-36 h-36 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                        />
                    </div>
                </div>

                {/* Modern Progress Bar */}
                <div className="flex flex-col items-center gap-4">
                    {/* Enhanced Progress Bar */}
                    <div className="w-80 h-2 bg-white/20 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full rounded-full animate-splash-progress shadow-lg relative overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(90deg, #1B6EF3 0%, #3EB5EA 50%, #1B6EF3 100%)",
                                backgroundSize: "200% 100%",
                                boxShadow:
                                    "0 0 20px rgba(27, 110, 243, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)",
                            }}
                        >
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                                    animation: "shimmer 1.5s infinite",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes splash-logo-modern {
                    0% {
                        opacity: 0;
                        transform: scale(0.5) rotate(-10deg);
                    }
                    50% {
                        transform: scale(1.1) rotate(5deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }
                
                .animate-splash-logo-modern {
                    animation: splash-logo-modern 1s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                @keyframes splash-glow {
                    0%, 100% {
                        opacity: 0.4;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.2);
                    }
                }
                
                .animate-splash-glow {
                    animation: splash-glow 2s ease-in-out infinite;
                }
                
                @keyframes splash-ring-1 {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.1;
                    }
                    100% {
                        transform: scale(0.8);
                        opacity: 0.3;
                    }
                }
                
                @keyframes splash-ring-2 {
                    0% {
                        transform: scale(0.9);
                        opacity: 0.2;
                    }
                    50% {
                        transform: scale(1.15);
                        opacity: 0.05;
                    }
                    100% {
                        transform: scale(0.9);
                        opacity: 0.2;
                    }
                }
                
                @keyframes splash-ring-3 {
                    0% {
                        transform: scale(1);
                        opacity: 0.1;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.02;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0.1;
                    }
                }
                
                .animate-splash-ring-1 {
                    animation: splash-ring-1 3s ease-in-out infinite;
                }
                
                .animate-splash-ring-2 {
                    animation: splash-ring-2 3.5s ease-in-out infinite;
                    animation-delay: 0.3s;
                }
                
                .animate-splash-ring-3 {
                    animation: splash-ring-3 4s ease-in-out infinite;
                    animation-delay: 0.6s;
                }
                
                @keyframes splash-progress {
                    0% {
                        width: 0%;
                        transform: translateX(-100%);
                    }
                    50% {
                        width: 70%;
                    }
                    100% {
                        width: 100%;
                        transform: translateX(0%);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                .animate-splash-progress {
                    animation: splash-progress ${minDisplayTime}ms ease-out;
                }
                
                @keyframes shimmer-progress {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                @keyframes float0 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(120deg); }
                    66% { transform: translate(-20px, 20px) rotate(240deg); }
                }
                
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-40px, 40px) rotate(-120deg); }
                    66% { transform: translate(25px, -25px) rotate(-240deg); }
                }
                
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(50px, 50px) rotate(180deg); }
                }
                
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-50px, -50px) rotate(-180deg); }
                }
                
                @keyframes float4 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(35px, -35px) rotate(90deg); }
                    66% { transform: translate(-35px, 35px) rotate(270deg); }
                }
                
                @keyframes float5 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-30px, 30px) rotate(-90deg); }
                    66% { transform: translate(30px, -30px) rotate(-270deg); }
                }
            `}</style>
        </div>
    );
}
