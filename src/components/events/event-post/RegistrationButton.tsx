"use client";

import { registerForEvent, unregisterForEvent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardX, CircleSlash } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useState } from "react";
import { signIn } from "@/lib/utils";

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

  if (isExpired) return <DisabledButton>Expired</DisabledButton>;
  if (isLoggedOut)
    return (
      <Button onClick={signIn}>
        <Clipboard size={20} className="mr-1" /> Register
      </Button>
    );
  if (isNotAllowed) return <DisabledButton>Not Allowed</DisabledButton>;

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
          if (isRegistered) await unregisterForEvent(eventID);
          else await registerForEvent(eventID);
          setIsRegistering(false);
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
