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
import { createClient } from "@/lib/supabase/client";

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

  const totalQuestions = useMemo(() => {
    return numAnswers + getRemaining(currentQuestion, answers);
  }, [answers, numAnswers, currentQuestion]);

  const handleComplete = async () => {
    // ... existing code to process answers

    // Add this section to save content IDs
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Determine which content IDs to add based on user answers
      const contentIds = determineContentIds(answers);

      // Update the client record with the new content IDs
      const { error } = await supabase
        .from('client')
        .update({ contents: contentIds })
        .eq('id', user.id);

      if (error) {
        console.error("Error updating client with content IDs:", error);
      }
    }

    onComplete(answers);
  };

  // Helper function to determine which content IDs to add based on user answers
  function determineContentIds(answers: Record<string, string[]>): string[] {
    const contentIds: string[] = [];

    // Example logic - adjust based on your specific requirements
    if (answers.lagacyPlanning && answers.lagacyPlanning[0] === "RESOURCE") {
      contentIds.push("760", "761", "763", "683");
    }

    // Add more conditions here based on other questions and answers

    // Remove duplicates using a simple loop
    const uniqueContentIds: string[] = [];
    for (let i = 0; i < contentIds.length; i++) {
      if (uniqueContentIds.indexOf(contentIds[i]) === -1) {
        uniqueContentIds.push(contentIds[i]);
      }
    }

    return uniqueContentIds;
  }

  if (currentQuestion?.type === "cover") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-6 space-y-6 p-20">
          <div className="space-y-4">
            {renderQuestions(currentQuestion, answers, setAnswers)}
          </div>
          <div className="flex flex-row gap-2 justify-center">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {currentQuestion?.title && (
        <div className="text-3xl my-8 max-w-4xl text-center">
          {currentQuestion.title}
        </div>
      )}
      <Card className="w-full max-w-4xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">{currentQuestion?.category}</h2>
        <p className="text-lg whitespace-normal break-words">{currentQuestion?.question}</p>
        {currentQuestion?.description && (
          <p className="text-sm whitespace-normal break-words">{currentQuestion?.description}</p>
        )}
        <div className="space-y-4">
          {renderQuestions(currentQuestion, answers, setAnswers)}
        </div>
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
            onClick={handleNext}
            disabled={currentQuestion?.required(answers)}
            className="flex-shrink-0"
          >
            {currentQuestion?.next(answers)
              ? !answers[currentQuestion.key] &&
                !currentQuestion.required(answers)
                ? "Skip"
                : "Next"
              : "Complete"}
          </Button>
        </div>
        <div className="flex justify-between">
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
      </Card>
    </div>
  );
}
