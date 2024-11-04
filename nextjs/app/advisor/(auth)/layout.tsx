import ChatContextProvider from "@/components/chat/chat-context";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function Layout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <ChatContextProvider userId={user?.id}>
      <Suspense fallback="Loading...">{children}</Suspense>
    </ChatContextProvider>
  );
}
