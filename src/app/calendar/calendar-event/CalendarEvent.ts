import { Type } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { DefaultCalendarEventComponent } from "../default-calendar-event/default-calendar-event.component";

export class CalendarEvent {

    /** 
     * Persistent event ID counter to allow for the generation of dynamic custom ID's (for accessibility sake)
     */
    static eventIdCount: number = 0;

    /** 
     * Appends to the event counter Ids
     */
    static eventIdText: string = "-event";

    /**
     * Unique identifier for the the event
     */
    id: string;

    /**
     * The title for the specific event
     */
    title: string;

    /**
     * The start date for the event
     */
    startDate: Date;

    /**
     * The End date for the event 
     * (used for the purpose of multi-day events)
     */
    endDate: Date;

    /**
     * Any custiom data to be passed into the event
     */
    data: any;

    /**
     * Should the tile be draggable or not
     */
    draggable: boolean = true;

    /**
     * The component to render for this specific event
     */
    component: Type<any> = DefaultCalendarEventComponent;

    /**
     * 
     * @param title The title for the event
     * @param startDate start Date for the event
     * @param endDate end date for the event
     * @param data Any additional metadata
     * @param options Optional parameters (draggable: boolean, id: string, component: any (Angular Component))
     */

    constructor(title, startDate, endDate, data: any, options?: { draggable?: boolean, id?: string, component?: Type<any> }) {

        this.title = title;

        this.startDate = startDate;
        this.endDate = endDate;
        this.data = data;


        // If options not empty populate 
        if (options !== undefined && options !== null) {
            this.component = options.component || this.component;
            this.draggable = options.draggable === undefined ? this.draggable : options.draggable;
            if (options.id !== null && options.id !== undefined) {
                this.id = options.id;
            } else {
                this.id = this.getNextID();
            }
        } else {
            this.id = this.getNextID();
        }
    }

    /**
     * Returns a unique identifier for the calendar event
     */
    private getNextID() {

        return CalendarEvent.eventIdCount++ + CalendarEvent.eventIdText;
    }
}

/*
    Interface to Implement on any event component
*/

export interface EventComponent {

    //Data to pass into component template
    data: any;


    /*
        ======= Example Implementation =========
        dataChannelToParent: Subject<any> = new Subject();

        sendDataToParent(event) {
            this.dataChannelToParent.next(event);
        }

    */

    //A Subject that is used to send data to the parent
    dataChannelToParent: Subject<any>;

    //Function for sending data to the parent
    sendDataToParent: Function;


}
