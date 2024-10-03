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
import { CheckCircle2 } from "lucide-react";
import { RedirectButton } from "./redirect-btn";
import { Database } from "@/types/database.types";
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

  console.log(data)
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={data.publicUrl || ""} alt="advisor-profile-pic" />
          <AvatarFallback>{`${advisor?.first_name?.[0]} ${advisor?.last_name?.[0]}`}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">{`${advisor.first_name} ${advisor.last_name}`}</CardTitle>
        <CardDescription className="text-base">{advisor.title}</CardDescription>
        <CardDescription className="mt-2 text-sm">
          {advisor.bio}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {(advisor?.narrow_scope as string[])?.map((scope, idx) => (
              <Badge key={idx} variant="secondary">
                {narrowScope.find((n) => n.code === scope)?.name ?? scope}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Matching Criteria</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">Similar age group to you</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">
                Matched with your preferred gender
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">
                Shares interests in Health & Wellness and Family-Oriented
                Planning
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Languages Spoken</h3>
          <p className="text-sm">
            {(advisor.languages as string[])
              ?.map((lang) => languages.find((l) => l.code === lang)?.name)
              .join(", ")}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <RedirectButton className="w-full" href={redirectTo}>
          View Profile
        </RedirectButton>
      </CardFooter>
    </Card>
  );
}
