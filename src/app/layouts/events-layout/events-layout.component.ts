import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-layout',
  imports: [RouterOutlet],
  templateUrl: './events-layout.component.html',
  styleUrls: ['./events-layout.component.css']
})
export class EventsLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
