import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Output() clickAction = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  handleOnClick() {
    this.clickAction.emit();
  }

}
