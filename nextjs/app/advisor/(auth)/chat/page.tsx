import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Redirect() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("advisor/chat/page: Error fetching user:", error);
    return redirect("/advisor/sign-in");
  }

  const { data: match, error: matchError } = await supabase
    .from("matchings")
    .select()
    .eq("advisor_id", user.id)
    .eq("enabled", true)
    .limit(1)
    .maybeSingle();

  if (matchError) {
    console.error("advisor/chat/page: Error fetching matchings:", matchError);
    return <div>Something went wrong</div>;
  }

  if (!match) {
    return (
      <div className="flex justify-center items-center grow h-1/4">
        We&apos;ll notify you by email as soon as we match you with a client.
      </div>
    );
  }

  return redirect(`/advisor/chat/${match.client_id}`);
}
