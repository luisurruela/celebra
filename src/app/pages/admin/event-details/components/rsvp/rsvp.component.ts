import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rsvp',
  imports: [CommonModule],
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {
  @Input() confirmedGuests!: Observable<number>;
  @Input() pendingGuests!: Observable<number>;
  @Input() declinedGuests!: Observable<number>;
  @Input() totalGuests!: Observable<number>;

  constructor() { }

  ngOnInit() {
  }

}
