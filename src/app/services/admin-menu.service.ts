import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {

  menuItems = [
    {
      name: 'Mis eventos',
      route: '/panel'
    }
  ];
  constructor() { }

}
