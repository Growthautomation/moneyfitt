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
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="name" className="text-right col-span-1 text-[#222222]">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={client.name || ""}
          className="col-span-3 border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
        />
        <Checkbox
          id="include-name"
          name="shareName"
          defaultChecked
          className="col-span-1 border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
        />
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="email" className="text-right col-span-1 text-[#222222]">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={client.preferred_contact_email || user.email || ""}
          className="col-span-3 border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
        />
        <Checkbox
          id="include-email"
          name="shareEmail"
          defaultChecked
          className="col-span-1 border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
        />
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="phone" className="text-right col-span-1 text-[#222222]">
          Phone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={client.phone_number || ""}
          className="col-span-3 border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
        />
        <Checkbox
          id="include-phone"
          name="sharePhone"
          defaultChecked
          className="col-span-1 border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
        />
      </div>
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="telegram" className="text-right col-span-1 text-[#222222]">
          Telegram
        </Label>
        <Input
          id="telegram"
          name="telegram"
          defaultValue={client.telegram || ""}
          placeholder="@username or t.me/username"
          className="col-span-3 border-[#9CABC2] focus:border-[#5C59E4] focus:ring-[#5C59E4]"
        />
        <Checkbox
          id="include-telegram"
          name="shareTelegram"
          defaultChecked
          className="col-span-1 border-[#9CABC2] data-[state=checked]:bg-[#5C59E4] data-[state=checked]:border-[#5C59E4]"
        />
      </div>
    </div>
  );
}
