import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListView from "@/components/events/ListView";
import CalendarView from "@/components/events/CalendarView";
export const metadata: Metadata = {
  title: "Events",
};

interface EventsProps {
  searchParams: URLSearchParams & { page?: string };
}

export default async function EventsPage({ searchParams }: EventsProps) {
  return (
    <>
      <h1 className="text-4xl text-center font-bold">Events</h1>
      <Tabs defaultValue="list" className="w-full max-w-3xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent
          value="list"
          className="grid grid-cols-1 gap-4 break-words max-w-3xl w-full mx-auto">
          <ListView searchParams={searchParams} />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </>
  );
}
