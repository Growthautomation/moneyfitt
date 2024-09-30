export interface Question {
    key: string;
    category: string;
    question: string;
    options?: string[];
    type: "single" | "multiple" | "text";
    next?: string | ((answers: Record<string, string[]>) => string) | null;
    required?: boolean;
}

export type QuestionFlow = Question[];