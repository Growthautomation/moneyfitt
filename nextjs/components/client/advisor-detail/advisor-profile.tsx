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
  Globe,
  Image as ImageIcon,
  ChurchIcon,
  FileCheck,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Advisor, Json } from "@/types/advisor";
import { createClient } from "@/lib/supabase/client";
import { languages, narrowScope, broadScope, religion } from "@/lib/constants";

// Helper function to ensure URL has a protocol
const ensureHttps = (url: string): string => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

// Helper function to parse image paths
const parseImagePaths = (images: Json | null): string[] => {
  if (!images) return [];
  if (Array.isArray(images))
    return images.filter((img) => typeof img === "string");
  if (typeof images === "string") return [images];
  return [];
};

export function AdvisorProfile({ advisor }: { advisor: Advisor }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profile, setProfile] = useState<string | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (advisor.profile_img) {
        const supabase = createClient();
        const { data } = await supabase.storage
          .from("public-files")
          .getPublicUrl(advisor.profile_img);
        setProfile(data?.publicUrl || null);
      }
    };
    fetchProfileImage();
  }, [advisor.profile_img]);

  useEffect(() => {
    const fetchSecondaryImages = async () => {
      const imagePaths = parseImagePaths(advisor.secondary_images);
      if (imagePaths.length > 0) {
        const supabase = createClient();
        const imageUrls = await Promise.all(
          imagePaths.map(async (imagePath) => {
            const { data } = await supabase.storage
              .from("public-files")
              .getPublicUrl(imagePath);
            return data?.publicUrl || "";
          })
        );
        setSecondaryImages(imageUrls.filter((url) => url !== ""));
      }
    };
    fetchSecondaryImages();
  }, [advisor.secondary_images]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % secondaryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + secondaryImages.length) % secondaryImages.length
    );
  };

  const openWebsite = (url: string | null | undefined) => {
    if (url) {
      window.open(ensureHttps(url), "_blank", "noopener,noreferrer");
    }
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
              {advisor.personal_website && (
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-[#FFFFFF] hover:bg-[#5C59E4] hover:text-white transition-colors"
                  onClick={() =>
                    advisor.personal_website &&
                    openWebsite(advisor.personal_website)
                  }
                >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Personal website</span>
                </Button>
              )}
              {advisor.agency_website && (
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-[#FFFFFF] hover:bg-[#5C59E4] hover:text-white transition-colors"
                  onClick={() =>
                    advisor.agency_website &&
                    openWebsite(advisor.agency_website)
                  }
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="sr-only">Agency website</span>
                </Button>
              )}
            </div>
          </div>
          <div className="text-center sm:text-left flex-grow">
            <CardTitle className="text-3xl font-bold break-words text-[#222222]">{`${advisor.first_name} ${advisor.last_name}`}</CardTitle>
            {advisor.tagline && (
              <p className="text-sm text-[#4543AB] font-medium break-words mt-1">
                {advisor.tagline}
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

          <section className="space-y-2">
            <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
              {secondaryImages.length > 0 ? (
                <>
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {secondaryImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Advisor interest ${index + 1}`}
                        width={400}
                        height={300}
                        objectFit="cover"
                        className="flex-shrink-0 w-full h-64"
                      />
                    ))}
                  </div>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {secondaryImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentSlide ? "bg-white" : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
