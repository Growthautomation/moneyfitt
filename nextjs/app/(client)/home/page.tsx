import { createClient } from "@/lib/supabase/server";
import Contents from "@/components/client/contents/main";
import { Faq } from "@/components/client/faq";
import ScrollToTop from "@/components/utils/scroll-to-top";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="space-y-16">
      <Contents user={user} />
      <div className="w-full">
        <h2 className="text-2xl font-bold text-[#222222] mb-8">
          Frequently Asked Questions
        </h2>
        <Faq />
      </div>
      <ScrollToTop />
    </div>
  );
}
