"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createPost, updatePost } from "@/lib/actions";
import { FormDialog } from "../form/FormDialog";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

type PostSchema = z.infer<typeof postSchema>;
const postSchema = z.object({
  title: z
    .string({
      required_error: "A title is required.",
    })
    .min(1),
  isTeam: z.boolean().optional(),
  content: z
    .string({
      required_error: "The content is required.",
    })
    .min(1),
});

interface PostFormProps {
  id?: number;
  initialValues?: PostSchema;
  triggerButton: React.ReactNode;
}

export function PostFormDialog({ triggerButton, id, initialValues }: PostFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: initialValues || {
      title: "",
      isTeam: false,
      content: "",
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
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isTeam"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <Checkbox
                defaultChecked={field.value || false}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FormLabel>Post as a team</FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem className="h-full">
            <FormLabel>Content</FormLabel>
            <Textarea className="h-[500px]" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
