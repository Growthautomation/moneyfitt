import { SubmitButton } from "@/components/submit-btn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { agentSignIn } from "@/lib/actions/agent";

export default function Login() {
  return (
    <form className="flex-1 flex flex-col min-w-64 w-1/3 mx-[auto]">
      <h1 className="text-2xl font-medium">Agent Sign in</h1>
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
        <SubmitButton
          pendingText="Signing In..."
          formAction={agentSignIn as never}
        >
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
}
