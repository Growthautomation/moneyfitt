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
import { createClient } from "@/lib/supabase/server";

export default async function AdvisorPreference() {
  const supabase = createClient();
  const {
    data: { user },
    error: usrErr,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("preference/page.tsx", usrErr);
    return <div>Failed to fetch user</div>;
  }

  const { data: client, error: clientErr } = await supabase
    .from("client")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!client) {
    console.error("preference/page.tsx", clientErr);
    return <div>Failed to fetch client</div>;
  }

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
              <Label htmlFor="broadScope" className="font-bold text-lg">
                Key Area
              </Label>
              <MultiSelectSearchableComponent
                name="broadScope"
                options={broadScope}
                placeholder={`Select from dropdown`}
                selected={(client.broad_scope as string[]) || []}
              />
            </div>

            {/* Specialized Area */}
            <div className="space-y-2">
              <Label htmlFor="narrowScope" className="font-bold text-lg">
                Specialized Area
              </Label>
              <MultiSelectSearchableComponent
                name="narrowScope"
                options={narrowScope}
                placeholder={`Select from dropdown`}
                selected={(client.narrow_scope as string[]) || []}
              />
            </div>

            {/* Religion Preference */}
            <div className="space-y-4">
              <Label className="font-bold text-lg">Religion Preference</Label>
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
                      defaultChecked={(
                        client.preferred_religion as string[]
                      )?.includes(religion.code)}
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
              <Label className="font-bold text-lg">Gender Preference</Label>
              <RadioGroup defaultValue="any" name="gender">
                {gender.map((g) => (
                  <div key={g.code} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={g.code}
                      id={`gender-${g.code}`}
                      defaultChecked={client.preferred_sex === g.code}
                    />
                    <Label htmlFor={`gender-${g.code}`}>{g.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Language Preference */}
            <div className="space-y-4">
              <Label className="font-bold text-lg">Language Preference</Label>
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
                      defaultChecked={(client.preferred_language as string[])?.includes(
                        language.code
                      )}
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
              <Label className="font-bold text-lg">Age Preference</Label>
              {ageGroups.map((age) => (
                <div key={age.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`age-${age.code}`}
                    name="age"
                    value={age.code}
                    checked={(client.preferred_age_group as string[])?.includes(
                      age.code
                    )}
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
