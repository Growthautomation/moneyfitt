import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { ShareContactDetailsComponent } from "@/components/share-contact-details";
import { Toaster } from "@/components/ui/toaster";
import AdvisorDetail from "@/components/client/advisor-detail/deail";
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
          <div className="mb-4">
            <ShareContactDetailsComponent />
          </div>
          <Chat
            messages={messages.reverse()}
            recipentId={advisor.id}
            recipentName={`${advisor.first_name} ${advisor.last_name}`}
            showSuggestion
          />
        </div>
      </div>
      <Toaster />

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
