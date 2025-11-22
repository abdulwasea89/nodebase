"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
            <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">Repurpose.ai</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Dashboard
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search or other items here if needed */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        {!session ? (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => signIn()}>
                                    Login
                                </Button>
                                <Button size="sm" onClick={() => signIn()}>
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <span className="text-sm font-medium">
                                {session.user?.name || session.user?.email}
                            </span>
                        )}
                    </nav>
                </div>
            </div>
        </nav>
    );
}
