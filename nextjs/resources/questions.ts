import {
  broadScope,
  religion,
  gender,
  languages,
  ageGroups,
  narrowScope,
  companies,
} from "@/lib/constants";
import { intersection } from "lodash";

export type QNode = {
  key: string;
  category: string;
  question: string;
  description?: string | null;
  title?: string | null;
  options: { code: string; name: string; description?: string }[];
  required: (answers: Record<string, string | string[]>) => boolean;
  answerModifier: (
    answers: Record<string, string | string[]>
  ) => Record<string, string | string[]>;
  type:
    | "single"
    | "multiple"
    | "text"
    | "multipleWithTags"
    | "multipleDropdown"
    | "cover";
  next: (answer: Object) => QNode | null;
  prev: (answer: Object) => QNode | null;
};

function createNode(
  key: string,
  category: string,
  question: string,
  type: QNode["type"],
  description: string | null = null,
  options: QNode["options"] = [],
  answerModifier: QNode["answerModifier"] = () => ({}),
  required: QNode["required"] = () => false,
  title: string | null = null
): QNode {
  return {
    key,
    category,
    question,
    options,
    type,
    title,
    description,
    answerModifier,
    required,
    next: () => null,
    prev: () => null,
  };
}

export const welcome = () =>
  createNode(
    "intro",
    "Let's Understand Your Needs",
    "How confident are you about knowing where you need help?",
    "single",
    null,
    [
      {
        code: "KNOW",
        name: "I know what area I want support with or product I need",
      },
      {
        code: "HELP",
        name: "Help me identify where I need professional support",
      },
    ],
    (answers) => ({
      contents: [
        "6601",
        "6651",
        "6701",
        ...((answers["contents"] as string[]) || []),
      ],
    }),
    ({ intro }) => !intro
  );

export const planningArea = () =>
  createNode(
    "broadScope",
    "Determining Your Needs",
    "Which areas of financial planning do you need help with?",
    "multiple",
    null,
    broadScope,
    () => ({}),
    ({ broadScope }) => !broadScope?.length
  );

export const specializationNodes = {
  IRM: () =>
    createNode(
      "specification",
      "Insurance and Risk Management",
      "Which aspects of insurance and risk management do you need help with?",
      "multiple",
      null,
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
      () => ({}),
      ({ specification }) =>
        intersection(specification ?? [], [
          "CIIP",
          "HMC",
          "CHS",
          "LI",
          "TI",
          "PAP",
          "PET",
          "OTHER",
        ]).length === 0
    ),
  IWM: () =>
    createNode(
      "specification",
      "Investments and Wealth Management",
      "Which aspects of investments and wealth management do you need help with?",
      "multiple",
      null,
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
      () => ({}),
      ({ specification }) =>
        intersection(specification ?? [], [
          "CPFIS",
          "WCI",
          "SII",
          "HNWP",
          "OTHER",
        ]).length === 0
    ),
  RLP: () =>
    createNode(
      "specification",
      "Retirement and Later-Life Planning",
      "Which aspects of retirement and later life planning do you need help with?",
      "multiple",
      null,
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
      () => ({}),
      ({ specification }) =>
        intersection(specification ?? [], ["RCP", "LEP", "PRP", "ECL", "OTHER"])
          .length === 0
    ),
  FPP: () =>
    createNode(
      "specification",
      "Family and Personal Planning",
      "Which aspects of family and personal planning do you need help with?",
      "multiple",
      null,
      [
        {
          code: "HCH",
          name: "Housing, HDB and CPF for Homes",
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
          code: "CEI",
          name: "Children (Education Savings, Child Health Insurance)",
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
      () => ({}),
      ({ specification }) =>
        intersection(specification ?? [], [
          "HCH",
          "FCP",
          "SCP",
          "CEI",
          "SNP",
          "DFP",
          "OTHER",
        ]).length === 0
    ),
  BCP: () =>
    createNode(
      "specification",
      "Business and Corporate Planning",
      "Which aspects of business and corporate planning do you need help with?",
      "multiple",
      null,
      [
        {
          code: "SEP",
          name: "Succession and Exit Planning",
        },
        {
          code: "CTP",
          name: "Corporate Tax Planning",
        },
        {
          code: "BIRM",
          name: "Business Insurance and Risk Management",
        },
        {
          code: "OTHER",
          name: "Other",
        },
      ],
      () => ({}),
      ({ specification }) =>
        intersection(specification ?? [], ["SEP", "CTP", "BIRM", "OTHER"])
          .length === 0
    ),
  NSP: () =>
    createNode(
      "specification",
      "Niche and Specialised Planning",
      "Which aspects of niche and specialised planning do you need help with?",
      "multiple",
      null,
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
      () => ({}),
      ({ specification }) =>
        intersection(specification ?? [], ["DMSL", "EFP", "TP", "SO", "OTHER"])
          .length === 0
    ),
};

export const advisorReligionNode = () =>
  createNode(
    "preferReligion",
    "Advisor Preferences",
    "Do you request a faith-aligned service? if so, please select by religion.",
    "multiple",
    null,
    [...religion, { code: undefined as never, name: "No preference" }]
  );

export const advisorGenderNode = () =>
  createNode(
    "preferGender",
    "Advisor Preferences",
    "By gender:",
    "single",
    null,
    [...gender, { code: undefined as never, name: "No preference" }]
  );

export const advisorLanguageNode = () =>
  createNode(
    "preferLanguage",
    "Advisor Preferences",
    "By languages spoken:",
    "multiple",
    null,
    [...languages, { code: undefined as never, name: "No preference" }]
  );

export const ageNode = () =>
  createNode(
    "age",
    "About You",
    "What is your age group?",
    "single",
    null,
    ageGroups,
    () => ({}),
    ({ age }) => !age
  );

export const advisorAgeNode = () =>
  createNode("preferAge", "Advisor Preferences", "By age:", "multiple", null, [
    ...ageGroups,
    { code: undefined as never, name: "No preference" },
  ]);

export const preferredCompanyNode = () =>
  createNode(
    "preferCompany",
    "Advisor Preferences",
    "By company or agency:",
    "multipleDropdown",
    null,
    companies
  );

export const additionalSpecification = () =>
  createNode(
    "specification",
    "Have We Missed Anything?",
    "Please select any additional specialisations that you need help with:",
    "multipleDropdown",
    null,
    [...narrowScope].sort((a, b) => a.name.localeCompare(b.name))
  );

export const userNameNode = () =>
  createNode("userName", "Personal Information", "What is your name?", "text");

export const startingFamilyNode = () =>
  createNode(
    "haveFamily",
    "About You",
    "Have you started a family or are starting one soon?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    () => ({}),
    ({ haveFamily }) => !haveFamily
  );

export const supportingParentNode = () =>
  createNode(
    "haveParents",
    "About You",
    "Are you supporting aged parents?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    () => ({}),
    ({ haveParents }) => !haveParents
  );

export const retiredQuestionNode = () =>
  createNode(
    "retired",
    "About You",
    "Are you retired?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    () => ({}),
    ({ retired }) => !retired
  );

export const emegencyFundNode = () =>
  createNode(
    "emergencyFund",
    "Emergency Fund",
    "Do you have 3 to 6 months worth of take-home income saved?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    (answers) => ({
      contents: [
        ...((answers["contents"] as string[]) ?? []),
        ...(answers["emergencyFund"] === "NO" &&
        !(answers["contents"] || []).includes("755")
          ? ["755"]
          : []),
      ],
    }),
    ({ emergencyFund }) => !emergencyFund,
    "Your Financial Planning"
  );

export const DTPDcoverageNode = () =>
  createNode(
    "DTPDCoverage",
    "Protection",
    "Do you have Death and Total Permanent Disability coverage worth 9x annual income?",
    "single",
    "Death and Total Permanent Disability (TPD) coverage is typically included in life insurance policies like whole life, term life, and investment-linked plans, either as a standard feature or optional rider.",
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    (answers) => ({
      specification: [
        ...((answers["specification"] as string[]) || []),
        ...(answers["DTPDCoverage"] === "NO" &&
        !answers["specification"]?.includes("LI")
          ? ["LI"]
          : []),
      ],
    }),
    ({ DTPDCoverage }) => !DTPDCoverage,
    "Your Financial Planning"
  );

export const illnessCoverageNode = () =>
  createNode(
    "illnessCoverage",
    "Protection",
    "Do you have Critical Illness coverage worth 4x annual income?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    (answers) => ({
      specification: [
        ...((answers["specification"] as string[]) || []),
        ...(answers["illnessCoverage"] === "NO" &&
        !(answers["specification"] || [])?.includes("CIIP")
          ? ["CIIP"]
          : []),
      ],
    }),
    ({ illnessCoverage }) => !illnessCoverage,
    "Your Financial Planning"
  );

export const insuranceCoverageNode = () =>
  createNode(
    "insuranceCoverage",
    "Protection",
    "Are you allocating 15% of your take-home income (after CPF contributions) to insurance?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    (answers) => ({
      broadScope: [
        ...((answers["broadScope"] as string[]) || []),
        ...(answers["insuranceCoverage"] === "NO" &&
        !answers["broadScope"]?.includes("IRM")
          ? ["IRM"]
          : []),
      ],
    }),
    ({ insuranceCoverage }) => !insuranceCoverage,
    "Your Financial Planning"
  );

export const investingNode = (investmentPercent: string) =>
  createNode(
    "investing",
    "Investing",
    `Are you investing ${investmentPercent} of your take-home income (after CPF contributions) towards financial goals?`,
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    () => ({}),
    ({ investing }) => !investing,
    "Your Financial Planning"
  );

export const reviewInvestment = () =>
  createNode(
    "professionalSupport",
    "Investing",
    "Well done. Are you looking for professional support with portfolio optimisation?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    (answers) => ({
      specification: [
        ...((answers["specification"] as string[]) || []),
        ...(answers["professionalSupport"] === "YES" &&
        !answers["specification"]?.includes("WCI")
          ? ["WCI"]
          : []),
      ],
    }),
    ({ professionalSupport }) => !professionalSupport,
    "Your Financial Planning"
  );

export const investmentAdvise = (percent, skipBusy = false) =>
  createNode(
    "investmentAdvise",
    "Investing",
    "What is your reason for answering no?",
    "single",
    null,
    [
      {
        code: "LEARNMORE",
        name: "Investing is too complicated for me and I would like professional help with it",
      },
      {
        code: "HELP",
        name: `I understand investing but I am not budgeting well enough to allocate ${percent}`,
      },
      ...(skipBusy
        ? []
        : [{ code: "BUSY", name: "I am too busy building my emergency fund" }]),
      { code: "DEBT", name: "I am prioritising debt management" },
    ],
    (answers) => {
      switch (answers["investmentAdvise"]) {
        case "LEARNMORE":
          return {
            broadScope: [
              ...((answers["broadScope"] as string[]) || []),
              ...(!answers["broadScope"]?.includes("IWM") ? ["IWM"] : []),
            ],
          } as never;
        case "HELP":
          return {
            contents: [
              ...((answers["contents"] as string[]) || []),
              ...(!answers["contents"]?.includes("756") ? ["756"] : []),
            ],
          } as never;
        case "DEBT":
          return {
            contents: [
              ...((answers["contents"] as string[]) || []),
              "708",
              "710",
              "3261",
            ],
          } as never;
        default:
          return {};
      }
    },
    ({ investmentAdvise }) => !investmentAdvise,
    "Your Financial Planning"
  );

export const startRetirementNode = () =>
  createNode(
    "retirementPlaining",
    "Retirement Planning",
    "Have you started planning for retirement?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    () => ({}),
    ({ retirementPlaining }) => !retirementPlaining,
    "Your Financial Planning"
  );

export const reviewRetirementNode = () =>
  createNode(
    "retirementReview",
    "Retirement Planning",
    "Well done. Would you like a professional to review your retirement plan?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    (answers) => ({
      broadScope: [
        ...((answers["broadScope"] as string[]) || []),
        ...(answers["retirementReview"] === "YES" &&
        !answers["broadScope"]?.includes("RLP")
          ? ["RLP"]
          : []),
      ],
    }),
    ({ retirementReview }) => !retirementReview,
    "Your Financial Planning"
  );

export const considerRetirementNode = () =>
  createNode(
    "retirementConsider",
    "Retirement Planning",
    "Consider starting! Would you like professional support on this matter?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "NO", name: "No" },
    ],
    (answers) => ({
      broadScope: [
        ...((answers["broadScope"] as string[]) || []),
        ...(answers["retirementConsider"] === "YES" &&
        !answers["broadScope"]?.includes("RLP")
          ? ["RLP"]
          : []),
      ],
    }),
    ({ retirementConsider }) => !retirementConsider,
    "Your Financial Planning"
  );

export const lagacyPlanningNode = () =>
  createNode(
    "lagacyPlanning",
    "Legacy Planning",
    "Have you made your will and CPF nomination, and appointed trusted persons?",
    "single",
    null,
    [
      { code: "YES", name: "Yes" },
      { code: "HELP", name: "No, I want professional help with this" },
      { code: "RESOURCE", name: "No, give me resources for this" },
    ],
    (answers) => {
      switch (answers["lagacyPlanning"]) {
        case "HELP":
          return {
            specification: [
              ...((answers["specification"] as string[]) || []),
              ...(!answers["specification"]?.includes("LEP") ? ["LEP"] : []),
            ],
          } as never;
        case "RESOURCE":
          return {
            contents: [
              ...((answers["contents"] as string[]) || []),
              "760",
              "761",
              "763",
              "683",
            ],
          } as never;
        default:
          return {};
      }
    },
    ({ lagacyPlanning }) => !lagacyPlanning,
    "Your Financial Planning"
  );

export const DTPDProtection = () =>
  createNode(
    "DTPDProtection",
    "Protection",
    "Make sure you have the following coverage: \n 1. Death & Total Permanent Disability (TPD): 9x annual income. \n 2. Critical illness: 4x annual income",
    "multiple",
    "Death and TPD coverage is typically included in life insurance policies like whole life, term life, and investment-linked plans, either as a standard feature or optional rider.",
    [
      { code: "YES", name: "I am covered" },
      {
        code: "CRITAL_ILLNESS",
        name: "I want professional help with critical illness coverage",
      },
      {
        code: "DTPD",
        name: "I want professional help with death and TPD coverage",
      },
      { code: "RESOURCE", name: "I want resources for this area" },
    ],
    (answers) => {
      const ans = answers["DTPDProtection"] ?? [];
      const modified = {
        specification: [...((answers["specification"] as string[]) || [])],
        contents: [...((answers["contents"] as string[]) || [])],
      };
      if (
        ans.includes("CRITAL_ILLNESS") &&
        !modified.specification.includes("CIIP")
      )
        modified.specification.push("CIIP");
      if (ans.includes("DTPD") && !modified.specification.includes("LI"))
        modified.specification.push("LI");
      if (ans.includes("RESOURCE")) modified.contents.push("2851", "3303");
      return modified;
    },
    ({ DTPDProtection }) => !DTPDProtection,
    "Your Financial Planning"
  );

export const insuranceFamilarity = () =>
  createNode(
    "insuranceFamilarity",
    "Protection",
    "Are you familiar with the following?:\n1. Home insurance\n2. Fire and home content insurance\n3. MediShield Life\n4. CareShield Life/Elder Shield",
    "single",
    null,
    [
      { code: "YES", name: "Yes, I am familiar" },
      { code: "NO", name: "No, give me resources for this" },
    ],
    () => ({}),
    ({ insuranceFamilarity }) => !insuranceFamilarity,
    "Your Financial Planning"
  );

export const retirementGoals = () =>
  createNode(
    "retirementGoals",
    "Retirement Goals",
    "Do you need professional support with either of the following?:\n1. Unlocking the value of your assets\n2. CPF management, particularly CPF Life",
    "single",
    null,
    [
      {
        code: "YES",
        name: "I want help with one or both of these areas",
      },
      { code: "NO", name: "No help needed" },
    ],
    (answers) => ({
      specification: [
        ...((answers["specification"] as string[]) || []),
        ...(answers["retirementGoals"] === "YES" &&
        !answers["specification"]?.includes("RCP")
          ? ["RCP"]
          : []),
      ],
    }),
    ({ retirementGoals }) => !retirementGoals,
    "Your Financial Planning"
  );

export const personalQuestionsCover = () =>
  createNode(
    "cover",
    "Financial Needs Determined",
    "We connect users with professionals who not only specialise in the financial support they need but also understand and relate to their unique situations.",
    "cover",
    "You're almost there! Let's take a moment to learn about any personal preferences you have for your advisor match. These steps are optional but will help us find a better fit for you.",
    []
  );
