"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Suspense, useState } from "react";
import Form from "./form";
import ComponentLoading from "@/components/utils/component-loading";
import { useFormState } from "react-dom";
import { shareContact } from "@/lib/actions/client";
import { SubmitButton } from "@/components/submit-btn";
import { useToast } from "@/hooks/use-toast";

export default function ShareButton({ advisorId }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(
    async (state, data) => {
      const res = await shareContact(data);
      if (res?.success) {
        toast({
            title: "Contact details shared",
            description: "The advisor has been notified.",
        })
        setOpen(false);
      }
      return res;
    },
    { error: null }
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5C59E4] hover:bg-[#4543AB] text-white">
          Share Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#222222]">
            Share Contact Details
          </DialogTitle>
          <DialogDescription className="text-[#9CABC2]">
            Please provide your contact information below. Uncheck the box to
            exclude a field.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <form action={formAction}>
            <input type="hidden" name="advisorId" value={advisorId} />
            <Suspense fallback={<ComponentLoading />}>
              <Form />
            </Suspense>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto border-[#9CABC2] text-[#222222] hover:bg-[#ECF0F3]"
              >
                Cancel
              </Button>
              <SubmitButton
                pendingText="Sharing..."
                className="w-full sm:w-auto bg-[#5C59E4] hover:bg-[#4543AB] text-white"
              >
                Share
              </SubmitButton>
            </div>
            {state?.error && (
              <div className="border my-2 p-3 rounded bg-red-200 text-red-500 text-sm">
                {state.error}
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
