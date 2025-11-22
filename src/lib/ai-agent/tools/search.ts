/**
 * Web Search Tool
 * 
 * Performs web searches using Tavily API to find relevant information
 * and recent content for the AI agent.
 */

import { tool } from '@openai/agents';
import { z } from 'zod';

// Tavily configuration - using environment variable
const tavilyApiKey = process.env.TAVILY_API_KEY;

/**
 * Search the web for information
 */
export const webSearchTool = tool({
    name: 'search_web',
    description: 'Search the web for recent information, news, or context about a topic. Use this when you need current data or want to find relevant articles.',

    parameters: z.object({
        query: z.string().describe('The search query'),
        maxResults: z.number().min(1).max(10).default(5).describe('Maximum number of results to return'),
    }),

    async execute({ query, maxResults = 5 }) {
        if (!tavilyApiKey) {
            return 'Error: TAVILY_API_KEY is not configured. Web search is currently unavailable.';
        }

        try {
            // Call Tavily API directly
            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
                    query,
                    max_results: maxResults,
                    search_depth: 'basic',
                    include_answer: true,
                    include_raw_content: false,
                }),
            });

            if (!response.ok) {
                return `Error: Tavily API request failed with status ${response.status}`;
            }

            const data = await response.json();

            const results = {
                answer: data.answer,
                results: (data.results || []).map((r: any) => ({
                    title: r.title,
                    url: r.url,
                    content: r.content,
                    score: r.score,
                })),
                query,
            };

            return JSON.stringify(results, null, 2);

        } catch (error) {
            return `Error performing web search: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    },
});
