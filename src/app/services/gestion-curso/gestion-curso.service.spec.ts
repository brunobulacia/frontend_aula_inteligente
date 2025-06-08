import { TestBed } from '@angular/core/testing';

import { GestionCursoService } from './gestion-curso.service';

describe('GestionCursoService', () => {
  let service: GestionCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
