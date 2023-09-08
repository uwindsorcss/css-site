"use client";
import { usePathname, useRouter } from "next/navigation";
import { TabsTrigger } from "../ui/tabs";

interface EventTabTriggerProps {
  value: string;
  label: string;
}

function EventTabTrigger({ value, label }: EventTabTriggerProps) {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <TabsTrigger
      value={value}
      onClick={() => {
        router.replace(`${pathName}?view=${value}`);
      }}>
      {label}
    </TabsTrigger>
  );
}

export default EventTabTrigger;
