"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import React from "react";
import { QNode } from "@/resources/questions";
import { getQuestions } from "@/resources/onboarding-question-v2";
import renderQuestions from "./renderer";
import { getRemaining } from "@/lib/utils/questions";
import { isEmpty } from "lodash";

interface OnboardingQuestionsProps {
  onComplete: (values: Record<string, string[]>) => void;
  onSkip?: () => void;
}

export function OnboardingFormComponent({
  onComplete,
  onSkip,
}: OnboardingQuestionsProps) {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState<QNode | null>(
    getQuestions()
  );
  const [numAnswers, setNumAnswers] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    const val = currentQuestion?.prev(answers);
    if (val) {
      setCurrentQuestion(val || null);
      setNumAnswers(numAnswers - 1);
    }
  };

  const handleNext = (answers) => {
    const newAns = { ...answers, ...currentQuestion?.answerModifier(answers) };
    const val = currentQuestion?.next(newAns);
    setAnswers(newAns);
    if (val) {
      setCurrentQuestion(val || null);
      setNumAnswers(numAnswers + 1);
      return;
    }
    onComplete(answers as never);
  };

  const totalQuestions = useMemo(() => {
    return numAnswers + getRemaining(currentQuestion, answers);
  }, [answers, numAnswers, currentQuestion]);

  if (currentQuestion?.type === "cover") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-6 space-y-6 p-20">
          <div className="space-y-4">
            {renderQuestions(currentQuestion, answers, setAnswers)}
          </div>
          <div className="flex flex-row gap-2 justify-center">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={() => handleNext(answers)}>Next</Button>
          </div>
          <div className="text-xs text-gray-400 text-center">
          You&apos;re using the beta version of our financial matching platform.
          For any issues, contact{" "}
          <a
            href="mailto:feedback@moneyfitt.co"
            className="hover:underline text-blue-500"
          >
            feedback@moneyfitt.co
          </a>. MoneyFitt (ProConnect Technologies Pte Ltd) is not responsible for any
          errors, omissions, or outcomes from using the platform, including
          reliance on matches with third-party financial professionals. All
          information is provided &quot;as is,&quot; without guarantees of accuracy,
          completeness, or results. MoneyFitt does not provide financial advice,
          nor are we licensed to do so.
        </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-6">
        <div>
          {currentQuestion?.title && (
            <div className="text-2xl font-bold">{currentQuestion.title}</div>
          )}
          <h2 className="text-2xl font-bold mt-2">
            {currentQuestion?.category}
          </h2>
        </div>
        <p className="text-lg whitespace-normal break-words">
          {currentQuestion?.question}
        </p>
        <div className="space-y-4">
          {renderQuestions(currentQuestion, answers, setAnswers, handleNext)}
        </div>
        {currentQuestion?.description && (
          <p className="text-sm whitespace-normal break-words">
            {currentQuestion?.description}
          </p>
        )}
        {error && <Alert variant="destructive">{error}</Alert>}
        <div className="flex justify-between items-center space-x-4">
          <Button
            onClick={handleBack}
            disabled={!currentQuestion?.prev(answers)}
            className="flex-shrink-0"
          >
            Back
          </Button>
          <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{
                width: `${(numAnswers / totalQuestions) * 100}%`,
              }}
            />
          </div>
          <Button
            onClick={() => handleNext(answers)}
            disabled={currentQuestion?.required(answers)}
            className="flex-shrink-0"
          >
            {currentQuestion?.next(answers)
              ? isEmpty(answers[currentQuestion.key]) &&
                !currentQuestion.required(answers)
                ? "Skip"
                : "Next"
              : "Complete"}
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <p className="text-sm text-gray-500">
            Progress: {((numAnswers / totalQuestions) * 100).toFixed()}%
            (Question {numAnswers} of {totalQuestions})
          </p>
          <span
            onClickCapture={() => onSkip?.()}
            className="hover:cursor-pointer hover:underline hover:text-blue-600 decoration-solid text-sm text-blue-500"
          >
            I have an account
          </span>
        </div>
        <div className="text-xs text-gray-400 text-center">
          You&apos;re using the beta version of our financial matching platform.
          For any issues, contact{" "}
          <a
            href="mailto:feedback@moneyfitt.co"
            className="hover:underline text-blue-500"
          >
            feedback@moneyfitt.co
          </a>. MoneyFitt (ProConnect Technologies Pte Ltd) is not responsible for any
          errors, omissions, or outcomes from using the platform, including
          reliance on matches with third-party financial professionals. All
          information is provided &quot;as is,&quot; without guarantees of accuracy,
          completeness, or results. MoneyFitt does not provide financial advice,
          nor are we licensed to do so.
        </div>
      </Card>
    </div>
  );
}
