import { Component, Input, OnInit } from '@angular/core';

import { Event } from '../../../../../types/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() event!: Event;

  constructor() { }

  ngOnInit() {
  }

}
