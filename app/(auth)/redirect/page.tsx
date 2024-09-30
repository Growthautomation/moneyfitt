import CreateClient from "@/components/client/create-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Callback() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return "An error occurred";
  }

  const { data: client, error } = await supabase
    .from("client")
    .select()
    .eq("id", user.id);

  if (error) {
    console.log(error);
    return "An error occurred" + error.message;
  }

  if(client.length == 0) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex justify-center items-center flex-col bg-white">
        <div className="w-10 h-10 border-2 border-t-[#3490dc] rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-semibold">
          Please wait while we redirect you to the website...
        </p>
        {client.length == 0 && <CreateClient />}
      </div>
    );
  }

  return redirect("/home");

}
