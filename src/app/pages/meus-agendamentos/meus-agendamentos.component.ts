import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meus-agendamentos',
  templateUrl: './meus-agendamentos.component.html',
  styleUrls: ['./meus-agendamentos.component.scss']
})
export class MeusAgendamentosComponent implements OnInit {

  constructor(private najaService: NajaService, private loading: LoadingService, private route: Router, private authService: AuthService, private router: Router, private confirmationService: ConfirmationService) { }
  agendamentos: any = [];
  assinatura: boolean = false;
  selected: any;
  ngOnInit(): void {
    if (sessionStorage.getItem('user') == null) {
      this.route.navigateByUrl('/login');
      return;
    }
    this.getAgendamentos();
  }

  getAgendamentos() {
    this.loading.show();
    this.najaService.getAgendamentos()
      .subscribe({
        next: (data) => {
          this.agendamentos = data;
          this.getAssinatura();
        },
        error: (error) => {
          this.loading.hide();
          console.log("🚀 ~ file: meus-agendamentos.component.ts:40 ~ MeusAgendamentosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  getAssinatura() {
    this.loading.show();
    this.authService.getAssinatura()
      .subscribe({
        next: (data) => {
          this.loading.hide();
          this.assinatura = data;
          console.log(data);
        },
        error: (error) => {
          this.loading.hide();
          console.log("🚀 ~ file: meus-agendamentos.component.ts:40 ~ MeusAgendamentosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  goToAssinaturaUrl(){
    window.open(`https://${environment.okDoutorWeb}/planos/assinaturas`, '_blank');
  }

  getStatus(status: number) {
    switch (status) {
      case 0:
        return 'Agendado';
      case 1:
        return 'Agendado';
      case 2:
        return 'Pago';
      case 3:
        return 'Cancelado';
      default:
        return 'Aguardando Pagamento';
    }
  }

  select(agendamento: any) {
    localStorage.setItem('object', JSON.stringify({ ...agendamento.dados.object, id: agendamento.id }));
    this.router.navigateByUrl('/pagamento');
  }

  confirm(event: Event,  selected: any) {
    this.loading.show();
    this.authService.getAssinatura()
      .subscribe({
        next: (data) => {
          this.loading.hide();
          this.assinatura = data;
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
              this.select(selected);
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
}
