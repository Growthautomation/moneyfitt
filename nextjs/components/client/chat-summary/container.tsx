import Header from "./summary-header";
import ComponentError from "@/components/utils/component-error";
import { createClient } from "@/lib/supabase/server";
import Summary from "./summary";

export default async function ChatSummaryContainer() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <ComponentError message="User not found" />;
  }

  const { data: advisors, error: advisorsError } = await supabase
    .from("matchings")
    .select(
      `
      advisor_id,
      advisor (
        *
      )
    `
    )
    .eq("client_id", user.id)
    .eq("enabled", true);

  if (!advisors) {
    console.error(
      "client/chat-summary/summary-header: fail to fetch advisors",
      advisorsError
    );
    return <ComponentError message={"Fail to fetch advisors"} />;
  }

  return (
    <div className="text-sm max-w-4xl mx-auto p-4 font-['Fira_Sans'] text-[#222222]">
      <Summary advisors={advisors.map(({ advisor }) => advisor)} />

      <p className="mt-8 text-sm italic text-[#9CABC2]">
        Disclaimer: This summary is for informational purposes only and does not
        constitute financial advice.
      </p>
    </div>
  );
}
