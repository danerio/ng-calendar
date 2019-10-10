
***ng-calendar*** is an accessible (WCAG 2.0 compliant), fully customizable calendar component written for Angular 4+. 

Features: 

- Custom date range for displaying a calendar grid from a given start date to a given end date
- Options for 5 day (for business days only) or 7 day (including weekends) weeks
- Options to use pre-built calendar event templates or to create your own 
- Drag and drop functionality (In-progress)


#SETUP
-------------------------
**STEP 0 - Dependencies**
-------------------------

Run: npm install moment --save

 
-------------------------
**STEP 1 - Import calendar.module**
-------------------------
#
In app.module.ts (or module of your choosing), add import for "CalendarModule" 

import { CalendarModule } from 'ng-on-global-lib';

import: [
    CalendarModule
]


-------------------------
**HOW TO USE**
-------------------------

Once you have the module, you may now use the component using the following tag: 
<ng-calendar></ng-calendar>

*Inputs*

- showWeekends: boolean       //Default is false
- startDate: Date             //Start date for range to display, supports two-way binding
- endDate: Date               //End date for range to display, supports two-way binding
- querySummary: string        //Optional text to discribe the data displayin in the calendar
- button-style: string        //Class(es) as a string to style buttons
- events: CalendarEvent[]     //List of CalendarEvent Objects


*Outputs*

- eventAction                 //Emits any event fired from a CalendarEvent Object
- startDateChange             //Emits whenever the startDate changes
- endDateChange               //Emits whenever the endDate changes



Example:
 `<ng-calendar 
    (eventAction)="onEventAction($event)" 
    [showWeekends]="false" 
    [(startDate)]="startDate"
    [(endDate)]="endDate" 
    [events]="eventObservable | async" 
    [querySummary]="querySummary" 
    [button-style]="buttonStyleClass"
    ></ng-calendar>
