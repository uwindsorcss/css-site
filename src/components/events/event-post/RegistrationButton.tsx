"use client";

import { registerForEvent, unregisterForEvent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardX, CircleSlash } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useState } from "react";
import { signIn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const DisabledButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <Button disabled {...props} className="select-none">
    <Clipboard size={20} className="mr-1" />
    {children}
  </Button>
);

interface RegistrationButtonProps {
  eventID: number;
  isFull: boolean;
  isRegistered: boolean;
  isNotAllowed?: boolean;
  isLoggedOut?: boolean;
  isExpired?: boolean;
}

function RegistrationButton({
  eventID,
  isFull,
  isRegistered,
  isNotAllowed = false,
  isLoggedOut = true,
  isExpired = false,
}: RegistrationButtonProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (isLoggedOut) return <Button onClick={signIn}><Clipboard size={20} className="mr-1" /> Register</Button>;
  if (isNotAllowed) return <DisabledButton>Not Allowed</DisabledButton>;
  if (isExpired) return <DisabledButton>Expired</DisabledButton>;

  const ButtonText = isRegistered ? "Unregister" : isFull ? "Full" : "Register";
  const ButtonIcon = isRegistered ? ClipboardX : isFull ? CircleSlash : Clipboard;

  return (
    <ConfirmationDialog
      title={isRegistered ? "Cancel Registration" : "Register"}
      description={
        isRegistered
          ? "Are you sure you want to cancel your registration for this event?"
          : "Are you sure you want to register for this event?"
      }
      actionButtonText="Confirm"
      pendingButtonText={isRegistered ? "Unregistering..." : "Registering..."}
      isPending={isRegistering}
      variant={isRegistered ? "destructive" : "default"}
      onAction={async () => {
        if (!isFull || isRegistered) {
          setIsRegistering(true);
          try {
            const [res] = await Promise.allSettled([
              isRegistered ? unregisterForEvent(eventID) : registerForEvent(eventID),
              // Artificial delay for ui feedback: https://www.youtube.com/watch?v=YnksFDAN_GA
              new Promise((resolve) => setTimeout(resolve, 800)),
            ]);

            router.refresh();

            const feedback = res.status === "fulfilled" ? res.value : null;
            const wasSuccessful = feedback?.success;

            toast({
              variant: wasSuccessful ? "success" : "destructive",
              title: wasSuccessful ? (isRegistered ? "Unregistered" : "Registered") : "Error",
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
        variant={isRegistered || isFull ? "destructive" : "default"}
        disabled={isFull && !isRegistered}>
        <ButtonIcon size={20} className="mr-1" /> {ButtonText}
      </Button>
    </ConfirmationDialog>
  );
}

export default RegistrationButton;
