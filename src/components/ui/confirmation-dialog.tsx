"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  variant?: "destructive" | "default" | "accent";
  isPending?: boolean;
  actionButtonText: string;
  pendingButtonText?: string;
  onAction: () => Promise<void> | void;
}

function ConfirmationDialog({
  children,
  title,
  description,
  variant,
  actionButtonText,
  pendingButtonText = "Loading...",
  isPending = false,
  onAction,
}: ConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async () => {
    await onAction();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={variant} onClick={handleAction} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? pendingButtonText : actionButtonText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationDialog;
