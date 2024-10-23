import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioAgendamentosComponent } from './relatorio-agendamentos.component';

describe('RelatorioAgendamentosComponent', () => {
  let component: RelatorioAgendamentosComponent;
  let fixture: ComponentFixture<RelatorioAgendamentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioAgendamentosComponent]
    });
    fixture = TestBed.createComponent(RelatorioAgendamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
