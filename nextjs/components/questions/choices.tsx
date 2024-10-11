import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export default function Choice({ question, answers, onChange }) {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">{question.category}</h2>
        <p className="text-xl text-center">{question.question}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option) => (
          <Button
            key={option}
            variant={
              answers[question.key]?.includes(option) ? "default" : "outline"
            }
            className="h-auto py-4 px-6 text-left justify-start items-start"
            onClick={() => onChange(question.key, option)}
          >
            {question.type === "multiple" && (
              <Checkbox
                checked={answers[question.key]?.includes(option)}
                className="mr-2"
              />
            )}
            {option}
          </Button>
        ))}
      </div>
    </>
  );
}
