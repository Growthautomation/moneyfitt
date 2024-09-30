"use client";
import { createUserClient } from "@/lib/actions/client";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function CreateClient() {
  const [answers, _] = useLocalStorage<Record<string, string[]>>("answers", {});

  const payload = {
    name: answers["userName"]?.[0],
    advisor_preference: {
      broad_scope: answers["broad_scope"],
      narrow_scope: answers["narrow_scope"],
      preferred_age_group: answers["preferedAgeRange"],
      preferred_sex: answers["userSex"],
      preferred_language: answers["languagePreference"],
      preferred_religion: answers["religiousBeliefs"],
      preferred_advisor: answers["companyPreference"],
    },
    all_answers: answers,
  };

  useEffect(() => {
    createUserClient(payload);
  }, []);

  return null;
}
