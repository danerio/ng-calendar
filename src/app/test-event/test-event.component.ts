import { EventComponent } from 'src/app/calendar/calendar-event/CalendarEvent';
import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-test-event',
  templateUrl: './test-event.component.html',
  styleUrls: ['./test-event.component.css']
})
export class TestEventComponent implements EventComponent, OnInit {
  data: any;
  background: string;
  randomText: string;

  dataChannelToParent: Subject<any> = new Subject();

  sendDataToParent(event) {
    this.dataChannelToParent.next(event);
  }


  constructor() {
    this.background = colors[Math.floor(Math.random() * colors.length)];
    this.randomText = text[Math.floor(Math.random() * text.length)];
  }

  ngOnInit() {
  }




}

export var text = [
  "This is a short sentence."
]
export var colors = [
 "Gold", 
 "Purple",
 "Grey",
 "Limegreen"
]