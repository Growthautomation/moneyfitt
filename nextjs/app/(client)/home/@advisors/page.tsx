import AdvisorList from "@/components/client/advisor-list/list";
import Rematch from "@/components/client/advisor-list/rematch";
import ComponentError from "@/components/utils/component-error";
import { createClient } from "@/lib/supabase/server";
import { parseISO, addHours, isAfter } from 'date-fns';

export default async function Advisors() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <ComponentError message="User not found" />;
  }

  const { data: lastMatch, error: lastMatchError } = await supabase
    .from("matchings")
    .select("created_at")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

    const lastDate = parseISO(lastMatch?.created_at as string);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Your Matched Advisors</h2>
        {isAfter(new Date(), addHours(lastDate, 1)) && <Rematch />}
      </div>
      <AdvisorList user={user} />
    </div>
  );
}
