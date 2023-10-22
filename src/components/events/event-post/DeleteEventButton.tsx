"use client";

import { deleteEvent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useState } from "react";

function DeleteEventButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <ConfirmationDialog
      title="Delete Event"
      description="Are you sure you want to delete this event? This action cannot be undone."
      actionButtonText="Delete"
      pendingButtonText="Deleting..."
      isPending={isDeleting}
      onAction={async () => {
        setIsDeleting(true);
        await deleteEvent(id);
        setIsDeleting(false);
      }}>
      <Button variant="destructive">
        <Trash2 className="w-5 h-5" />
      </Button>
    </ConfirmationDialog>
  );
}

export default DeleteEventButton;
