import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicosEEspecialistasComponent } from './medicos-e-especialistas.component';

describe('MedicosEEspecialistasComponent', () => {
  let component: MedicosEEspecialistasComponent;
  let fixture: ComponentFixture<MedicosEEspecialistasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicosEEspecialistasComponent]
    });
    fixture = TestBed.createComponent(MedicosEEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
