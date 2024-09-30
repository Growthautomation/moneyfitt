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
      next: "age" // Always go to age next
    },
    {
      key: "age",
      category: "Personal Information",
      question: "What is your age group?",
      options: ["18-25", "26-34", "36-59", "55-64", "65+"],
      type: "single",
      next: (answers) => {
        // Check the introQuestion answer to determine the next question
        if (answers.introQuestion?.[0] === "I know what area I want support with or product I need") {
          return "financialPlanningArea";
        }
        return "emergencySavings"; // Continue with the existing flow
      }
    },
    {
      key: "financialPlanningArea",
      category: "Financial Planning Area",
      question: "What area of financial planning do you need help with?",
      options: [
        {
          name: "Insurance and Risk Management",
          description: "Safeguarding health, life, income, and assets."
        },
        {
          name: "Investments and Wealth Management",
          description: "Growing or preserving wealth."
        },
        {
          name: "Retirement and Later-Life Planning",
          description: "Planning for retirement and stability."
        },
        {
          name: "Family and Personal Planning",
          description: "E.g. Education, family planning, wills."
        },
        {
          name: "Business and Corporate Planning",
          description: "Business growth, protection, and succession planning."
        },
        {
          name: "Niche and Specialised Planning",
          description: "E.g. Tax planning, alternative investments, divorce planning."
        }
      ],
      type: "multipleWithTags",
      next: "drillDownQuestions",
      drillDownQuestions: (selectedAreas: string[]) => {
        const questions: Question[] = [];
        
        if (selectedAreas.includes("Insurance and Risk Management")) {
          questions.push({
            key: "insuranceRiskManagement",
            category: "Insurance and Risk Management",
            question: "Which aspects of Insurance and Risk Management do you need help with?",
            options: [
              "Critical Illness/Income Protection",
              "Health and Medical Coverage",
              "CPF Health Schemes",
              "Life Insurance",
              "Travel Insurance",
              "Property and Asset Protection",
              "Pets",
              "Other"
            ],
            type: "multiple",
            next: "advisorPreference"
          });
        }
        
        if (selectedAreas.includes("Investments and Wealth Management")) {
          questions.push({
            key: "investmentsWealthManagement",
            category: "Investments and Wealth Management",
            question: "Which aspects of Investments and Wealth Management do you need help with?",
            options: [
              "CPF Investment Scheme (CPFIS)",
              "Wealth Creation and Investments",
              "Sustainable and Impact Investing",
              "High Net Worth Planning",
              "Other"
            ],
            type: "multiple",
            next: "advisorPreference"
          });
        }
        
        if (selectedAreas.includes("Retirement and Later-Life Planning")) {
          questions.push({
            key: "retirementLaterLifePlanning",
            category: "Retirement and Later-Life Planning",
            question: "Which aspects of Retirement and Later-Life Planning do you need help with?",
            options: [
              "Retirement & CPF Planning",
              "Legacy and Estate Planning",
              "Pre-Retirement Planning",
              "Elder Care and Long-Term Support",
              "Other"
            ],
            type: "multiple",
            next: "advisorPreference"
          });
        }
        
        if (selectedAreas.includes("Family and Personal Planning")) {
          questions.push({
            key: "familyPersonalPlanning",
            category: "Family and Personal Planning",
            question: "Which aspects of Family and Personal Planning do you need help with?",
            options: [
              "Housing & CPF for Homes",
              "Family and Child Planning",
              "Special Circumstances Planning",
              "Children (Education Savings, Child Insurance)",
              "Special Needs Planning",
              "Divorce Financial Planning",
              "Other"
            ],
            type: "multiple",
            next: "advisorPreference"
          });
        }
        
        if (selectedAreas.includes("Business and Corporate Planning")) {
          questions.push({
            key: "businessCorporatePlanning",
            category: "Business and Corporate Planning",
            question: "Which aspects of Business and Corporate Planning do you need help with?",
            options: [
              "Succession and Exit Planning",
              "Corporate Tax Planning",
              "Business Insurance and Risk Management",
              "Other"
            ],
            type: "multiple",
            next: "advisorPreference"
          });
        }
        
        if (selectedAreas.includes("Niche and Specialised Planning")) {
          questions.push({
            key: "nicheSpecialisedPlanning",
            category: "Niche and Specialised Planning",
            question: "Which aspects of Niche and Specialised Planning do you need help with?",
            options: [
              "Debt Management and Student Loans",
              "Expat Financial Planning",
              "Tax Planning",
              "Singaporeans Overseas",
              "Other"
            ],
            type: "multiple",
            next: "advisorPreference"
          });
        }
        
        return questions;
      }
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
        if (age === "55-64") return "incomeInvestmentPercentage";
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
      next: (answers) => {
        const age = answers?.age?.[0];
        if (age === "18-25") {
          return "advisorPreference";
        } else {
          return "retirementPlanning";
        }
      }
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
          return "lowInvestmentReason26+";
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
      question: "Do you have the following?\n\n- Death & Total Permanent Disability. Coverage: 9x annual income.\n-Critical Illness Insurance. Coverage: 4x annual income.",
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
      question: "Are you familiar with the following?\n\n- Home insurance\n- Fire and home content insurance\n- MediShield Life for large healthcare bills\n- CareShield Life/ElderShield for long-term case of severe disabilities.",
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
      next: "userSex",
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