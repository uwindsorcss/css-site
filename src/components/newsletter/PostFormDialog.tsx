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
  bannerUrl: z.string().optional(),
  bannerAlt: z.string().optional(),
  // TODO: ideally this should make it so alt text is required if an image is provided
  //       using z.object() with .refine() could be a potential solution.
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
      bannerUrl: "",
      bannerAlt: "",
      isTeam: false,
    },
  });

  async function onSubmit(data: PostSchema) {
    const post: PostFormData = {
      title: data.title,
      isTeam: data.isTeam,
      content: data.content,
      bannerUrl: data.bannerUrl,
      bannerAlt: data.bannerAlt,
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
      <Input label="Title" type="text" placeholder=" e.g. Newsletter" {...form.register("title")} />
      <Input label="Banner URL" type="text" placeholder="Banner Image URL" {...form.register("bannerUrl")} />
      <Input label="Banner Alt Text" type="text" placeholder="Banner Image Alt Text" {...form.register("bannerAlt")} />
      <Textarea
        label="Content"
        type="text"
        placeholder="Write your post here..."
        className="h-full min-h-[500px]"
        {...form.register("content")}
      />
      <Checkbox label="Post as a team" {...form.register("isTeam")} />
    </FormDialog>
  );
}

export default PostFormDialog;
