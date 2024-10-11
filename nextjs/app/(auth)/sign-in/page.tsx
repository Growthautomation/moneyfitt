"use client";

import { OnboardingFormComponent } from "@/components/onboarding/form";
import Welcome from "@/components/onboarding/welcome";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
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
  const [_, setAnswers] = useLocalStorage("answers", {});

  const [step, setStep] = useState<"login" | "onboarding" | "welcome">(
    "welcome"
  );

  if (step === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Sign in to your account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            {/* Add more SSO buttons here */}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <Welcome onNext={() => setStep("onboarding")} onSkip={() => setStep("login")} />
    );
  }

  return (
    <OnboardingFormComponent
      onComplete={(answers) => {
        setAnswers(answers);
        setStep("login");
      }}
      onSkip={() => setStep("login")}
    />
  );
};

export default Auth;
