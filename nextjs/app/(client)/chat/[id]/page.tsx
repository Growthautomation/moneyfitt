import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdvisorDetail from "@/components/client/advisor-detail/deail";

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
      <AdvisorDetail
        advisorId={params.id}
        user={user}
        messageOffset={searchParams?.offset}
      />
    </main>
  );
}
