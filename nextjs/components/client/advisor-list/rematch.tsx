import { Matching } from "@/types/matching"
import RematchBtn from "./rematch-btn";
import { addHours, isAfter } from "date-fns";

interface RematchProps {
  matching: Matching
}
export default function Rematch({matching}: RematchProps) {
  if(isAfter(new Date(), addHours(matching.created_at, 24))){
    return <RematchBtn matchId={matching.id} />
  }

  return null
}
