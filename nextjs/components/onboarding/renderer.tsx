import { QNode } from "@/resources/questions";
import Select from "./select";
import { SetStateAction } from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { CircleCheckBig } from "lucide-react";
import { MultiSelectSearchableComponent } from "../multi-select-searchable";

export default function renderQuestions(
  question: QNode | null,
  answer: Record<string, string | string[]>,
  setAnswer: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >,
  next: (answers: Record<string, any>) => void = () => null
) {
  switch (question?.type) {
    case "single":
      return (
        <Select
          options={question.options}
          value={answer[question.key]}
          onSelect={(val) => {
            const newAns = { ...answer, [question.key]: val };
            setAnswer(newAns);
            next(newAns);
          }}
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
              [question.key]: answer[question.key]?.includes(val)
                ? [
                    ...(answer[question.key] as string[])?.filter(
                      (a) => a !== val
                    ),
                  ]
                : [...((answer[question.key] || []) as string[]), val],
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
    case "cover":
      return (
        <div>
          <h1 className="text-xl text-cente my-4 flex gap-3">
            <CircleCheckBig className="text-green-500" />
            {question.category}
          </h1>
          <p className="mb-4">{question.question}</p>
          <p className="mb-4">{question.description}</p>
        </div>
      );
    case "multipleDropdown":
      return (
        <div className="flex justify-center">
          <MultiSelectSearchableComponent
            options={question.options}
            placeholder={`Select from dropdown`}
            selected={(answer[question.key] as string[]) || []}
            onChange={(values) =>
              setAnswer({
                ...answer,
                [question.key]: values.map((v) => v.code),
              })
            }
          />
        </div>
      );
    default:
      return null;
  }
}
