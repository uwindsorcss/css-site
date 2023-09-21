import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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

interface FormDialogProps {
  children: React.ReactNode;
  form: UseFormReturn<any>;
  triggerButton: React.ReactNode;
  onSubmitAction: (data: z.infer<any>) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
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
  buttonText,
  pendingButtonText,
  contentClassName,
}: FormDialogProps) {
  const isPending = form.formState.isSubmitting;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className={clsx("max-h-[80vh] overflow-y-auto min-h-[70vh]", contentClassName)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-4">
            {children}
            <Button size="full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {pendingButtonText}
                </>
              ) : (
                <>{buttonText}</>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}