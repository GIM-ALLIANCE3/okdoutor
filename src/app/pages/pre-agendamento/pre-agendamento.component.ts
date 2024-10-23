import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogMessageComponent } from 'src/shared/dialog-message/dialog-message.component';


@Component({
  selector: 'app-pre-agendamento',
  templateUrl: './pre-agendamento.component.html',
  styleUrls: ['./pre-agendamento.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class PreAgendamentoComponent {
  clinicList: any = [];
  isMedic: boolean = localStorage.getItem('medico') !== undefined && localStorage.getItem('medico') !== null;
  ref!: DynamicDialogRef;
  
  selected = 0;
  empresas: any = [];
  selectedDate = 0;
  object: any = JSON.parse(localStorage.getItem('object') || '{}');
  selectedClinic = -1;
  selectedClinicData: any = undefined;
  nomeMedico = localStorage.getItem('nomeMedico') || 'Dr(a).';
  selectedHour: any = undefined;
  selectedDay: any = this.getNext30Days()[0];
  medicDays: any = [];
  procedimento: any = localStorage.getItem('procedimento') || 4367;
  visible = false;
  beforePage = localStorage.getItem('beforePage') || '/home';

  responsiveOptions = [
    {
      breakpoint: '3440px',
      numVisible: 8,
      numScroll: 1
    },
    {
      breakpoint: '2680px',
      numVisible: 6,
      numScroll: 1
    },
    {
      breakpoint: '2150px',
      numVisible: 5,
      numScroll: 1
    },
    {
      breakpoint: '1850px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 5,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 4,
      numScroll: 1
    }
  ];

  carousel = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  selectedMedic = this.clinicList[0]?.medicList[0];

  selectedEmpresa = this.empresas[0];

  medicCurriculum: any;

  medicCRM = localStorage.getItem('medico') || '';
  constructor(private router: Router, private najaService: NajaService, private loading: LoadingService, private messageService: MessageService, private dialogService: DialogService) {

  }

  async ngOnInit() {
    console.log("🚀 ~ file: pre-agendamento.component.ts:19 ~ PreAgendamentoComponent ~ constructor ~ this.isMedic:", this.isMedic)
    if (!this.isMedic) {
      this.getClinicList();
    }
    else {
      this.loading.show();
      this.getClinicListByMedic();
      this.getMedicByCRM();
    }
    this.getEmpresas();
  }

  getMedicByCRM() {
    this.najaService.getMedicoByCRM(this.medicCRM).subscribe((res: any) => {
      console.log("🚀 ~ PreAgendamentoComponent ~ this.najaService.getMedicoByCRM ~ res:", res)
      this.medicCurriculum = res;
    });
  }

  scrollDownByOne() {
    // scroll down body by 1px
    setTimeout(() => {
      window.scrollBy(0, 300);
    }, 300);
  }

  getIndexByObject(list: any, obj: any) {
    return list.findIndex((item: any) => item === obj);
  }

  filterClinic(event: any) {
    this.selectedClinicData = this.clinicList.filter((item: any) => {
      return item.nome.toLowerCase().includes(event.target.value.toLowerCase());
    });
  }

  getEmpresas() {
    this.najaService.getEmpresas().subscribe((res: any) => {
      this.empresas = [{ NomeFantasia: "Todas as clínicas", CodEmpresa: 0 }];
      this.empresas = this.empresas.concat(res.empresas);
      this.empresas = this.empresas.filter((item: any) => item.CodEmpresa < 3);
      this.selectedEmpresa = this.empresas[0];
      console.log("🚀 ~ PreAgendamentoComponent ~ this.najaService.getEmpresas ~ res:", this.empresas)
    }, (err: any) => {
    });
  }

  empresaFilter() {
    if (this.selectedEmpresa.CodEmpresa === 0) {
      this.getEmpresas();
      return;
    }
    this.loading.show();
    this.selectedClinic = 999;
    this.selectedHour = undefined;
    if (!this.isMedic) {
      const date = this.selectedDay?.monthNumber + '-' + this.selectedDay?.day + '-' + new Date().getFullYear();
      this.najaService.getAvailableHoursFromDate(this.procedimento, date).subscribe((res: any) => {
        this.clinicList = res.filter((item: any) => item.id === this.selectedEmpresa.CodEmpresa);
        this.loading.hide();
        this.loading.hide();
      }, (err: any) => {
        this.loading.hide();
      });
    }
    else {
      this.najaService.getAvailableHoursFromMedico(localStorage.getItem('procedimento') as string, localStorage.getItem('medico') as string).subscribe((res: any) => {
        this.medicDays = res;
        this.selectedDate = this.medicDays[0].id;
        this.clinicList = this.medicDays[0].clinics.filter((item: any) => item.id === this.selectedEmpresa.CodEmpresa);
        this.loading.hide();
      }, (err: any) => {
        this.loading.hide();
      });
    }
  }

  // notify2(titulo: string = "Aviso!", mensagem: string = "Código enviado para o e-mail cadastrado.", redirect?: any) {
  //   this.ref = this.dialogService.open(DialogMessageComponent, {
  //     header: titulo,
  //     width: '30%',
  //     contentStyle: {"max-height": "30%", "overflow": "auto"},
  //     baseZIndex: 10000,
  //     data: { message: mensagem },
  //     modal: true
  //   });
  // }


  changeRoute(route: string) {
    if (!sessionStorage.getItem('user')) {
      this.loading.notify("Aviso!", "Você precisa estar logado para realizar um agendamento. Faça o login ou cadastre-se.", '/login');
    }
    else {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const data = {
        "codigo_convenio": "1",
        "cpf_paciente": user.userData.cpf,
        "data_agenda": this.selectedHour.DataAgenda,
        "data_nascimento_paciente": "19850628",
        "email_paciente": user.userData.email,
        "codigo_empresa": this.selectedClinicData.id,
        "nome_paciente": user.userData.nome,
        "fone1_paciente": user.userData.clular,
        "obs_agenda": "Registro feito pelo sistema de agendamentos OK Doutor",
        "codigo_plano": 4,
        "codigo_recurso_agenda": this.selectedHour.recurso,
        "isn_horario": this.selectedHour.isn,
        // "peso_paciente": "110",
        "cod_procidimento": this.procedimento.toString(),
      }
      localStorage.setItem('data', JSON.stringify(data));
      localStorage.setItem('medico', JSON.stringify(this.selectedMedic));
      localStorage.setItem('clinica', JSON.stringify(this.selectedClinicData));
      localStorage.setItem('horario', JSON.stringify(this.selectedHour));
      this.router.navigate([route]);
    }
  }

  getClinicList() {
    this.loading.show();
    const date = this.selectedDay?.monthNumber + '-' + this.selectedDay?.day + '-' + new Date().getFullYear();
    this.najaService.getAvailableHoursFromDate(this.procedimento, date).subscribe((res: any) => {
      if (res.length === 0) {
        this.loading.notify("Aviso!", "Não há horários disponíveis para este procedimento.", this.beforePage);
        this.loading.hide();
        return;
      }
      this.clinicList = res;
      console.log("🚀 ~ PreAgendamentoComponent ~ this.najaService.getAvailableHoursFromDate ~ res:", res)
      this.loading.hide();
    }, (err: any) => {
      this.loading.hide();
    });
  }

  getClinicListByMedic() {
    this.loading.show();
    this.najaService.getAvailableHoursFromMedico(localStorage.getItem('procedimento') as string, localStorage.getItem('medico') as string).subscribe((res: any) => {
      if (res.length === 0) {
        this.loading.notify("Aviso!", "Não há horários disponíveis para este médico.", this.beforePage);
        this.loading.hide();
        return;
      }
      this.medicDays = res;
      this.selectedDate = this.medicDays[0].id;
      this.clinicList = this.medicDays[0].clinics;
      this.empresaFilter();
      this.loading.hide();

    }, (err: any) => {
      this.loading.hide();
    });
  }

  getAvailableHoursFromDate(item: any) {
    this.clinicList = item.clinics;
  }

  getNext30Days(): Array<{ day: number; month: string; dayOfWeek: string }> {
    const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const dayOfWeekNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

    let currentDate = new Date();
    let dates = [];

    for (let i = 0; i < 30; i++) {
      // Extrair informações da data
      let day = currentDate.getDate();
      let monthIndex = currentDate.getMonth();
      let dayOfWeekIndex = currentDate.getDay();

      // Construir o objeto de data
      let dateInfo = {
        day: day,
        month: monthNames[monthIndex],
        monthNumber: monthIndex + 1,
        dayOfWeek: dayOfWeekNames[dayOfWeekIndex],
        id: i
      };

      // Adicionar o objeto à lista
      dates.push(dateInfo);

      // Adicionar um dia à data atual
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  calcularDesconto(valorOriginal: number, valorComDesconto: number): string {
    if (valorOriginal <= 0) {
      return "Valor original deve ser maior que zero.";
    }

    if (valorComDesconto > valorOriginal) {
      return "Valor com desconto não pode ser maior que o valor original.";
    }

    let desconto = ((valorOriginal - valorComDesconto) / valorOriginal) * 100;
    return "-" + desconto.toFixed(0) + "%";
  }
}
