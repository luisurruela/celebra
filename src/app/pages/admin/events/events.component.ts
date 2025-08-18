import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { EventComponent } from './components/event/event.component';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../types/event';

@Component({
  selector: 'app-events',
  imports: [CommonModule, EventComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events$!: Observable<Event[]>;
  activeMenuId: string | null = null;
  
  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.events$ = this.eventService.getEvents();
  }

  toggleMenu(eventId: string) {
    this.activeMenuId = this.activeMenuId === eventId ? null : eventId;
  }

  deleteEvent(eventId: string) {
    this.eventService.deleteEvent(eventId);
  }

}
