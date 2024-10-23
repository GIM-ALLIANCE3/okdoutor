import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';

@Component({
  selector: 'app-relatorio-agendamentos',
  templateUrl: './relatorio-agendamentos.component.html',
  styleUrls: ['./relatorio-agendamentos.component.scss']
})
export class RelatorioAgendamentosComponent implements OnInit {
  agendamentos: any = [];
  filteredAgendamentos: any[] = [];
  public de: any;
  public ate: any;
  constructor(private najaService: NajaService, private loading: LoadingService) { }

  ngOnInit(): void {
    this.getAllAgendamentos();
  }

  getAllAgendamentos() {
    this.loading.show();
    this.najaService.getAllAgendamentos()
      .subscribe({
        next: (dados: any) => {
          this.loading.hide();
          let data = dados.filter((agendamento: any) => agendamento.status === 2);
          data = data.sort((a: any, b: any) => {
            return b.createdAt._seconds - a.createdAt._seconds;
          });
          this.agendamentos = data;
          this.filteredAgendamentos = [];
          for (const iterator of this.filteredAgendamentos) {
            iterator.dataAgendada = new Date(iterator.createdAt._seconds * 1000).toLocaleDateString('pt-BR');
          }
          this.filteredAgendamentos = this.filteredAgendamentos.sort((a: any, b: any) => {
            return b.createdAt._seconds - a.createdAt._seconds;
          });
          console.log(data);
        },
        error: (error) => {
          this.loading.hide();
          console.log("🚀 ~ file: meus-agendamentos.component.ts:40 ~ MeusAgendamentosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  formatData(data: { _seconds: number, _nanoseconds: number }) {
    return new Date(data._seconds * 1000).toLocaleDateString('pt-BR');
  }

  filterData2(field: string, value: string) {
    if (value.trim() === '') {
      this.filteredAgendamentos = this.agendamentos;
      return;
    }

    this.filteredAgendamentos = this.agendamentos.filter((agendamento: any) => {
      const fieldValue = field === 'clinica' ? agendamento.dados.clinica.name : agendamento.dados[field];
      return fieldValue.toLowerCase().includes(value.toLowerCase());
    });
  }

  clearFilter() {
    this.filteredAgendamentos = [...this.agendamentos];
    this.de = '';
    this.ate = '';
  }

  filterData() {
    console.log(this.de, this.ate);
    const splitedDe = this.de.split('-');
    const splitedAte = this.ate.split('-');
    const de = new Date(`${splitedDe[1]}/${splitedDe[2]}/${splitedDe[0]}`).setHours(0, 0, 0, 0);
    const ate = new Date(`${splitedAte[1]}/${splitedAte[2]}/${splitedAte[0]}`).setHours(23, 59, 59, 999);
    console.log(de, ate);
    this.filteredAgendamentos = this.agendamentos.filter((agendamento: any) => {
      const createdAtDate = new Date(agendamento.createdAt._seconds * 1000).setHours(0, 0, 0, 0);
      return (!de || createdAtDate >= de) && (!ate || createdAtDate <= ate);
    });
  }
}
