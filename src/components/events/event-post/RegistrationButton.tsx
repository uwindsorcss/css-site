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
  isWaitListEnabled: boolean;
  isRegistered: boolean;
  isNotAllowed?: boolean;
  isLoggedOut?: boolean;
  isExpired?: boolean;
}

function RegistrationButton({
  eventID,
  isFull,
  isWaitListEnabled,
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

  const ButtonText = isRegistered
    ? "Unregister"
    : isFull
    ? isWaitListEnabled
      ? "Join Waitlist"
      : "Full"
    : "Register";
  const ButtonIcon = isRegistered
    ? ClipboardX
    : isFull
    ? isWaitListEnabled
      ? Clipboard
      : CircleSlash
    : Clipboard;
  const waitListEnabled = isFull && isWaitListEnabled;

  return (
    <ConfirmationDialog
      title={isRegistered ? "Cancel Registration" : waitListEnabled ? "Join Waitlist" : "Register"}
      description={
        isRegistered
          ? "Are you sure you want to cancel your registration for this event?"
          : waitListEnabled
          ? "This event is full. Would you like to join the waitlist?"
          : "Are you sure you want to register for this event?"
      }
      actionButtonText="Confirm"
      pendingButtonText={isRegistered ? "Unregistering..." : "Registering..."}
      isPending={isRegistering}
      variant={isRegistered ? "destructive" : "accent"}
      onAction={async () => {
        if (!isRegistering) {
          setIsRegistering(true);
          if (isRegistered) await unregisterForEvent(eventID);
          else await registerForEvent(eventID);
          setIsRegistering(false);
        }
      }}>
      <Button
        variant={isRegistered || (isFull && !isWaitListEnabled) ? "destructive" : "accent"}
        disabled={isFull && !isWaitListEnabled && !isRegistered}>
        <ButtonIcon size={20} className="mr-1" /> {ButtonText}
      </Button>
    </ConfirmationDialog>
  );
}

export default RegistrationButton;
