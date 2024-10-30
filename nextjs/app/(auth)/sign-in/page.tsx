"use client";

import { OnboardingFormComponent } from "@/components/onboarding/form";
import Welcome from "@/components/onboarding/welcome";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/utils/spinner";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useFormik } from "formik";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { object, string } from "yup";

const Auth = () => {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [_, setAnswers] = useLocalStorage("answers", {});

  const [step, setStep] = useState<"login" | "onboarding" | "welcome">(
    "welcome"
  );
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: object({
      email: string()
        .email("Invalid email address")
        .required("Email is required"),
      password: string().required("Password is required"),
    }),
    onSubmit: async (values, { setStatus }) => {
      try {
        if (isOnboardingComplete) {
          const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              emailRedirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/callback`,
            },
          });
          if (error) {
            setStatus(error.message);
            return;
          }
          toast({
            title: "Account created",
            description: "Please check your email for a verification link.",
          });
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) {
          setStatus(error.message);
          return;
        }
        router.push("/callback");
      } catch (error) {
        setStatus(error.message);
      }
    },
  });

  const handleGoogleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/callback`,
      },
    });
  };
  const handleFacebookSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/callback`,
      },
    });
  };

  if (step === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-[480px] px-16 py-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {isOnboardingComplete ? (
                <>
                  <CircleCheckBig className="text-green-500" />
                  <span className="text-2xl font-bold text-center">
                    Onboarding Complete
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-center">Log in</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {isOnboardingComplete
                ? "Register with MoneyFitt to view your matches."
                : "Sign in to your account."}
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-6">
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="you@example.com"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-sm text-red-500 mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  placeholder="Your password"
                  type="password"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-sm text-red-500 mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </div>
              <div className="text-center my-3">
                <Button className="w-full" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? (
                    <Spinner className="w-7 h-7" />
                  ) : isOnboardingComplete ? (
                    "Register"
                  ) : (
                    "Sign in"
                  )}
                </Button>
                {formik.status && (
                  <div className="text-sm text-red-500 mt-1 bg-red-200 rounded">
                    {formik.status}
                  </div>
                )}
              </div>
              <div className="text-center">
                {!isOnboardingComplete && (
                  <Link
                    href="/forget-password"
                    className="text-sm text-blue-500 hover:underline cursor-pointer"
                  >
                    Forgot password
                  </Link>
                )}
              </div>
            </form>
            <div className="flex items-center">
              <Separator className="shrink" />
              <span className="text-sm text-gray-400 px-4">Or</span>
              <Separator className="shrink" />
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
            {/* <Button
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
            </Button> */}
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
