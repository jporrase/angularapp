import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FertilizantesComponent } from './fertilizantes.component';

describe('FertilizantesComponent', () => {
  let component: FertilizantesComponent;
  let fixture: ComponentFixture<FertilizantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FertilizantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FertilizantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
