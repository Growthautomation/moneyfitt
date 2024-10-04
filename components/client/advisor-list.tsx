import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { AdvisorProfileCard } from "../advisor-profile-card";
import ComponentError from "../utils/component-error";

export default async function AdvisorList({ user }: { user: User }) {
  const supabase = createClient();
  const { data: advisors, error } = await supabase
    .from("matchings")
    .select(
      `
        advisor_id,
        advisor (
          *
        )
      `
    )
    .eq("client_id", user.id);
  if (!advisors) {
    console.error("Error fetching advisors", error);
    return <ComponentError message="Error loading advisors" />;
  }
  return (
    <div className="w-full lg:w-2/3 flex flex-nowrap overflow-x-auto gap-4 pb-4">
      {advisors.map(({ advisor_id, advisor }) => (
        <div
          key={advisor_id}
          className="flex-none w-full sm:w-1/2 lg:w-1/3 max-w-md"
        >
          <AdvisorProfileCard
            advisor={advisor as never}
            redirectTo={`/chat/${advisor_id}`}
          />
        </div>
      ))}
    </div>
  );
}
