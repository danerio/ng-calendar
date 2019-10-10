/**
 * @author Danella Olsen
 * A component to display a single calendar event
 */

import { DynamicComponentInsertionDirective } from './../directives/dynamic-component-insertion.directive';
import { Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { ViewChild } from '@angular/core';
import { CalendarEvent, EventComponent } from 'src/app/calendar/calendar-event/CalendarEvent';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.css']
})
export class CalendarEventComponent implements OnInit {

  // A calendar event object to be rendered
  @Input() event: CalendarEvent;

  // Output emitter for when an action is triggered within the generated event component
  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  // Referencing the dynamicComponentInsertion directive from the template
  @ViewChild(DynamicComponentInsertionDirective) eventHost: DynamicComponentInsertionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    // Generating the event on init 
    this.loadEventData();
  }

  /**
   * Function to generate the event component and load it with the event data
   */
  loadEventData() {

    // Verifying that the event has a component prior to use
    if (this.event.component !== null && this.event.component !== undefined) {


      // Passing the custom component into the component factory
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.event.component);
      let viewContainerRef = this.eventHost.viewContainerRef;

      // Clearing the view container
      viewContainerRef.clear();

      //  Creating our component
      let componentRef = viewContainerRef.createComponent(componentFactory);

      // Setting the data property of the generated component to the current event
      (<EventComponent>componentRef.instance).data = this.event;

      // Subscribing to the dynamically generated components dataChannelToParent Observable
      (<EventComponent>componentRef.instance).dataChannelToParent.subscribe(data => {
        this.onAction.emit(data);
      });

    } else { // If event does not have a component type defined
      console.warn("Unable to display event as no component type was provided.");
    }
  }
}
