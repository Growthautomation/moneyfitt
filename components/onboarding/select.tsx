import { QNode } from "@/resources/questions";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export default function Select({
  question,
  answer,
  onSelect,
}: {
  question: QNode;
  answer: Record<string, string | string[]>;
  onSelect: (key: string, val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {question.options?.map((option) => (
        <Button
          key={option.code}
          variant={
            answer[question.key]?.includes(option.code)
              ? "default"
              : "outline"
          }
          className="h-auto py-4 px-6 text-left justify-start items-start w-full"
          onClick={() => onSelect(question.key, option.code)}
        >
          <div className="flex items-start">
            {question.type === "multiple" && (
              <Checkbox
                checked={answer[question.key]?.includes(option.code)}
                className="mr-2 mt-1"
              />
            )}
            <span className="flex-1 whitespace-normal">{option.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
