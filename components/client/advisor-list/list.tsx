import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { AdvisorProfileCard } from "@/components/client/advisor-list/profile-card";
import ComponentError from "@/components/utils/component-error";

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
    console.error("client/advisor-list/list: Error fetching advisors", error);
    return <ComponentError message="Error loading advisors" />;
  }

  return (
    <div className="flex gap-6 flex-wrap flex-row auto-row-fr">
      {advisors.map(({ advisor_id, advisor }) => (
        <div key={advisor_id} className="h-full grow min-w-[10rem] w-[13rem]">
          <AdvisorProfileCard
            advisor={advisor as never}
            redirectTo={`/chat/${advisor_id}`}
          />
        </div>
      ))}
    </div>
  );
}
