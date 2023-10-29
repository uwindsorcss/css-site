import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import ListView from "@/components/events/list-view/ListView";
import CalendarView from "@/components/events/calendar-view/CalendarView";
import EventTabTrigger from "@/components/events/TabTrigger";
import { canEditEvent, getSession } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
const EventFormDialog = dynamic(() => import("@/components/events/EventFormDialog"));

export const metadata: Metadata = {
  title: "Events",
};

interface EventsProps {
  searchParams: URLSearchParams & { page?: string; view?: string };
}

export default async function EventsPage({ searchParams }: EventsProps) {
  const view = searchParams.view;
  const session = await getSession();

  return (
    <>
      <h1 className="text-4xl text-center font-bold">Events</h1>
      <Tabs defaultValue={view ?? "list"} aria-label="Events View" className="w-full max-w-3xl">
        {session && canEditEvent(session) && (
          <EventFormDialog
            triggerButton={
              <Button size="full" className="mb-4">
                Create Event
              </Button>
            }
          />
        )}
        <TabsList className="grid w-full grid-cols-2">
          <EventTabTrigger value="list" label="List View" />
          <EventTabTrigger value="calendar" label="Calendar View" />
        </TabsList>
        <TabsContent
          value="list"
          className="grid grid-cols-1 gap-4 break-words max-w-3xl w-full mx-auto">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <ListView searchParams={searchParams} />
          </Suspense>
        </TabsContent>
        <TabsContent value="calendar">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <CalendarView />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}
