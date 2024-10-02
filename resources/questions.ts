import {
  broadScope,
  religion,
  gender,
  languages,
  ageGroups,
} from "@/lib/constants";
import { create } from "lodash";

export type QNode = {
  key: string;
  category: string;
  question: string;
  options: { code: string; name: string; description?: string }[];
  answerModifier: (
    answer: string,
    answers: Record<string, string | string[]>
  ) => Record<string, string | string[]>;
  type:
    | "single"
    | "multiple"
    | "text"
    | "multipleWithTags"
    | "multipleDropdown";
  next: (answer: Object) => QNode | null;
  prev: (answer: Object) => QNode | null;
};

function createNode(
  key: string,
  category: string,
  question: string,
  type: QNode["type"],
  options: QNode["options"] = [],
  answerModifier: QNode["answerModifier"] = (answer) => ({ [key]: answer })
): QNode {
  return {
    key,
    category,
    question,
    options,
    type,
    answerModifier,
    next: () => null,
    prev: () => null,
  };
}

export const welcome = () =>
  createNode(
    "intro",
    "Let's Get MoneyFitt",
    "Welcome to MoneyFitt! Let's get started on your financial planning journey.",
    "single",
    [
      {
        code: "KNOW",
        name: "I know what area I want support with or product I need",
      },
      {
        code: "HELP",
        name: "Help me identify where I need professional support",
      },
    ]
  );

export const planningArea = () =>
  createNode(
    "broadScope",
    "Financial Planning Areas",
    "What area of financial planning do you need help with?",
    "multiple",
    broadScope,
    (answer, answers) => ({
      broadScope: answers["broadScope"]?.includes(answer)
        ? [...(answers["broadScope"] as string[])?.filter((a) => a !== answer)]
        : [...((answers["broadScope"] || []) as string[]), answer],
    })
  );

export const specializationNodes = {
  IRM: () =>
    createNode(
      "specification",
      "Insurance and Risk Management",
      "Which aspects of Insurance and Risk Management do you need help with?",
      "multiple",
      [
        {
          code: "CIIP",
          name: "Critical Illness/Income Protection",
        },
        {
          code: "HMC",
          name: "Health and Medical Coverage",
        },
        {
          code: "CHS",
          name: "CPF Health Schemes",
        },
        {
          code: "LI",
          name: "Life Insurance",
        },
        {
          code: "TI",
          name: "Travel Insurance",
        },
        {
          code: "PAP",
          name: "Property and Asset Protection",
        },
        {
          code: "PET",
          name: "Pets",
        },
        {
          code: "OTHER",
          name: "Other",
        },
      ],
      (answer, answers) => ({
        specification: answers["specification"]?.includes(answer)
          ? [
              ...(answers["specification"] as string[])?.filter(
                (a) => a !== answer
              ),
            ]
          : [...((answers["specification"] || []) as string[]), answer],
      })
    ),
  IWM: () =>
    createNode(
      "specification",
      "Investment and Wealth Management",
      "Which aspects of Investment and Wealth Management do you need help with?",
      "multiple",
      [
        {
          code: "CPFIS",
          name: "CPF Investment Scheme (CPFIS)",
        },
        {
          code: "WCI",
          name: "Wealth Creation and Investments",
        },
        {
          code: "SII",
          name: "Sustainable and Impact Investing",
        },
        {
          code: "HNWP",
          name: "High Net Worth Planning",
        },
        {
          code: "OTHER",
          name: "Other",
        },
      ],
      (answer, answers) => ({
        specification: answers["specification"]?.includes(answer)
          ? [
              ...(answers["specification"] as string[])?.filter(
                (a) => a !== answer
              ),
            ]
          : [...((answers["specification"] || []) as string[]), answer],
      })
    ),
  RLP: () =>
    createNode(
      "specification",
      "Retirement and Legacy Planning",
      "Which aspects of Retirement and Legacy Planning do you need help with?",
      "multiple",
      [
        {
          code: "RCP",
          name: "Retirement & CPF Planning",
        },
        {
          code: "LEP",
          name: "Legacy and Estate Planning",
        },
        {
          code: "PRP",
          name: "Pre-Retirement Planning",
        },
        {
          code: "ECL",
          name: "Elder Care and Long-Term Support",
        },
        {
          code: "OTHER",
          name: "Other",
        },
      ],
      (answer, answers) => ({
        specification: answers["specification"]?.includes(answer)
          ? [
              ...(answers["specification"] as string[])?.filter(
                (a) => a !== answer
              ),
            ]
          : [...((answers["specification"] || []) as string[]), answer],
      })
    ),
  FPP: () =>
    createNode(
      "specification",
      "Financial Planning and Protection",
      "Which aspects of Financial Planning and Protection do you need help with?",
      "multiple",
      [
        {
          code: "HCP",
          name: "Health and Critical Illness Protection",
        },
        {
          code: "PIP",
          name: "Personal Income Protection",
        },
        {
          code: "DMSL",
          name: "Debt Management and Student Loans",
        },
        {
          code: "EFP",
          name: "Expat Financial Planning",
        },
        {
          code: "TP",
          name: "Tax Planning",
        },
        {
          code: "SO",
          name: "Singaporeans Overseas",
        },
        {
          code: "OTHER",
          name: "Other",
        },
      ],
      (answer, answers) => ({
        specialization: answers["specification"]?.includes(answer)
          ? [
              ...(answers["specification"] as string[])?.filter(
                (a) => a !== answer
              ),
            ]
          : [...((answers["specification"] || []) as string[]), answer],
      })
    ),
  BCP: () =>
    createNode(
      "specification",
      "Business Continuity Planning",
      "Which aspects of Business Continuity Planning do you need help with?",
      "multiple",
      [
        {
          code: "HCPFH",
          name: "Housing & CPF for Homes",
        },
        {
          code: "FCP",
          name: "Family and Child Planning",
        },
        {
          code: "SCP",
          name: "Special Circumstances Planning",
        },
        {
          code: "CE",
          name: "Children (Education Savings, Child Insurance)",
        },
        {
          code: "SNP",
          name: "Special Needs Planning",
        },
        {
          code: "DFP",
          name: "Divorce Financial Planning",
        },
        {
          code: "OTHER",
          name: "Other",
        },
      ],
      (answer, answers) => ({
        specification: answers["specification"]?.includes(answer)
          ? [
              ...(answers["specification"] as string[])?.filter(
                (a) => a !== answer
              ),
            ]
          : [...((answers["specification"] || []) as string[]), answer],
      })
    ),
  NSP: () =>
    createNode(
      "specification",
      "Needs-based Selling Process",
      "Which aspects of Needs-based Selling Process do you need help with?",
      "multiple",
      [
        {
          code: "DMSL",
          name: "Debt Management and Student Loans",
        },
        {
          code: "EFP",
          name: "Expat Financial Planning",
        },
        {
          code: "TP",
          name: "Tax Planning",
        },
        {
          code: "SO",
          name: "Singaporeans Overseas",
        },
        {
          code: "OTHER",
          name: "Other",
        },
      ],
      (answer, answers) => ({
        specification: answers["specification"]?.includes(answer)
          ? [
              ...(answers["specification"] as string[])?.filter(
                (a) => a !== answer
              ),
            ]
          : [...((answers["specification"] || []) as string[]), answer],
      })
    ),
};

export const religionNode = () =>
  createNode(
    "religion",
    "Advisor preferences",
    "What is your religious beliefs?",
    "single",
    religion
  );

export const genderNode = () =>
  createNode("gender", "Advisor preferences", "What is your gender", "single", [
    ...gender,
    { code: "PNS", name: "Prefer not to say" },
  ]);

export const languageNode = () =>
  createNode(
    "language",
    "Advisor preferences",
    "What language do you prefer to communicate in?",
    "multiple",
    languages,
    (answer, answers) => ({
      language: answers["language"]?.includes(answer)
        ? [...(answers["language"] as string[])?.filter((a) => a !== answer)]
        : [...((answers["language"] || []) as string[]), answer],
    })
  );

export const ageNode = () =>
  createNode(
    "age",
    "Advisor preferences",
    "What is your age group?",
    "single",
    ageGroups
  );

export const preferredCompanyNode = () =>
  createNode(
    "company",
    "Advisor preferences",
    "Do you have a preferred company or advisor?",
    "multiple",
    [
      { code: "bank", name: "Bank" },
      { code: "independentFirmLarge", name: "Independent Firm (Large)" },
      { code: "independentFirmSmall", name: "Independent Firm (Small)" },
      { code: "insuranceCompany", name: "Insurance Company" },
      { code: "other", name: "Other" },
    ],
    (answer, answers) => ({
      company: answers["company"]?.includes(answer)
        ? [...(answers["company"] as string[])?.filter((a) => a !== answer)]
        : [...((answers["company"] || []) as string[]), answer],
    })
  );

export const userNameNode = () =>
  createNode("userName", "Personal Information", "What is your name?", "text");

export const startingFamilyNode = () =>
  createNode(
    "haveFamily",
    "Personal Information",
    "Do you have family or starting one soon?",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const supportingParentNode = () =>
  createNode(
    "haveParents",
    "Investment Challenges",
    "Are you supporting age parents?",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const retiredQuestionNode = () =>
  createNode("retired", "Investment Challenges", "Are you retired?", "single", [
    { code: "YES", name: "Yes" },
    { code: "NO", name: "No" },
  ]);

export const emegencyFundNode = () =>
  createNode(
    "emergencyFund",
    "Emergency Funds",
    "Do you have 3 to 6 months worth of take-home income saved?",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const DTPDcoverageNode = () =>
  createNode(
    "DTPDcoverage",
    "Protection",
    "Do you have Disability and Terminal Illness coverage?",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const illnessCoverageNode = () =>
  createNode(
    "illnessCoverage",
    "Protection",
    "Do you have Critical Illness insurance coverage worth 4x annual income?",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const insuranceCoverageNode = () =>
  createNode(
    "insuranceCoverage",
    "Protection",
    "Are you allocating 15% your take home income to insurance?",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const investingNode = (investmentPercent: string) =>
  createNode(
    "investing",
    "Investment",
    `Are you investing ${investmentPercent} of your income(after CPF deduction) towards financial goals?`,
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const reviewInvestment = () =>
  createNode(
    "professionalSupport",
    "Professional Support",
    "Congrat! Would you like professional support to optimise your portfolio.",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const investmentAdvise = () =>
  createNode(
    "investmentAdvise",
    "Investment",
    "Would you like to receive investment advice?",
    "single",
    [
      {
        code: "LEARNMORE",
        name: "I don't understand investing. Match me with an expert to learn more",
      },
      {
        code: "HELP",
        name: "I understand investing but I am not budgeting well enough to allocate 15%+",
      },
      { code: "BUSY", name: "Too busy building emergency fund." },
      { code: "DEBT", name: "Proioring debt management" },
    ]
  );

export const startRetirementNode = () =>
  createNode(
    "retirementPlaining",
    "Retirement Planning",
    "Have you started retirement planning?",
    "single",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ]
  );

export const reviewRetirementNode = () => createNode(
  "retirementReview",
  "Retirement Planning",
  "Would you like to review your retirement plan?",
  "single",
  [
    { code: "YES", name: "Yes" },
    { code: "NO", name: "No" },
  ]
);

export const considerRetirementNode = () => createNode(
  "retirementConsider",
  "Retirement Planning",
  "Consider starting! Woould you like professional support on this metter?",
  "single",
  [
    { code: "YES", name: "Yes" },
    { code: "NO", name: "No" },
  ]
);

export const lagacyPlanningNode = () => createNode(
  "lagacyPlanning",
  "Retirement Planning",
  "Do you have the following addressed \n 1. A will \n 2.CPF nomination \n 3. Appointed trusted persons",
  "single",
  [
    { code: "YES", name: "Yes" },
    { code: "HELP", name: "No, I want professional helpth with this" },
    { code: "RESOURCE", name: "No, give me resources for this"}
  ]
);

export const DTPDProtection = () => createNode(
  "DTPDProtection",
  "Protection",
  "Make sure you have the following. \n Death and Total Disability Coverage: 9x annual income \n Critical Illness Insurance: 4x annual income",
  "single",
  [
    { code: "YES", name: "I am covered" },
    { code: "CRITAL_ILLNESS", name: "I want help with Critical Illness Insurance" },
    { code: "DTPD", name: "I want help with Death and Total Permanent Disability Coverage" },
    { code: "RESOURCE", name: "Give me resources for this" }
  ]
)

export const insuranceFamilarity = () => createNode(
  "insuranceFamilarity",
  "Insurance Familarity",
  "Are you familiar with the following?\nHome Insurance\nFire and Home Content Insurance\nMediShield Life for large healthcare bill\nCareShield Life/Elder Shield for longterm case of severe disiability",
  "single",
  [
    { code: "YES", name: "Yes, I am familier" },
    { code: "NO", name: "No, Give me resources for this" }
  ]
)

export const retirementGoals = () => createNode(
  "retirementGoals",
  "Retirement Goals",
  "Do you need professional support with either of the following\n1. Unlocking the value of your assets\n2. CPF management, particularly CPF life",
  "single",
  [
    { code: "YES", name: "I want help with either CPF retirement schemes or asset management" },
    { code: "NO", name: "No help needed" },
  ],
)