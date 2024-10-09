import ChatSummaryContainer from "@/components/client/chat-summary/container";
import ComponentError from "@/components/utils/component-error";
import { createClient } from "@/lib/supabase/server";

export default async function Summary({ searchParams }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <ComponentError message="User not found" />;
  }
  return (
    <div className="w-full">
      <ChatSummaryContainer
        selectedAdvisor={searchParams?.advisorId}
        user={user}
      />
    </div>
  );
}
