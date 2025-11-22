"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
            <div className="w-full max-w-md px-4">
                <div className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
                    {/* Error Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-destructive/10">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold">Authentication Error</h1>
                        <p className="text-muted-foreground">{errorMessage}</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 space-y-3">
                        <Link href="/auth/signin" className="block">
                            <Button className="w-full" size="lg">
                                Try Again
                            </Button>
                        </Link>
                        <Link href="/" className="block">
                            <Button variant="outline" className="w-full" size="lg">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            If the problem persists, please{" "}
                            <Link href="/support" className="underline hover:text-primary">
                                contact support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
