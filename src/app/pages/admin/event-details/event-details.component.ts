import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';

import { EventService } from '../../../services/event.service';
import { Event } from '../../../types/event';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event$!: Observable<Event | null | undefined>;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.event$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          return from(this.eventService.getEventById(id));
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
