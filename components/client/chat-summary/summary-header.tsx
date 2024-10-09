import ComponentError from "@/components/utils/component-error";
import { RedirectButton } from "@/components/utils/redirect-btn";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Header({ selectedAdvisor, user }) {
  const supabase = createClient();

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
    .eq("client_id", user.id);

  if (!advisors) {
    console.error("client/chat-summary/summary-header: fail to fetch advisors", advisorsError);
    return <ComponentError message={"Fail to fetch advisors"} />;
  }

  if (!selectedAdvisor) {
    redirect(`?advisorId=${advisors?.[0]?.advisor?.id}`);
  }

  return (
    <div className="flex mb-6 border-b border-[#ECF0F3]">
      {advisors.map(({ advisor }) => (
        <Link
          key={advisor?.id}
          href={`?advisorId=${advisor?.id}`}
          className={`px-4 py-2 text-lg bg-transparent hover:bg-gray-200 border-0 outline-none shadow-none ring-0 ${
            selectedAdvisor === advisor?.id
              ? "text-[#5C59E4] border-b-2 border-[#5C59E4]"
              : "text-[#9CABC2]"
          }`}
        >
          {`${advisor?.first_name} ${advisor?.last_name}`}
        </Link>
      ))}
    </div>
  );
}
