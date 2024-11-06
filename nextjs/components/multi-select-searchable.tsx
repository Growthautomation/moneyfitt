"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
  code: string;
  name: string;
};

type MultiSelectSearchableProps = {
  name?: string;
  options: Option[];
  placeholder: string;
  selected: string[];
  onChange?: (selected: Option[]) => void;
  maxSelections?: number;
};

export function MultiSelectSearchableComponent({
  name,
  options,
  placeholder,
  selected,
  onChange,
  maxSelections,
}: MultiSelectSearchableProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Convert selected codes to Option objects
  const selectedOptions = options.filter((option) => selected.includes(option.code));

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  // Simplified update function that just emits the new codes
  const updateSelection = (newSelectedOptions: Option[]) => {
    console.log('Updating selection:', newSelectedOptions.map(o => o.code));
    onChange?.(newSelectedOptions);
  };

  const handleRemove = (optionToRemove: Option) => {
    console.log('Attempting to remove:', optionToRemove.code);
    const newSelected = selectedOptions.filter(
      (option) => option.code !== optionToRemove.code
    );
    console.log('New selection after remove:', newSelected.map(o => o.code));
    updateSelection(newSelected);
  };

  const handleSelect = (option: Option) => {
    const isCurrentlySelected = selectedOptions.map(x => x.code).includes(option.code);
    
    if (isCurrentlySelected) {
      handleRemove(option);
    } else if (!maxSelections || selectedOptions.length < maxSelections) {
      updateSelection([...selectedOptions, option]);
    }
  };

  return (
    <div className="w-full">
      {selectedOptions.map((option) => (
        <input
          key={option.code}
          type="hidden"
          name={name}
          value={option.code}
        />
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedOptions.length > 0
              ? `${selectedOptions.length} selected`
              : placeholder}
            <span className="ml-2">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <div className="p-2">
            <Input
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
            {maxSelections && selectedOptions.length > maxSelections && (
              <div className="px-2 py-1 text-sm text-yellow-600 bg-yellow-50 rounded mb-2">
                {selectedOptions.length - maxSelections} selection(s) over limit. Please remove some items.
              </div>
            )}
            <div className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => {
                const isSelected = selectedOptions.map(x => x.code).includes(option.code);
                const isDisabled = !isSelected && maxSelections && selectedOptions.length >= maxSelections;
                
                return (
                  <div
                    key={option.code}
                    className={`flex items-center p-2 cursor-pointer ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mr-2"
                    />
                    {option.name}
                  </div>
                );
              })}
              {filteredOptions.length === 0 && (
                <div className="p-2 text-gray-500">No options found.</div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedOptions.map((option) => (
          <Badge key={option.code} variant="secondary">
            {option.name}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-4 w-4 p-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Remove button clicked for:', option.code);
                handleRemove(option);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
