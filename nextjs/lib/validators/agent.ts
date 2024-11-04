import {
  isValidAgeGroup,
  isValidBroadScope,
  isValidGender,
  isValidLanguage,
  isValidNarrowScope,
  isValidReligion,
} from "./constants";

export function validateAgent(attributes: object) {
  if (!attributes) {
    return "Attributes are required";
  }
  if (!isValidGender(attributes["gender"])) {
    return "Invalid gender" + attributes["gender"];
  }
  if (!isValidAgeGroup(attributes["ageGroup"])) {
    return "Invalid age group" + attributes["ageGroup"];
  }
  if (
    attributes["broadScope"].map((s) => isValidBroadScope(s)).includes(false)
  ) {
    const invalidScope = attributes["broadScope"].find(scope => !isValidBroadScope(scope));
    return `Invalid broad scope: ${invalidScope}`;
  }
  if (attributes["narrowScope"].map((s) => isValidNarrowScope(s))) {
    const invalidScope = attributes["narrowScope"].find(scope => !isValidNarrowScope(scope));
    return `Invalid narrow scope: ${invalidScope}`;
  }
  if (attributes["languages"].map((l) => isValidLanguage(l)).includes(false)) {
    const invalidLanguage = attributes["languages"].find(language => !isValidLanguage(language));
    return `Invalid language: ${invalidLanguage}`;
  }
  if (!isValidReligion(attributes["religion"])) {
    return "Invalid religion" + attributes["religion"];
  }
  return null;
}
