"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionFlow, Question, Tag } from "@/types/onboarding";
import { useSessionStorage } from "usehooks-ts";
import { onboardingQuestions } from "@/resources/onboarding-questions";
import { useRouter } from 'next/navigation';
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import React from 'react';

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
  const [drillDownQuestions, setDrillDownQuestions] = useState<Question[]>([]);

  useEffect(() => {
    console.log("Component rendered. Current question:", currentQuestion.key);
    console.log("Current answers state:", answers);
  }, [currentQuestion, answers]);

  const handleOptionClick = (key: string, option: string | Tag) => {
    console.log(`Option clicked: ${typeof option === 'string' ? option : option.name} for question: ${key}`);
    setAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers };
      if (currentQuestion.type === "single") {
        newAnswers[key] = [typeof option === 'string' ? option : option.name];
      } else if (currentQuestion.type === "multipleWithTags") {
        const currentAnswers = newAnswers[key] || [];
        const optionName = typeof option === 'string' ? option : option.name;
        if (currentAnswers.includes(optionName)) {
          newAnswers[key] = currentAnswers.filter((a) => a !== optionName);
        } else {
          newAnswers[key] = [...currentAnswers, optionName];
        }
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
    if (currentQuestion.type === "multipleWithTags" && currentQuestion.drillDownQuestions) {
      const selectedTags = answers[currentQuestion.key] || [];
      const newDrillDownQuestions = currentQuestion.drillDownQuestions(selectedTags);
      setDrillDownQuestions(newDrillDownQuestions);
      if (newDrillDownQuestions.length > 0) {
        setCurrentQuestion(newDrillDownQuestions[0]);
        return;
      }
    }

    const nextQuestion = findNextQuestion(currentQuestion.key, answers);
    if (nextQuestion) {
      setQuestionHistory(prev => [...prev, currentQuestion]);
      setCurrentQuestion(nextQuestion);
    } else if (drillDownQuestions.length > 0) {
      setCurrentQuestion(drillDownQuestions[0]);
      setDrillDownQuestions(prev => prev.slice(1));
    } else if (currentQuestion.key === "userName") {
      // This is the last question, so we complete the onboarding
      handleComplete();
    } else {
      // If there are no more questions in the main flow, move to userSex
      const userSexQuestion = onboardingQuestions.find(q => q.key === "userSex");
      if (userSexQuestion) {
        setQuestionHistory(prev => [...prev, currentQuestion]);
        setCurrentQuestion(userSexQuestion);
      } else {
        console.error("User sex question not found");
        handleComplete();
      }
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
    console.log("Onboarding completed, final answers:", answers);
    onComplete(answers);
    router.push('/sign-in');
  };

  const renderQuestionText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const estimateTotalQuestions = () => {
    const age = answers.age?.[0];
    const introAnswer = answers.introQuestion?.[0];
    let estimatedTotal = 4; // Start with intro, age, sex, and name questions

    if (introAnswer === "I know what area I want support with or product I need") {
      estimatedTotal += 2; // financialPlanningArea + one drill-down
    } else {
      if (age === "65+") {
        estimatedTotal += 4; // emergencySavings, seniorFinancialSupport, estatePlanning, seniorInsurance
      } else if (age === "55-64") {
        estimatedTotal += 6; // emergencySavings, incomeInvestmentPercentage, retirementPlanning, estatePlanning, seniorInsurance
      } else if (age === "36-59") {
        estimatedTotal += 6; // emergencySavings, insuranceCoverage, criticalIllnessInsurance, insuranceAllocation, incomeInvestmentPercentage, retirementPlanning
      } else {
        estimatedTotal += 5; // emergencySavings, insuranceCoverage, criticalIllnessInsurance, insuranceAllocation, investmentAllocation
      }
    }

    return estimatedTotal;
  };

  const calculateProgress = () => {
    const estimatedTotal = estimateTotalQuestions();
    const answeredQuestions = Object.keys(answers).length;
    const progress = (answeredQuestions / estimatedTotal) * 100;
    return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-6"> {/* Increased max-width */}
        <h2 className="text-2xl font-bold">{currentQuestion.category}</h2>
        <p className="text-lg">{renderQuestionText(currentQuestion.question)}</p>
        <div className="space-y-4">
          {currentQuestion.type === "text" ? (
            <Input
              type="text"
              placeholder="Enter your answer"
              value={answers[currentQuestion.key]?.[0] || ""}
              onChange={(e) => handleTextInput(currentQuestion.key, e.target.value)}
              className="w-full"
            />
          ) : currentQuestion.type === "multipleWithTags" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentQuestion.options as Tag[]).map((tag) => (
                <div key={tag.name} className="space-y-2">
                  <Button
                    variant={answers[currentQuestion.key]?.includes(tag.name) ? "default" : "outline"}
                    className="w-full justify-start h-auto py-4 px-6" // Increased padding
                    onClick={() => handleOptionClick(currentQuestion.key, tag)}
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold">{tag.name}</span>
                      {tag.description && (
                        <span className="text-sm text-gray-500 mt-1 whitespace-normal">{tag.description}</span>
                      )}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                width: `${calculateProgress()}%`,
              }}
            />
          </div>
          <Button onClick={handleNext}>
            {currentQuestion.key === "userName" ? "Complete" : "Next"}
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