import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HigieneInstalacionesComponent } from './higiene-instalaciones.component';

describe('HigieneInstalacionesComponent', () => {
  let component: HigieneInstalacionesComponent;
  let fixture: ComponentFixture<HigieneInstalacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HigieneInstalacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HigieneInstalacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
