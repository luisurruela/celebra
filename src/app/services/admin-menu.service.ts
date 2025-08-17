import { Injectable } from '@angular/core';

import { MenuItem } from '../layouts/admin-layout/types/menu-item';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {

  menuItems: MenuItem[] = [
    {
      name: 'Mis eventos',
      route: '/panel',
      icon: 'event'
    }
  ];
  
  constructor() { }

}
