import AdvisorList from "@/components/client/advisor-list/list";
import Rematch from "@/components/client/advisor-list/rematch";
import ComponentError from "@/components/utils/component-error";
import { createClient } from "@/lib/supabase/server";

export default async function Advisors() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <ComponentError message="User not found" />;
  }

  return (
    <div className="w-full">
       <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Your Matched Advisors</h2>
        <Rematch />
      </div>
      <AdvisorList user={user} />
    </div>
  );
}
