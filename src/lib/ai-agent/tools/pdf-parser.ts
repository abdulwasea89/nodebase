/**
 * PDF Parser Tool
 * 
 * Extracts text content from PDF files, handling both URLs and local paths.
 * Uses lazy loading to avoid startup errors from native dependencies.
 */

import { tool } from '@openai/agents';
import { z } from 'zod';

/**
 * Extract text from PDF files
 */
export const pdfParserTool = tool({
    name: 'parse_pdf',
    description: 'Extract text content from a PDF file. Provide a URL to a PDF document.',

    parameters: z.object({
        url: z.string().url().describe('URL to the PDF file'),
    }),

    async execute({ url }) {
        try {
            // Lazy load pdf-parse only when needed to avoid startup errors
            let pdfParse: any;
            try {
                pdfParse = require('pdf-parse');
            } catch (loadError) {
                return 'Error: PDF parsing is not available. The pdf-parse library requires additional dependencies (@napi-rs/canvas). Please use the article scraper for web content instead.';
            }

            // Fetch the PDF
            const response = await fetch(url);

            if (!response.ok) {
                return `Error: Failed to fetch PDF. Status: ${response.status}`;
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Parse PDF
            const data = await pdfParse(buffer);

            const result = {
                text: data.text.trim(),
                pages: data.numpages,
                info: data.info,
                wordCount: data.text.split(/\s+/).length,
                url,
            };

            return JSON.stringify(result, null, 2);

        } catch (error) {
            return `Error parsing PDF: ${error instanceof Error ? error.message : 'Unknown error'}. PDF parsing may not be available in this environment.`;
        }
    },
});
