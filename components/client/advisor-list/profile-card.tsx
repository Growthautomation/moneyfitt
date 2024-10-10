import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RedirectButton } from "@/components/utils/redirect-btn";
import { languages, narrowScope } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { Advisor } from "@/types/advisor";

interface AdvisorProfileCardProps {
  advisor: Advisor;
  redirectTo: string;
}

export async function AdvisorProfileCard({
  advisor,
  redirectTo,
}: AdvisorProfileCardProps) {
  const supabase = createClient();
  const { data } = await supabase.storage
    .from("public-files")
    .getPublicUrl(advisor.profile_img ?? "");

  return (
    <Card className="w-full h-full flex flex-col bg-white shadow-lg border-t-4 border-[#5C59E4]">
      <CardHeader className="text-center flex-shrink-0 flex flex-col justify-between">
        <Avatar className="w-24 h-24 mx-auto border-4 border-[#D6D5F8]">
          <AvatarImage src={data.publicUrl || ""} alt="advisor-profile-pic" />
          <AvatarFallback className="bg-[#8583EB] text-white text-xl font-semibold">
            {`${advisor?.first_name?.[0]}${advisor?.last_name?.[0]}`}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="mt-4 text-xl font-bold text-[#222222]">
            {`${advisor.first_name} ${advisor.last_name}`}
          </CardTitle>
          <CardDescription className="text-base font-medium text-[#4543AB]">
            {advisor.title}
          </CardDescription>
        </div>
        <CardDescription className="mt-2 text-sm text-[#222222] line-clamp-3">
          {advisor.bio}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex flex-col">
            <h3 className="font-semibold mb-2 text-[#2E2C72]">
              Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {(advisor?.narrow_scope as string[])?.slice(0, 3).map((scope, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-[#D6D5F8] text-[#2E2C72] hover:bg-[#8583EB] hover:text-white"
                >
                  {narrowScope.find((n) => n.code === scope)?.name ?? scope}
                </Badge>
              ))}
              {(advisor?.narrow_scope as string[])?.length > 3 && (
                <Badge variant="secondary" className="bg-[#D6D5F8] text-[#2E2C72]">
                  +{(advisor?.narrow_scope as string[]).length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-[#2E2C72]">
              Languages Spoken
            </h3>
            <p className="text-sm text-[#222222]">
              {(advisor.languages as string[])
                ?.map((lang) => languages.find((l) => l.code === lang)?.name || lang)
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-shrink-0">
        <RedirectButton
          className="w-full bg-[#5C59E4] hover:bg-[#4543AB] text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
          href={redirectTo}
        >
          View Profile
        </RedirectButton>
      </CardFooter>
    </Card>
  );
}
