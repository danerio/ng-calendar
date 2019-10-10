import { DynamicComponentInsertionDirective } from './directives/dynamic-component-insertion.directive';
import { CalendarEventComponent } from './calendar-event/calendar-event.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultCalendarEventComponent } from './default-calendar-event/default-calendar-event.component';
import { CalendarComponent } from './calendar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule
  ],
  declarations: [
    DefaultCalendarEventComponent,
    CalendarComponent,
    CalendarEventComponent, 
    DynamicComponentInsertionDirective
  ],
    exports:[
      CalendarComponent, 
      CalendarEventComponent
    ],
  entryComponents: [DefaultCalendarEventComponent]
})
export class CalendarModule { }

