import { AdvisorProfile } from "@/components/advisor-profile";
import { RedirectButton } from "@/components/redirect-btn";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Suspense } from "react";
import ComponentLoading from "../utils/component-loading";
import AdvisorChat from "./advisor-chat";
import ComponentError from "../utils/component-error";

interface ClientChatContainerProps {
  advisorId: string;
  user: User;
  messageOffset?: string;
}

export default async function AdvisorDetail({
  advisorId,
  user,
  messageOffset,
}) {
  const supabase = createClient();

  const { data: advisor, error: advisorError } = await supabase
    .from("advisor")
    .select("*")
    .eq("id", advisorId)
    .single();

  if (!advisor) {
    console.error(advisorError);
    return <ComponentError message="Advisor not found" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <RedirectButton
          variant="ghost"
          size="icon"
          className="mr-2 bg-white text-black hover:text-white"
          href="/home"
        >
          <ArrowLeft className="h-6 w-6" />
        </RedirectButton>
        <h1 className="text-2xl font-bold">{`Chat with ${advisor.first_name} ${advisor.last_name}`}</h1>
      </div>
      <div className="flex flex-row gap-8">
        <div className="w-[60%]">
          <AdvisorProfile advisor={advisor} />
        </div>
        <div className="w-[40%] sticky top-8">
          <Suspense fallback={<ComponentLoading />}>
            <AdvisorChat user={user} advisor={advisor} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
