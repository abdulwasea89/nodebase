// Type declarations for modules without TypeScript definitions

declare module 'jsdom' {
    export class JSDOM {
        constructor(html: string, options?: any);
        window: {
            document: Document;
        };
    }
}

declare module 'pdf-parse' {
    interface PDFInfo {
        PDFFormatVersion?: string;
        IsAcroFormPresent?: boolean;
        IsXFAPresent?: boolean;
        [key: string]: any;
    }

    interface PDFData {
        numpages: number;
        numrender: number;
        info: PDFInfo;
        metadata: any;
        text: string;
        version: string;
    }

    function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
    export = pdfParse;
}
