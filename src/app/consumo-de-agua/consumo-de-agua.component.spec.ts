import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoDeAguaComponent } from './consumo-de-agua.component';

describe('ConsumoDeAguaComponent', () => {
  let component: ConsumoDeAguaComponent;
  let fixture: ComponentFixture<ConsumoDeAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoDeAguaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoDeAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
