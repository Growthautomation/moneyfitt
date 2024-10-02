import { QNode } from "@/resources/questions";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export default function Select({
  options,
  value,
  onSelect,
  multiple = false,
}: {
  options: QNode["options"];
  multiple?: boolean;
  value: string | string[];
  onSelect: (val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {options?.map((option) => (
        <Button
          key={option.code}
          variant={value?.includes(option.code) ? "default" : "outline"}
          className="h-auto py-4 px-6 text-left flex-col justify-start items-start w-full"
          onClick={() => onSelect(option.code)}
        >
          <div className="flex items-start items-center">
            {multiple && (
              <Checkbox
                checked={value?.includes(option.code)}
                className="mr-2 mt-1"
              />
            )}
            <span className="flex-1 whitespace-normal">{option.name}</span>
          </div>
          {option.description && (
            <span className="text-xs mt-3 text-wrap">{option.description}</span>
          )}
        </Button>
      ))}
    </div>
  );
}
