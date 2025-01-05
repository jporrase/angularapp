import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitosanitariosComponent } from './fitosanitarios.component';

describe('FitosanitariosComponent', () => {
  let component: FitosanitariosComponent;
  let fixture: ComponentFixture<FitosanitariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitosanitariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitosanitariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
