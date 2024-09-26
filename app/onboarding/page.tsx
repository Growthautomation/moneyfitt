"use client"

import { useState, useEffect } from "react";
import { OnboardingFormComponent } from "@/components/onboarding-form";
import { onboardingQuestions } from "@/resources/onboarding-questions";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Clear any existing onboarding responses when the component mounts
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboardingResponses');
      sessionStorage.removeItem('answers');
      setResponses({});
    }
  }, []);

  const handleComplete = (formResponses: Record<string, string[]>) => {
    // Save responses to local storage
    localStorage.setItem('onboardingResponses', JSON.stringify(formResponses));
    
    // Navigate to homepage
    router.push("/homepage");
  };

  const handleChange = (newResponses: Record<string, string[]>) => {
    setResponses(newResponses);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <OnboardingFormComponent
        onComplete={handleComplete}
        questions={onboardingQuestions}
        onChange={handleChange}
        initialResponses={responses}
      />
    </main>
  );
}
