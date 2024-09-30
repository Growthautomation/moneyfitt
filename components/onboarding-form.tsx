"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionFlow, Question } from "@/types/onboarding";
import { useSessionStorage } from "usehooks-ts";
import { onboardingQuestions } from "@/resources/onboarding-questions";
import { useRouter } from 'next/navigation';
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

interface OnboardingQuestionsProps {
  onComplete: (values: Record<string, string[]>) => void;
  questions: QuestionFlow;
}

export function OnboardingFormComponent({
  onComplete,
  questions,
}: OnboardingQuestionsProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0]);
  const [answers, setAnswers] = useSessionStorage<Record<string, string[]>>('answers', {});
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Component rendered. Current question:", currentQuestion.key);
    console.log("Current answers state:", answers);
  }, [currentQuestion, answers]);

  const handleOptionClick = (key: string, option: string) => {
    console.log(`Option clicked: ${option} for question: ${key}`);
    setAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers };
      if (currentQuestion.type === "single") {
        newAnswers[key] = [option];
      } else {
        const currentAnswers = newAnswers[key] || [];
        if (currentAnswers.includes(option)) {
          newAnswers[key] = currentAnswers.filter((a) => a !== option);
        } else {
          newAnswers[key] = [...currentAnswers, option];
        }
      }
      console.log("Updated answers:", newAnswers);
      return newAnswers;
    });
  };

  const handleTextInput = (key: string, value: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [key]: [value],
    }));
  };

  const handleNext = () => {
    console.log("Next button clicked");
    console.log("Current question:", currentQuestion);
    console.log("Current answers before next:", answers);

    if (currentQuestion.required !== false && 
        (!answers[currentQuestion.key] || 
         (currentQuestion.type !== "text" && answers[currentQuestion.key].length === 0) ||
         (currentQuestion.type === "text" && answers[currentQuestion.key][0].trim() === ""))) {
      setError("Please provide an answer before proceeding.");
      return;
    }

    setError(null);
    const nextQuestion = findNextQuestion(currentQuestion.key, answers);
    if (nextQuestion) {
      setQuestionHistory(prev => [...prev, currentQuestion]);
      setCurrentQuestion(nextQuestion);
    } else {
      console.log("No more questions, redirecting to login");
      router.push('/sign-in');
    }
  };

  const handleBack = () => {
    console.log("Back button clicked");
    if (questionHistory.length > 0) {
      const previousQuestion = questionHistory[questionHistory.length - 1];
      setCurrentQuestion(previousQuestion);
      setQuestionHistory(prev => prev.slice(0, -1));
    }
  };

  const handleComplete = () => {
    // You might want to add some validation here
    onComplete(answers);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-6 space-y-6">
        <div className="space-y-4">
          {currentQuestion.type === "text" ? (
            <Input
              type="text"
              placeholder="Enter your answer"
              value={answers[currentQuestion.key]?.[0] || ""}
              onChange={(e) => handleTextInput(currentQuestion.key, e.target.value)}
              className="w-full"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options?.map((option) => (
                <Button
                  key={option}
                  variant={
                    answers[currentQuestion.key]?.includes(option)
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-4 px-6 text-left justify-start items-start w-full"
                  onClick={() => handleOptionClick(currentQuestion.key, option)}
                >
                  <div className="flex items-start">
                    {currentQuestion.type === "multiple" && (
                      <Checkbox
                        checked={answers[currentQuestion.key]?.includes(option)}
                        className="mr-2 mt-1"
                      />
                    )}
                    <span className="flex-1 whitespace-normal">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Button onClick={handleBack} disabled={questionHistory.length === 0}>
            Back
          </Button>
          <div className="h-2 flex-1 bg-gray-200 mx-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{
                width: `${((questionHistory.length + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <Button onClick={handleNext}>
            {findNextQuestion(currentQuestion.key, answers) ? "Next" : "Complete"}
          </Button>
        </div>
        <div className="text-sm text-gray-500">Debug: Current question key: {currentQuestion.key}</div>
      </Card>
    </div>
  );
}

function findNextQuestion(currentKey: string, answers: Record<string, string[]>): Question | null {
  console.log("Finding next question. Current key:", currentKey);
  console.log("Answers in findNextQuestion:", answers);
  
  const currentQuestion = onboardingQuestions.find(q => q.key === currentKey);
  if (!currentQuestion) {
    console.error("Current question not found for key:", currentKey);
    return null;
  }

  let nextKey: string | null = null;
  
  if (typeof currentQuestion.next === 'function') {
    try {
      nextKey = currentQuestion.next(answers || {});
      console.log("Next key determined by function:", nextKey);
    } catch (error) {
      console.error("Error in next function:", error);
      // Fallback to a default next question if there's an error
      nextKey = "financialGoals";
    }
  } else {
    nextKey = currentQuestion.next;
    console.log("Static next key:", nextKey);
  }

  if (!nextKey) {
    console.log("No next key found, ending questionnaire");
    return null;
  }

  const nextQuestion = onboardingQuestions.find(q => q.key === nextKey);
  if (!nextQuestion) {
    console.error("Next question not found for key:", nextKey);
    return null;
  }

  return nextQuestion;
}
