import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Post } from "@prisma/client";
import PostFormDialog from "../PostFormDialog";

function EditPostButton({ id, post }: { id: number; post: Post }) {
  const values = {
    title: post.title || "",
    content: post.content || "",
    imageUrl: post.imageUrl || "",
    isTeam: post.authorId ? false : true,
  };

  return (
    <PostFormDialog
      id={id}
      initialValues={values}
      triggerButton={
        <Button>
          <Pencil size={18} className="mr-1" />
          {"Edit"}
        </Button>
      }
    />
  );
}

export default EditPostButton;
