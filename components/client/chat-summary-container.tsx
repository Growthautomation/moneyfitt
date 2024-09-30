import Link from "next/link";
import ChatSummary from "./chat-summary";
import { createClient } from "@/lib/supabase/server";
import { callGPT4 } from "@/lib/utils";

export default async function ChatSummaryContainer({
  advisors,
  selectedAdvisor,
  user,
}) {
  const supabase = createClient();

  const { data: messages } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${selectedAdvisor?.id}),and(sender.eq.${selectedAdvisor?.id},recipient.eq.${user.id})`
    );

  // populate here
  // const offers = callGPT4();

  return (
    <div className="text-sm max-w-4xl mx-auto p-4 font-['Fira_Sans'] text-[#222222]">
      <div className="flex mb-6 border-b border-[#ECF0F3]">
        {advisors.map((advisor) => (
          <Link
            key={advisor.id}
            href={{
              pathname: `${process.env.NEXT_PUBLIC_ORIGIN}/home`,
              query: { advisorId: advisor.id },
            }}
            className={`px-4 py-2 text-lg ${
              selectedAdvisor.id === advisor.id
                ? "text-[#5C59E4] border-b-2 border-[#5C59E4]"
                : "text-[#9CABC2]"
            }`}
          >
            {`${advisor.first_name} ${advisor.last_name}`}
          </Link>
        ))}
      </div>

      <ChatSummary
        services={["offers"]}
        quickSummary={"quick summary"}
        analysis={"analysis"}
        mainPoints={["mainpoint"]}
      />

      <p className="mt-8 text-sm italic text-[#9CABC2]">
        Disclaimer: This summary is for informational purposes only and does not
        constitute financial advice.
      </p>
    </div>
  );
}
