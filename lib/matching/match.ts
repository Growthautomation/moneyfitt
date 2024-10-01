import { Advisor } from "@/types/advisor";
import { Client } from "@/types/client";
import { intersection } from "lodash";

export default function matchAdvisors(advisors: Advisor[], user: Client) {
  const scores = advisors.map((advisor) => ({
    ...advisor,
    ...calculateScore(advisor, user),
  }));
  const maxNeed = scores.sort((a, b) => b.needScore - a.needScore)[0];
  const maxPersonal = scores.sort((a, b) => b.personalScore - a.personalScore)[0];
  const maxTotal = scores.sort((a, b) => b.totalScore - a.totalScore)[0];
  return [maxNeed, maxPersonal, maxTotal];
}

function calculateScore(advisor: Advisor, client: Client) {
  const nS = needScore(advisor, client);
  const pS = personalScore(advisor, client);
  return {
    needScore: nS,
    personalScore: pS,
    totalScore: nS + pS
  }
}

function needScore(advisor: Advisor, client: Client) {
  let score = 0;
  if(client.broad_scope) {
    score += intersection(client.broad_scope as string[], advisor.broad_scope as string[]).length * 5;
  }
  if(client.narrow_scope) {
    score += intersection(client.narrow_scope as string[], advisor.narrow_scope as string[]).length * 3;
  }
  return score;
}


function personalScore(advisor: Advisor, client: Client) {
  let score = 0;
  if (
    client.preferred_sex &&
    (client.preferred_sex as string[]).includes(advisor.gender as string)
  ) {
    score += 2;
  }
  if (
    client.preferred_age_group &&
    (client.preferred_age_group as string[]).includes(
      advisor.age_group as string
    )
  ) {
    score += 2;
  }
  if (
    client.preferred_language &&
    intersection(
      client.preferred_language as string[],
      advisor.languages as string[]
    ).length > 0
  ) {
    score += 2;
  }
  if (
    client.preferred_religion &&
    advisor.religion === client.preferred_religion
  ) {
    score += 2;
  }
  return score;
}