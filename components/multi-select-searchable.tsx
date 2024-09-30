"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Option = {
  value: string;
  label: string;
}

type MultiSelectSearchableProps = {
  options: Option[];
  placeholder: string;
  selected: string[];
  onChange: (selected: Option[]) => void;
}

export function MultiSelectSearchableComponent({
  options,
  placeholder,
  selected,
  onChange
}: MultiSelectSearchableProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedOptions = options.filter(option => selected.includes(option.value))

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (option: Option) => {
    const newSelected = selected.includes(option.value)
      ? selectedOptions.filter(item => item.value !== option.value)
      : [...selectedOptions, option]
    onChange(newSelected)
  }

  const handleRemove = (option: Option) => {
    onChange(selectedOptions.filter(item => item.value !== option.value))
  }

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder}
            <span className="ml-2">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2">
            <Input
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    readOnly
                    className="mr-2"
                  />
                  {option.label}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="p-2 text-gray-500">No options found.</div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedOptions.map((option) => (
          <Badge key={option.value} variant="secondary">
            {option.label}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-4 w-4 p-0"
              onClick={() => handleRemove(option)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}