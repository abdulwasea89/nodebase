"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PenTool, Settings, LogOut, History, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Content Studio
                    </h2>
                    <div className="space-y-1">
                        <Link href="/dashboard">
                            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start">
                                <PenTool className="mr-2 h-4 w-4" />
                                Create Content
                            </Button>
                        </Link>
                        <Link href="/dashboard/history">
                            <Button variant={pathname === "/dashboard/history" ? "secondary" : "ghost"} className="w-full justify-start">
                                <History className="mr-2 h-4 w-4" />
                                History
                            </Button>
                        </Link>
                        <Link href="/dashboard/settings">
                            <Button variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"} className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Theme Toggle and Logout */}
            <div className="px-3 py-2 space-y-2">
                <div className="space-y-1">
                    {mounted && (
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? (
                                <>
                                    <Sun className="mr-2 h-4 w-4" />
                                    Light Mode
                                </>
                            ) : (
                                <>
                                    <Moon className="mr-2 h-4 w-4" />
                                    Dark Mode
                                </>
                            )}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
