import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { LoginButton } from "@/components/login-button";
import { ArrowRight, CheckCircle2, Zap, Layout, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-32 pb-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Now with Gemini 1.5 Pro
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Turn One Post into a <br className="hidden md:block" />
                <span className="text-primary">Week of Content</span>
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Repurpose.ai uses advanced AI to transform your long-form content into engaging social media posts for Twitter, LinkedIn, and TikTok instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <LoginButton size="lg" className="gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </LoginButton>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Abstract Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-purple-500/40 rounded-full blur-3xl animate-pulse" />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4 p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Layout className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Formatting</h3>
                <p className="text-muted-foreground">
                  Automatically formats content for each platform's unique style and constraints. No more manual editing.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Instant Generation</h3>
                <p className="text-muted-foreground">
                  Powered by Gemini, generate high-quality threads, posts, and scripts in seconds, not hours.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Multi-Platform</h3>
                <p className="text-muted-foreground">
                  Create content for Twitter, LinkedIn, and TikTok simultaneously from a single source.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-16 md:py-24 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">10x</h4>
                <p className="text-sm font-medium text-muted-foreground">Faster Content Creation</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">3+</h4>
                <p className="text-sm font-medium text-muted-foreground">Platforms Supported</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">24/7</h4>
                <p className="text-sm font-medium text-muted-foreground">AI Availability</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">100%</h4>
                <p className="text-sm font-medium text-muted-foreground">Creator Focused</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
