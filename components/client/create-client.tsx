"use client";
import { createUserClient } from "@/lib/actions/client";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function CreateClient() {
  const [answers, _] = useLocalStorage<Record<string, string | string[]>>("answers", {});


  useEffect(() => {
    createUserClient({
      name: answers["userName"] as string,
      broad_scope: answers["broadScope"],
      narrow_scope: answers["specification"],
      preferred_age_group: answers["age"],
      preferred_advisor: answers["company"],
      preferred_language: answers["language"],
      preferred_religion: answers["religion"],
      preferred_sex: answers["gender"],
      all_answers: answers,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
