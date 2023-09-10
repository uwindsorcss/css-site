"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventFormDialog } from "./EventFormDialog";
import { useState } from "react";

interface EventFormTriggerProps {
  children: React.ReactNode;
  title: string;
  buttonText: string;
  pendingButtonText: string;
  id?: number;
  initialValues?: any;
}

function EventFormTrigger({
  children,
  title,
  id,
  initialValues,
  buttonText,
  pendingButtonText,
}: EventFormTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <EventFormDialog
          closeDialog={() => setOpen(false)}
          id={id}
          initialValues={initialValues}
          buttonText={buttonText}
          pendingButtonText={pendingButtonText}
        />
      </DialogContent>
    </Dialog>
  );
}

export default EventFormTrigger;
