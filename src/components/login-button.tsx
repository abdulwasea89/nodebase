"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function LoginButton({
    children,
    size = "default",
    variant = "default",
    className
}: {
    children: React.ReactNode;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string;
}) {
    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={() => signIn()}
        >
            {children}
        </Button>
    );
}
