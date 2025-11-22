"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Twitter, Linkedin, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContent {
    twitter: string;
    linkedin: string;
    tiktok: string;
    metadata?: {
        originalLength: number;
        sourceType: string;
        topics: string[];
    };
}

export default function DashboardPage() {
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [inputMode, setInputMode] = useState<"text" | "url">("text");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGenerate = async () => {
        const inputValue = inputMode === "text" ? content.trim() : url.trim();
        if (!inputValue) return;

        setIsLoading(true);
        setError(null);
        setGeneratedContent(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: inputMode === "text" ? content.trim() : undefined,
                    url: inputMode === "url" ? url.trim() : undefined,
                    sourceType: inputMode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Extract detailed error message
                const errorMsg = data.details || data.error || "Failed to generate content";
                const suggestion = data.suggestion ? `\n\n${data.suggestion}` : '';
                throw new Error(errorMsg + suggestion);
            }

            setGeneratedContent(data.data);
            toast({
                title: "Content Generated!",
                description: "Your social media posts are ready.",
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setContent("");
        setUrl("");
        setGeneratedContent(null);
        setError(null);
    };

    const handleCopy = async (text: string, platform: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "Copied!",
                description: `${platform} post copied to clipboard.`,
            });
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Copy Failed",
                description: "Could not copy to clipboard.",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Content</h3>
                <p className="text-sm text-muted-foreground">
                    Transform your long-form content into engaging social media posts.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Input Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Input Content</CardTitle>
                        <CardDescription>
                            Paste your content or provide a URL to an article.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Tabs for Text vs URL */}
                        <div className="flex gap-2 mb-4">
                            <Button
                                variant={inputMode === "text" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setInputMode("text")}
                                disabled={isLoading}
                            >
                                📝 Text
                            </Button>
                            <Button
                                variant={inputMode === "url" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setInputMode("url")}
                                disabled={isLoading}
                            >
                                🔗 URL
                            </Button>
                        </div>

                        {/* Text Input */}
                        {inputMode === "text" && (
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="content">Your Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Paste your blog post, article, or script here..."
                                    className="min-h-[300px]"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        {/* URL Input */}
                        {inputMode === "url" && (
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="url">Article URL</Label>
                                <input
                                    id="url"
                                    type="url"
                                    placeholder="https://example.com/article"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    The AI will scrape and extract content from this URL
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="justify-between space-x-2">
                        <Button variant="ghost" onClick={handleClear} disabled={isLoading}>
                            Clear
                        </Button>
                        <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || (inputMode === "text" ? !content.trim() : !url.trim())}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Posts
                        </Button>
                    </CardFooter>
                </Card>

                {/* Error Display
                {error && (
                    <Card className="border-destructive">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-destructive">Generation Error</p>
                                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )} */}

                {/* Generated Content Display */}
                {generatedContent && (
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Twitter Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Twitter className="h-5 w-5 text-blue-400" />
                                        Twitter/X
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(generatedContent.twitter, "Twitter")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardDescription>Optimized for tweets and threads</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-wrap text-sm rounded-lg bg-muted p-4">
                                    {generatedContent.twitter}
                                </div>
                            </CardContent>
                        </Card>

                        {/* LinkedIn Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Linkedin className="h-5 w-5 text-blue-600" />
                                        LinkedIn
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(generatedContent.linkedin, "LinkedIn")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardDescription>Professional posts for LinkedIn</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-wrap text-sm rounded-lg bg-muted p-4">
                                    {generatedContent.linkedin}
                                </div>
                            </CardContent>
                        </Card>

                        {/* TikTok Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                        TikTok
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(generatedContent.tiktok, "TikTok")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardDescription>Video script with hooks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-wrap text-sm rounded-lg bg-muted p-4">
                                    {generatedContent.tiktok}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Metadata Display */}
                {generatedContent?.metadata && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Content Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Original Length:</span>
                                    <span className="font-medium">{generatedContent.metadata.originalLength} chars</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Source Type:</span>
                                    <span className="font-medium capitalize">{generatedContent.metadata.sourceType}</span>
                                </div>
                                {generatedContent.metadata.topics.length > 0 && (
                                    <div>
                                        <span className="text-muted-foreground">Topics:</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {generatedContent.metadata.topics.map((topic, i) => (
                                                <span key={i} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
