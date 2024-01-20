"use client";

import { FormDialog } from "../form/FormDialog";
import { useForm } from "@/hooks/useForm";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input, Select } from "../form/form-fields";
import { addUserToStaff } from "@/lib/admin-actions";
import { Role } from "@prisma/client";
import { useAsyncFeedback } from "@/hooks/useAsyncFeedback";

export function AddUserDialog() {
  const handleAsync = useAsyncFeedback();
  const [isOpen, setIsOpen] = useState(false);
  const postSchema = z.object({
    email: z
      .string({
        required_error: "The user's email is required.",
      })
      .min(1),
    role: z.enum([Role.mod, Role.postEditor, Role.eventEditor]),
  });

  type PostSchema = z.infer<typeof postSchema>;
  const form = useForm({
    schema: postSchema,
  });

  return (
    <FormDialog
      buttonText="Add User"
      pendingButtonText="Adding User..."
      title="Add User"
      description="Add a new user to the staff team."
      form={form}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      onSubmitAction={async (data: PostSchema) => {
        await handleAsync(addUserToStaff, data.email, data.role);
        form.reset();
        setIsOpen(false);
      }}
      triggerButton={
        <Button size="full" onClick={() => setIsOpen(true)}>
          <UserPlus size={18} className="mr-2" />
          Add User
        </Button>
      }>
      <Input
        label="UWindsor Email"
        placeholder="user@uwindsor.ca"
        type="email"
        {...form.register("email", { required: true })}
      />
      <Select
        label="Role"
        placeholder="Select a role..."
        options={[
          { label: "Moderator", value: Role.mod },
          { label: "Post Editor", value: Role.postEditor },
          { label: "Event Editor", value: Role.eventEditor },
        ]}
        {...form.register("role", { required: true })}
      />
    </FormDialog>
  );
}
