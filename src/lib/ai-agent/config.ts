/**
 * AI Agent Configuration
 * 
 * Sets up the Content Repurposing Agent powered by Gemini
 * using OpenAI's Agents SDK with custom tools and instructions.
 */

import { Agent, OpenAIChatCompletionsModel } from '@openai/agents';
import { OpenAI } from 'openai';
import { z } from 'zod';

// Import tools
import { articleScraperTool } from './tools/scraper';
import { webSearchTool } from './tools/search';
import { pdfParserTool } from './tools/pdf-parser';

// Gemini API configuration
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
}

// Create OpenAI client pointing to Gemini
const geminiClient = new OpenAI({
    apiKey: geminiApiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

// Create Gemini model instance
export const geminiModel = new OpenAIChatCompletionsModel(
    geminiClient,
    'gemini-2.0-flash' // Using the latest flash model
);

// Output schema for generated content
export const GeneratedContentOutput = z.object({
    twitter: z.string().describe('Twitter thread or post (280 chars max per tweet)'),
    linkedin: z.string().describe('LinkedIn post (3000 chars max)'),
    tiktok: z.string().describe('TikTok video script with hooks and CTA'),
    metadata: z.object({
        originalLength: z.number().describe('Length of original content'),
        sourceType: z.enum(['text', 'url', 'pdf']).describe('Type of source'),
        topics: z.array(z.string()).describe('Main topics extracted'),
    }),
});

export type GeneratedContentOutput = z.infer<typeof GeneratedContentOutput>;

// Agent context type
export interface AgentContext {
    userId: string;
    userName?: string;
    userEmail?: string;
}

/**
 * Content Repurposing Agent
 * 
 * Transforms long-form content into engaging social media posts
 * optimized for Twitter, LinkedIn, and TikTok.
 */
export const contentRepurposingAgent = new Agent<AgentContext>({
    name: 'ContentRepurposingAgent',

    instructions: `You are an expert content repurposing AI that transforms long-form content into engaging social media posts.

## Your Mission
Take blog posts, articles, videos, or documents and create platform-optimized content for:
1. **Twitter/X**: Engaging threads or standalone tweets
2. **LinkedIn**: Professional posts with insights
3. **TikTok**: Video scripts with hooks and calls-to-action

## Guidelines

### Twitter/X
- Keep tweets under 280 characters
- Use hooks in first tweet for threads
- Include relevant hashtags (2-3 max)
- Create engagement with questions or insights
- Use line breaks for readability
- For threads: Number tweets (1/, 2/, etc.)

### LinkedIn
- Professional yet conversational tone
- Lead with a hook or question
- Use short paragraphs (2-3 sentences max)
- Include emojis sparingly for emphasis
- End with a question or CTA
- Aim for 150-300 words (sweet spot)
- Add 3-5 relevant hashtags at the end

### TikTok
- Create a VIDEO SCRIPT not just text
- Structure: Hook (3 sec) → Value (30-45 sec) → CTA (5 sec)
- Write for SPOKEN delivery
- Include [VISUAL CUES] in brackets
- Mark [B-ROLL] suggestions
- Add [TEXT OVERLAY] suggestions
- Keep total under 60 seconds when spoken
- End with clear CTA

## Content Analysis
Before repurposing:
1. Identify key insights, data points, stories
2. Extract quotable moments
3. Find emotional hooks
4. Determine best angle for each platform

## Quality Standards
- Original content must be preserved in meaning
- Adapt tone for each platform
- No generic corporate speak
- Use concrete examples over abstract concepts
- Make it scroll-stopping, not skippable

## Output Format
You must respond in JSON format with these exact fields:
{
  "twitter": "string - Twitter thread or post",
  "linkedin": "string - LinkedIn post",
  "tiktok": "string - TikTok video script",
  "metadata": {
    "originalLength": number,
    "sourceType": "text" | "url" | "pdf",
    "topics": ["array", "of", "topics"]
  }
}

## Tools Available
You have access to tools to:
- Scrape articles from URLs (always available)
- Search the web for additional context (requires API key)
- Parse PDF documents (optional, may not be available)
Use these when users provide URLs or need research.`,

    model: geminiModel,

    tools: [
        articleScraperTool,
        webSearchTool,
        pdfParserTool,
    ],
});

/**
 * Simple summarizer agent for internal use
 */
export const summarizerAgent = new Agent({
    name: 'ContentSummarizer',
    instructions: 'Extract key points and create a concise summary of the provided text. Focus on main ideas, data, and quotable moments.',
    model: geminiModel,
    outputType: z.object({
        keyPoints: z.array(z.string()),
        mainTopics: z.array(z.string()),
        quotes: z.array(z.string()),
        summary: z.string(),
    }),
});
