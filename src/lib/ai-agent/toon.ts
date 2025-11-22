/**
 * TOON (Token-Oriented Object Notation) Encoder/Decoder
 * 
 * Converts JSON to compact TOON format to reduce LLM token usage.
 * TOON uses YAML-style indentation for objects and CSV-style rows for arrays.
 * 
 * Example:
 * JSON: [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
 * TOON: items[2]{id,name}:\n  1,Alice\n  2,Bob
 * 
 * Benefits: 30-50% token reduction for uniform arrays
 */

interface ToonEncoderOptions {
    indentSize?: number;
    includeTokenCount?: boolean;
}

/**
 * Encode JSON to TOON format
 */
export function encodeToTOON(data: any, options: ToonEncoderOptions = {}): string {
    const { indentSize = 2, includeTokenCount = false } = options;

    const result = encodeTOONValue(data, 0, indentSize);

    if (includeTokenCount) {
        const tokens = estimateTokens(result);
        const jsonTokens = estimateTokens(JSON.stringify(data));
        const savings = ((jsonTokens - tokens) / jsonTokens * 100).toFixed(1);
        return `# TOON Format - Estimated ${tokens} tokens (${savings}% savings vs JSON)\n${result}`;
    }

    return result;
}

/**
 * Decode TOON format back to JSON
 */
export function decodeFromTOON(toon: string): any {
    // Remove comments
    const lines = toon.split('\n').filter(line => !line.trim().startsWith('#'));
    return parseTOONValue(lines, 0).value;
}

/**
 * Encode a value to TOON format
 */
function encodeTOONValue(value: any, depth: number, indentSize: number): string {
    const indent = ' '.repeat(depth * indentSize);

    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return escapeString(value);
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();

    if (Array.isArray(value)) {
        return encodeArray(value, depth, indentSize);
    }

    if (typeof value === 'object') {
        return encodeObject(value, depth, indentSize);
    }

    return String(value);
}

/**
 * Encode an array - use CSV-style format for uniform arrays
 */
function encodeArray(arr: any[], depth: number, indentSize: number): string {
    if (arr.length === 0) return '[]';

    // Check if array contains uniform objects
    if (isUniformObjectArray(arr)) {
        return encodeUniformArray(arr, depth, indentSize);
    }

    // Fallback to YAML-style array
    const indent = ' '.repeat(depth * indentSize);
    const items = arr.map(item =>
        `${indent}- ${encodeTOONValue(item, depth + 1, indentSize)}`
    ).join('\n');

    return `\n${items}`;
}

/**
 * Encode uniform object array in CSV-style format
 */
function encodeUniformArray(arr: any[], depth: number, indentSize: number): string {
    if (arr.length === 0) return '[]';

    const indent = ' '.repeat(depth * indentSize);
    const fields = Object.keys(arr[0]);
    const header = `[${arr.length}]{${fields.join(',')}}:\n`;

    const rows = arr.map(obj => {
        const values = fields.map(field => {
            const value = obj[field];
            if (typeof value === 'string') return escapeCSVValue(value);
            if (value === null || value === undefined) return '';
            return String(value);
        });
        return `${indent}${values.join(',')}`;
    }).join('\n');

    return header + rows;
}

/**
 * Encode an object in YAML-style format
 */
function encodeObject(obj: Record<string, any>, depth: number, indentSize: number): string {
    const indent = ' '.repeat(depth * indentSize);
    const entries = Object.entries(obj);

    if (entries.length === 0) return '{}';

    const lines = entries.map(([key, value]) => {
        const encodedValue = encodeTOONValue(value, depth + 1, indentSize);
        // If value is multiline, put it on next line
        if (encodedValue.includes('\n')) {
            return `${indent}${key}:${encodedValue}`;
        }
        return `${indent}${key}: ${encodedValue}`;
    }).join('\n');

    return `\n${lines}`;
}

/**
 * Check if array contains uniform objects (same keys)
 */
function isUniformObjectArray(arr: any[]): boolean {
    if (arr.length === 0) return false;
    if (typeof arr[0] !== 'object' || arr[0] === null || Array.isArray(arr[0])) {
        return false;
    }

    const firstKeys = Object.keys(arr[0]).sort();

    return arr.every(item => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            return false;
        }
        const keys = Object.keys(item).sort();
        return JSON.stringify(keys) === JSON.stringify(firstKeys);
    });
}

/**
 * Parse TOON value from lines
 */
function parseTOONValue(lines: string[], index: number): { value: any; nextIndex: number } {
    // Implementation simplified for now - full parser would handle all TOON syntax
    // For MVP, we'll rely on the encoder primarily and use JSON.parse as fallback for decoding
    throw new Error('TOON decoder not fully implemented - use for encoding only in MVP');
}

/**
 * Escape string for TOON format
 */
function escapeString(str: string): string {
    if (str.includes('\n') || str.includes('"') || str.includes(',')) {
        return `"${str.replace(/"/g, '\\"')}"`;
    }
    return str;
}

/**
 * Escape value for CSV format
 */
function escapeCSVValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

/**
 * Estimate token count (rough approximation)
 * Real implementation would use tiktoken or similar
 */
function estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

/**
 * Compare token usage between JSON and TOON
 */
export function compareFormats(data: any): {
    json: { text: string; tokens: number };
    toon: { text: string; tokens: number };
    savings: number;
} {
    const jsonText = JSON.stringify(data);
    const toonText = encodeToTOON(data);

    const jsonTokens = estimateTokens(jsonText);
    const toonTokens = estimateTokens(toonText);
    const savings = ((jsonTokens - toonTokens) / jsonTokens * 100);

    return {
        json: { text: jsonText, tokens: jsonTokens },
        toon: { text: toonText, tokens: toonTokens },
        savings,
    };
}
