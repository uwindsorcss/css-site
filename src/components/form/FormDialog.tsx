import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/form/form";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import clsx from "clsx";
import { DialogDescription } from "@radix-ui/react-dialog";

interface FormDialogProps {
  children: React.ReactNode;
  form: UseFormReturn<any>;
  triggerButton: React.ReactNode;
  onSubmitAction: (data: z.infer<any>) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  description?: string;
  buttonText: string;
  pendingButtonText: string;
  contentClassName?: string;
}

export function FormDialog({
  children,
  form,
  triggerButton,
  onSubmitAction,
  isOpen,
  setIsOpen,
  title,
  description,
  buttonText,
  pendingButtonText,
  contentClassName,
}: FormDialogProps) {
  const isPending = form.formState.isSubmitting;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className={clsx("max-h-[80vh] overflow-y-auto", contentClassName)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <Form form={form} onSubmit={onSubmitAction}>
          {children}
          <Button size="full" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? pendingButtonText : buttonText}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
