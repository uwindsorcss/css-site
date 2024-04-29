import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export function useToastFeedback() {
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error) {
      const formattedError = error.replace(/([A-Z])/g, " $1");
      toast.error(formattedError);
    } else if (success) toast.success(success);

    if (error !== null || success !== null) router.replace(path);
  }, [searchParams, path, router]);
}
