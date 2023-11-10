"use client";

import { registerForEvent, unregisterForEvent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardX, CircleSlash } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useState } from "react";
import { signIn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface RegistrationButtonProps {
  full: boolean;
  registered: boolean;
  notAllowed?: boolean;
  isLoggedOut?: boolean;
  eventID: number;
}

function RegistrationButton({
  full,
  registered,
  notAllowed = false,
  isLoggedOut = true,
  eventID
}: RegistrationButtonProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (isLoggedOut)
    return (
      <Button onClick={() => signIn()}>
        <Clipboard className="w-4 h-4 mr-2" />
        <span>Sign In to Register</span>
      </Button>
    );

  if (notAllowed)
    return (
      <Button disabled>
        <Clipboard className="w-4 h-4 mr-2" />
        <span>Not Allowed</span>
      </Button>
    );

  const ButtonText = registered ? "Unregister" : full ? "Full" : "Register";
  const ButtonIcon = registered ? ClipboardX : full ? CircleSlash : Clipboard;

  return (
    <ConfirmationDialog
      title={registered ? "Cancel Registration" : "Register"}
      description={
        registered
          ? "Are you sure you want to cancel your registration for this event?"
          : "Are you sure you want to register for this event?"
      }
      actionButtonText="Confirm"
      pendingButtonText={registered ? "Cancelling..." : "Registering..."}
      isPending={isRegistering}
      variant={registered ? "destructive" : "default"}
      onAction={async () => {
        if (!full || registered) {
          setIsRegistering(true);
          try {
            const actionResults = await Promise.allSettled([
              registered ? unregisterForEvent(eventID) : registerForEvent(eventID),
              // Artificial delay for ui feedback: https://www.youtube.com/watch?v=YnksFDAN_GA
              new Promise((resolve) => setTimeout(resolve, 800)),
            ]);

            router.refresh();

            const feedback = (
              actionResults.find((c) => c.status === "fulfilled") as PromiseFulfilledResult<any>
            ).value;
            const wasSuccessful = feedback?.success;

            toast({
              variant: wasSuccessful ? "success" : "destructive",
              title: wasSuccessful ? registered ? "Unregistered" : "Registered" : "Error",
              description: wasSuccessful ? feedback.success : feedback?.error,
            });
          } catch (e) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong.",
            });
          } finally {
            setIsRegistering(false);
          }
        }
      }}>
      <Button
        variant={registered || full ? "destructive" : "default"}
        disabled={full && !registered}>
        <ButtonIcon size={20} className="mr-1" /> {ButtonText}
      </Button>
    </ConfirmationDialog>
  );
}

export default RegistrationButton;
