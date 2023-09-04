"use client";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import { createRef, useEffect } from 'react';
import { display12HourTime } from '@/lib/utils';

function Calendar({ events }: { events: any[] }) {
    function renderEventContent(eventInfo: any) {
        return (
            <span>
                <i>{eventInfo.event.title}</i> - <>{display12HourTime(eventInfo.event.start)}{eventInfo.event.end ? ` - ${display12HourTime(eventInfo.event.end)}` : ''}</>
            </span>
        )
    }

    const calendarRef = createRef<FullCalendar>()

    const resizeHandler = () => {
        if (window.innerWidth < 768) calendarRef?.current?.getApi().changeView('listWeek')
        else calendarRef?.current?.getApi().changeView('dayGridMonth')
    }

    useEffect(() => {
        window.addEventListener('resize', resizeHandler)
        return () => window.removeEventListener('resize', resizeHandler)
    }, [])

    return (
        <FullCalendar
            plugins={[dayGridPlugin, listPlugin]}
            initialView={window.innerWidth < 768 ? 'listWeek' : 'dayGridMonth'}
            events={events}
            eventContent={renderEventContent}
            ref={calendarRef}
        />
    )
}

export default Calendar