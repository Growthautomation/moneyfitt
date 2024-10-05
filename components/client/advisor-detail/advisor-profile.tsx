"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Star,
  User,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Advisor } from "@/types/advisor";
import { createClient } from "@/lib/supabase/client";
import { languages, narrowScope } from "@/lib/constants";

export function AdvisorProfile({ advisor }: { advisor: Advisor }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profile, setProfile] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data } = await supabase.storage
        .from("public-files")
        .getPublicUrl(advisor.profile_img ?? "");
      setProfile(data?.publicUrl);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3);
  };

  return (
    <div className="h-full">
      <Card className="bg-[#FFFFFF] h-full overflow-hidden shadow-lg border-[#5C59E4] border-t-4">
        <CardHeader className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-gradient-to-r from-[#D6D5F8] to-[#FFFFFF] p-6">
          <div className="relative flex-shrink-0">
            <Image
              src={profile || "/default-profile.png"}
              alt={`${advisor.first_name} ${advisor.last_name}`}
              width={150}
              height={150}
              className="rounded-full border-4 border-[#FFFFFF] shadow-lg"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-[#FFFFFF] hover:bg-[#5C59E4] hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn profile</span>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-[#FFFFFF] hover:bg-[#5C59E4] hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter profile</span>
              </Button>
            </div>
          </div>
          <div className="text-center sm:text-left flex-grow">
            <CardTitle className="text-3xl font-bold break-words text-[#222222]">{`${advisor.first_name} ${advisor.last_name}`}</CardTitle>
            <p className="text-sm text-[#4543AB] font-medium break-words mt-1">
              Certified Financial Planner & Chartered Financial Consultant(Dummy)
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <User className="mr-2 flex-shrink-0 text-[#5C59E4]" /> Professional Summary
            </h2>
            <p className="text-[#222222] break-words">{advisor.bio}</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <Star className="mr-2 flex-shrink-0 text-[#5C59E4]" /> Specializations
            </h2>
            <div className="flex flex-wrap gap-2">
              {(advisor.narrow_scope as string[])?.map((spec) => (
                <Badge key={spec} variant="secondary" className="bg-[#8583EB] text-white hover:bg-[#4543AB]">
                  {narrowScope.find((s) => s.code === spec)?.name}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <Languages className="mr-2 text-[#5C59E4]" /> Languages Spoken
            </h2>
            <div className="flex flex-wrap gap-2">
              {(advisor.languages as string[])?.map((lang) => (
                <Badge key={lang} variant="outline" className="border-[#5C59E4] text-[#2E2C72]">
                  {languages.find((l) => l.code === lang)?.name}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <GraduationCap className="mr-2 text-[#5C59E4]" /> Education
            </h2>
            <ul className="list-disc list-inside text-[#222222] space-y-1">
              {(advisor.education as string[]).map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <Briefcase className="mr-2 text-[#5C59E4]" /> Professional Experience
            </h2>
            <ul className="space-y-2 text-[#222222]">
              {(advisor.professional_background as string[])?.map((exp) => (
                <li key={exp} className="flex items-start">
                  <span className="mr-2 text-[#5C59E4]">•</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72]">Approach & Philosophy</h2>
            <blockquote className="border-l-4 border-[#5C59E4] pl-4 italic text-[#222222] bg-[#ECF0F3] p-3 rounded">
              &ldquo;I believe in creating personalized, long-term strategies
              that align with my clients&apos; values and goals. By taking a
              holistic approach, I help clients navigate life&apos;s financial
              complexities and ensure they are well-prepared for the
              future.&rdquo;(dummy)
            </blockquote>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <Award className="mr-2 text-[#5C59E4]" /> Awards & Recognition
            </h2>
            <ul className="list-disc list-inside text-[#222222] space-y-1">
              <li>
                &ldquo;Top Financial Advisor in Singapore 2022&rdquo; by
                Financial Times
              </li>
              <li>
                &ldquo;Best Client Service Award&rdquo; by Wealth Management
                Asia
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-[#2E2C72]">Personal Interests & Hobbies</h2>
            <ul className="text-[#222222] flex flex-wrap gap-2 my-2">
              {(advisor?.personal_interests as string[]).map((interest) => (
                <li key={interest} className="bg-[#D6D5F8] text-[#2E2C72] rounded-full px-3 py-1 text-sm font-medium">
                  {interest}
                </li>
              ))}
            </ul>
            <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <Image
                  src="/lib/images/Pacific-Beach-Half-Marathon-Start-Line-3200x2133.jpg"
                  alt="John Doe hiking"
                  width={384}
                  height={256}
                  className="flex-shrink-0 object-cover"
                />
                <Image
                  src="/lib/images/images (3).jpg"
                  alt="John Doe running a marathon"
                  width={384}
                  height={256}
                  className="flex-shrink-0 object-cover"
                />
                <Image
                  src="/lib/images/happy-three-generation-asian-family-600nw-2226442045.webp"
                  alt="John Doe with family"
                  width={384}
                  height={256}
                  className="flex-shrink-0 object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-[#5C59E4] hover:text-white transition-colors"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-[#5C59E4] hover:text-white transition-colors"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? "bg-[#5C59E4]" : "bg-[#9CABC2]"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
