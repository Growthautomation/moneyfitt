import { mapAnswersToQA } from '@/resources/map-questions';

export default function UserInfoCard({ client, contactInfo }) {
  const { qaList, helpAreas } = mapAnswersToQA(client.all_answers);

  // Helper function to generate a summary
  function generateSummary(qaList: { question: string; answer: string }[]): string[] {
    const summary: string[] = [];

    // Helper function to find an answer
    const findAnswer = (keyword: string): string | undefined => {
      const qa = qaList.find(qa => qa.question.toLowerCase().includes(keyword.toLowerCase()));
      return qa?.answer;
    };

    // Name and Age
    const name = findAnswer("What is your name?");
    const age = findAnswer("What is your age group?");
    if (name || age) {
      summary.push(`${name || 'Client'} (${age || 'Age not specified'})`);
    }

    // Family Status
    if (findAnswer("Do you have family or starting one soon?") === "Yes") {
      summary.push("Has or starting a family");
    }

    // Supporting Parents
    if (findAnswer("Are you supporting age parents?") === "Yes") {
      summary.push("Supporting aging parents");
    }

    // Retirement Status
    if (findAnswer("Are you retired?") === "Yes") {
      summary.push("Retired");
    }

    // Emergency Fund
    if (findAnswer("Do you have 3 to 6 months worth of take-home income saved?") === "No") {
      summary.push("Lacks emergency fund");
    }

    // DTPD Coverage
    if (findAnswer("Do you have Death and Total Permanent Disability Coverage worth 9x annual income?") === "No") {
      summary.push("Insufficient DTPD coverage");
    }

    // Critical Illness Coverage
    if (findAnswer("Do you have Critical Illness insurance coverage worth 4x annual income?") === "No") {
      summary.push("Insufficient critical illness coverage");
    }

    // Insurance Allocation
    if (findAnswer("Are you allocating 15% your take home income to insurance?") === "No") {
      summary.push("Under-allocated for insurance");
    }

    // Investment
    const investingAnswer = findAnswer("Are you investing");
    if (investingAnswer === "No") {
      summary.push("Not currently investing");
    }

    // Investment Advice
    const investmentAdvice = findAnswer("Would you like to receive investment advice?");
    if (investmentAdvice) {
      summary.push(`Investment advice: ${investmentAdvice}`);
    }

    // Retirement Planning
    if (findAnswer("Have you started retirement planning?") === "No") {
      summary.push("No retirement planning started");
    }

    // Legacy Planning
    const legacyPlanning = findAnswer("Do you have the following addressed");
    if (legacyPlanning && legacyPlanning !== "Yes") {
      summary.push("Needs legacy planning assistance");
    }

    // Financial Planning Areas
    const planningAreas = findAnswer("What area of financial planning do you need help with?");
    if (planningAreas) {
      summary.push(`Focus areas: ${planningAreas}`);
    }

    // Advisor Preferences
    const preferences: string[] = [];
    const religion = findAnswer("Do you have any prefernces for your advisors religous beliefs?");
    const gender = findAnswer("What is your gender");
    const language = findAnswer("What language do you prefer to communicate in?");
    const company = findAnswer("Do you have a preferred company or advisor?");

    if (religion) preferences.push(`Religion: ${religion}`);
    if (gender) preferences.push(`Gender: ${gender}`);
    if (language) preferences.push(`Language: ${language}`);
    if (company) preferences.push(`Preferred Company: ${company}`);

    if (preferences.length > 0) {
      summary.push(`Preferences: ${preferences.join(', ')}`);
    }

    return summary;
  }

  const summary = generateSummary(qaList);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4 w-full">
      <h2 className="font-bold text-xl mb-4">Client Info</h2>
      
      {/* Contact Information Section */}
      {contactInfo && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
          <p><strong>Email:</strong> {contactInfo.email}</p>
          <p><strong>Phone:</strong> {contactInfo.phone}</p>
        </div>
      )}
      
      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Summary</h3>
        <ul className="list-disc pl-5">
          {summary.map((item, index) => (
            <li key={index} className="mb-1">{item}</li>
          ))}
        </ul>
      </div>

      {/* Areas Needing Help Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Areas Needing Assistance</h3>
        <ul className="list-disc pl-5">
          {helpAreas.map((item, index) => (
            <li key={index} className="mb-1">{item}</li>
          ))}
        </ul>
      </div>

      {/* Detailed Q&A Section */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Detailed Information</h3>
        {qaList.map((qa, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{qa.question}</p>
            <p className="ml-4">{qa.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
