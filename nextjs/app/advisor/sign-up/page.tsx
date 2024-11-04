"use client";
import { SubmitButton } from "@/components/submit-btn";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAgent } from "@/lib/actions/agent";
import { useFormState } from "react-dom";

const initialState = {
  success: false,
  error: null,
};

export default function AgentSignup() {
  const [state, formAction] = useFormState(
    (prev, data) => createAgent(data),
    initialState
  );
  return (
    <form
      className="flex-1 flex flex-col min-w-64 w-1/3 mx-[auto]"
      action={formAction}
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

        <Label htmlFor="attributes">Attributes</Label>
        <Textarea name="attributes" placeholder="User attributes" required />

        <Label htmlFor="profile_img">Profile Img</Label>
        <Input
          name="profile_img"
          placeholder="Profile image"
          required
          type="file"
        />

        <SubmitButton pendingText="Registering...">Register</SubmitButton>
        {state?.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
}
