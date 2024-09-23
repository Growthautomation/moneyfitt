"use client"

import { OnboardingFormComponent } from "@/components/onboarding-form";
import { onboardingQuestions } from "@/resources/onboarding-questions";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  return (
    <main className="container mx-auto px-4 py-8">
      <OnboardingFormComponent
        onComplete={() => router.push("/auth/register")}
        questions={onboardingQuestions}
      />
    </main>
  );
}
