import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ActionButtonComponent } from '../../../../../shared/action-button/action-button.component';
import { ClickOutsideDirective } from "../../../../../directives/click-outside.directive";
import { ButtonComponent } from '../../../../../shared/button/button.component';
import { GuestService } from '../../../../../services/guest.service';
import { Event as EventElement, Guest, GuestStatus } from '../../../../../types/event';

@Component({
  selector: 'app-guests-table',
  imports: [ActionButtonComponent, ButtonComponent, CommonModule, ReactiveFormsModule, ClickOutsideDirective],
  templateUrl: './guests-table.component.html',
  styleUrls: ['./guests-table.component.css']
})
export class GuestsTableComponent implements OnInit {
  @Input() guests$!: Observable<Guest[]>;
  @Input() event!: EventElement;

  isEditing = false;
  guestStatus = GuestStatus;
  currentGuest: Guest | null = null;
  menuOpenFor: string | null = null;

  guestForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    allowed: new FormControl(1),
    email: new FormControl(''),
    phone: new FormControl('')
  });
  
  constructor(private guestService: GuestService) { }

  ngOnInit() {
  }

  addGuest() {
    if (!this.event.id) {
      return;
    }
    this.guestService.create(this.event.id, this.guestForm.value);
    this.guestForm.reset({ allowed: 1 });
  }

  editGuest(guest: Guest) {
    this.isEditing = true;
    this.currentGuest = guest;
    this.guestForm.patchValue(guest);
  }

  deleteGuest(guestId: string) {
    if (!this.event.id) {
      return;
    }
    
    this.guestService.remove(this.event.id, guestId);
  }

  updateGuest() {
    if (!this.event.id) {
      return;
    }
    this.guestService.update(this.event.id, this.currentGuest?.id!, this.guestForm.value);
    this.isEditing = false;
    this.guestForm.reset({ allowed: 1 });
  }

  submit() {
    if (this.isEditing) {
      this.updateGuest();
    } else {
      this.addGuest();
    }
  }

  shareGuest(guest: Guest) {
    if (!this.event.id) {
      return;
    }
    console.log(`Share link: http://localhost:4200/eventos/${this.event.slug}/${guest.slug}`);
  }

  async setStatus(guestId: string, status: GuestStatus) {
    this.menuOpenFor = null;
    
    if (!this.event.id) {
      return;
    }
    
    await this.guestService.update(this.event.id, guestId, { confirmed: status });
  }

  toggleMenu(guestId: string, event: Event) {
    event.stopPropagation();
    
    if (this.menuOpenFor === guestId) {
      this.menuOpenFor = null;
    } else {
      this.menuOpenFor = null;
      Promise.resolve().then(() => {
        this.menuOpenFor = guestId;
      });
    }
  }

}
