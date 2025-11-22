/**
 * Content Generation API Endpoint
 * 
 * Handles content repurposing requests using the AI agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { run } from '@openai/agents';
import { contentRepurposingAgent, AgentContext } from '@/lib/ai-agent/config';
import { encodeToTOON } from '@/lib/ai-agent/toon';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await req.json();
        const { content, sourceType = 'text', url } = body;

        if (!content && !url) {
            return NextResponse.json(
                { error: 'Either content or url is required' },
                { status: 400 }
            );
        }

        // Prepare agent context
        const agentContext: AgentContext = {
            userId: session.user.id,
            userName: session.user.name || undefined,
            userEmail: session.user.email || undefined,
        };

        // Build input based on source type
        let input = '';
        if (url) {
            input = `Please repurpose the content from this URL: ${url}`;
        } else {
            input = `Please repurpose the following content:\n\n${content}`;
        }

        // Run the agent with error handling
        let result;
        try {
            result = await run(contentRepurposingAgent, input, {
                context: agentContext,
            });
        } catch (runError: any) {
            // Handle specific API errors
            if (runError.status === 429) {
                return NextResponse.json(
                    {
                        error: 'Rate limit exceeded',
                        details: 'You have exceeded the Gemini API rate limit. Please wait a few minutes and try again. If this persists, check your API quota in Google AI Studio.',
                        suggestion: 'Free tier: 15 requests/minute, 1500 requests/day. Consider upgrading or waiting before retrying.'
                    },
                    { status: 429 }
                );
            }

            if (runError.status === 401 || runError.status === 403) {
                return NextResponse.json(
                    {
                        error: 'Authentication error',
                        details: 'Invalid or expired Gemini API key. Please check your GEMINI_API_KEY in the .env file.',
                        suggestion: 'Get your API key from: https://makersuite.google.com/app/apikey'
                    },
                    { status: 401 }
                );
            }

            if (runError.status === 400) {
                return NextResponse.json(
                    {
                        error: 'Invalid request',
                        details: runError.message || 'The request to Gemini API was invalid. The content may be too long or contain unsupported characters.',
                    },
                    { status: 400 }
                );
            }

            // Log the full error for debugging
            console.error('Agent execution error:', {
                status: runError.status,
                message: runError.message,
                type: runError.type,
                code: runError.code,
            });

            return NextResponse.json(
                {
                    error: 'AI generation failed',
                    details: runError.message || 'An error occurred while generating content. Please try again.',
                },
                { status: 500 }
            );
        }

        // Check if agent completed successfully
        if (!result.finalOutput) {
            return NextResponse.json(
                { error: 'Agent did not produce output' },
                { status: 500 }
            );
        }

        // Parse the output if it's a string (Gemini returns JSON as string)
        let parsedOutput: any;
        if (typeof result.finalOutput === 'string') {
            try {
                // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
                let cleanJson = result.finalOutput.trim();
                if (cleanJson.startsWith('```')) {
                    // Remove opening ```json or ```
                    cleanJson = cleanJson.replace(/^```(?:json)?\s*\n?/, '');
                    // Remove closing ```
                    cleanJson = cleanJson.replace(/\n?```\s*$/, '');
                }

                parsedOutput = JSON.parse(cleanJson);
            } catch (e) {
                console.error('Failed to parse agent output:', result.finalOutput);
                return NextResponse.json(
                    { error: 'Invalid output format from agent' },
                    { status: 500 }
                );
            }
        } else {
            parsedOutput = result.finalOutput;
        }

        // Validate required fields
        if (!parsedOutput.twitter || !parsedOutput.linkedin || !parsedOutput.tiktok) {
            return NextResponse.json(
                { error: 'Agent output missing required platforms' },
                { status: 500 }
            );
        }

        // Store the generated content
        const contentRecord = await prisma.content.create({
            data: {
                userId: session.user.id,
                originalText: content || url || '',
                type: sourceType,
            },
        });

        // Store individual posts
        await Promise.all([
            prisma.generatedPost.create({
                data: {
                    contentId: contentRecord.id,
                    platform: 'twitter',
                    postContent: parsedOutput.twitter,
                },
            }),
            prisma.generatedPost.create({
                data: {
                    contentId: contentRecord.id,
                    platform: 'linkedin',
                    postContent: parsedOutput.linkedin,
                },
            }),
            prisma.generatedPost.create({
                data: {
                    contentId: contentRecord.id,
                    platform: 'tiktok',
                    postContent: parsedOutput.tiktok,
                },
            }),
        ]);

        // Return generated content
        return NextResponse.json({
            success: true,
            data: {
                twitter: parsedOutput.twitter,
                linkedin: parsedOutput.linkedin,
                tiktok: parsedOutput.tiktok,
                metadata: parsedOutput.metadata || {
                    originalLength: content?.length || 0,
                    sourceType,
                    topics: [],
                },
                contentId: contentRecord.id,
            },
        });

    } catch (error) {
        console.error('Error generating content:', error);

        return NextResponse.json(
            {
                error: 'Failed to generate content',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve user's generated content history
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user's content with generated posts
        const content = await prisma.content.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                generatedPosts: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20, // Last 20 items
        });

        return NextResponse.json({
            success: true,
            data: content,
        });

    } catch (error) {
        console.error('Error fetching content:', error);

        return NextResponse.json(
            { error: 'Failed to fetch content' },
            { status: 500 }
        );
    }
}
