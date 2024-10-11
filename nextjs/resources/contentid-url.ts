// Define a type for the content ID to URL mapping
type ContentIdUrlMap = {
  [key: string]: string;
};

// Create a mapping of content IDs to their corresponding URLs
export const contentIdToUrl: ContentIdUrlMap = {
  "6601": "https://moneyfitt.co/blog/article/how-to-find-the-best-insurance-agent-for-you-in-singapore-6601",
  "6651": "https://moneyfitt.co/blog/article/insurance-agent-vs-financial-advisor-which-expert-should-you-choose-6651",
  "6701": "https://moneyfitt.co/blog/article/how-a-financial-consultant-can-guide-you-to-prosperity-in-singapore-6701",
  
  // New entries
  "755": "https://moneyfitt.co/blog/article/why-you-must-have-an-emergency-fund-and-how-to-save-for-it-755",
  "756": "https://moneyfitt.co/blog/article/budgeting-101-why-a-strong-budget-is-a-catalyst-for-financial-freedom-756",
  "708": "https://moneyfitt.co/blog/article/understanding-the-basics-of-credit-debt-and-credit-cards-708",
  "710": "https://moneyfitt.co/blog/article/visualising-credit-card-misuse-and-the-debt-cycle-710",
  "3261": "https://moneyfitt.co/blog/article/what-to-ask-your-bank-when-you-have-too-much-debt-3261",
  "760": "https://moneyfitt.co/blog/article/estate-planning-what-it-is-and-why-you-need-it-760",
  "761": "https://moneyfitt.co/blog/article/maximise-your-legacy-the-importance-of-will-writing-in-estate-planning-761",
  "763": "https://moneyfitt.co/blog/article/estate-planning-what-is-a-trust-fund-and-why-set-one-up-763",
  "683": "https://moneyfitt.co/blog/article/protect-your-family-s-future-with-lasting-power-of-attorney-lpa-683",
  "2851": "https://moneyfitt.co/blog/article/your-ultimate-guide-to-life-insurance-everything-you-need-to-know-2851",
  "3303": "https://moneyfitt.co/blog/article/critical-illness-insurance-why-you-need-it-even-with-health-insurance-3303",
};

// Function to get the URL for a given content ID
export function getUrlForContentId(contentId: string): string | undefined {
  return contentIdToUrl[contentId];
}

// Function to get the content ID from a URL
export function getContentIdFromUrl(url: string): string | undefined {
  const contentId = url.split('-').pop();
  return contentId && contentIdToUrl[contentId] ? contentId : undefined;
}
