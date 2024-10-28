import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  ageGroups,
  broadScope,
  gender,
  languages,
  narrowScope,
  religion,
} from "@/lib/constants";
import { SubmitButton } from "@/components/submit-btn";
import { updatePreferenceAndMatch } from "@/lib/actions/client";
import { MultiSelectSearchableComponent } from "@/components/multi-select-searchable";

export default function AdvisorPreference() {
  return (
    <div>
      <div className="my-3 px-5">
        <Link className="border rounded p-3" href="/home">
          Back
        </Link>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Advisor Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" action={updatePreferenceAndMatch}>
            {/* Key Area */}
            <div className="space-y-2">
              <Label htmlFor="keyArea">Key Area</Label>
              <MultiSelectSearchableComponent
                name="keyArea"
                options={broadScope}
                placeholder={`Select from dropdown`}
                selected={[]}
              />
            </div>

            {/* Specialized Area */}
            <div className="space-y-2">
              <Label htmlFor="specializedArea">Specialized Area</Label>
              <MultiSelectSearchableComponent
                name="specializedArea"
                options={narrowScope}
                placeholder={`Select from dropdown`}
                selected={[]}
              />
            </div>
            {/* Religion Preference */}
            <div className="space-y-4">
              <Label>Religion Preference</Label>
              <div className="grid grid-cols-2 gap-4">
                {religion.map((religion) => (
                  <div
                    key={religion.code}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`religion-${religion.code}`}
                      name="religions"
                      value={religion.code}
                    />
                    <Label htmlFor={`religion-${religion.code}`}>
                      {religion.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Preference */}
            <div className="space-y-4">
              <Label>Gender Preference</Label>
              <RadioGroup defaultValue="any" name="gender">
                {gender.map((g) => (
                  <div key={g.code} className="flex items-center space-x-2">
                    <RadioGroupItem value={g.code} id={`gender-${g.code}`} />
                    <Label htmlFor={`gender-${g.code}`}>{g.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Language Preference */}
            <div className="space-y-4">
              <Label>Language Preference</Label>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`language-${language.code}`}
                      name="languages"
                      value={language.code}
                    />
                    <Label htmlFor={`language-${language.code}`}>
                      {language.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Preference */}
            <div className="space-y-4">
              <Label>Age Preference</Label>
              {ageGroups.map((age) => (
                <div key={age.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`age-${age.code}`}
                    name="age"
                    value={age.code}
                  />
                  <Label htmlFor={`age-${age.code}`}>{age.name}</Label>
                </div>
              ))}
            </div>

            <SubmitButton className="w-full" pendingText="Updating...">
              Submit Preferences
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
