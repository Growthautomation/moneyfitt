import Chat from "@/components/chat/chat-container";
import { AdvisorProfile } from "@/components/advisor-profile";
import { RedirectButton } from "@/components/redirect-btn";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

interface ChatProps {
  params: {
    id: string;
  };
  searchParams: {
    offset?: string;
  };
}

export default async function ChatPage({ params, searchParams }: ChatProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: advisor, error: advisorError } = await supabase
    .from("advisor")
    .select("*")
    .eq("id", params.id)
    .single();

  if (advisorError) {
    return "An error occurred" + advisorError.message;
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${advisor.id}),and(sender.eq.${advisor.id},recipient.eq.${user.id})`
    )
    .order("created_at", { ascending: false })
    .limit(parseInt(searchParams.offset ?? '0') + 10);
  if (error) {
    return "An error occurred" + error.message;
  }

  return (
    <main className="container mx-auto px-4 py-8">
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
          <Chat
            messages={messages.reverse()}
            recipentId={advisor.id}
            recipentName={`${advisor.first_name} ${advisor.last_name}`}
            showSuggestion
          />
        </div>
      </div>
    </main>
  );
}
