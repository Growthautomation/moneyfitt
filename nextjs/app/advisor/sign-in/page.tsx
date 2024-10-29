import { SubmitButton } from "@/components/submit-btn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { agentSignIn } from "@/lib/actions/agent";
import Link from "next/link";

export default function Login() {
  return (
    <form className="flex-1 flex flex-col min-w-64 w-1/2 mx-[auto] border rounded mt-4 p-7">
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
        <div className="text-right">
          <Link
            href="/forget-password"
            className="text-sm text-blue-500 hover:underline cursor-pointer"
          >
            Forget password?
          </Link>
        </div>
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
