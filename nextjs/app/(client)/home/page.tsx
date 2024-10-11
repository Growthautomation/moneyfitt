import { createClient } from "@/lib/supabase/server";
import Contents from "@/components/client/contents/main";
import { Faq } from "@/components/client/faq";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div>
      <Contents user={user} />
      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold text-[#222222] mb-6">
          Frequently Asked Questions
        </h2>
        <Faq />
      </div>
    </div>
  );
}
