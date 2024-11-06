"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Advisor } from "@/types/advisor";
import { MultiSelectSearchableComponent } from "@/components/multi-select-searchable";
import {
  broadScope,
  narrowScope,
  religion,
  companies,
  languages,
} from "@/lib/constants";
import { ImageManager } from "@/components/advisor/image-manager";
import { SliderImageManager } from "@/components/advisor/slider-image-manager";

interface EditProfileFormProps {
  advisor: Advisor;
  onUpdate: (field: string, value: any) => void;
}

// Add constants for limits
const LIMITS = {
  broad_scope: 2,
  narrow_scope: 6,
  personal_interests: 6,
  testinomial: 3,
};

export function EditProfileForm({ advisor, onUpdate }: EditProfileFormProps) {
  // Helper function to handle list items
  const handleListChange = (field: string, index: number, value: string) => {
    const currentList = (advisor[field] as string[]) || [];
    const newList = [...currentList];
    
    if (field === "testinomial") {
      // For testimonials, preserve any existing author part
      const currentItem = currentList[index] || '';
      const authorPart = currentItem.split(' - ')[1] || '';
      newList[index] = `${value}${authorPart ? ` - ${authorPart}` : ''}`;
    } else {
      newList[index] = value;
    }
    
    onUpdate(field, newList);
  };

  const addListItem = (field: string) => {
    const currentList = (advisor[field] as string[]) || [];
    if (field in LIMITS && currentList.length >= LIMITS[field as keyof typeof LIMITS]) {
      console.warn(
        `Maximum ${LIMITS[field as keyof typeof LIMITS]} items allowed`
      );
      return;
    }
    onUpdate(field, [...currentList, ""]);
  };

  const removeListItem = (field: string, index: number) => {
    const currentList = (advisor[field] as string[]) || [];
    onUpdate(
      field,
      currentList.filter((_, i) => i !== index)
    );
  };

  // Add handlers for multi-select
  const handleBroadScopeChange = (selected: { code: string }[]) => {
    onUpdate(
      "broad_scope",
      selected.map((item) => item.code)
    );
  };

  const handleNarrowScopeChange = (selected: { code: string }[]) => {
    onUpdate(
      "narrow_scope",
      selected.map((item) => item.code)
    );
  };

  const handleReligionChange = (selected: { code: string }[]) => {
    // Religion should only allow one selection
    if (selected.length > 0) {
      onUpdate("religion", selected[selected.length - 1].code);
    } else {
      onUpdate("religion", null);
    }
  };

  const handleCompanyChange = (selected: { code: string }[]) => {
    // Company should only allow one selection
    if (selected.length > 0) {
      onUpdate("current_company", selected[selected.length - 1].code);
    } else {
      onUpdate("current_company", null);
    }
  };

  // Add a new function to handle author changes
  const handleTestimonialAuthorChange = (index: number, author: string) => {
    const currentList = (advisor.testinomial as string[]) || [];
    const newList = [...currentList];
    const currentItem = currentList[index] || '';
    const testimonialPart = currentItem.split(' - ')[0] || '';
    newList[index] = `${testimonialPart} - ${author}`;
    onUpdate("testinomial", newList);
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg border border-[#D6D5F8]">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2E2C72]">
          Basic Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={advisor.first_name || ""}
              onChange={(e) => onUpdate("first_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={advisor.last_name || ""}
              onChange={(e) => onUpdate("last_name", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={advisor.title || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_company">Current Company</Label>
          <MultiSelectSearchableComponent
            options={companies}
            placeholder="Select company"
            selected={advisor.current_company ? [advisor.current_company] : []}
            onChange={handleCompanyChange}
          />
        </div>
      </div>

      {/* Profile Image */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2E2C72]">Profile Image</h3>
        <ImageManager
          advisorId={advisor.id}
          currentProfileImage={advisor.profile_img}
          onUpdate={() => window.location.reload()}
        />
      </div>

      {/* Websites */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2E2C72]">Websites</h3>

        <div className="space-y-2">
          <Label htmlFor="personal_website">Personal Website</Label>
          <Input
            id="personal_website"
            value={advisor.personal_website || ""}
            onChange={(e) => onUpdate("personal_website", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agency_website">Agency Website</Label>
          <Input
            id="agency_website"
            value={advisor.agency_website || ""}
            onChange={(e) => onUpdate("agency_website", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={advisor.bio || ""}
          onChange={(e) => onUpdate("bio", e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      {/* Specialisations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2E2C72]">
          Specialisations
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Broad Scope
              <span className="text-sm font-normal text-[#4543AB] ml-2">
                (Max 2)
              </span>
            </Label>
            <MultiSelectSearchableComponent
              options={broadScope}
              placeholder="Select broad specialisations"
              selected={(advisor.broad_scope as string[]) || []}
              onChange={handleBroadScopeChange}
              maxSelections={LIMITS.broad_scope}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Narrow Scope
              <span className="text-sm font-normal text-[#4543AB] ml-2">
                (Max 6)
              </span>
            </Label>
            <MultiSelectSearchableComponent
              options={narrowScope}
              placeholder="Select narrow specialisations"
              selected={(advisor.narrow_scope as string[]) || []}
              onChange={handleNarrowScopeChange}
              maxSelections={LIMITS.narrow_scope}
            />
          </div>
        </div>
      </div>

      {/* Professional Background */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#2E2C72]">
            Professional Background
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem("professional_background")}
            className="text-[#5C59E4] border-[#5C59E4]"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {((advisor.professional_background as string[]) || []).map(
          (item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) =>
                  handleListChange(
                    "professional_background",
                    index,
                    e.target.value
                  )
                }
                placeholder="Enter professional background"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeListItem("professional_background", index)}
                className="text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        )}
      </div>

      {/* Awards */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#2E2C72]">
            Awards
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem("awards")}
            className="text-[#5C59E4] border-[#5C59E4]"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {((advisor.awards as string[]) || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) =>
                handleListChange("awards", index, e.target.value)
              }
              placeholder="Enter award"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeListItem("awards", index)}
              className="text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#2E2C72]">
            Certifications
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem("certifications")}
            className="text-[#5C59E4] border-[#5C59E4]"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {((advisor.certifications as string[]) || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) =>
                handleListChange("certifications", index, e.target.value)
              }
              placeholder="Enter certification"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeListItem("certifications", index)}
              className="text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2E2C72]">Languages</h3>
        <MultiSelectSearchableComponent
          options={languages}
          placeholder="Select languages"
          selected={(advisor.languages as string[]) || []}
          onChange={(selected) =>
            onUpdate(
              "languages",
              selected.map((item) => item.code)
            )
          }
        />
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#2E2C72]">
            Education
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem("education")}
            className="text-[#5C59E4] border-[#5C59E4]"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {((advisor.education as string[]) || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) =>
                handleListChange("education", index, e.target.value)
              }
              placeholder="Enter education"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeListItem("education", index)}
              className="text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Religion */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2E2C72]">Religion</h3>
        <MultiSelectSearchableComponent
          options={religion}
          placeholder="Select religion"
          selected={advisor.religion ? [advisor.religion] : []}
          onChange={handleReligionChange}
        />
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#2E2C72]">
            Testimonials
            <span className="text-sm font-normal text-[#4543AB] ml-2">
              ({((advisor.testinomial as string[]) || []).length}/
              {LIMITS.testinomial} max)
            </span>
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem("testinomial")}
            className="text-[#5C59E4] border-[#5C59E4]"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {((advisor.testinomial as string[]) || []).map((item, index) => {
          const [testimonial, author] = item.split(' - ');
          return (
            <div key={index} className="flex gap-2">
              <div className="flex flex-col grow gap-2">
                <Textarea
                  value={testimonial}
                  onChange={(e) =>
                    handleListChange("testinomial", index, e.target.value)
                  }
                  placeholder="Enter testimonial"
                />
                <div className="space-y-1">
                  <Label htmlFor={`author-${index}`}>Author</Label>
                  <Input 
                    id={`author-${index}`}
                    value={author || ''}
                    onChange={(e) => handleTestimonialAuthorChange(index, e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeListItem("testinomial", index)}
                className="text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Personal Interests */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#2E2C72]">
            Personal Interests
            <span className="text-sm font-normal text-[#4543AB] ml-2">
              ({((advisor.personal_interests as string[]) || []).length}/
              {LIMITS.personal_interests} max)
            </span>
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem("personal_interests")}
            className="text-[#5C59E4] border-[#5C59E4]"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {((advisor.personal_interests as string[]) || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) =>
                handleListChange("personal_interests", index, e.target.value)
              }
              placeholder="Enter interest"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeListItem("personal_interests", index)}
              className="text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#2E2C72]">
          Gallery Images
          <span className="text-sm font-normal text-[#4543AB] ml-2">
            (Max 6 images)
          </span>
        </h3>
        <SliderImageManager
          advisorId={advisor.id}
          selectedImages={(advisor.secondary_images as string[]) || []}
          onUpdate={(paths) => onUpdate("secondary_images", paths)}
          maxImages={6}
        />
      </div>
    </div>
  );
}
