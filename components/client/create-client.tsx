"use client";
import { createUserClient } from "@/lib/actions/client";
import { User } from "@supabase/supabase-js";
import { create } from "domain";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";

export default function CreateClient() {
  const [answers, _] = useSessionStorage("answers", {});

  useEffect(() => {
    createUserClient({ answers });
  }, []);

  return null;
}
