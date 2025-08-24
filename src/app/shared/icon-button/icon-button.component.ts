import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent implements OnInit {
  @Input() icon: string = 'arrow_back';
  @Output() clickAction = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  handleOnClick() {
    this.clickAction.emit();
  }

}
