import { Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Event } from '../../../../../types/event';

@Component({
  selector: 'app-event-information',
  imports: [DatePipe],
  templateUrl: './event-information.component.html',
  styleUrls: ['./event-information.component.css']
})
export class EventInformationComponent implements OnInit {
  @Input() event!: Event;
  
  constructor() { }

  ngOnInit() {
  }

  getEventDate(event: Event): Date {
    if ((event.fecha as any)?.toDate) {
      return (event.fecha as any).toDate();
    }
    return new Date(event.fecha);
  }

}
