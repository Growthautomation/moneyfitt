import { QNode } from "@/resources/questions";
import Select from "./select";
import { SetStateAction } from "react";
import { Input } from "../ui/input";

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
          options={question.options}
          value={answer[question.key]}
          onSelect={(val) =>
            setAnswer({ ...answer, ...question.answerModifier(val, answer) })
          }
        />
      );
    case "multiple":
      return (
        <Select
          options={question.options}
          value={answer[question.key]}
          onSelect={(val) =>
            setAnswer({
              ...answer,
              ...question.answerModifier(val, answer),
            })
          }
          multiple
        />
      );
    case "text":
      return (
        <Input
          type="text"
          placeholder="Enter your answer"
          value={answer[question.key]}
          onChange={(e) =>
            setAnswer({ ...answer, [question.key]: e.target.value })
          }
          className="w-full"
        />
      );
    default:
      return null;
  }
}
