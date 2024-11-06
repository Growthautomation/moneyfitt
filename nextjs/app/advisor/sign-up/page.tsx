"use client";
import { SubmitButton } from "@/components/submit-btn";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createBlankAgent } from "@/lib/actions/agent";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useState } from "react";

const initialState = {
  success: false,
  error: null,
};

export default function AgentSignup() {
  const [state, formAction] = useFormState(
    (prev, data) => createBlankAgent(data),
    initialState
  );

  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <form
      className="flex-1 flex flex-col min-w-64 w-1/3 mx-[auto]"
      action={formAction}
      onSubmit={(e) => {
        if (!acceptTerms) {
          e.preventDefault();
          return;
        }
      }}
    >
      <h1 className="text-2xl font-medium">Register Agent</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />

        <div className="flex items-start space-x-2 mb-4">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          />
          <label 
            htmlFor="acceptTerms" 
            className="text-xs leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            By creating this account, I confirm that I have read and agree to the{" "}
            <Link 
              href="https://www.moneyfitt.co/terms-and-conditions" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MoneyFitt Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link 
              href="https://www.moneyfitt.co/privacy-policy" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy and Data Protection Policy
            </Link>
          </label>
        </div>

        <SubmitButton 
          pendingText="Registering..." 
          disabled={!acceptTerms}
        >
          Register
        </SubmitButton>
        
        {state?.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
}
