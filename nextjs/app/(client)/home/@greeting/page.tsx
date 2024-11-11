import { createClient } from "@/lib/supabase/server";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper function to format the name from email
function formatNameFromEmail(email: string): string {
  // Get the part before @
  const namePart = email.split('@')[0];
  // Split by dots and take first part
  const firstName = namePart.split('.')[0];
  // Capitalize first letter and make rest lowercase
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

export default async function Greeting() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get formatted name if email exists
  const displayName = user?.email ? formatNameFromEmail(user.email) : "";

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-[#222222]">
          Welcome {displayName} to the MoneyFitt Beta
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-[#9CABC2]" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px] text-sm">
              <p>
                You&apos;re using the beta version of our financial matching platform. 
                For any issues, contact feedback@moneyfitt.co. 
                MoneyFitt (ProConnect Technologies Pte Ltd) is not responsible for any errors, 
                omissions, or outcomes from using the platform, including reliance on matches 
                with third-party financial professionals. All information is provided &quot;as is,&quot; 
                without guarantees of accuracy, completeness, or results. MoneyFitt does not 
                provide financial advice, nor are we licensed to do so.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
