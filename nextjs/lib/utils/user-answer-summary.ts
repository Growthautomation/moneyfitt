import {
  decodeAge,
  decodeBroadScope,
  decodeGender,
  decodeLanguage,
  decodeReligion,
  decodeSpecifications,
} from "./decode-answers";

export function getUserAnswerSummary(answers) {
  const summary: string[] = [];

  // Age
  summary.push(`Age: (${decodeAge(answers["age"]) || "Age not specified"})`);

  // Family Status
  if (answers["haveFamily"] === "YES") {
    summary.push("Has or starting a family");
  }

  // Supporting Parents
  if (answers["haveParents"] === "YES") {
    summary.push("Supporting aging parents");
  }

  // Retirement Status
  if (answers["retired"] === "YES") {
    summary.push("Retired");
  }

  // Emergency Fund
  if (answers["emergencyFund"] === "NO") {
    summary.push("Lacks emergency fund");
  }

  // DTPD Coverage
  if (answers["DTPDCoverage"] === "NO") {
    summary.push("Insufficient DTPD coverage");
  }

  // Critical Illness Coverage
  if (answers["illnessCoverage"] === "NO") {
    summary.push("Insufficient critical illness coverage");
  }

  // Insurance Allocation
  if (answers["insuranceCoverage"] === "NO") {
    summary.push("Under-allocated for insurance");
  }

  // Investment
  if (answers["investing"] === "No") {
    summary.push("Not currently investing");
  }

  // Investment Advice
  if (answers["investmentAdvise"]) {
    summary.push(`Investment advice: ${answers["investmentAdvise"]}`);
  }

  // Retirement Planning
  if (answers["retirementPlaining"] === "NO") {
    summary.push("No retirement planning started");
  }

  // Legacy Planning
  if (answers["lagacyPlanning"] !== "YES") {
    summary.push("Needs legacy planning assistance");
  }

  // Financial Planning Areas
  if (answers["broadScope"]) {
    summary.push(
      `Focus areas: ${decodeBroadScope(answers["broadScope"] ?? [])}`
    );
  }

  // Advisor Preferences
  if (answers["religion"]) {
    summary.push(`Preferred Religion: ${decodeReligion(answers["religion"])}`);
  }
  if (answers["gender"]) {
    summary.push(`Preferred Gender: ${decodeGender(answers["gender"])}`);
  }
  if (answers["language"]) {
    summary.push(`Prefered Language: ${decodeLanguage(answers["language"])}`);
  }
  if (answers["company"]) {
    summary.push(`Preferred Company: ${answers["company"]}`);
  }

  return summary;
}

export function getUserAnswerHelpArea(answers) {
  const helpArea = [] as string[];

  if (answers["broadScope"]) {
    helpArea.push(...decodeBroadScope(answers["broadScope"] ?? []));
  }
  if(answers["specification"]){
    helpArea.push(...decodeSpecifications(answers["specification"] ?? []));
  }
  if (answers['emergencyFund'] === 'NO') {
    helpArea.push('Emergency Fund Planning');
  }
  if (answers['DTPDCoverage']  === 'NO') {
    helpArea.push('Death and Total Permanent Disability Coverage');
  }
  if (answers['illnessCoverage'] === 'NO') {
    helpArea.push('Critical Illness Coverage');
  }
  if (answers['insuranceCoverage'] === 'NO') {
    helpArea.push('Insurance Allocation');
  }
  if (answers['investing'] === 'NO') {
    helpArea.push('Investment Planning');
  }
  if (answers['retirementPlaining'] === 'NO') {
    helpArea.push('Retirement Planning');
  }
  if (answers['lagacyPlanning']  === 'HELP') {
    helpArea.push('Legacy Planning');
  }
  return helpArea
}
