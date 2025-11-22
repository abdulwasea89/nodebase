"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, FileText, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryItem {
    id: string;
    originalText: string;
    type: string;
    createdAt: string;
    generatedPosts: {
        id: string;
        platform: string;
        postContent: string;
    }[];
}

export default function HistoryPage() {
    const { data: session } = useSession();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/generate");

            if (!response.ok) {
                throw new Error("Failed to fetch history");
            }

            const data = await response.json();
            setHistory(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "twitter":
                return <Twitter className="h-4 w-4" />;
            case "linkedin":
                return <Linkedin className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <p className="text-destructive">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Content History</h3>
                <p className="text-muted-foreground">
                    View all your previously generated social media posts
                </p>
            </div>

            {history.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No content yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Start creating content to see your history here
                            </p>
                            <Button asChild>
                                <a href="/dashboard">Create Content</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {history.map((item) => (
                        <Card key={item.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">
                                            {item.type === "url" ? "From URL" : "Text Content"}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.createdAt).toLocaleString()}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Original Content Preview */}
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.originalText}
                                        </p>
                                    </div>

                                    {/* Generated Posts */}
                                    <div className="grid gap-3 md:grid-cols-3">
                                        {item.generatedPosts.map((post) => (
                                            <Card key={post.id} className="border-muted">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-sm flex items-center gap-2">
                                                        {getPlatformIcon(post.platform)}
                                                        <span className="capitalize">{post.platform}</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-xs text-muted-foreground line-clamp-4 mb-3">
                                                        {post.postContent}
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => handleCopy(post.postContent)}
                                                    >
                                                        Copy
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
