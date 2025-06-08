import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioDiaComponent } from './horario-dia.component';

describe('HorarioDiaComponent', () => {
  let component: HorarioDiaComponent;
  let fixture: ComponentFixture<HorarioDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
