"use client";
import { createUserClient } from "@/lib/actions/client";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function CreateClient() {
  const [answers, _] = useLocalStorage<Record<string, string | string[]>>(
    "answers",
    {}
  );

  useEffect(() => {
    createUserClient({
      name: answers["userName"] as string,
      broad_scope: answers["broadScope"],
      narrow_scope: answers["specification"] ?? [],
      preferred_age_group: answers["preferAge"],
      preferred_advisor: answers["preferCompany"],
      preferred_language: answers["preferLanguage"],
      preferred_religion: answers["preferReligion"],
      preferred_sex: answers["preferGender"],
      all_answers: answers,
      contents: answers["contents"] as string[],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
