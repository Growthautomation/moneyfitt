import { Client } from "@/types/client";
import { Json } from "@/types/database.types";
import { Matching } from "@/types/matching";

type Input = {
  client_id: string | null;
  advisor_visibility: Json | null;
  client: Client | null;
};

export function annonomiseMatching(match: Input) {
  return Object.keys(match?.client ?? {}).reduce(
    (acc, key) => {
      return ((match.advisor_visibility as string[]) ?? []).includes(key)
        ? { ...acc, [key]: match?.client?.[key] }
        : acc;
    },
    { id: match.client_id, all_answers: match.client?.all_answers } as Client
  );
}
