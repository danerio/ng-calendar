import { TestEventComponent } from './test-event/test-event.component';
import { CalendarEvent } from './calendar/calendar-event/CalendarEvent';
import { Component } from '@angular/core';
import { CalendarUtil } from './calendar/CalendarUtil';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  calendarStartDate: Date;
  calendarEndDate: Date;

  constructor() {
    this.calendarStartDate = CalendarUtil.getPreviousDate(new Date()); // Setting start date to yesterday
    this.calendarEndDate = CalendarUtil.getDateFromBaseDate(new Date(), 30); // Displaying 30 days from today
  }

  // Example calendar events
  events: CalendarEvent[] = [

    // An event for yesterday
    new CalendarEvent("This is Yesterday!", CalendarUtil.getPreviousDate(new Date()), CalendarUtil.getPreviousDate(new Date()), { title: "Some text to pass in as custom data" }),

    // An event for todays date
    new CalendarEvent("This is Today!", new Date(), new Date(), { title: "Some text to pass in as custom data" }),

    // This one uses a custom component instead of the default
    new CalendarEvent("Ooo, this one uses a custom component.", new Date(), new Date(), { title: "Some text to pass in as custom data" }, { component: TestEventComponent }),

    // An event from the future
    new CalendarEvent("This is Tomorrow!", CalendarUtil.getNextDate(new Date()), CalendarUtil.getNextDate(new Date()), { title: "Some text to pass in as custom data" })
  ]


}
