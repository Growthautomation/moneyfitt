export type Question = {
    key: string;
    category: string;
    question: string;
    type: "single" | "multiple" | "text";
    options?: string[];
}

export type QuestionFlow = Question[];