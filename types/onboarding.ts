export interface Question {
    key: string;
    category: string;
    question: string;
    options: string[];
    type: "single" | "multiple";
    next?: string | ((answers: Record<string, string[]>) => string) | null;
    required?: boolean; // New property
}

export type QuestionFlow = Question[];