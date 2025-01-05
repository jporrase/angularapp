import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosechaComponent } from './cosecha.component';

describe('CosechaComponent', () => {
  let component: CosechaComponent;
  let fixture: ComponentFixture<CosechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
