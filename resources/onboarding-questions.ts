import { QuestionFlow, Question } from "@/types/onboarding";

export const onboardingQuestions: QuestionFlow = [
    {
      key: "introQuestion",
      category: "Let's Get MoneyFitt",
      question: "Financial Planning can be difficult to navigate. Let's start by understanding whether you know your needs.",
      options: [
        "I know what area I want support with or product I need",
        "Help me identify where I need professional support"
      ],
      type: "single",
      next: "age" // This will lead to the existing age question
    },
    {
      key: "age",
      category: "Personal Information",
      question: "What is your age group?",
      options: ["18-25", "26-34", "36-59", "55-64", "65+"],
      type: "single",
      next: "emergencySavings"
    },
    
    {
      key: "emergencySavings",
      category: "Financial Status",
      question: "Do you have 3 to 6 months worth of take home income saved?",
      options: ["Yes", "No"],
      type: "single",
      next: "insuranceCoverage"
    },
    {
      key: "insuranceCoverage",
      category: "Insurance",
      question: "Do you have Death & Total Permanent Disability insurance coverage worth 9x annual income?",
      options: ["Yes", "No"],
      type: "single",
      next: "criticalIllnessInsurance"
    },
    {
      key: "criticalIllnessInsurance",
      category: "Insurance",
      question: "Do you have Critical Illness insurance coverage worth 4x annual income?",
      options: ["Yes", "No"],
      type: "single",
      next: "insuranceAllocation"
    },
    {
      key: "insuranceAllocation",
      category: "Insurance",
      question: "Are you allocating 15% of your take-home pay on insurance?",
      options: ["Yes", "No"],
      type: "single",
      next: (answers) => {
        console.log("Insurance allocation answers:", answers);
        const age = answers?.age?.[0];
        console.log("Age from answers:", age);
        if (age === "18-25") return "investmentAllocation";
        if (age === "26-34" || age === "36-59") return "incomeInvestmentPercentage";
        return "financialGoals"; // Changed from "retirementPlans" to "financialGoals"
      }
    },
    {
      key: "investmentAllocation",
      category: "Investments",
      question: "Are you investing 15%+ of your income (after CPF deductions) investing towards financial goals?",
      options: ["Yes", "No"],
      type: "single",
      next: (answers) => {
        if (answers.investmentAllocation?.[0] === "Yes") {
          return "optimizePortfolio";
        }
        return "lowInvestmentReason";
      }
    },
    {
      key: "lowInvestmentReason",
      category: "Investment Challenges",
      question: "What's the main reason you're not investing 15%+ of your income?",
      options: [
        "I don't understand investing - match me with an expert to learn more",
        "I understand investing but I am not budgeting well enough to allocate that %",
        "Too busy building an emergency fund",
        "Prioritising debt management"
      ],
      type: "single",
      next: "financialGoals"
    },
    {
      key: "optimizePortfolio",
      category: "Investment Optimization",
      question: "Well done! Would you like professional support to optimise your portfolio?",
      options: ["Yes", "No"],
      type: "single",
      next: "financialGoals"
    },

    // 26-34 & 36-59
    {
      key: "incomeInvestmentPercentage",
      category: "Investments",
      question: "How much of your income (after CPF deductions) are you investing towards financial goals?",
      options: ["0%", "1-5%", "5-10%", "10-15%", "15%+"],
      type: "single",
      next: "financialGoals"
    },
    {
      key: "financialGoals",
      category: "Financial Goals",
      question: "What are your primary financial goals?",
      options: [
        "Saving for retirement",
        "Buying a home",
        "Starting a business",
        "Funding education",
        "Building wealth"
      ],
      type: "multiple",
      next: null // This will be the last question
    },
    {
      key: "optionalQuestion",
      category: "Optional Information",
      question: "This question is optional. You can skip it if you want.",
      options: ["Option 1", "Option 2", "Option 3"],
      type: "single",
      next: "nextQuestion",
      required: false
    }
];

// Remove the findNextQuestion function from here as it's now in onboarding-form.tsx