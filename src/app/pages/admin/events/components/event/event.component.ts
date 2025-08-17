import { Component, Input, OnInit } from '@angular/core';

import { ClickOutsideDirective } from '../../../../../directives/click-outside.directive';
import { EventService } from '../../../../../services/event.service';
import { Event } from '../../../../../types/event';

@Component({
  selector: 'app-event',
  imports: [ClickOutsideDirective],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input() event!: Event;

  isMenuOpen = false;

  constructor(private eventService: EventService) { }

  ngOnInit() {
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  deleteEvent() {
    if (this.event.id) {
      this.eventService.deleteEvent(this.event.id);
    }
  }

}
