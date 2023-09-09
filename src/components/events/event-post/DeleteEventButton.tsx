"use client";

import { deleteEvent } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

function DeleteEventButton({ id }: { id: number }) {
  return (
    <ConfirmationDialog
      title="Delete Event"
      description="Are you sure you want to delete this event? This action cannot be undone."
      actionButtonText="Delete"
      onAction={() => deleteEvent(id)}>
      <Button variant="destructive">
        <Trash2 className="w-5 h-5" />
      </Button>
    </ConfirmationDialog>
  );
}

export default DeleteEventButton;
