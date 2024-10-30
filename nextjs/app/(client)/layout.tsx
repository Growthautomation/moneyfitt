import ChatContextProvider from "@/components/chat/chat-context";
import Footer from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import "@/styles/globals.css";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "MoneyFitt Matchmaking Platform",
  description: "MoneyFitt Matchmaking Platform",
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <ChatContextProvider userId={user?.id}>
      <Suspense fallback="Loading...">{children}</Suspense>
      <Footer />
    </ChatContextProvider>
  );
}
