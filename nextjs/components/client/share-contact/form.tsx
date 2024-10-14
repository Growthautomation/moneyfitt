import { createClient } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Form() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("client/share-contact: User not found");
    return <p>Problem with authentication.</p>;
  }
  const { data: client, error } = await supabase
    .from("client")
    .select()
    .eq("id", user.id)
    .single();

  if (!client) {
    console.error("client/share-contact: Error fetching client data:", error);
    return <p>Client not found</p>;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid gap-4 sm:gap-6">
        {/* Name field */}
        <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
          <Label htmlFor="name" className="text-left sm:text-right sm:col-span-1 text-[#222222]">
            Name
          </Label>
          <div className="flex items-center gap-2 sm:col-span-4">
            <Input
              id="name"
              name="name"
              defaultValue={client.name || ""}
              className="flex-grow border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
            />
            <Checkbox
              id="include-name"
              name="shareName"
              defaultChecked
              className="border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
            />
          </div>
        </div>

        {/* Email field */}
        <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
          <Label htmlFor="email" className="text-left sm:text-right sm:col-span-1 text-[#222222]">
            Email
          </Label>
          <div className="flex items-center gap-2 sm:col-span-4">
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={client.preferred_contact_email || user.email || ""}
              className="flex-grow border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
            />
            <Checkbox
              id="include-email"
              name="shareEmail"
              defaultChecked
              className="border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
            />
          </div>
        </div>

        {/* Phone field */}
        <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
          <Label htmlFor="phone" className="text-left sm:text-right sm:col-span-1 text-[#222222]">
            Phone
          </Label>
          <div className="flex items-center gap-2 sm:col-span-4">
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={client.phone_number || ""}
              className="flex-grow border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
            />
            <Checkbox
              id="include-phone"
              name="sharePhone"
              defaultChecked
              className="border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
            />
          </div>
        </div>

        {/* Telegram field */}
        <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-2 sm:gap-4">
          <Label htmlFor="telegram" className="text-left sm:text-right sm:col-span-1 text-[#222222]">
            Telegram
          </Label>
          <div className="flex items-center gap-2 sm:col-span-4">
            <Input
              id="telegram"
              name="telegram"
              defaultValue={client.telegram || ""}
              placeholder="@username or t.me/username"
              className="flex-grow border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
            />
            <Checkbox
              id="include-telegram"
              name="shareTelegram"
              defaultChecked
              className="border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
