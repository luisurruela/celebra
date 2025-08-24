import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ActionButtonComponent } from '../../../../../shared/action-button/action-button.component';
import { ClickOutsideDirective } from "../../../../../directives/click-outside.directive";
import { ButtonComponent } from '../../../../../shared/button/button.component';
import { GuestService } from '../../../../../services/guest.service';
import { Guest, GuestStatus } from '../../../../../types/event';

@Component({
  selector: 'app-guests-table',
  imports: [ActionButtonComponent, ButtonComponent, CommonModule, ReactiveFormsModule, ClickOutsideDirective],
  templateUrl: './guests-table.component.html',
  styleUrls: ['./guests-table.component.css']
})
export class GuestsTableComponent implements OnInit {
  @Input() guests$!: Observable<Guest[]>;
  @Input() eventId: string | null = null;

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
    if (!this.eventId) {
      return;
    }
    this.guestService.create(this.eventId, this.guestForm.value);
    this.guestForm.reset({ allowed: 1 });
  }

  editGuest(guest: Guest) {
    this.isEditing = true;
    this.currentGuest = guest;
    this.guestForm.patchValue(guest);
  }


  deleteGuest(guestId: string) {
    if (!this.eventId) {
      return;
    }
    
    this.guestService.remove(this.eventId, guestId);
  }

  updateGuest() {
    if (!this.eventId) {
      return;
    }
    this.guestService.update(this.eventId, this.currentGuest?.id!, this.guestForm.value);
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

  shareGuest(guestId: string) {
    if (!this.eventId) {
      return;
    }
    console.log(`Sharing guest ${guestId} for event ${this.eventId}`);
  }

  async setStatus(guestId: string, status: GuestStatus) {
    this.menuOpenFor = null;
    
    if (!this.eventId) {
      return;
    }
    const save = await this.guestService.update(this.eventId, guestId, { confirmed: status });
    console.log('Status updated', save);
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
