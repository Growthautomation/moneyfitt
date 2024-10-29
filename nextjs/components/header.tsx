import { signOutAction } from "@/lib/actions/auth";
import { SubmitButton } from "./submit-btn";
import { createClient } from "@/lib/supabase/server";
import { RedirectButton } from "./utils/redirect-btn";
import ChangePassword from "./utils/change-password";
import Link from "next/link";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="flex items-center gap-2 justify-end h-16">
            {user.user_metadata["userType"] === "advisor" && <Link className="hover:bg-gray-100 border px-4 py-[.5rem] rounded text-sm" href="/advisor/profile">Profile</Link>}
            {user.user_metadata["userType"] !== "advisor" && <Link className="hover:bg-gray-100 border px-4 py-[.5rem] rounded text-sm" href="/history">Match History</Link>}
            <ChangePassword />
            <form>
              <SubmitButton
                pendingText="Signing out..."
                formAction={signOutAction}
                className="bg-primary text-white hover:bg-primary hover:text-white"
                variant="outline"
              >
                Logout
              </SubmitButton>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-end h-16">
            <RedirectButton
              className=""
              href="/advisor/sign-in"
              variant="outline"
            >
              Advisor Sign In
            </RedirectButton>
          </div>
        )}
      </div>
    </header>
  );
}
