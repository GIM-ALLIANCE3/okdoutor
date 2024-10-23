import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { LoadingService } from 'src/app/service/loading.service';
import { PaymentService } from 'src/app/service/payment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagamentoComponent implements OnInit {
  public object = JSON.parse(localStorage.getItem('object') || '{}');
  public user = JSON.parse(sessionStorage.getItem('user') || '{}');
  public valor = 0;
  public assinatura: boolean = false;

  constructor(private _fb: FormBuilder, private loading: LoadingService, private paymentService: PaymentService, private authService: AuthService, private confirmationService: ConfirmationService, private router: Router) { }

  cardForm = this._fb.group({
    CardNumber: [null, Validators.required],
    Holder: [null, Validators.required],
    ExpirationDate: [null, [Validators.required, this.cardDateValidator]],
    SecurityCode: [null, Validators.required],
    instalments: [1]
  });

  qrCodeText = "00020101021126580014br.gov.bcb.pix0136040d5d64-7f14-4238-b04a...";
  pixImage = "https://placehold.co/400"

  step = '0';
  visible = false;

  ngOnInit(): void {
    this.getAssinatura();
  }

  cardDateValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return null;
    }
    const [month, year] = value.split('/').map(Number);
    const inputDate = new Date(year, month - 1);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (inputDate.getFullYear() < currentYear || (inputDate.getFullYear() === currentYear && inputDate.getMonth() < currentMonth)) {
      control.setErrors({ cardDate: true });
      return { cardDate: true };
    }
    return null;
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

  confirm(event: Event) {
    this.loading.show();
    this.authService.getAssinatura()
      .subscribe({
        next: (data) => {
          this.loading.hide();
          this.assinatura = data;
          if (this.assinatura) {
            this.step = 'cartão';
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
              this.step = 'cartão';
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

  getInstalmentsValue(instalments: number, value: number) {
    const valor = this.arredondamentoFinal(value, instalments) / instalments;
    if (Number.isInteger(valor * 10)) {
      return (valor * 10 / 10).toFixed(2);
    }
    return valor.toFixed(2);
  }

  arredondamentoFinal(value: number, parcela: number): any {
    const valor = Number(value.toFixed(2));
    const valorParcela = Number((valor / parcela).toFixed(2));
    let valorCalculado = Number(valorParcela.toFixed(2)) * parcela;
    const final = Number(valorCalculado.toFixed(2));
    if (Number.isInteger(final * 10)) {
      return (valor * 10 / 10).toFixed(2);
    }
    return final;
  }

  goToMySchedules() {
    this.router.navigate(['/meus-agendamentos']);
  }

  fazerPagamento(pix?: boolean) {
    // if (pix) {
    //   this.loading.notify('Aviso!', 'Metodo Pix indisponível no momento, tente novamente mais tarde!');
    //   this.step = '0';
    //   return;
    // }
    this.loading.show();
    const data: any = {
      ...this.cardForm.value,
      installments: Number(this.cardForm.value.instalments),
      valor: this.valor,
      id: this.object.id
    }
    if (pix) {
      data.Type = "pix";
    }
    this.paymentService.makePayment(data)
      .subscribe({
        next: (result) => {
          this.loading.hide();
          if (result.status === 200) {
            if (!pix) {
              this.loading.notify('Sucesso!', 'Pagamento realizado com sucesso!', '/meus-agendamentos');
            }
            else{
              this.loading.notify('Sucesso!', 'Qrcode gerado com sucesso, porém não é possível realizar pagamentos PIX em ambiente de testes!');
              this.pixImage = `data:image/png;base64,${result.data.Payment.QrCodeBase64Image}`;
              this.qrCodeText = result.data.Payment.QrCodeString;
            }
          }
          else if (result.status === 400) {
            this.loading.notify('Erro!', 'Erro ao realizar pagamento! Agendamento já foi pago ou cancelado', '/meus-agendamentos');
          }
          else {
            if (pix) {
              this.loading.notify('Erro!', 'Erro ao realizar pagamento!');
            }
            else {
              this.loading.notify('Erro!', 'Erro ao realizar pagamento! Número do Cartão inválido!');
            }
          }
          console.log(result);
        },
        error: (error) => {
          this.loading.hide();
          if (error.error.data.Code == 126) {
            this.loading.notify('Erro!', 'Erro ao realizar pagamento! Data de validade do cartão inválida!');
            return;
          }
          this.loading.notify('Erro!', 'Erro ao realizar pagamento!');
          console.log("🚀 ~ file: pagamento.component.ts:81 ~ PagamentoComponent ~ fazerPagamento ~ error", error)
        }
      })
  }

  get PixValue() {
    let valor = this.assinatura ? this.object.proCartao.Precos[1].PrecoProduto : this.object.proOnline.Precos[1].PrecoProduto;
    return this.arredondamentoFinal(valor, 1);
  }
}
