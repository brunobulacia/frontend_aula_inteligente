import { TestBed } from '@angular/core/testing';

import { HorarioDiasService } from './horario-dias.service';

describe('HorarioDiasService', () => {
  let service: HorarioDiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioDiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
