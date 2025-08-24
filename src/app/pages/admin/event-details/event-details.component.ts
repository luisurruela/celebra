import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';

import { GuestsTableComponent } from './components/guests-table/guests-table.component';
import { EventService } from '../../../services/event.service';
import { GuestService } from '../../../services/guest.service';
import { Event, Guest } from '../../../types/event';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, GuestsTableComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventId: string | null = null;
  event$!: Observable<Event | null | undefined>;
  guests$!: Observable<Guest[]>;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private guestService: GuestService
  ) { }

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.eventId = params.get('id');
        if (this.eventId) {
          this.guests$ = this.guestService.list(this.eventId);
          return from(this.eventService.getEventById(this.eventId));
        } else {
          return of(undefined);
        }
      })
    );
  }

  goBack() {
    window.history.back();
  }
  
}
