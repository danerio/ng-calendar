import { DefaultCalendarEventComponent } from './calendar/default-calendar-event/default-calendar-event.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEventComponent } from './calendar/calendar-event/calendar-event.component';
import { TestEventComponent } from './test-event/test-event.component';
import { CalendarModule } from 'src/app/calendar/--calendar-export';

@NgModule({
  declarations: [
    AppComponent,
    TestEventComponent
  ],
  // Any components to be rendered during runtime for the calendar MUST be listed as an entry component
  entryComponents: [
    DefaultCalendarEventComponent,
    TestEventComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // Ooo, ahh - importing our custom Calendar Module
    CalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
