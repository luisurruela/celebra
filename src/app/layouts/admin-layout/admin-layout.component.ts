import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  showSidebar = true;
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

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

}
