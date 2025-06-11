import { TestBed } from '@angular/core/testing';

import { NotasAdminService } from './notas-admin.service';

describe('NotasAdminService', () => {
  let service: NotasAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
