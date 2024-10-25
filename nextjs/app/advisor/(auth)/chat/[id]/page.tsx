import ClientDashboard from "@/components/advisor/client-dashboard";
import Revalidate from "@/components/utils/cache-revalidate";
import { createClient } from "@/lib/supabase/server";
import { annonomiseMatching } from "@/lib/utils/annonomize";
import { redirect } from "next/navigation";

export default async function Chat({ params }) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("advisor/chat/page: Error fetching user:", error);
    return redirect("/agent/sign-in");
  }
  // Fetch matchings for the current advisor
  const { data: match, error: matchingsError } = await supabase
    .from("matchings")
    .select("client_id, advisor_visibility, client(*)")
    .eq("advisor_id", user.id)
    .eq("client_id", params.id)
    .eq("enabled", true)
    .limit(1)
    .single();

  if (matchingsError) {
    console.error(
      "app/advisor/chat/page: Error fetching matchings:",
      matchingsError
    );
    return "Error fetching clients";
  }

  return (
    <div>
      <ClientDashboard client={annonomiseMatching(match)} />;
    </div>
  );
}
