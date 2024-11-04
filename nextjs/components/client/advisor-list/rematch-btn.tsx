"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { createMatching, singleRematch } from "@/lib/actions/client";
import { SubmitButton } from "@/components/submit-btn";

export default function RematchBtn({ matchId }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <RefreshCw className="h-4 w-4" /> Match Refresh
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find New Match</DialogTitle>
            <DialogDescription>
              <p className="mb-2">Would you like to edit your answers to the onboarding quiz?</p>
              <p className="text-[#EB5853]">
                Warning: Selecting &quot;No&quot; will refresh your match with your current answers and you will not be able to message this advisor again. If you do not wish to rematch please close this popup
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <form action={singleRematch}>
              <input hidden id="matchId" name="matchId" value={matchId} />
              <SubmitButton pendingText="Matching...">No</SubmitButton>
            </form>
            <Button
              onClick={() => {
                router.push(`/preference?matchId=${matchId}`);
                setOpen(false);
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
