import { getQuestions } from '../resources/onboarding-question-v2';
import { QNode, specializationNodes, planningArea } from '../resources/questions';

// Helper function to find an option across all specialization nodes
function findSpecializationOption(code: string): string | undefined {
  for (const nodeFunc of Object.values(specializationNodes)) {
    const node = nodeFunc();
    const option = node.options.find(opt => opt.code === code);
    if (option) {
      return option.name;
    }
  }
  return undefined;
}

/**
 * Maps the user's answers to the full questions and textual answers.
 * @param answers - The JSON object containing user's answers.
 * @returns An object with qaList and helpAreas.
 */
export function mapAnswersToQA(
  answers: Record<string, any>
): { 
  qaList: { question: string; answer: string }[];
  helpAreas: string[];
} {
  const qaList: { question: string; answer: string }[] = [];
  const questionMap = new Map<string, QNode>();
  const helpAreas: Set<string> = new Set(); // Using a Set to avoid duplicates

  // Helper function to traverse and collect all questions
  function traverseQuestions(node: QNode) {
    if (!questionMap.has(node.key)) {
      questionMap.set(node.key, node);

      // Traverse to the next node based on default flow
      if (node.next) {
        const nextNode = node.next({ [node.key]: null });
        if (nextNode) {
          traverseQuestions(nextNode);
        }
      }
    }
  }

  // Start traversal from the root question
  const rootQuestion = getQuestions();
  traverseQuestions(rootQuestion);

  // Map user's answers to questions and answer texts
  for (const [key, value] of Object.entries(answers)) {
    if (questionMap.has(key)) {
      const questionNode = questionMap.get(key)!;
      let answerText = '';

      // Handle different question types
      if (questionNode.type === 'multiple' || questionNode.type === 'multipleWithTags') {
        const selectedOptions = (value as string[]).map((code: string) => {
          const option = questionNode.options.find((opt) => opt.code === code);
          return option ? option.name : code;
        });
        answerText = selectedOptions.join(', ');
      } else if (questionNode.type === 'single') {
        const option = questionNode.options.find((opt) => opt.code === value);
        answerText = option ? option.name : value;
      } else if (questionNode.type === 'text') {
        answerText = value as string;
      }

      qaList.push({
        question: questionNode.question,
        answer: answerText,
      });

      // Handle areas needing assistance
      if (key === 'broadScope') {
        (value as string[]).forEach(code => {
          const option = planningArea().options.find(opt => opt.code === code);
          if (option) {
            helpAreas.add(option.name);
          }
        });
      } else if (key === 'specification') {
        (value as string[]).forEach(code => {
          const optionName = findSpecializationOption(code);
          if (optionName) {
            helpAreas.add(optionName);
          }
        });
      }

      // Add other relevant areas based on specific answers
      if (key === 'emergencyFund' && value === 'NO') {
        helpAreas.add('Emergency Fund Planning');
      }
      if (key === 'DTPDCoverage' && value === 'NO') {
        helpAreas.add('Death and Total Permanent Disability Coverage');
      }
      if (key === 'illnessCoverage' && value === 'NO') {
        helpAreas.add('Critical Illness Coverage');
      }
      if (key === 'insuranceCoverage' && value === 'NO') {
        helpAreas.add('Insurance Allocation');
      }
      if (key === 'investing' && value === 'NO') {
        helpAreas.add('Investment Planning');
      }
      if (key === 'retirementPlaining' && value === 'NO') {
        helpAreas.add('Retirement Planning');
      }
      if (key === 'lagacyPlanning' && value === 'HELP') {
        helpAreas.add('Legacy Planning');
      }
    }
  }

  return { qaList, helpAreas: Array.from(helpAreas) };
}