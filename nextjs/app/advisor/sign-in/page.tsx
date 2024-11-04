"use client";
import { SubmitButton } from "@/components/submit-btn";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { agentSignIn } from "@/lib/actions/agent";
import Link from "next/link";
import { useFormState } from "react-dom";

const initialState = {
  success: false,
  error: null,
};

export default function Login() {
  const [state, formAction] = useFormState(
    (prev, data) => agentSignIn(data),
    initialState
  );

  return (
    <form
      className="flex-1 flex flex-col min-w-64 w-1/2 mx-[auto] border rounded mt-4 p-7"
      action={formAction}
    >
      <h1 className="text-2xl font-medium text-center">Advisor Sign in</h1>
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
        <div className="text-center">
          <Link
            href="/forget-password"
            className="text-sm text-blue-500 hover:underline cursor-pointer"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
        {state?.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
}
