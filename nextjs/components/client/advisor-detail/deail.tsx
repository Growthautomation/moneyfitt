import { RedirectButton } from "@/components/utils/redirect-btn";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Suspense } from "react";
import ComponentLoading from "@/components/utils/component-loading";
import AdvisorChat from "./chat";
import ComponentError from "@/components/utils/component-error";
import { AdvisorProfile } from "./advisor-profile";
import MobileToggle from "./mobile-toggle";

interface AdvisorDetailProps {
  advisorId: string;
  user: User;
  messageOffset?: string;
}

export default async function AdvisorDetail({
  advisorId,
  user,
  messageOffset,
}: AdvisorDetailProps) {
  const supabase = createClient();

  const { data: advisor, error: advisorError } = await supabase
    .from("advisor")
    .select("*")
    .eq("id", advisorId)
    .single();

  if (!advisor) {
    console.error("client/advisor-detail/detail:", advisorError);
    return <ComponentError message="Advisor not found" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <RedirectButton
          variant="ghost"
          size="icon"
          className="mr-2"
          href="/home"
        >
          <ArrowLeft className="h-6 w-6" />
        </RedirectButton>
        <h1 className="text-2xl font-bold">{`Chat with ${advisor.first_name} ${advisor.last_name}`}</h1>
      </div>
      <div className="lg:hidden mb-4">
        <MobileToggle />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[60%]" id="advisor-profile">
          <AdvisorProfile advisor={advisor} />
        </div>
        <div className="w-full lg:w-[40%] lg:sticky lg:top-8" id="advisor-chat">
          <Suspense fallback={<ComponentLoading />}>
            <AdvisorChat user={user} advisor={advisor} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
