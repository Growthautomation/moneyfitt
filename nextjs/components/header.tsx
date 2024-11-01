import { signOutAction } from "@/lib/actions/auth";
import { SubmitButton } from "./submit-btn";
import { createClient } from "@/lib/supabase/server";
import { RedirectButton } from "./utils/redirect-btn";
import Link from "next/link";
import { SettingsDropdown } from "./settings-dropdown";
import Image from "next/image";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b">
      <div className="absolute left-4 z-50 flex items-center h-[64px]">
        {" "}
        <Link href={user ? "/" : "https://moneyfitt.co"}>
          <Image
            src="/moneyfitt-logo.webp"
            alt="Logo"
            width={200}
            height={80}
            quality={100}
          />
        </Link>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="flex items-center gap-2 justify-end h-16">
            {user.user_metadata["userType"] === "advisor" && (
              <Link
                className="hover:bg-gray-100 border px-4 py-[.5rem] rounded text-sm"
                href="/advisor/profile"
              >
                Profile
              </Link>
            )}

            {/* Settings Dropdown */}
            <SettingsDropdown userType={user.user_metadata["userType"]} />

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
