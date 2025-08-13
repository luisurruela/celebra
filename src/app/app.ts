import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet]
})
export class App {
  protected readonly title = signal('Celebra');
}
