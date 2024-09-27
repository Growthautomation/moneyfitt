"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionFlow } from "@/types/onboarding";
import Choice from "./questions/choices";
import TextQuestion from "./questions/text";
import { createUserClient } from "@/lib/actions/client";
import { useSessionStorage } from "usehooks-ts";

interface OnboardingQuestionsProps {
  questions: QuestionFlow;
  onComplete?: (answers: any) => void;
}

export function OnboardingFormComponent({
  questions,
  onComplete
}: OnboardingQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useSessionStorage('answers', {});

  const handleOptionClick = (key: string, option: string) => {
    if (questions[currentQuestion].type === "single") {
      setAnswers({ ...answers, [key]: [option] });
    } else if (questions[currentQuestion].type === "text") {
      setAnswers({ ...answers, [key]: option });
    } else {
      const currentAnswers = answers[key] || [];
      if (currentAnswers.includes(option)) {
        setAnswers({
          ...answers,
          [key]: currentAnswers.filter((a) => a !== option),
        });
      } else {
        setAnswers({
          ...answers,
          [key]: [...currentAnswers, option],
        });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    // You might want to add some validation here
    onComplete?.(answers)
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 space-y-8">
        {currentQuestionData.type === "text" ? (
          <TextQuestion
            question={currentQuestionData}
            answer={answers}
            onChange={handleOptionClick}
          />
        ) : (
          <Choice
            question={currentQuestionData}
            answers={answers}
            onChange={handleOptionClick}
          />
        )}

        <div className="flex justify-between items-center">
          <Button onClick={handleBack} disabled={currentQuestion === 0}>
            Back
          </Button>
          <div className="h-2 flex-1 bg-gray-200 mx-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          {currentQuestion === questions.length - 1 ? (
            <Button onClick={handleComplete}>
              Complete
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
