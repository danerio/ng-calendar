import { CalendarEvent } from './calendar-event/CalendarEvent';
import { Component, OnInit, OnChanges, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';

import * as moment_ from 'moment';
import { CalendarUtil } from './CalendarUtil';
const moment = moment_; //Work around for "Cannot call a namespace ('moment')" when packaging

@Component({
  selector: 'ng-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {

  /**
   * Note: ngOnChanges CAN be costly (runs every time there is a change to input ); consider modifying (when time allows) for performance improvements
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Only runs function if the startDate, endDate, or events array has been modified
    if (changes["startDate"] || changes["endDate"] || changes["events"]) {

      // Calling function to set the dates in the calendar
      this.dates = this.setDates();
    }
  }

  // Input for the start date
  @Input() startDate: Date;

  // If start date is changed, this event emitter emits an event
  @Output() startDateChange = new EventEmitter<any>();

  // Input for the end date for the date range in the calendar
  @Input() endDate: Date;

  // If end date is changed, this event emitter emits an event
  @Output() endDateChange = new EventEmitter<any>();

  // Default number of days to display from the start date
  @Input() numberOfDays: number = 90;

  // Allows for the passing in of a class name to be used for styling
  @Input('button-style') buttonStyleClass: string = "button"


  // A variable to store the currently dragged event
  private currentDraggedEvent: CalendarEvent;
  // A variable to store the date from where the dragged event originated 
  private currentDraggedEventOriginalDate: Date;


  // The default width for a date cell
  width: number = 14.161;


  // Event emitter for when a calendar event is moved in the calendar
  @Output() eventMoved = new EventEmitter();

  // If an event occurs 
  @Output() eventAction = new EventEmitter();


  // True will show weekends on the calendar, false will hide
  @Input() showWeekends: boolean = true;

  // The events to be rendered on the calendar, if outside range they will still be sorted, but not displayed
  @Input() events: CalendarEvent[] = [];

  // String to store the query summary for the calendar 
  @Input() querySummary: string = "";
  days: any = {};

  // variable for storing events mapped to dates
  private mappedEvents: Object = {};


  dates: any[];
  currentlySelectedEventId: string;

  constructor() {
    this.startDate = new Date();
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate = new Date();
    this.endDate.setHours(0, 0, 0, 0);
  }


  //Function to call on event drag start-
  setCurrentDragged(event: CalendarEvent) {

    //Stroing the original event
    this.currentDraggedEvent = event;
    this.currentlySelectedEventId = event.id;
    //Storing the orignal date for the event
    this.currentDraggedEventOriginalDate = event.startDate;
  }

  private mapEventsToDates() {

    //Clearing the current mappedEvents object
    this.mappedEvents = {};

    //Sorting the events by start time
    if (this.events !== null) {
      this.events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());


      //Looping through all the events
      this.events.forEach(event => {
        //Formatting the start date for the event to use as a key
        var formattedDate = this.getFormattedDate(event.startDate);

        //Using the key to get all events for that day
        var events = this.mappedEvents[formattedDate];

        //If no events already exist for that day
        if (events === null || events === undefined) {

          //Creating an empty array for events for specified date
          this.mappedEvents[formattedDate] = [];
        }

        //Adding event to that day
        this.mappedEvents[formattedDate].push(event);
      })
    }
  }


  setDates(): any[] {

    // Variable to store a list of all the processed days
    var dayArray = [];

    // Calling a function to map all events passed into the calendar to dates
    this.mapEventsToDates();

    // Ensuring that the start date is indeed a date object
    var start = new Date(this.startDate);

    // Ensuring that the end date is indeed a date object
    var end = new Date(this.endDate);

    // Setting the hours to zero for the start and end date
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Setting the count for the number of days
    this.numberOfDays = CalendarUtil.getDistanceBetweenTwoDates(start, end) + 1;


    // Formatting todays date (marked in yellow on the calendar)
    var formattedToday = this.getFormattedDate(new Date());

    // Gets all the weeks from the start date to the end date in the calendar
    CalendarUtil.getWeeksInRange(new Date(this.startDate), new Date(this.endDate), this.showWeekends).map(week => {

      // Looping through each week
      week.forEach(day => {

        // Formatting the day (string used for mapping)
        var date = this.getFormattedDate(day);

        // If the date has not before been processed, create a new date info object
        if (this.days[date] === null || this.days[date] === undefined) {
          this.days[date] = new DateInfo(day, []);
        }


        // If the date is todays date
        if (formattedToday === date) {
          // Set today flag to true
          this.days[date].isToday = true;

          // Set the outside range flag to fales 
          this.days[date].outsideRange = false;
        } else if (day.valueOf() < start.valueOf() || day.valueOf() > end.valueOf()) {

          // If the date is outside of the selected start and end date range, set outside range to true
          this.days[date].outsideRange = true;

        } else {
          this.days[date].highlight = false;
          this.days[date].outsideRange = false;
        }

        this.days[date].events = this.mappedEvents[date] || [];
        dayArray.push(this.days[date]);
      })
    });

    return dayArray;
  }

  /**
   * function that formats a given date
   * @param date A date object to be formatted
   */
  private getFormattedDate(date: Date) {
    try {

      // Using default date format to format the date
      return moment(date).format(CalendarUtil.DATE_FORMAT);
    } catch (error) {
      console.error("Unable to parse date: %s", date)
      return null;
    }

  }

  onEventAction(event) {
    this.eventAction.emit(event);
  }


  /**
   * Function for toggling on and of the showing of weekends
   */
  toggleShowWeekends() {
    this.showWeekends = !this.showWeekends;
    this.dates = this.setDates()
    this.setDateWidth();
  }


  /**
   * Function used for a long range view, displays all the days in the calendar from today to x number of days
   * @param numOfDays number of days to display 
   */
  startFromToday(numOfDays) {
    this.startDate = new Date();
    this.startDateChange.emit(this.startDate);

    this.endDate = CalendarUtil.getDateFromBaseDate(new Date(this.startDate), numOfDays);
    this.endDateChange.emit(this.endDateChange);

    this.days = this.setDates();
  }

  /**
   * Init function 
   */
  ngOnInit() {
    this.setDateWidth();
  }

  /**
   * Function to set the width of a cell
   */
  setDateWidth() {
    this.width = this.showWeekends ? 1 / 7 * 100 : 1 / 5 * 100;
  }

  /**
   * Function to allow for the dragging of an event
   */
  onEventDrag(day, event) {
    event.preventDefault();
    this.moveEvent(this.currentDraggedEvent.startDate, day.date, this.currentDraggedEvent);

  }


  onEventSelect(event, day?) {
    if (this.currentlySelectedEventId === event.id) {
      this.onEventDrop(event);
    } else {
      this.currentlySelectedEventId = event.id;
      this.currentDraggedEvent = event;
      this.currentDraggedEventOriginalDate = event.startDate;
    }
  }



  /**
   * Function for moving an event to a neighboring day
   */
  moveToNextDay() {
    if (this.currentDraggedEvent !== undefined && this.currentDraggedEvent !== null) {
      var currentDay = new Date(this.currentDraggedEvent.startDate);
      var nextDay = CalendarUtil.getNextDate(currentDay);
      this.moveEvent(currentDay, nextDay, this.currentDraggedEvent);
      document.getElementById(this.currentlySelectedEventId + "-selector").focus();
    }

  }


  /**
   * @todo Refine dragging function - currently inefficient and it makes me unhappy.
   */
  private moveEvent(oldDate, newDate, event) {
    var formattedOldDate = this.getFormattedDate(oldDate);
    var formattedNewDate = this.getFormattedDate(newDate);

    if (formattedOldDate !== formattedNewDate) {
      if (this.currentlySelectedEventId !== undefined) {
        event.startDate = new Date(newDate);

        event.startDate.setHours(oldDate.getHours(), oldDate.getMinutes(), oldDate.getSeconds())


        var index = -1;

        for (var i = 0; i < this.mappedEvents[formattedOldDate].length; i++) {
          var item = this.mappedEvents[formattedOldDate][i];
          if (item.id === event.id) {
            index = i;
            break;
          }
        }
        this.mappedEvents[formattedOldDate].splice(index, 1);
        if (this.mappedEvents[formattedNewDate] === undefined) {
          this.mappedEvents[formattedNewDate] = [];
        }
        this.mappedEvents[formattedNewDate].push(event);

        this.days[formattedNewDate].events = this.mappedEvents[formattedNewDate];

      }
    }

  }

  allowDrop(day, event) {
    if (!day.outsideRange) {
      event.preventDefault();
    }
  }

  onEventDrop(event) {

    // Formatting the from date (the original date)
    var fromDate = this.getFormattedDate(this.currentDraggedEventOriginalDate);

    // Formatting the end date (the new date)
    var toDate = this.getFormattedDate(this.currentDraggedEvent.startDate);

    // If NOT dropping on the same date 
    if (fromDate !== toDate) {

      // Emitting to parent element that an item has been moved
      this.eventMoved.emit({
        fromDate: this.currentDraggedEventOriginalDate,
        toDate: this.currentDraggedEvent.startDate,
        event: this.currentDraggedEvent
      })


      // Resetting the drag
      this.clearDragItems();

    }

  }

  //Function to clear the currently selected item for dragging
  private clearDragItems() {

    //Clearing the stored original item date
    this.currentDraggedEventOriginalDate = undefined;

    //Clearing the currently selected event
    this.currentDraggedEvent = undefined;
  }


  onMouseLeaveCalendar() {
    //If  drag is currently in progress
    if (this.currentDraggedEventOriginalDate !== undefined) {

      //If event is dropped outside of calendar, resets to original date
      this.moveEvent(this.currentDraggedEvent.startDate, this.currentDraggedEventOriginalDate, this.currentDraggedEvent);
      this.clearDragItems();
    }
  }
}





export class DateInfo {
  date: Date;
  events: CalendarEvent[];

  constructor(date, events) {
    this.date = date;
    this.events = events || [];
  }

}