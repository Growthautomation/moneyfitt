import { broadScope } from "@/lib/constants";

export type QNode = {
  key: string;
  category: string;
  question: string;
  options: { code: string; name: string; description?: string }[];
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
  options: QNode["options"] = []
): QNode {
  return {
    key,
    category,
    question,
    options,
    type,
    next: () => null,
    prev: () => null,
  };
}

export const welcome = createNode(
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

export const planningArea = createNode(
  "broadScope",
  "Financial Planning Areas",
  "What area of financial planning do you need help with?",
  "multiple",
  broadScope
);

export const specializationNodes = {
  IRM: createNode(
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
        code: null as never,
        name: "Other",
      },
    ]
  ),
  IWM: createNode(
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
        code: null as never,
        name: "Other",
      },
    ]
  ),
  RLP: createNode(
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
        code: null as never,
        name: "Other",
      },
    ]
  ),
  FPP: createNode(
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
        code: null as never,
        name: "Other",
      },
    ]
  ),
  BCP: createNode(
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
        code: null as never,
        name: "Other",
      },
    ]
  ),
  NSP: createNode(
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
        code: null as never,
        name: "Other",
      },
    ]
  ),
};
