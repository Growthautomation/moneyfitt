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
  "6651": "https://moneyfitt.co/articles/insurance-agent-vs-financial-advisor-which-expert-should-you-choose",
  "6701": "https://moneyfitt.co/articles/how-a-financial-consultant-can-guide-you-to-prosperity-in-singapore",
  
  // New entries
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
};

// Function to get the URL for a given content ID
export function getUrlForContentId(contentId: string): string | undefined {
  return contentIdToUrl[contentId];
}

// Function to get the proper title for a given content ID
export function getTitleForContentId(contentId: string): string | undefined {
  return contentIdToTitle[contentId];
}
