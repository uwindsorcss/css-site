"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

interface DeleteButtonProps {
  type: "post" | "event";
  callback: (id: number) => Promise<void>;
  id: number;
}

function DeleteButton({ type, callback, id }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <ConfirmationDialog
      title={`Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      description={`Are you sure you want to delete this ${type}? This action cannot be undone.`}
      actionButtonText="Delete"
      pendingButtonText="Deleting..."
      isPending={isDeleting}
      onAction={async () => {
        setIsDeleting(true);
        await callback(id);
        setIsDeleting(false);
      }}>
      <Button variant="destructive">
        <Trash2 size={18} className="mr-1" />
        {"Delete"}
      </Button>
    </ConfirmationDialog>
  );
}

export default DeleteButton;
