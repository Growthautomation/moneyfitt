import {
  encodeAgeGroup,
  encodeBroadScope,
  encodeCompany,
  encodeGender,
  encodeLanguage,
  encodeNarrowScope,
  encodeReligion,
} from "./encode";

export function validate(raw: any) {
  const data = {
    first_name: raw["First name/name to go by"],
    last_name: raw["Last name"],
    title: raw["Tagline or title"],
    bio: raw["Bio"],
    broad_scope: raw[
      "Broad scope: What areas of Financial Planning do you specialise in or have most interest in?\nMaximum 2"
    ]
      .split(".,")
      .map((x: string) => x.trim().replace(/\.$/, ""))
      .filter((x: string) => !!x)
      .map((x: string) => encodeBroadScope(x)),
    narrow_scope: raw[
      "Narrow scope: Products and Specialisations: \nSelect up to 6. "
    ]
      .split(", ")
      .map((x: string) => x.trim())
      .filter((x: string) => !!x)
      .map((x: string) => encodeNarrowScope(x)),
    languages: raw["Languages Spoken"]
      ? raw["Languages Spoken"]
          .split(",")
          .map((l: string) => l.trim())
          .filter((l: string) => !!l)
          .map((l: string) => encodeLanguage(l))
      : [],
    education: raw["Education Background"]
      ? raw["Education Background"]
          .split("\n")
          .map((x: string) => x.trim())
          .filter((x: string) => !!x)
      : [],
    professional_background: raw["Professional Background"]
      ? raw["Professional Background"]
          .split("\n\n")
          .map((x: string) => x.trim())
          .filter((x: string) => !!x)
      : [],
    certifications: raw["Professional Certifications"]
      ? raw["Professional Certifications"]
          .split(/\n|,/)
          .map((item: string) => item.trim())
          .filter((item: string) => !!item)
      : [],
    awards: raw["Awards and Recognition "]
      ? raw["Awards and Recognition "]
          .split("\n")
          .map((item: string) => item.trim())
          .filter((item: string) => !!item)
      : [],
    religion: raw["Religious Belief"]
      ? encodeReligion(raw["Religious Belief"])
      : undefined,
    social_profiles: raw["Social Profile Links"]
      ? raw["Social Profile Links"]
          .split("\n")
          .map((x: string) => x.trim())
          .filter((x: string) => !!x)
      : [],
    current_company: encodeCompany(raw["Current Company"]),
    personal_website: raw["Personal Website"],
    mas: raw["MAS Register of Representatives Number"],
    testinomial: [
      raw["Testimony 1"],
      raw["Testimony 2"],
      raw["Testimony 3"],
    ].filter((t) => !!t),
    personal_interests: raw["Personal Interests"]
    ? raw["Personal Interests"]
        .split(",")
        .map((x: string) => x.trim())
        .filter((x: string) => !!x)
    : [],
    gender: raw["Gender"] ? encodeGender(raw["Gender"]) : undefined,
    age_group: raw["Age"] ? encodeAgeGroup(raw["Age"]) : undefined,
    profile_img: undefined,
    tagline: raw["Tagline or title"],
    secondary_images: [],
  };
  return data;
}
