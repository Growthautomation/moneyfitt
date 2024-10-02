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
    return "Invalid gender";
  }
  if (!isValidAgeGroup(attributes["ageGroup"])) {
    return "Invalid age group";
  }
  if (
    attributes["broadScope"].map((s) => isValidBroadScope(s)).includes(false)
  ) {
    return "Invalid broad scope";
  }
  if (attributes["narrowScope"].map((s) => isValidNarrowScope(s))) {
    return "Invalid narrow scope";
  }
  if (attributes["languages"].map((l) => isValidLanguage(l)).includes(false)) {
    return "Languages are required";
  }
  if (!isValidReligion(attributes["religion"])) {
    return "Invalid religion";
  }
  return null;
}
