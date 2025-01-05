import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDeVisitasComponent } from './control-de-visitas.component';

describe('ControlDeVisitasComponent', () => {
  let component: ControlDeVisitasComponent;
  let fixture: ComponentFixture<ControlDeVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlDeVisitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlDeVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
