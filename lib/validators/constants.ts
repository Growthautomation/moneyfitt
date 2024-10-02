import {
    gender,
    ageGroups,
    broadScope,
    narrowScope,
    languages,
    religion,
  } from "../constants";
  
  export function isValidGender(val: string) {
    return gender.map((g) => g.code).includes(val);
  }
  
  export function isValidAgeGroup(val: string) {
    return ageGroups.map((a) => a.code).includes(val);
  }
  
  export function isValidBroadScope(val: string) {
    return broadScope.map((b) => b.code).includes(val);
  }
  
  export function isValidNarrowScope(val: string) {
    return narrowScope.map((n) => n.code).includes(val);
  }
  
  export function isValidLanguage(val: string) {
    return languages.map((l) => l.code).includes(val);
  }
  
  export function isValidReligion(val: string) {
    return religion.map((r) => r.code).includes(val);
  }
  