import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info" | "warning";
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type,
    onClose,
    duration = 3000,
}: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return "ri-checkbox-circle-line";
            case "error":
                return "ri-error-warning-line";
            case "warning":
                return "ri-alert-line";
            case "info":
                return "ri-information-line";
            default:
                return "ri-information-line";
        }
    };

    const getBgColor = () => {
        switch (type) {
            case "success":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            case "info":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]">
            <div
                className={`${getBgColor()} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 space-x-reverse min-w-[300px] max-w-md animate-slide-down`}
            >
                <i className={`${getIcon()} text-xl`}></i>
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                >
                    <i className="ri-close-line text-lg"></i>
                </button>
            </div>
        </div>
    );
}

