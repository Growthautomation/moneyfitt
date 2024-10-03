"use client";

// TODO: change this to server component
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
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 h-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-shrink-0">
            <Image
              src={profile || ""}
              alt={`${advisor.first_name} ${advisor.last_name}`}
              width={150}
              height={150}
              className="rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-white"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn profile</span>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-white"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter profile</span>
              </Button>
            </div>
          </div>
          <div className="text-center sm:text-left flex-grow">
            <CardTitle className="text-2xl font-bold break-words">{`${advisor.first_name} ${advisor.last_name}`}</CardTitle>
            <p className="text-sm text-muted-foreground break-words">
              Certified Financial Planner & Chartered Financial
              Consultant(Dummy)
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 overflow-hidden">
          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <User className="mr-2 flex-shrink-0" /> Professional Summary
            </h2>
            <p className="text-muted-foreground break-words">{advisor.bio}</p>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Star className="mr-2 flex-shrink-0" /> Specializations
            </h2>
            <div className="flex flex-wrap gap-2">
              {(advisor.narrow_scope as string[])?.map((spec) => (
                <Badge key={spec} variant="secondary">
                  {narrowScope.find((s) => s.code === spec)?.name}
                </Badge>
              ))}
            </div>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Languages className="mr-2" /> Languages Spoken
            </h2>
            <div className="flex gap-2">
              {(advisor.languages as string[])?.map((lang) => (
                <Badge key={lang} variant="outline">
                  {languages.find((l) => l.code === lang)?.name}
                </Badge>
              ))}
            </div>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <GraduationCap className="mr-2" /> Education
            </h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {(advisor.education as string[]).map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Briefcase className="mr-2" /> Professional Experience
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              {(advisor.professional_background as string[])?.map((exp) => (
                <li key={exp}>{exp}</li>
              ))}
            </ul>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">
              Approach & Philosophy
            </h2>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-muted-foreground">
              &ldquo;I believe in creating personalized, long-term strategies
              that align with my clients&apos; values and goals. By taking a
              holistic approach, I help clients navigate life&apos;s financial
              complexities and ensure they are well-prepared for the
              future.&rdquo;(dummy)
            </blockquote>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Award className="mr-2" /> Awards & Recognition
            </h2>
            <ul className="list-disc list-inside text-muted-foreground">
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

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">
              Personal Interests & Hobbies
            </h2>
            <ul className="text-muted-foreground flex gap-2 my-2">
              {(advisor?.personal_interests as string[]).map((interest) => (
                <li key={interest} className="bg-gray-200 w-fit rounded p-1">
                  {interest}
                </li>
              ))}
            </ul>
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
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
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-white" : "bg-gray-400"
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
