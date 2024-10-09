import { createClient } from "@/lib/supabase/server";
import Contents from "@/components/client/contents/main";

export default async function Page(){
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return <Contents user={user} />;
}