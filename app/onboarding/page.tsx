"use client"

import { OnboardingFormComponent } from "@/components/onboarding-form";
import { onboardingQuestions } from "@/resources/onboarding-questions";
import { redirect } from "next/navigation";

export default function Onboarding() {
  return (
    <main className="container mx-auto px-4 py-8">
      <OnboardingFormComponent
        onComplete={() => redirect("/sign-in")}
        questions={onboardingQuestions}
      />
    </main>
  );
}
