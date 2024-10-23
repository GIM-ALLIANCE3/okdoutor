import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAgendamentoComponent } from './pre-agendamento.component';

describe('PreAgendamentoComponent', () => {
  let component: PreAgendamentoComponent;
  let fixture: ComponentFixture<PreAgendamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreAgendamentoComponent]
    });
    fixture = TestBed.createComponent(PreAgendamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
