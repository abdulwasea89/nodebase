/**
 * Simple toast hook for notifications
 */

import { useState, useCallback } from "react";

export interface Toast {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(({ title, description, variant = "default" }: Toast) => {
        // In a full implementation, this would add to a toast queue
        // For now, we'll just console.log as a simple notification
        if (variant === "destructive") {
            console.error(`[Toast] ${title}${description ? `: ${description}` : ''}`);
        } else {
            console.log(`[Toast] ${title}${description ? `: ${description}` : ''}`);
        }

        // You can replace this with Sonner, react-hot-toast, or shadcn toast later
        setToasts(prev => [...prev, { title, description, variant }]);
    }, []);

    return { toast, toasts };
}
