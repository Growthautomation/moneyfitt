import { QuestionFlow } from "@/types/onboarding";

export const onboardingQuestions: QuestionFlow = [
  {
    key: "name",
    category: "Personal Information",
    question: "What is your name?",
    type: "text"
  },
  {
    key: "age",
    category: "Personal Information",
    question: "What is your age group?",
    options: ["18-25", "26-35", "36-45", "46-55", "56+"],
    type: "single"
  },
  {
    key: "gender",
    category: "Personal Information",
    question: "How do you identify?",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"],
    type: "single"
  },
  {
    key: "financialGoals",
    category: "Financial Goals and Preferences",
    question: "What are your primary financial goals? (Select all that apply)",
    options: ["Saving for a home", "Retirement planning", "Investment growth", "Education planning", "Debt management", "Tax optimization", "Other"],
    type: "multiple"
  },
  {
    key: "financialServices",
    category: "Financial Goals and Preferences",
    question: "Which types of financial services are you interested in? (Select all that apply)",
    options: ["Insurance", "Investments", "Estate planning", "Financial planning", "Business advisory", "Tax planning"],
    type: "multiple"
  },
  {
    key: "lifestyleValues",
    category: "Lifestyle and Values",
    question: "Which of these lifestyle attributes resonate with you most? (Select all that apply)",
    options: ["Health and wellness", "Travel", "Family-oriented", "Career-driven", "Social and community engagement", "Entrepreneurial spirit"],
    type: "multiple"
  },
  {
    key: "hobbies",
    category: "Hobbies and Interests",
    question: "What are your hobbies and interests? (Select all that apply)",
    options: ["Sports and fitness", "Arts and culture", "Reading and writing", "Traveling", "Cooking and food", "Technology and gaming", "Volunteering"],
    type: "multiple"
  },
  {
    key: "financialStatus",
    category: "Financial Status",
    question: "How would you describe your current financial situation?",
    options: ["Just starting out", "Growing my wealth", "Managing significant wealth", "Preparing for retirement", "In retirement"],
    type: "single"
  }
]