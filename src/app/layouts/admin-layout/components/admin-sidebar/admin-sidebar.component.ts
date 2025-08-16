import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  @Input() showSidebar = true;
  @Input() menuItems: any[] = [];
  
  isMobile = false;
  constructor() { }

  ngOnInit() {
    this.checkScreenWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }
  }

}
