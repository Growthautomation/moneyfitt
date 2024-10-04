import { signOutAction } from "@/lib/actions/auth";
import { SubmitButton } from "./submit-btn";
import { createClient } from "@/lib/supabase/server";
import { RedirectButton } from "./utils/redirect-btn";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="flex items-center justify-end h-16">
            <form>
              <SubmitButton
                pendingText="Signing out..."
                formAction={signOutAction}
                variant="outline"
              >
                Logout
              </SubmitButton>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-end h-16">
            <RedirectButton className="" href="/advisor/sign-in" variant="outline">
              Advisor Sign In
            </RedirectButton>
          </div>
        )}
      </div>
    </header>
  );
}
