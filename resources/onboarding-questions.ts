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
      next: (answers) => {
        const age = answers?.age?.[0];
        if (age === "65+") return "seniorFinancialSupport";
        if (age === "55-64") return "retirementPlanning";
        return "insuranceCoverage";
      }
    },
    // New question for 65+ age group
    {
      key: "seniorFinancialSupport",
      category: "Senior Financial Planning",
      question: "Do you need professional support with either of the following:\n\n- Unlocking the value of your assets\n- CPF management, particularly CPF Life",
      options: [
        "I want help with either CPF retirement schemes or asset management",
        "No help needed"
      ],
      type: "single",
      next: "estatePlanning" // This will lead to the legacy planning question
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
        return "null"; // Changed from "retirementPlans" to "financialGoals"
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
        "I understand investing but I am not budgeting well enough to allocate 15%+",
        "Too busy building an emergency fund",
        "Prioritising debt management"
      ],
      type: "single",
      next: "advisorPreference"
    },
    {
      key: "optimizePortfolio",
      category: "Investment Optimization",
      question: "Well done! Would you like professional support to optimise your portfolio?",
      options: ["Yes", "No"],
      type: "single",
      next: "advisorPreference"
    },

    // 26-34 & 36-59
    {
      key: "incomeInvestmentPercentage",
      category: "Investments",
      question: "Are you investing 10%+ of your income (after CPF deductions) towards financial goals?",
      options: ["Yes", "No"],
      type: "single",
      next: (answers) => {
        // Use the answer from this question, not investmentAllocation
        if (answers.incomeInvestmentPercentage?.[0] === "Yes") {
          return "optimizePortfolio";
        } else {
          return "lowInvestmentReason";
        }
      }
    },

    {
      key: "lowInvestmentReason26+",
      category: "Investment Challenges",
      question: "What's the main reason you're not investing 10%+ of your income?",
      options: [
        "I don't understand investing - match me with an expert to learn more",
        "I understand investing but I am not budgeting well enough to allocate 10%+",
        "Too busy building an emergency fund",
        "Prioritising debt management"
      ],
      type: "single",
      next: "retirementPlanning"
    },
   

    // New retirement planning questions
    {
      key: "retirementPlanning",
      category: "Retirement",
      question: "Have you started your retirement planning?",
      options: ["Yes", "No"],
      type: "single",
      next: (answers) => {
        if (answers.retirementPlanning?.[0] === "Yes") {
          return "reviewRetirementPlanning";
        } else {
          return "startRetirementPlanning";
        }
      }
    },
    {
      key: "reviewRetirementPlanning",
      category: "Retirement",
      question: "Well done! Would you like a professional to review your retirement planning?",
      options: ["Yes", "No"],
      type: "single",
      next: (answers) => {
        const age = answers?.age?.[0];
        if (age === "36-59" || age === "55-64" || age === "65+") {
          return "estatePlanning";
        }
        return "advisorPreference"; // End the questionnaire for other age groups
      }
    },
    {
      key: "startRetirementPlanning",
      category: "Retirement",
      question: "Consider starting! Would you like professional support on this matter?",
      options: ["Yes", "No"],
      type: "single",
      next: (answers) => {
        const age = answers?.age?.[0];
        if (age === "36-59" || age === "55-64" || age === "65+") {
          return "estatePlanning";
        }
        return "advisorPreference"; // End the questionnaire for other age groups
      }
    },
    // New estate planning question
    {
      key: "estatePlanning",
      category: "Estate Planning",
      question: "Do you have the following addressed: A will, CPF nomination, Appointed trusted persons?",
      options: [
        "Yes",
        "No - I want professional help with this",
        "No - Give me resources for this"
      ],
      type: "single",
      next: (answers) => {
        const age = answers?.age?.[0];
        if (age === "55-64" || age === "65+") {
          return "seniorInsurance";
        }
        return "advisorPreference"; // End the questionnaire for other age groups
      }
    },
    // New insurance question for 55-64 and 65+ age groups
    {
      key: "seniorInsurance",
      category: "Insurance",
      question: "Make sure you have the following:\n\nDeath & Total Permanent Disability. Coverage: 9x annual income.\n\nCritical Illness Insurance. Coverage: 4x annual income.",
      options: [
        "I am covered",
        "I want help with Critical Illness Insurance",
        "I want help with Death & Total Permanent Disability Insurance",
        "Give me resources for this"
      ],
      type: "multiple",
      next: "seniorInsuranceAwareness"
    },
    // New insurance awareness question for 55-64 and 65+ age groups
    {
      key: "seniorInsuranceAwareness",
      category: "Insurance Awareness",
      question: "Make sure you are familiar with the following:\n\n- Home insurance\n- Fire and home content insurance\n- MediShield Life for large healthcare bills\n- CareShield Life/ElderShield for long-term case of severe disabilities.",
      options: [
        "Yes, I am familiar",
        "No - Give me resources for this"
      ],
      type: "single",
      next: "advisorPreference" // This is now the last question
    },
    {
      key: "advisorPreference",
      category: "Advisor Preferences",
      question: "What is most important to you in a Financial Advisor?\n(Leave blank and we will match you with the best advisor for you)",
      options: [
        "Religious Beliefs",
        "Language Preference",
        "Additional Specialisations",
        "Company Preference",
        "Age Range"
      ],
      type: "single",
      next: "userSex", // Changed from "" to "userSex"
      required: false
    },

    // New question for user's sex
    {
      key: "userSex",
      category: "Personal Information",
      question: "What is your sex?",
      options: ["Male", "Female", "Other", "Prefer not to say"],
      type: "single",
      next: "userName"
    },

    // New question for user's name
    {
      key: "userName",
      category: "Personal Information",
      question: "What is your name?\n(We do not share your name or contact details with the advisor until you choose to share)",
      type: "text", // New type for text input
      next: null
    },

    
   
];

// Remove the findNextQuestion function from here as it's now in onboarding-form.tsx