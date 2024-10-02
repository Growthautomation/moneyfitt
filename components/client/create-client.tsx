"use client";
import { createUserClient } from "@/lib/actions/client";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function CreateClient() {
  const [answers, _] = useLocalStorage<Record<string, string[]>>("answers", {});


  useEffect(() => {
    createUserClient({
      name: answers["userName"]?.[0],
      broad_scope: answers["financialPlanningArea"],
      narrow_scope: answers["narrow_scope"],
      preferred_age_group: answers["preferedAgeRange"],
      preferred_advisor: answers["companyPreference"],
      preferred_language: answers["languagePreference"],
      preferred_religion: answers["religiousBeliefs"],
      preferred_sex: answers["userSex"],
      all_answers: answers,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
