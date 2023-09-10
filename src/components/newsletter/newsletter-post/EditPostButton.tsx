import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Post } from "@prisma/client";
import { PostFormDialog } from "../PostFormDialog";

function EditPostButton({ id, post }: { id: number; post: Post }) {
  const values = {
    title: post.title || "",
    content: post.content || "",
  };

  return (
    <PostFormDialog
      id={id}
      initialValues={values}
      triggerButton={
        <Button>
          <Pencil className="w-5 h-5" />
        </Button>
      }
    />
  );
}

export default EditPostButton;
