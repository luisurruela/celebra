/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminMenuService } from './admin-menu.service';

describe('Service: AdminMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminMenuService]
    });
  });

  it('should ...', inject([AdminMenuService], (service: AdminMenuService) => {
    expect(service).toBeTruthy();
  }));
});
