"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionFlow } from "@/types/onboarding";
import { useSessionStorage } from "usehooks-ts";

interface OnboardingQuestionsProps {
  onComplete: (values: Record<string, string[]>) => void;
  questions: QuestionFlow;
}

export function OnboardingFormComponent({
  onComplete,
  questions,
}: OnboardingQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useSessionStorage('answers', {})

  const handleOptionClick = (key: string, option: string) => {
    if (questions[currentQuestion].type === "single") {
      setAnswers({ ...answers, [key]: [option] });
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
    onComplete(answers);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            {currentQuestionData.category}
          </h2>
          <p className="text-xl text-center">{currentQuestionData.question}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestionData.options.map((option) => (
            <Button
              key={option}
              variant={
                answers[currentQuestionData.key]?.includes(option)
                  ? "default"
                  : "outline"
              }
              className="h-auto py-4 px-6 text-left justify-start items-start"
              onClick={() => handleOptionClick(currentQuestionData.key, option)}
            >
              {currentQuestionData.type === "multiple" && (
                <Checkbox
                  checked={answers[currentQuestionData.key]?.includes(option)}
                  className="mr-2"
                />
              )}
              {option}
            </Button>
          ))}
        </div>
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
            <Button onClick={handleComplete}>Complete</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
