"use client";

import { useForm } from "@/hooks/useForm";
import * as z from "zod";
import { Input, Textarea, Checkbox } from "../form/form-fields";
import { createPost, updatePost } from "@/lib/actions";
import { FormDialog } from "../form/FormDialog";
import { useState } from "react";

type PostSchema = z.infer<typeof postSchema>;
const postSchema = z.object({
  title: z
    .string({
      required_error: "A title is required.",
    })
    .min(1),
  content: z
    .string({
      required_error: "The content is required.",
    })
    .min(1),
  isTeam: z.boolean().optional(),
});

interface PostFormProps {
  id?: number;
  initialValues?: PostSchema;
  triggerButton: React.ReactNode;
}

function PostFormDialog({ triggerButton, id, initialValues }: PostFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    schema: postSchema,
    defaultValues: initialValues || {
      title: "",
      content: "",
      isTeam: false,
    },
  });

  async function onSubmit(data: PostSchema) {
    const post: PostFormData = {
      title: data.title,
      isTeam: data.isTeam,
      content: data.content,
    };

    if (id) await updatePost(post, id);
    else await createPost(post);

    setIsOpen(false);
  }

  return (
    <FormDialog
      form={form}
      triggerButton={triggerButton}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmitAction={onSubmit}
      title={id ? "Edit Post" : "Create Post"}
      buttonText={id ? "Update Post" : "Create Post"}
      pendingButtonText={id ? "Updating Post..." : "Creating Post..."}
      contentClassName="sm:max-w-[800px]">
      <Input label="Title" type="text" {...form.register("title")} />
      <Textarea
        label="Content"
        type="text"
        className="min-h-[500px] h-full"
        {...form.register("content")}
      />
      <Checkbox label="Post as a team" {...form.register("isTeam")} />
    </FormDialog>
  );
}

export default PostFormDialog;
