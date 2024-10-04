import Chat from "@/components/chat/chat-container";
import { AdvisorProfile } from "@/components/advisor-profile";
import { RedirectButton } from "@/components/redirect-btn";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import AdvisorDetail from "@/components/client/advisor-detail";
import { Suspense } from "react";
import PageLoading from "@/components/utils/page-loading";

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

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoading />}>
        <AdvisorDetail
          advisorId={params.id}
          user={user}
          messageOffset={searchParams?.offset}
        />
      </Suspense>
    </main>
  );
}
