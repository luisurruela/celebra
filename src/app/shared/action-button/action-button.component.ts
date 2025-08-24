import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-action-button',
  imports: [CommonModule],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css'],
})
export class ActionButtonComponent implements OnInit {
  @Input() actionType: string = 'edit';
  @Input() color: string = 'blue';
  @Input() disabled: boolean = false;

  @Output() clickAction = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  handleOnClick() {
    if (this.disabled) {
      return;
    }
    this.clickAction.emit();
  }

}
