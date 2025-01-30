"use client";
import { createUserClient } from "@/lib/actions/client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreateClient() {
  useEffect(() => {
    const initClient = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get answers from auth metadata
      const answers = user.user_metadata?.onboardingAnswers || {};
      console.log('Creating client with answers:', answers);

      createUserClient({
        name: answers.userName as string,
        broad_scope: answers.broadScope || [],
        narrow_scope: answers.specification || [],
        preferred_age_group: answers.preferAge || [],
        preferred_advisor: answers.preferCompany || [],
        preferred_language: answers.preferLanguage || [],
        preferred_religion: answers.preferReligion || [],
        preferred_sex: answers.preferGender,
        all_answers: answers,
        contents: answers.contents || [],
        is_admin: false,
      });
    };

    initClient();
  }, []);

  return null;
}
