import { RouterLink } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ClickOutsideDirective } from '../../../../directives/click-outside.directive';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  imports: [ClickOutsideDirective, RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  showAccountMenu = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  handleToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout();
  }
}
