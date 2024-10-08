import { QNode } from "@/resources/questions";

export function getRemaining(current: QNode | null, answer: Record<string, string[]>) {
  let remaining = 0;
  let node = current;
  while (node) {
    node = node?.next(answer);
    remaining++;
  }
  return Math.max(0, remaining - 1);
}