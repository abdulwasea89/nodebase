/**
 * Article Scraper Tool
 * 
 * Extracts clean article content from web pages using
 * cheerio for HTML parsing and Mozilla's Readability for content extraction.
 */

import { tool } from '@openai/agents';
import { z } from 'zod';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

/**
 * Scrape and extract article content from a URL
 */
export const articleScraperTool = tool({
    name: 'scrape_article',
    description: 'Extract clean article content from a URL. Returns title, author, content, and other metadata. Use this when the user provides a URL to an article or blog post.',

    parameters: z.object({
        url: z.string().url().describe('The URL of the article to scrape'),
    }),

    async execute({ url }) {
        try {
            // Fetch the HTML content
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ContentRepurposingBot/1.0)',
                },
            });

            if (!response.ok) {
                return `Error: Failed to fetch URL. Status: ${response.status}`;
            }

            const html = await response.text();

            // Parse with JSDOM
            const dom = new JSDOM(html, { url });

            // Extract readable content using Readability
            const reader = new Readability(dom.window.document);
            const article = reader.parse();

            if (!article) {
                return 'Error: Could not extract article content. The page may not be an article or may be behind a paywall.';
            }

            // Clean up the content (remove excessive whitespace)
            const textContent = article.textContent || '';
            const cleanContent = textContent
                .replace(/\s+/g, ' ')
                .replace(/\n\s*\n/g, '\n\n')
                .trim();

            // Return structured data
            const result = {
                title: article.title || 'Untitled',
                author: article.byline || 'Unknown',
                content: cleanContent,
                excerpt: article.excerpt || cleanContent.slice(0, 200) + '...',
                url: url,
                wordCount: cleanContent.split(/\s+/).length,
                readingTime: Math.ceil(cleanContent.split(/\s+/).length / 200), // minutes
            };

            return JSON.stringify(result, null, 2);

        } catch (error) {
            return `Error scraping article: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    },
});
