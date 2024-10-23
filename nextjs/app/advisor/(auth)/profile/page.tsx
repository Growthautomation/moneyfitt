import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { broadScope, languages, narrowScope, religion } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { ensureHttps } from "@/lib/utils/links";
import {
  Award,
  Briefcase,
  ChurchIcon,
  FileCheck,
  Globe,
  GraduationCap,
  ImageIcon,
  Languages,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Profile() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    console.error(error);
    return <div>Something went wrong</div>;
  }
  const { data: advisor, error: advisorError } = await supabase
    .from("advisor")
    .select()
    .eq("id", user.id)
    .single();
  if (!advisor) {
    console.error(advisorError);
    return <div>Advisor not found</div>;
  }

  return (
    <div className="h-full lg:block" id="advisor-profile">
      <div className="mx-10 mt-4">
        <Link className="hover:bg-gray-100 p-3 border rounded" href="javascript:history.back()">Back</Link>
      </div>
      <Card className="w-[50rem] mx-auto bg-[#FFFFFF] h-full overflow-hidden shadow-lg border-[#5C59E4] border-t-4">
        <CardHeader className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-gradient-to-r from-[#D6D5F8] to-[#FFFFFF] p-6">
          <div className="relative flex-shrink-0">
            <Image
              src={advisor.profile_img || "/default-profile.png"}
              alt={`${advisor.first_name} ${advisor.last_name}`}
              width={150}
              height={150}
              className="rounded-full border-4 border-[#FFFFFF] shadow-lg"
            />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <CardTitle className="text-3xl font-bold break-words text-[#222222]">{`${advisor.first_name} ${advisor.last_name}`}</CardTitle>
            {advisor.title && (
              <p className="text-sm text-[#4543AB] font-medium break-words mt-1">
                {advisor.title}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {advisor.current_company && (
                <Badge
                  variant="secondary"
                  className="bg-[#5C59E4] text-white hover:bg-[#4543AB]"
                >
                  {advisor.current_company}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {advisor.bio && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <User className="mr-2 flex-shrink-0 text-[#5C59E4]" /> Bio
              </h2>
              <p className="text-[#222222] break-words">{advisor.bio}</p>
            </section>
          )}

          {(advisor.broad_scope || advisor.narrow_scope) && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <Star className="mr-2 flex-shrink-0 text-[#5C59E4]" />{" "}
                Specialisations
              </h2>
              <div className="flex flex-wrap gap-2">
                {(advisor.broad_scope as string[])?.map((spec: string) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className="bg-[#5C59E4] text-white hover:bg-[#4543AB]"
                  >
                    {broadScope.find((s) => s.code === spec)?.name || spec}
                  </Badge>
                ))}
                {(advisor.narrow_scope as string[])?.map((spec: string) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className="bg-[#5C59E4] text-white hover:bg-[#4543AB]"
                  >
                    {narrowScope.find((s) => s.code === spec)?.name || spec}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {advisor.professional_background && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <Briefcase className="mr-2 text-[#5C59E4]" /> Professional
                Background
              </h2>
              <ul className="space-y-2 text-[#222222]">
                {(advisor.professional_background as string[])?.map(
                  (exp: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-[#5C59E4]">•</span>
                      <span>{exp}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {advisor.awards && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <Award className="mr-2 text-[#5C59E4]" /> Awards
              </h2>
              <ul className="space-y-2 text-[#222222]">
                {(advisor.awards as string[])?.map(
                  (award: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-[#5C59E4]">•</span>
                      <span>{award}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {advisor.certifications && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <FileCheck className="mr-2 text-[#5C59E4]" /> Certifications
              </h2>
              <ul className="space-y-2 text-[#222222]">
                {(advisor.certifications as string[])?.map(
                  (cert: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-[#5C59E4]">•</span>
                      <span>{cert}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {advisor.languages && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <Languages className="mr-2 text-[#5C59E4]" /> Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {(advisor.languages as string[])?.map((lang: string) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="border-[#5C59E4] text-[#2E2C72]"
                  >
                    {languages.find((l) => l.code === lang)?.name || lang}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {advisor.education && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <GraduationCap className="mr-2 text-[#5C59E4]" /> Education
              </h2>
              <ul className="space-y-2 text-[#222222]">
                {(advisor.education as string[])?.map(
                  (edu: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-[#5C59E4]">•</span>
                      <span>{edu}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {advisor.religion && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <ChurchIcon className="mr-2 text-[#5C59E4]" /> Religion
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-[#5C59E4] text-[#2E2C72]"
                >
                  {religion.find((r) => r.code === advisor.religion)?.name ||
                    advisor.religion}
                </Badge>
              </div>
            </section>
          )}

          {advisor.testinomial && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                <Star className="mr-2 text-[#5C59E4]" /> Testimonials
              </h2>
              <ul className="space-y-2 text-[#222222]">
                {(advisor.testinomial as string[])?.map(
                  (testimonial: string, index: number) => (
                    <li key={index}>
                      <blockquote className="border-l-4 border-[#5C59E4] pl-4 italic text-[#222222] bg-[#ECF0F3] p-3 rounded">
                        <p>&ldquo;{testimonial}&rdquo;</p>
                      </blockquote>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {advisor.personal_interests && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-[#2E2C72]">
                Personal Interests
              </h2>
              <ul className="text-[#222222] flex flex-wrap gap-2 my-2">
                {(advisor.personal_interests as string[])?.map(
                  (interest: string, index: number) => (
                    <li
                      key={index}
                      className="bg-[#D6D5F8] text-[#2E2C72] rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {interest}
                    </li>
                  )
                )}
              </ul>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
