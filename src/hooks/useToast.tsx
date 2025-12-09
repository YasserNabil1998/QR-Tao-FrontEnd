import { useState, useCallback } from "react";
import Toast from "../components/common/Toast";

interface ToastState {
    message: string;
    type: "success" | "error" | "info" | "warning";
    id: number;
}

let toastId = 0;

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastState[]>([]);

    const showToast = useCallback(
        (
            message: string,
            type: "success" | "error" | "info" | "warning" = "info"
        ) => {
            const id = ++toastId;
            setToasts((prev) => [...prev, { message, type, id }]);
        },
        []
    );

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const ToastContainer = () => (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );

    return { showToast, ToastContainer };
};

