import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function useToastFeedback() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("error") !== null) {
      const error = searchParams.get("error")?.replace(/([A-Z])/g, " $1");
      toast({
        title: "Error",
        description: error ?? "",
        variant: "destructive",
      });
      router.replace(path);
      router.refresh();
    } else if (searchParams.get("success") !== null) {
      toast({
        title: "Success",
        description: searchParams.get("success") ?? "",
        variant: "success",
      });
      router.replace(path);
      router.refresh();
    }
  }, [searchParams, path, router, toast]);
}
