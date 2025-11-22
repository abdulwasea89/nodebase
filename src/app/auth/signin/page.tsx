"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Chrome, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
    Callback: "There was a problem signing you in. Please try again.",
    OAuthSignin: "Error in constructing an authorization URL.",
    OAuthCallback: "Error in handling the response from the OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    EmailCreateAccount: "Could not create email provider user in the database.",
    Signin: "Error in signing in.",
    Default: "An error occurred. Please try again.",
};

export default function SignInPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const error = searchParams.get("error");
    const errorMessage = error ? errorMessages[error] || errorMessages.Default : null;

    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md px-4">
                <div className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                Repurpose.ai
                            </h1>
                        </Link>
                        <p className="mt-2 text-muted-foreground">
                            Sign in to start creating content
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{errorMessage}</p>
                        </div>
                    )}

                    {/* Sign in options */}
                    <div className="space-y-4">
                        <Button
                            onClick={handleGoogleSignIn}
                            variant="outline"
                            size="lg"
                            className="w-full gap-3 h-12 text-base font-medium hover:bg-primary/5 hover:border-primary/50 transition-all"
                        >
                            <Chrome className="h-5 w-5" />
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Quick & Secure
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-center text-muted-foreground">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="underline hover:text-primary">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="underline hover:text-primary">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>

                    {/* Back to home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>

                {/* Additional info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <span className="font-medium text-foreground">
                            Sign in to create one automatically
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
