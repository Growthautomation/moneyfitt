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
import { languages, narrowScope, broadScope, religion, companies } from "@/lib/constants";
import Link from "next/link";
import { EditProfileForm } from "@/components/advisor/edit-profile-form"
import { updateAdvisorProfile } from "@/lib/actions/agent"
import { motion } from "framer-motion"

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

// Modify the props interface to include editing capability
interface AdvisorProfileProps {
  advisor: Advisor;
  editable?: boolean;
}

export function AdvisorProfile({ advisor: initialAdvisor, editable = false }: AdvisorProfileProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false)
  const [localAdvisor, setLocalAdvisor] = useState(initialAdvisor)

  useEffect(() => {
    const fetchSecondaryImages = async () => {
      const imagePaths = parseImagePaths(localAdvisor.secondary_images);
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
  }, [localAdvisor.secondary_images]);

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

  // Add editing handlers
  const handleUpdate = (field: string, value: any) => {
    setLocalAdvisor(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      const result = await updateAdvisorProfile(localAdvisor)
      if (result.success) {
        setIsEditing(false)
        // Only reload if there were actual changes
        if (!result.message?.includes('No changes')) {
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <div className="h-full w-full max-w-[100vw] mx-auto px-4" id="advisor-profile">
      {editable && (
        <div className="max-w-[90rem] mx-auto mt-4 flex justify-between items-center">
          <Link className="hover:bg-gray-100 p-3 border rounded" href="javascript:history.back()">
            Back
          </Link>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-[#5C59E4] hover:bg-[#4543AB] text-white"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      )}
      
      <div className={`flex ${isEditing ? 'gap-6 justify-center' : 'justify-center'} max-w-[90rem] mx-auto mt-6`}>
        <Card className={`${isEditing ? 'w-[45rem]' : 'w-[50rem]'} bg-[#FFFFFF] shadow-lg border-[#5C59E4] border-t-4 flex-shrink-0`}>
          <CardHeader className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-gradient-to-r from-[#D6D5F8] to-[#FFFFFF] p-6">
            <div className="relative flex-shrink-0">
              <Image
                src={localAdvisor.profile_img || "/default-profile.png"}
                alt={`${localAdvisor.first_name} ${localAdvisor.last_name}`}
                width={150}
                height={150}
                className="rounded-full border-4 border-[#FFFFFF] shadow-lg"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {localAdvisor.personal_website && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-[#FFFFFF] hover:bg-[#5C59E4] hover:text-white transition-colors"
                    onClick={() =>
                      localAdvisor.personal_website &&
                      openWebsite(localAdvisor.personal_website)
                    }
                  >
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Personal website</span>
                  </Button>
                )}
                {localAdvisor.agency_website && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-[#FFFFFF] hover:bg-[#5C59E4] hover:text-white transition-colors"
                    onClick={() =>
                      localAdvisor.agency_website &&
                      openWebsite(localAdvisor.agency_website)
                    }
                  >
                    <Briefcase className="h-4 w-4" />
                    <span className="sr-only">Agency website</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="text-center sm:text-left flex-grow">
              <CardTitle className="text-3xl font-bold break-words text-[#222222]">{`${localAdvisor.first_name} ${localAdvisor.last_name}`}</CardTitle>
              {localAdvisor.title && (
                <p className="text-sm text-[#4543AB] font-medium break-words mt-1">
                  {localAdvisor.title}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {localAdvisor.current_company && (
                  <Badge
                    variant="secondary"
                    className="bg-[#5C59E4] text-white hover:bg-[#4543AB]"
                  >
                    {companies.find((c) => c.code === localAdvisor.current_company)?.name || localAdvisor.current_company}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6 w-full">
              {localAdvisor.bio && localAdvisor.bio.trim() && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <User className="mr-2 flex-shrink-0 text-[#5C59E4]" /> Bio
                  </h2>
                  <div className="w-full">
                    <p className="text-[#222222] whitespace-pre-wrap break-words w-full">
                      {localAdvisor.bio}
                    </p>
                  </div>
                </section>
              )}

              {(localAdvisor.broad_scope?.length > 0 || localAdvisor.narrow_scope?.length > 0) && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <Star className="mr-2 flex-shrink-0 text-[#5C59E4]" /> Specialisations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(localAdvisor.broad_scope as string[])?.map((spec: string) => (
                      <Badge
                        key={spec}
                        variant="secondary"
                        className="bg-[#2E2C72] text-white hover:bg-[#4543AB]"
                      >
                        {broadScope.find((s) => s.code === spec)?.name || spec}
                      </Badge>
                    ))}
                    {(localAdvisor.narrow_scope as string[])?.map((spec: string) => (
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

              {localAdvisor.professional_background?.length > 0 && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <Briefcase className="mr-2 flex-shrink-0 text-[#5C59E4]" /> Professional Background
                  </h2>
                  <ul className="space-y-2 text-[#222222] w-full">
                    {(localAdvisor.professional_background as string[])?.map(
                      (exp: string, index: number) => (
                        <li key={index} className="flex items-start w-full">
                          <span className="mr-2 text-[#5C59E4] flex-shrink-0">•</span>
                          <span className="whitespace-pre-wrap break-words flex-grow">
                            {exp}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </section>
              )}

              {localAdvisor.awards?.length > 0 && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <Award className="mr-2 text-[#5C59E4]" /> Awards
                  </h2>
                  <ul className="space-y-2 text-[#222222] w-full">
                    {(localAdvisor.awards as string[])?.map(
                      (award: string, index: number) => (
                        <li key={index} className="flex items-start w-full">
                          <span className="mr-2 text-[#5C59E4]">•</span>
                          <span>{award}</span>
                        </li>
                      )
                    )}
                  </ul>
                </section>
              )}

              {localAdvisor.certifications?.length > 0 && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <FileCheck className="mr-2 text-[#5C59E4]" /> Certifications
                  </h2>
                  <ul className="space-y-2 text-[#222222] w-full">
                    {(localAdvisor.certifications as string[])?.map(
                      (cert: string, index: number) => (
                        <li key={index} className="flex items-start w-full">
                          <span className="mr-2 text-[#5C59E4]">•</span>
                          <span>{cert}</span>
                        </li>
                      )
                    )}
                  </ul>
                </section>
              )}

              {localAdvisor.languages?.length > 0 && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <Languages className="mr-2 text-[#5C59E4]" /> Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(localAdvisor.languages as string[])?.map((lang: string) => (
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

              {localAdvisor.education?.length > 0 && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <GraduationCap className="mr-2 text-[#5C59E4]" /> Education
                  </h2>
                  <ul className="space-y-2 text-[#222222] w-full">
                    {(localAdvisor.education as string[])?.map(
                      (edu: string, index: number) => (
                        <li key={index} className="flex items-start w-full">
                          <span className="mr-2 text-[#5C59E4]">•</span>
                          <span>{edu}</span>
                        </li>
                      )
                    )}
                  </ul>
                </section>
              )}

              {localAdvisor.religion && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <ChurchIcon className="mr-2 text-[#5C59E4]" /> Religion
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-[#5C59E4] text-[#2E2C72]"
                    >
                      {religion.find((r) => r.code === localAdvisor.religion)?.name ||
                        localAdvisor.religion}
                    </Badge>
                  </div>
                </section>
              )}

              {localAdvisor.testinomial?.length > 0 && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <Star className="mr-2 text-[#5C59E4]" /> Testimonials
                  </h2>
                  <ul className="space-y-2 text-[#222222] w-full">
                    {(localAdvisor.testinomial as string[])?.map(
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

              {localAdvisor.personal_interests?.length > 0 && (
                <section className="space-y-2 w-full">
                  <h2 className="text-xl font-semibold text-[#2E2C72]">Personal Interests</h2>
                  <ul className="text-[#222222] flex flex-wrap gap-2 my-2">
                    {(localAdvisor.personal_interests as string[])?.map(
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

              {localAdvisor.secondary_images?.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
                    <ImageIcon className="mr-2 text-[#5C59E4]" /> Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-auto">
                    {(localAdvisor.secondary_images as string[]).map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative rounded-lg overflow-hidden ${
                          index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                        }`}
                      >
                        <div className="aspect-square w-full relative">
                          <Image
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        {isEditing && (
          <div className="w-[35rem] flex-shrink-0">
            <div className="sticky top-4">
              <EditProfileForm 
                advisor={localAdvisor} 
                onUpdate={handleUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
