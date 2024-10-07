import {
  ageGroups,
  broadScope,
  gender,
  languages,
  narrowScope,
  religion,
} from "../constants";

export function decodeAge(age: string) {
  return ageGroups.find((group) => group.code === age)?.name;
}

export function decodeBroadScope(scope: string[]) {
  return scope.map((item) => {
    return broadScope.find((group) => group.code === item)?.name || '';
  });
}

export function decodeReligion(rel: string) {
  return religion.find((group) => group.code === rel)?.name;
}

export function decodeGender(gend: string) {
  return gender.find((group) => group.code === gend)?.name;
}

export function decodeLanguage(lang: string[]) {
  return lang.map((item) => {
    return languages.find((group) => group.code === item)?.name;
  });
}

export function decodeSpecifications(spec: string[]) {
  return spec.map((item) => {
    return narrowScope.find((group) => group.code === item)?.name || '';
  });
}
