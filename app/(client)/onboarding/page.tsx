import { OnboardingFormComponent } from "@/components/onboarding-form";
import { onboardingQuestions } from "@/resources/onboarding-questions";

export default function Onboarding() {
  return (
      <OnboardingFormComponent
        questions={onboardingQuestions}
      />
  );
}
