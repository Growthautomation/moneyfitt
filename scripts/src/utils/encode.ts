const broadScope = [
  {
    code: "IRM",
    name: "Insurance and Risk Management: Safeguarding health, life, income, and assets",
    description: "Safeguarding health, life, income, and assets.",
  },
  {
    code: "IWM",
    name: "Investments and Wealth Management: Growing or preserving wealth",
    description: "Growing or preserving wealth.",
  },
  {
    code: "RLP",
    name: "Retirement and Later-Life Planning: Planning for retirement and stability",
    description: "Planning for retirement and stability.",
  },
  {
    code: "FPP",
    name: "Family and Personal Planning: E.g. Education, family planning, wills",
    description: "E.g. Education, family planning, wills.",
  },
  {
    code: "BCP",
    name: "Business and Corporate Planning: Business growth, protection, and succession planning",
    description: "Business growth, protection, and succession planning",
  },
  {
    code: "NSP",
    name: "Niche and Specialised Planning: E.g. Tax planning, alternative investments, divorce planning",
    description:
      "E.g. Tax planning, alternative investments, divorce planning.",
  },
];

const narrowScope = [
  { code: "BIRM", name: "Business Insurance and Risk Management" },
  { code: "CEI", name: "Children (Education Savings,Child Health Insurance)" },
  { code: "CIIP", name: "Critical Illness/Income Protection" },
  { code: "CTP", name: "Corporate Tax Planning" },
  { code: "CHS", name: "CPF Health Schemes" },
  { code: "CIS", name: "CPF Investment Schemes" },
  { code: "DMSL", name: "Debt Management and Student Loans" },
  { code: "DFP", name: "Divorce Financial Planning" },
  { code: "ECLS", name: "Elder Care and Long-Term Support" },
  { code: "EFP", name: "Expat Financial Planning" },
  { code: "FCP", name: "Family and Child Planning" },
  { code: "GZ", name: "Gen Z" },
  { code: "HMC", name: "Health and Medical Coverage" },
  { code: "HNWP", name: "High Net Worth Planning" },
  { code: "HCH", name: "Housing and CPF for Homes" },
  { code: "LEP", name: "Legacy and Estate Planning" },
  { code: "LI", name: "Life Insurance" },
  { code: "MA", name: "Middle Aged (40-60)" },
  { code: "M", name: "Millennials" },
  { code: "P", name: "Pets" },
  { code: "R", name: "Retirees" },
  { code: "W", name: "Women" },
  { code: "PRP", name: "Pre-Retirement Planning" },
  { code: "PAP", name: "Property and Asset Protection" },
  { code: "RCP", name: "Retirement and CPF Planning" },
  { code: "SO", name: "Singaporeans Overseas" },
  { code: "SCP", name: "Special Circumstances Planning" },
  { code: "SNP", name: "Special Needs Planning" },
  { code: "SEP", name: "Succession and Exit Planning" },
  { code: "SII", name: "Sustainable and Impact Investing" },
  { code: "TP", name: "Tax Planning" },
  { code: "TI", name: "Travel Insurance" },
  { code: "WCI", name: "Wealth Creation and Investments" },
  { code: "GEW", name: "Gig Economy Worker" },
  { code: "MG", name: "Merdeka Generation" },
  { code: "NP", name: "New Parent" },
];

const ageGroups = [
  {
    code: "A1",
    name: "18-25",
  },
  {
    code: "A2",
    name: "26-34",
  },
  {
    code: "A3",
    name: "35-54",
  },
  {
    code: "A4",
    name: "55-64",
  },
  {
    code: "A5",
    name: "65+",
  },
];

const gender = [
  {
    code: "M",
    name: "Male",
  },
  {
    code: "F",
    name: "Female",
  },
];

const languages = [
  { code: "ENG", name: "English" },
  { code: "CHI", name: "Mandarin" },
  { code: "MAL", name: "Malay" },
  { code: "TAM", name: "Tamil" },
  { code: "HOK", name: "Hokkien" },
  { code: "CAN", name: "Cantonese" },
  { code: "TEO", name: "Teochew" },
  { code: "HAK", name: "Hakka" },
  { code: "BEN", name: "Bengali" },
  { code: "PUN", name: "Punjabi" },
];

const religion = [
  { code: "CHR", name: "Christianity" },
  { code: "CAT", name: "Catholicism" },
  { code: "ISL", name: "Islam" },
  { code: "BUD", name: "Buddhism" },
  { code: "HIN", name: "Hinduism" },
  { code: "TAO", name: "Taoism" },
  { code: "SIK", name: "Sikhism" },
  { code: "JUD", name: "Judaism" },
  { code: "ATH", name: "Atheism" },
];

export const companies = [
  { code: 'AWM', name: 'Ascendance Wealth Management(AWM)' },
  { code: 'HSBC', name: 'HSBC Life' },
  { code: "II", name: "Income Insurance" },
  { code: "PRU", name: "Prudential" },
  { code: "GE", name: "Great Eastern (Advisors’ Clique Collective)"},
  { code: "PIAS", name: "Professional Investment Advisory Services"},
  { code: "FA", name: "Financial Alliance Pte Ltd"},
  { code: "PS", name: "Phillip Securities Pte Ltd"}
]

export function encodeLanguage(lang: string) {
  const obj = languages.find((l) => l.name === lang);
  if (!obj) throw new Error("Language not found: " + lang);
  return obj.code;
}

export function encodeGender(g: string){
    const obj = gender.find((l) => l.name === g);
    if (!obj) throw new Error('Gender not found: ' + g);
    return obj.code;
}

export function encodeReligion(r: string){
    const obj = religion.find((l) => l.name === r);
    if (!obj) throw new Error('Religion not found: ' + r);
    return obj.code;
}

export function encodeAgeGroup(age: string){
    const numerical = parseInt(age);
    if (isNaN(numerical)) throw new Error('Age must be a number');
    if (numerical >= 65){
        return 'A5';
    }
    if (numerical >= 55){
        return 'A4';
    }
    if (numerical >= 35){
        return 'A3';
    }
    if (numerical >= 26){
        return 'A2';
    }   
    if (numerical >= 18){
        return 'A1';
    }
    throw new Error('Age must be at least 18');
}

export function encodeBroadScope(scope: string){
    const obj = broadScope.find((l) => l.name === scope);
    if (!obj) throw new Error('Broad scope not found: ' + scope);
    return obj.code;
}

export function encodeNarrowScope(scope: string){
    const obj = narrowScope.find((l) => l.name === scope);
    if (!obj) throw new Error('Narrow scope not found: ' + scope);
    return obj.code;
}

export function encodeCompany(comp: string){
    const obj =  companies.find((l) => l.name === comp);
    if (!obj) throw new Error('Company not found: ' + comp);
    return obj.code;
}
