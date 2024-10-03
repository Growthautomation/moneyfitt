"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import React from "react";
import { QNode } from "@/resources/questions";
import { getQuestions } from "@/resources/onboarding-question-v2";
import renderQuestions from "./renderer";

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

  const handleNext = () => {
    setAnswers({ ...answers, ...currentQuestion?.answerModifier(answers) });
    const val = currentQuestion?.next(answers);
    if (val) {
      setCurrentQuestion(val || null);
      setNumAnswers(numAnswers + 1);
      return;
    }
    onComplete(answers as never);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">{currentQuestion?.category}</h2>
        <p className="text-lg whitespace-pre">{currentQuestion?.question}</p>
        <div className="space-y-4">
          {renderQuestions(currentQuestion, answers, setAnswers)}
        </div>
        {error && <Alert variant="destructive">{error}</Alert>}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Button
            onClick={handleBack}
            disabled={!currentQuestion?.prev(answers)}
          >
            Back
          </Button>
          <div className="h-2 flex-1 bg-gray-200 mx-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{
                width: `${(numAnswers / 12) * 100}%`,
              }}
            />
          </div>
          <Button onClick={handleNext}>
            {currentQuestion?.next(answers) ? "Next" : "Complete"}
          </Button>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-500">
            Progress: {((numAnswers / 12) * 100).toFixed()}% (Question{" "}
            {numAnswers} of {12})
          </p>
          <span
            onClickCapture={() => onSkip?.()}
            className="hover:cursor-pointer hover:underline hover:text-blue-600 decoration-solid text-sm text-blue-500"
          >
            I have an account
          </span>
        </div>
      </Card>
    </div>
  );
}
