// Define types for our mappings
type ContentIdUrlMap = {
  [key: string]: string;
};

type ContentIdTitleMap = {
  [key: string]: string;
};

// Create a mapping of content IDs to their corresponding URLs
export const contentIdToUrl: ContentIdUrlMap = {
  "6601": "https://moneyfitt.co/articles/how-to-find-the-best-insurance-agent-for-you-in-singapore",
  "6651": "https://moneyfitt.co/articles/insurance-agent-vs-financial-advisor---which-expert-should-you-choose",
  "6701": "https://moneyfitt.co/articles/how-a-trusted-financial-consultant-can-guide-you-to-prosperity-in-singapore",
  "755": "https://moneyfitt.co/articles/why-you-must-have-an-emergency-fund-and-how-to-save-for-it",
  "756": "https://moneyfitt.co/articles/budgeting-101-why-a-strong-budget-is-a-catalyst-for-financial-freedom",
  "708": "https://moneyfitt.co/articles/understanding-the-basics-of-credit-debt-and-credit-cards",
  "710": "https://moneyfitt.co/articles/visualising-credit-card-misuse-and-the-debt-cycle",
  "3261": "https://moneyfitt.co/articles/what-to-ask-your-bank-when-you-have-too-much-debt",
  "760": "https://moneyfitt.co/articles/estate-planning-what-it-is-and-why-you-need-it",
  "761": "https://moneyfitt.co/articles/maximise-your-legacy-the-importance-of-will-writing-in-estate-planning",
  "763": "https://moneyfitt.co/articles/estate-planning-what-is-a-trust-fund-and-why-set-one-up",
  "683": "https://moneyfitt.co/articles/protect-your-family-s-future-with-lasting-power-of-attorney-lpa",
  "2851": "https://moneyfitt.co/articles/your-ultimate-guide-to-life-insurance-everything-you-need-to-know",
  "3303": "https://moneyfitt.co/articles/critical-illness-insurance-why-you-need-it-even-with-health-insurance",
  
  // New entries
  "3109": "https://moneyfitt.co/articles/integrated-shield-plans-why-medishield-life-is-unfortunately-often-insufficient",
  "152": "https://moneyfitt.co/articles/health-insurance-so-medical-woes-dont-have-to-hurt-your-wallet-too",
  "1819": "https://moneyfitt.co/articles/travel-insurance-dont-forget-to-put-it-on-your-trip-itinerary",
  "1865": "https://moneyfitt.co/articles/pet-insurance-for-your-furkids-coverage-and-considerations",
  "3251": "https://moneyfitt.co/articles/5-tips-to-help-you-find-the-right-insurance-agent",
  "3955": "https://moneyfitt.co/articles/exploring-your-financial-options-why-loyalty-to-one-adviser-may-not-be-best",

  // Investment related entries
  "2505": "https://moneyfitt.co/articles/cpf-investment-scheme-cpfis-a-guide-to-investing-your-cpf-savings",
  "751": "https://moneyfitt.co/articles/investing-basics-risk-appetite-time-horizon-asset-allocation-and-diversification",
  "1852": "https://moneyfitt.co/articles/reasons-to-start-investing-retirement-fire-and-good-causes",
  "930": "https://moneyfitt.co/articles/how-to-construct-a-successful-investment-portfolio",
  "931": "https://moneyfitt.co/articles/core-satellite-investing-strategy-above-average-returns-with-below-average-risk",
  "1057": "https://moneyfitt.co/articles/how-to-become-a-better-investor-start-by-understanding-the-psychology-of-investing",
  "968": "https://moneyfitt.co/articles/understanding-investment-considerations-return-and-risk",

  // New retirement and legacy planning entries
  "2503": "https://moneyfitt.co/articles/cpf-singapores-mandatory-savings-for-retirement-housing-and-healthcare",
  "1055": "https://moneyfitt.co/articles/understanding-estate-planning-wills-trusts-and-lasting-power-of-attorney",

  // Housing related entry
  "2454": "https://moneyfitt.co/articles/buying-a-house-101-one-of-lifes-most-significant-financial-goals",
};

// Create a mapping of content IDs to their proper titles
export const contentIdToTitle: ContentIdTitleMap = {
  "6601": "How to Find the Best Insurance Agent for You in Singapore",
  "6651": "Insurance Agent vs Financial Advisor: Which Expert Should You Choose?",
  "6701": "How a Financial Consultant Can Guide You to Prosperity in Singapore",
  "755": "Why You Must Have an Emergency Fund and How to Save for It",
  "756": "Budgeting 101: Why a Strong Budget Is a Catalyst for Financial Freedom",
  "708": "Understanding the Basics of Credit, Debt, and Credit Cards",
  "710": "Visualising Credit Card Misuse and the Debt Cycle",
  "3261": "What to Ask Your Bank When You Have Too Much Debt",
  "760": "Estate Planning: What It Is and Why You Need It",
  "761": "Maximise Your Legacy: The Importance of Will Writing in Estate Planning",
  "763": "Estate Planning: What is a Trust Fund and Why Set One Up?",
  "683": "Protect Your Family's Future with Lasting Power of Attorney (LPA)",
  "2851": "Your Ultimate Guide to Life Insurance: Everything You Need to Know",
  "3303": "Critical Illness Insurance: Why You Need It Even with Health Insurance",
  
  // New entries
  "3109": "Integrated Shield Plans: Why MediShield Life Is Unfortunately Often Insufficient",
  "152": "Health Insurance: So Medical Woes Don't Have To Hurt Your Wallet Too",
  "1819": "Travel Insurance: Don't Forget to Put It on Your Trip Itinerary",
  "1865": "Pet Insurance for Your Furkids: Coverage and Considerations",
  "3251": "5 Tips to Help You Find the Right Insurance Agent",
  "3955": "Exploring Your Financial Options: Why Loyalty to One Adviser May Not Be Best",

  // Investment related entries
  "2505": "CPF Investment Scheme (CPFIS): A Guide to Investing Your CPF Savings",
  "751": "Investing Basics: Risk Appetite, Time Horizon, Asset Allocation, and Diversification",
  "1852": "Reasons to Start Investing: Retirement, FIRE and Good Causes",
  "930": "How to Construct a Successful Investment Portfolio",
  "931": "Core-Satellite Investing Strategy: Above-Average Returns with Below-Average Risk",
  "1057": "How to Become a Better Investor: Start by Understanding the Psychology of Investing",
  "968": "Understanding Investment Considerations: Return and Risk",

  // New retirement and legacy planning entries
  "2503": "CPF: Singapore's Mandatory Savings for Retirement, Housing, and Healthcare",
  "1055": "Understanding Estate Planning: Wills, Trusts and Lasting Power of Attorney",

  // Housing related entry
  "2454": "Buying a House 101: One of Life's Most Significant Financial Goals",
};

// Function to get the URL for a given content ID
export function getUrlForContentId(contentId: string): string | undefined {
  return contentIdToUrl[contentId];
}

// Function to get the proper title for a given content ID
export function getTitleForContentId(contentId: string): string | undefined {
  return contentIdToTitle[contentId];
}
