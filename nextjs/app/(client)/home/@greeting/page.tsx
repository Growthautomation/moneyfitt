import { createClient } from "@/lib/supabase/server";
import { CustomTooltipWrapper } from "@/components/client/tooltip-content";

// Helper function to format the name from email
function formatNameFromEmail(email: string): string {
  const namePart = email.split('@')[0];
  const firstName = namePart.split('.')[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

export default async function Greeting() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = user?.email ? formatNameFromEmail(user.email) : "";

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h1 className="text-2xl font-bold text-[#222222]">
          Welcome, {displayName} to the MoneyFitt Beta
        </h1>
        <CustomTooltipWrapper />
      </div>
    </div>
  );
}
