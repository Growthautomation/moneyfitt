"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Question, Tag } from "@/types/onboarding";
import { useLocalStorage } from "usehooks-ts";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import React from 'react';
import { onboardingQuestions } from "@/resources/onboarding-questions";
import { MultiSelectSearchableComponent } from "@/components/multi-select-searchable";
import { DropdownGroup } from "@/types/onboarding";

interface OnboardingQuestionsProps {
  onComplete: (values: Record<string, string[]>) => void;
}

export function OnboardingFormComponent({
  onComplete,
}: OnboardingQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(onboardingQuestions[0]);
  const [answers, setAnswers] = useLocalStorage<Record<string, string[]>>('answers', {});
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [drillDownQuestions, setDrillDownQuestions] = useState<Question[]>([]);
  const [isClient, setIsClient] = useState(false);

  const questionMap = useMemo(() => {
    const map = new Map<string, Question>();
    onboardingQuestions.forEach(q => map.set(q.key, q));
    return map;
  }, []);

  const getQuestionsPath = (answers: Record<string, string[]>) => {
    const path: string[] = [];
    const visited = new Set<string>();

    function traverse(questionKey: string | null) {
      if (!questionKey || visited.has(questionKey)) return;
      visited.add(questionKey);
      path.push(questionKey);

      const question = questionMap.get(questionKey);
      if (!question) return;

      // Handle drill-down questions
      if (question.type === "multipleWithTags" && question.drillDownQuestions) {
        const selectedTags = answers[question.key] || [];
        const drillDownQs = question.drillDownQuestions(selectedTags);
        for (const dq of drillDownQs) {
          traverse(dq.key);
        }
      }

      // Determine the next question
      let nextKey: string | null | undefined = null;
      if (typeof question.next === 'function') {
        try {
          nextKey = question.next(answers);
        } catch (error) {
          console.error("Error determining next question:", error);
          nextKey = null;
        }
      } else {
        nextKey = question.next;
      }

      traverse(nextKey as never);
    }

    traverse(onboardingQuestions[0].key); // Start from the first question

    // Always add the final questions if they're not already included
    if (!path.includes('advisorPreference')) path.push('advisorPreference');
    if (!path.includes('userSex')) path.push('userSex');
    if (!path.includes('userName')) path.push('userName');

    return path;
  };

  const questionsPath = useMemo(() => {
    return getQuestionsPath(answers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questionMap]);

  const currentQuestionIndex = questionsPath.indexOf(currentQuestion.key);

  const calculateProgress = () => {
    const totalQuestions = questionsPath.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOptionClick = (key: string, option: string | Tag) => {
    setAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers };
      if (currentQuestion.type === "single") {
        newAnswers[key] = [typeof option === 'string' ? option : option.name];
      } else if (currentQuestion.type === "multipleWithTags") {
        const currentAnswers = newAnswers[key] || [];
        const optionName = typeof option === 'string' ? option : option.code;
        if (currentAnswers.includes(optionName)) {
          newAnswers[key] = currentAnswers.filter((a) => a !== optionName);
        } else {
          newAnswers[key] = [...currentAnswers, optionName];
        }
      } else {
        const currentAnswers = newAnswers[key] || [];
        if (currentAnswers.includes(option as never)) {
          newAnswers[key] = currentAnswers.filter((a) => a !== option);
        } else {
          newAnswers[key] = [...currentAnswers as never, option as never];
        }
      }
      return newAnswers;
    });
  };

  const handleTextInput = (key: string, value: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [key]: [value],
    }));
  };

  console.log(answers);

  const handleNext = () => {
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
      // If there are no more questions in the main flow, move to advisorPreference
      const advisorPreferenceQuestion = onboardingQuestions.find(q => q.key === "advisorPreference");
      if (advisorPreferenceQuestion) {
        setQuestionHistory(prev => [...prev, currentQuestion]);
        setCurrentQuestion(advisorPreferenceQuestion);
      } else {
        console.error("Advisor preference question not found");
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (questionHistory.length > 0) {
      const previousQuestion = questionHistory[questionHistory.length - 1];
      setCurrentQuestion(previousQuestion);
      setQuestionHistory(prev => prev.slice(0, -1));
    }
  };

  const handleComplete = () => {
    onComplete(answers);
  };

  const renderQuestionText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const renderQuestionOptions = () => {
    if (currentQuestion.type === "text") {
      return (
        <Input
          type="text"
          placeholder="Enter your answer"
          value={answers[currentQuestion.key]?.[0] || ""}
          onChange={(e) => handleTextInput(currentQuestion.key, e.target.value)}
          className="w-full"
        />
      );
    } else if (currentQuestion.type === "multipleDropdown") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(currentQuestion.options as DropdownGroup[]).map((group) => (
            <div key={group.key} className="space-y-2">
              <h3 className="font-semibold">{group.label}</h3>
              <MultiSelectSearchableComponent
                options={group.options}
                placeholder={`Select ${group.label.toLowerCase()}...`}
                selected={answers[group.key] || []}
                onChange={(values) => handleDropdownChange(group.key, values)}
              />
            </div>
          ))}
        </div>
      );
    } else if (currentQuestion.type === "multipleWithTags") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(currentQuestion.options as Tag[]).map((tag) => (
            <Button
              key={tag.code}
              variant={answers[currentQuestion.key]?.includes(tag.code) ? "default" : "outline"}
              className="w-full justify-start h-auto py-4 px-6 text-left"
              onClick={() => handleOptionClick(currentQuestion.key, tag)}
            >
              <div className="flex flex-col items-start">
                <span className="font-semibold">{tag.name}</span>
                {tag.description && (
                  <span className="text-sm text-gray-500 mt-1 whitespace-normal">{tag.description}</span>
                )}
              </div>
            </Button>
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      );
    }
  };

  const handleDropdownChange = (key: string, values: { value: string, label: string }[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [key]: values.map(v => v.value),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">{currentQuestion.category}</h2>
        <p className="text-lg">{renderQuestionText(currentQuestion.question)}</p>
        {isClient && (
          <div className="space-y-4">
            {renderQuestionOptions()}
          </div>
        )}
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
        <div className="text-sm text-gray-500">
          Progress: {Math.round(calculateProgress())}% (Question {currentQuestionIndex + 1} of {questionsPath.length})
        </div>
      </Card>
    </div>
  );
}

function findNextQuestion(currentKey: string, answers: Record<string, string[]>): Question | null {
  const currentQuestion = onboardingQuestions.find(q => q.key === currentKey);
  if (!currentQuestion) {
    console.error("Current question not found for key:", currentKey);
    return null;
  }

  let nextKey: string | null = null;
  
  if (typeof currentQuestion.next === 'function') {
    try {
      nextKey = currentQuestion.next(answers || {});
    } catch (error) {
      console.error("Error in next function:", error);
      // Fallback to a default next question if there's an error
      nextKey = "financialGoals";
    }
  } else {
    nextKey = currentQuestion.next || null; // Ensure nextKey is string | null
  }

  if (!nextKey) {
    return null;
  }

  const nextQuestion = onboardingQuestions.find(q => q.key === nextKey);
  if (!nextQuestion) {
    console.error("Next question not found for key:", nextKey);
    return null;
  }

  return nextQuestion;
}