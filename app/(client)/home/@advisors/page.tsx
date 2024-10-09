import AdvisorList from "@/components/client/advisor-list/list";
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
      <AdvisorList user={user} />;
    </div>
  );
}
