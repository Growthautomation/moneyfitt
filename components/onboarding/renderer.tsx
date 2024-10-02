import { QNode } from "@/resources/questions";
import Select from "./select";
import { SetStateAction } from "react";

export default function renderQuestions(
  question: QNode | null,
  answer: Record<string, string | string[]>,
  setAnswer: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >
) {
  switch (question?.type) {
    case "single":
      return (
        <Select
          question={question}
          answer={answer}
          onSelect={(key, val) => setAnswer({ ...answer, [key]: [val] })}
        />
      );
    case "multiple":
      return (
        <Select
          question={question}
          answer={answer}
          onSelect={(key, val) =>
            setAnswer({
              ...answer,
              [key]: answer[key]?.includes(val)
                ? [
                    ...((answer[key] as string[]) || []).filter(
                      (v) => v !== val
                    ),
                  ]
                : [...((answer[key] as string[]) || []), val],
            })
          }
        />
      );
    default:
      return null;
  }
}
