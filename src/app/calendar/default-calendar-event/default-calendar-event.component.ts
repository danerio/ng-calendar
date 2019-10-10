import { Subject } from 'rxjs/internal/Subject';
import { EventComponent } from '../calendar-event/CalendarEvent';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-calendar-event',
  templateUrl: './default-calendar-event.component.html',
  styleUrls: ['./default-calendar-event.component.css']
})
export class DefaultCalendarEventComponent implements EventComponent, OnInit {
  data: any;
  dataChannelToParent: Subject<any> = new Subject();
  sendDataToParent: Function;

  constructor() { }

  ngOnInit() {
  }

}
