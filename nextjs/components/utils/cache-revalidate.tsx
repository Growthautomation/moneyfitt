"use client";
import { revalidate } from "@/lib/actions/cache";
import { useEffect } from "react";

export default function Revalidate({ path }) {
  useEffect(() => {
    revalidate(path);
  }, [path]);
  return null;
}
