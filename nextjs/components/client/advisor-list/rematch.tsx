import { createClient } from "@/lib/supabase/server"
import { Matching } from "@/types/matching"
import RematchBtn from "./rematch-btn";
import { addHours, addMinutes, isAfter } from "date-fns";

interface RematchProps {
  matching: Matching
}
export default function Rematch({matching}: RematchProps) {
  if(isAfter(new Date(), addMinutes(matching.created_at, 1))){
    return <RematchBtn matchId={matching.id} />
  }

  return null
}
