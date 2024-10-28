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
import { createMatching } from "@/lib/actions/client";
import { SubmitButton } from "@/components/submit-btn";

export default function Rematch() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <RefreshCw className="h-4 w-4 mx-2" /> Match me again
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find New Match</DialogTitle>
            <DialogDescription>
              Do you want to edit your advisor preference or your matching needs
              questions?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <form action={createMatching}>
                <SubmitButton pendingText="Matching...">
                  No
                </SubmitButton>
              </form>
            </DialogClose>
            <Button
              onClick={() => {
                router.push("/preference");
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
