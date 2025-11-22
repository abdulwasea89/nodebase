import { create } from 'zustand';

interface GeneratedContent {
    twitter: string[];
    linkedin: string;
    tiktok: string;
}

interface ContentState {
    originalContent: string;
    generatedContent: GeneratedContent | null;
    isGenerating: boolean;
    setOriginalContent: (content: string) => void;
    setGeneratedContent: (content: GeneratedContent) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    reset: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
    originalContent: '',
    generatedContent: null,
    isGenerating: false,
    setOriginalContent: (content) => set({ originalContent: content }),
    setGeneratedContent: (content) => set({ generatedContent: content }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    reset: () => set({ originalContent: '', generatedContent: null, isGenerating: false }),
}));
