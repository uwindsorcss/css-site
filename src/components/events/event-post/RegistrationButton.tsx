"use client";

import { registerForEvent, unregisterForEvent } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardX } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useState } from "react";

interface RegistrationButtonProps {
    registered: boolean;
    userID: number;
    eventID: number;
}

function RegistrationButton({ registered, userID, eventID }: RegistrationButtonProps) {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <ConfirmationDialog
            title={registered ? "Unregister" : "Register"}
            description={
                registered
                    ? "Are you sure you want to unregister from this event?"
                    : "Are you sure you want to register for this event?"
            }
            actionButtonText="Confirm"
            pendingButtonText={
                registered ? "Unregistering..." : "Registering..."
            }
            isPending={isRegistering}
            variant={registered ? "destructive" : "default"}
            onAction={async () => {
                setIsRegistering(true);
                if (registered) await unregisterForEvent(eventID, userID);
                else await registerForEvent(eventID, userID);
                setIsRegistering(false);
            }}>
            <Button variant={registered ? "destructive" : "discord"}>
                {registered ? (
                    <>
                        <ClipboardX className="w-5 h-5 mr-1" /> Unregister
                    </>
                )
                    : (
                        <>
                            <Clipboard className="w-5 h-5 mr-1" /> Register
                        </>
                    )
                }
            </Button>
        </ConfirmationDialog>
    );
}

export default RegistrationButton;
