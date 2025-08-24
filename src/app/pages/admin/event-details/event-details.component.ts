import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';
import { GuestsTableComponent } from './components/guests-table/guests-table.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';
import { EventService } from '../../../services/event.service';
import { GuestService } from '../../../services/guest.service';
import { Event, Guest, GuestStatus } from '../../../types/event';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GuestsTableComponent, RsvpComponent, IconButtonComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventId: string | null = null;
  event$!: Observable<Event | null | undefined>;
  guests$!: Observable<Guest[]>;
  guestStatus = GuestStatus;

  confirmedGuests$!: Observable<number>;
  pendingGuests$!: Observable<number>;
  declinedGuests$!: Observable<number>;
  totalGuests$!: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private guestService: GuestService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.eventId = params.get('id');
        if (this.eventId) {
          this.guests$ = this.guestService.list(this.eventId);

          this.confirmedGuests$ = this.guests$.pipe(
            map(guests => guests.filter(g => g.confirmed === this.guestStatus.Confirmed).length)
          );

          this.pendingGuests$ = this.guests$.pipe(
            map(guests => guests.filter(g => g.confirmed === this.guestStatus.Pending).length)
          );
          
          this.declinedGuests$ = this.guests$.pipe(
            map(guests => guests.filter(g => g.confirmed === this.guestStatus.Declined).length)
          );

          this.totalGuests$ = this.guests$.pipe(
            map(guests => 
              guests
                .filter(g => g.confirmed === this.guestStatus.Confirmed)
                .reduce((acc, g) => acc + (g.allowed ?? 1), 0)
            )
          );

          return from(this.eventService.getEventById(this.eventId));
        } else {
          return of(undefined);
        }
      })
    );
  }

  goBack() {
   this.location.back();
  }

  editEvent(id: string) {
    this.router.navigate(['/panel/editar-evento', id]);
  }
  
}
