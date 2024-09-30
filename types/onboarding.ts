export interface Tag {
    name: string;
    description?: string;
    subTags?: string[];
}

export interface Question {
    key: string;
    category: string;
    question: string;
    options?: string[] | Tag[];
    type: "single" | "multiple" | "text" | "multipleWithTags";
    next?: string | ((answers: Record<string, string[]>) => string | null) | null;
    required?: boolean;
    drillDownQuestions?: (selectedTags: string[]) => Question[];
}

export type QuestionFlow = Question[];