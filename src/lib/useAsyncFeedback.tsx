import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useAsyncFeedback() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const addParam = (error: boolean, message: string) => {
    const current = new URLSearchParams(searchParams.toString());

    if (error) {
      current.set("error", message);
      current.delete("success");
    } else {
      current.set("success", message);
      current.delete("error");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.replace(`${pathname}${query}`);
  };

  async function handleAsyncAction(callback: (...args: any[]) => Promise<any>, ...args: any[]) {
    try {
      const result = await callback(...args);
      if (typeof result === "string") addParam(false, result);
      return true;
    } catch (error) {
      const errorObject = error as Error;
      const message =
        errorObject.message.replace("error: ", "").charAt(0).toUpperCase() +
        errorObject.message.slice(1);
      addParam(true, message);
    }
    return false;
  }

  return handleAsyncAction;
}
