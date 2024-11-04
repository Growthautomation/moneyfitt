import ChatContextProvider from "@/components/chat/chat-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    .eq("id", user?.id || "")
    .single();
  if (error) {
    console.error(error);
  }

  return (
    <ChatContextProvider userId={user?.id}>
      {!advisor?.active && (
        <Alert variant="destructive" className="m-4 mx-auto font-bold text-center text-lg w-1/2">
          <AlertDescription>Your profile is under review. You will not get a match until we approve your profile.</AlertDescription>
        </Alert>
      )}
      <Suspense fallback="Loading...">{children}</Suspense>
    </ChatContextProvider>
  );
}
