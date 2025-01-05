import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientoDeAguaComponent } from './tratamiento-de-agua.component';

describe('TratamientoDeAguaComponent', () => {
  let component: TratamientoDeAguaComponent;
  let fixture: ComponentFixture<TratamientoDeAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamientoDeAguaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TratamientoDeAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
