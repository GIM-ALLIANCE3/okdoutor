import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirmar-agendamento',
  templateUrl: './confirmar-agendamento.component.html',
  styleUrls: ['./confirmar-agendamento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmarAgendamentoComponent implements OnInit {

  constructor(private router: Router, public loading: LoadingService, private najaService: NajaService, private authService: AuthService, private confirmationService: ConfirmationService) {
    this.dataFormatada.setDate(this.dataFormatada.getDate() + 1);
    this.dados.horario.dataFormatada = this.dataFormatada.toLocaleDateString('pt-BR');
  }

  visible = false;
  step = 0;
  horario = JSON.parse(localStorage.getItem('horario') || '{}');
  dataFormatada = new Date(this.horario.dataAgenda);
  assinatura: boolean = false;
  user: any = JSON.parse(sessionStorage.getItem('user') || '{}');

  dados: any = {
    horario: {
      ...JSON.parse(localStorage.getItem('horario') || '{}'),
      dataFormatada: new Date(JSON.parse(localStorage.getItem('horario') || '{}').dataAgenda).toLocaleDateString('pt-BR')
    },
    medico: JSON.parse(localStorage.getItem('medico') || '{}'),
    procedimento: JSON.parse(localStorage.getItem('object') || '{}'),
    data: JSON.parse(localStorage.getItem('data') || '{}'),
    clinica: JSON.parse(localStorage.getItem('clinica') || '{}')
  }

  ngOnInit(): void {
    this.getSubscriptionStatus();
    if (this.dados && this.dados.clinica) {
      this.dados.clinica.address = this.dados.clinica.name === "AV. CAXANGÁ"
        ? "Av. Caxangá, 2351 - Cordeiro, Recife - PE, 50721-000"
        : "Av. Recife, 712 - Areias, Recife - PE, 50110-727"
    }
  }

  async getSubscriptionStatus() {
    this.assinatura = await this.authService.getAssinatura().pipe().toPromise();
  }

  changeRoute(route: string) {
    this.router.navigate([route]);
  }

  edit() {
    const medico = JSON.parse(localStorage.getItem('medico') || '{}');
    localStorage.removeItem('clinica');
    localStorage.removeItem('data');
    localStorage.removeItem('horario');
    localStorage.removeItem('medico');
    if (localStorage.getItem('medicStep') == 'true') {
      localStorage.setItem('medico', (medico.crm) as string);
    }
    this.router.navigate(['/pre-agendamento']);
  }

  confirm(event: Event) {
    this.loading.show();
    this.authService.getAssinatura()
      .subscribe({
        next: (data) => {
          this.loading.hide();
          this.assinatura = data;
          if (this.assinatura) {
            this.router.navigate(['/pagamento']);
            return;
          }
          this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Não encontramos uma assinatura ativa em sua conta, deseja assinar agora?',
            header: 'Assinatura Cartão tudook',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "none",
            rejectIcon: "none",
            acceptLabel: "Sim",
            rejectLabel: "Não",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
              window.open(`https://${environment.okDoutorWeb}/planos/assinaturas`, '_blank');
            },
            reject: () => {
              this.changeRoute('/pagamento');
            }
          });
        },
        error: (error) => {
          this.loading.notify('Erro!', 'Erro ao realizar pagamento, dados do cartão inválidos!');
          this.loading.hide();
          console.log("🚀 ~ file: meus-agendamentos.component.ts:40 ~ MeusAgendamentosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  createAgendamento() {
    this.dados.object = { ...JSON.parse(localStorage.getItem('object') || '{}'), medico: this.dados.medico, clinica: this.dados.clinica, horario: this.dados.horario };
    localStorage.setItem('object', JSON.stringify(this.dados.object));
    this.loading.show();
    const data = JSON.parse(localStorage.getItem('data') || '{}');
    this.najaService.createAgendamento({
      dados: data,
      procedimento: this.dados.procedimento,
      medico: this.dados.medico,
      data: this.dados.data,
      clinica: this.dados.clinica,
      horario: this.dados.horario,
      object: this.dados.object
    }).subscribe((res: any) => {
      const object = JSON.parse(localStorage.getItem('object') || '{}');
      object.id = res.id;
      localStorage.setItem('object', JSON.stringify(object));

      this.loading.hide();
      this.step = 1;
    }, (err: any) => {
      this.loading.hide();
    });
  }

  calcularDesconto(valorOriginal: number, valorComDesconto: number): string {
    if (valorOriginal <= 0) {
      return "Valor original deve ser maior que zero.";
    }

    if (valorComDesconto > valorOriginal) {
      return "Valor com desconto não pode ser maior que o valor original.";
    }

    let desconto = ((valorOriginal - valorComDesconto) / valorOriginal) * 100;
    return desconto.toFixed(0) + "%";
  }
}
