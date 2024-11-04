import ChatContextProvider from "@/components/chat/chat-context";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function Layout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: advisor, error } = await supabase
    .from("advisor")
    .select("*")
    .eq("id", user?.id || '')
    .single();
  if (error) {
    console.error(error);
  }

  return (
    <ChatContextProvider userId={user?.id}>
      {!advisor?.active && <div>Inactive</div>}
      <Suspense fallback="Loading...">{children}</Suspense>
    </ChatContextProvider>
  );
}
