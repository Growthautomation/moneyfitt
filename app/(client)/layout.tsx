import ChatContextProvider from "@/components/chat/chat-context";
import { createClient } from "@/lib/supabase/server";
import "@/styles/globals.css";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return redirect("/onboarding");
    }
  return <ChatContextProvider userId={user.id}>{children}</ChatContextProvider>;
}
