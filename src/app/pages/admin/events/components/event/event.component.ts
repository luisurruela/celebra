import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ClickOutsideDirective } from '../../../../../directives/click-outside.directive';
import { Event } from '../../../../../types/event';

@Component({
  selector: 'app-event',
  imports: [ClickOutsideDirective],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input() event!: Event;
  @Input() isMenuOpen = false;

  @Output() menuToggle = new EventEmitter<string>();
  @Output() deleteEvent = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {
  }

  onMenuToggle(): void {
    this.menuToggle.emit(this.event.id);
  }

  onDeleteEvent(): void {
    this.deleteEvent.emit(this.event.id);
  }

}
