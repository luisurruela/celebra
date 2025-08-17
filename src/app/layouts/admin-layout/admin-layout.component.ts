import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminMenuService } from '../../services/admin-menu.service';
import { MenuItem } from './types/menu-item';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, AdminHeaderComponent, AdminSidebarComponent, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  showSidebar = true;
  menuItems: MenuItem[] = [];

  constructor(private adminMenuService: AdminMenuService) { }

  ngOnInit() {
    this.menuItems = this.adminMenuService.menuItems;
  }
}
