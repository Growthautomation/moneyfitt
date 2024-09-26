import { AdvisorProfile } from "@/components/advisor-profile";
import { RedirectButton } from "@/components/redirect-btn";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Chat from "@/components/chat";

interface ChatProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/onboarding");
  }

  const {
    data: { user: advisor }, error: adv
  } = await supabase.auth.admin.getUserById(params.id);

  if (!advisor) {
    console.log(adv)
    return "Advisor not found";
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select()
    .or(
      `recipient.eq.${advisor.id},recipient.eq.${user.id},sender.eq.${user.id},sender.eq.${advisor.id}`
    )
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    return "cannot retrieve messages" + error.message;
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
        <h1 className="text-2xl font-bold">Chat with {advisor.email}</h1>
      </div>
      <div className="flex flex-row gap-8">
        <div className="w-[60%]">
          <AdvisorProfile />
        </div>
        <div className="w-[40%] sticky top-8">
          <Chat messages={messages} recipiant={advisor} user={user} />
        </div>
      </div>
    </main>
  );
}
