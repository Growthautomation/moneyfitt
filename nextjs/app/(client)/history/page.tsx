import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function MatchHistory() {
  const supabase = createClient();
  const {
    data: { user },
    error: usrErr,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("preference/page.tsx", usrErr);
    return <div>Failed to fetch user</div>;
  }

  const { data: matchings, error: matchErr } = await supabase
    .from("matchings")
    .select("*, advisor(*)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (!matchings) {
    console.error("preference/page.tsx", matchErr);
    return <div>Failed to fetch matchings</div>;
  }

  return (
    <div className="">
      <div className="flex my-3 px-5 items-center">
        <Link
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          href="/home"
        >
          Back
        </Link>
        <div className="grow text-center text-xl font-bold">Match History</div>
      </div>

      <Card className="mx-4 max-w-2xl mx-auto my-5">
        <CardHeader>
          <CardTitle className="text-lg">Your Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matchings.map((match, index) => (
              <Link key={index} href={`/chat/${match.advisor_id}`}>
                <div className="flex items-center space-x-4 rounded-lg border p-4">
                  <CalendarDays className="h-5 w-5 text-gray-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      Matched with {match.advisor?.first_name}{" "}
                      {match.advisor?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
