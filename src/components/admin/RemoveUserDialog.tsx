"use client";

import { Button } from "@/components/ui/button";
import ConfirmationDialog from "../ui/confirmation-dialog";
import { useState } from "react";
import { removeUserFromStaff } from "@/lib/admin-actions";
import { X } from "lucide-react";
import { useAsyncFeedback } from "@/hooks/useAsyncFeedback";

interface RemoveUserDialogProps {
  disabled?: boolean;
  userId: number;
  userName: string;
}

export function RemoveUserDialog({ disabled = false, userId, userName }: RemoveUserDialogProps) {
  const handleAsync = useAsyncFeedback();
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <ConfirmationDialog
      title={`Remove User`}
      description={`Are you sure you want to remove ${userName} from the staff team? This action cannot be undone.`}
      actionButtonText="Remove"
      pendingButtonText="Removing..."
      isPending={isRemoving}
      onAction={async () => {
        setIsRemoving(true);
        await handleAsync(removeUserFromStaff, userId);
        setIsRemoving(false);
      }}>
      <Button size={"icon"} disabled={disabled}>
        <X size={18} />
      </Button>
    </ConfirmationDialog>
  );
}
