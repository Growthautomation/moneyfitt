import ComponentError from "@/components/utils/component-error";
import { createClient } from "@/lib/supabase/server";

export default async function Greeting() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <ComponentError message="User not found" />;
  }
  const { data: clientData } = await supabase
    .from("client")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!clientData) {
    return <ComponentError message="Client not found" />;
  }
  return (
    <>
      <header className="mb-8 flex items-center space-x-4">
        <h1 className="text-xl font-bold">{`Welcome, ${
          clientData?.name || user?.email
        }`}</h1>
      </header>
      <h2 className="text-xl font-semibold mb-4">Your Matched Advisors</h2>
    </>
  );
}
