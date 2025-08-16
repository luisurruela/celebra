import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  handleToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
