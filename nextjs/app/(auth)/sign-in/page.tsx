"use client";

import { OnboardingFormComponent } from "@/components/onboarding/form";
import Welcome from "@/components/onboarding/welcome";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const Auth = () => {
  const superbase = createClient();
  const handleGoogleSignIn = () => {
    superbase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/callback`,
      },
    });
  };
  const handleFacebookSignIn = () => {
    superbase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/callback`,
      },
    });
  };
  const [_, setAnswers] = useLocalStorage("answers", {});

  const [step, setStep] = useState<"login" | "onboarding" | "welcome">("welcome");
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  if (step === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-auto px-16 py-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {isOnboardingComplete ? (
                <>
                  <CircleCheckBig className="text-green-500" />
                  <span className="text-2xl font-bold text-center">Onboarding Complete</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-center">Log in</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {isOnboardingComplete
                ? "Sign in to your account or register with MoneyFitt to view your matches."
                : "Sign in to your account or register with MoneyFitt."}
            </div>
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Image
                src="/google-logo.png"
                alt="Google logo"
                width={20}
                height={20}
              />
              <span>Sign in with Google</span>
            </Button>
            <Button
              onClick={handleFacebookSignIn}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Image
                src="/facebook-logo.svg"
                alt="Facebook logo"
                width={15}
                height={15}
              />
              <span>Sign in with Facebook</span>
            </Button>
            {/* Add more SSO buttons here */}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <Welcome
        onNext={() => setStep("onboarding")}
        onSkip={() => {
          setStep("login");
          setIsOnboardingComplete(false);
        }}
      />
    );
  }

  return (
    <OnboardingFormComponent
      onComplete={(answers) => {
        setAnswers(answers);
        setStep("login");
        setIsOnboardingComplete(true);
      }}
      onSkip={() => {
        setStep("login");
        setIsOnboardingComplete(false);
      }}
    />
  );
};

export default Auth;
