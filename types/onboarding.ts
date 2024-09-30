export interface Tag {
    name: string;
    description?: string;
    subTags?: string[];
}

export interface DropdownOption {
    value: string;
    label: string;
}

export interface DropdownGroup {
    key: string;
    label: string;
    options: DropdownOption[];
}

export interface Question {
    key: string;
    category: string;
    question: string;
    options?: string[] | Tag[] | DropdownGroup[];
    type: "single" | "multiple" | "text" | "multipleWithTags" | "multipleDropdown";
    next?: string | ((answers: Record<string, string[]>) => string | null) | null;
    required?: boolean;
    drillDownQuestions?: (selectedTags: string[]) => Question[];
    maxPathLength?: number;
}

export type QuestionFlow = Question[];