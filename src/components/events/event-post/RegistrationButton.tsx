"use client";

import { registerForEvent, unregisterForEvent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardX, CircleSlash } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useState } from "react";
import { signIn } from "@/lib/utils";

interface RegistrationButtonProps {
  full: boolean;
  registered: boolean;
  notAllowed?: boolean;
  userID: number | null;
  eventID: number;
}

function RegistrationButton({
  full,
  registered,
  notAllowed = false,
  userID,
  eventID,
}: RegistrationButtonProps) {
  const [isRegistering, setIsRegistering] = useState(false);

  if (!userID)
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

  return (
    <ConfirmationDialog
      title={registered ? "Unregister" : "Register"}
      description={
        registered
          ? "Are you sure you want to unregister from this event?"
          : "Are you sure you want to register for this event?"
      }
      actionButtonText="Confirm"
      pendingButtonText={registered ? "Unregistering..." : "Registering..."}
      isPending={isRegistering}
      variant={registered ? "destructive" : "default"}
      onAction={async () => {
        if (!full || registered) {
          setIsRegistering(true);
          if (registered) await unregisterForEvent(eventID, userID);
          else await registerForEvent(eventID, userID);
          setIsRegistering(false);
        }
      }}>
      <Button
        variant={registered || full ? "destructive" : "default"}
        disabled={full && !registered}>
        {registered ? (
          <>
            <ClipboardX className="w-5 h-5 mr-1" /> Unregister
          </>
        ) : (
          <>
            {full ? (
              <>
                <CircleSlash className="w-5 h-5 mr-1" /> At Capacity
              </>
            ) : (
              <>
                <Clipboard className="w-5 h-5 mr-1" /> Register
              </>
            )}
          </>
        )}
      </Button>
    </ConfirmationDialog>
  );
}

export default RegistrationButton;
