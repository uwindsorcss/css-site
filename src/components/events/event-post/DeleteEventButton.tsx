"use client";

import { deleteEvent } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function DeleteEventButton({ id }: { id: number }) {
  return (
    <Button variant="destructive" size="icon" onClick={() => deleteEvent(id)}>
      <Trash2 />
    </Button>
  );
}

export default DeleteEventButton;
