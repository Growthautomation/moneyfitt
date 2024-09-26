"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionFlow, Question } from "@/types/onboarding";
import { useSessionStorage } from "usehooks-ts";
import { findNextQuestion } from "@/resources/onboarding-questions";

interface OnboardingQuestionsProps {
  onComplete: (values: Record<string, string[]>) => void;
  questions: QuestionFlow;
}

export function OnboardingFormComponent({
  onComplete,
  questions,
}: OnboardingQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0]);
  const [answers, setAnswers] = useSessionStorage('answers', {});
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);

  const handleOptionClick = (key: string, option: string) => {
    if (currentQuestion.type === "single") {
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
    const nextQuestion = findNextQuestion(currentQuestion.key, answers[currentQuestion.key]);
    if (nextQuestion) {
      setQuestionHistory([...questionHistory, currentQuestion]);
      setCurrentQuestion(nextQuestion);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (questionHistory.length > 0) {
      const previousQuestion = questionHistory[questionHistory.length - 1];
      setCurrentQuestion(previousQuestion);
      setQuestionHistory(questionHistory.slice(0, -1));
    }
  };

  const handleComplete = () => {
    // You might want to add some validation here
    onComplete(answers);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            {currentQuestion.category}
          </h2>
          <p className="text-xl text-center">{currentQuestion.question}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <Button
              key={option}
              variant={
                answers[currentQuestion.key]?.includes(option)
                  ? "default"
                  : "outline"
              }
              className="h-auto py-4 px-6 text-left justify-start items-start"
              onClick={() => handleOptionClick(currentQuestion.key, option)}
            >
              {currentQuestion.type === "multiple" && (
                <Checkbox
                  checked={answers[currentQuestion.key]?.includes(option)}
                  className="mr-2"
                />
              )}
              {option}
            </Button>
          ))}
        </div>
        <div className="flex justify-between items-center">
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
            {findNextQuestion(currentQuestion.key, answers[currentQuestion.key]) ? "Next" : "Complete"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
