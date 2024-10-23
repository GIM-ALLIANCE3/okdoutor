import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-medicos-e-especialistas',
  templateUrl: './medicos-e-especialistas.component.html',
  styleUrls: ['./medicos-e-especialistas.component.scss']
})
export class MedicosEEspecialistasComponent implements OnInit {

  constructor(private najaService: NajaService, private loading: LoadingService) { }

  step = 0;

  selected: any;

  selectedFilter: any = [];

  selectedMedico: any;

  especialidades_servicos: any = [];

  especialidades_servicos_filter: any = [];

  ngOnInit(): void {
    this.loading.show();
    this.najaService.getProcedimentosWithEspecialistas()
      .pipe(
        catchError(error => {
          console.error('Ocorreu um erro ao buscar procedimentos com especialistas:', error);
          throw error(error); // Re-lança o erro para ser tratado em outros lugares, se necessário.
        })
      )
      .subscribe(
        {
          next: (data) => {
            this.loading.hide();
            console.log(data);
            this.especialidades_servicos = data;
            this.especialidades_servicos_filter = [...this.especialidades_servicos];
          },
          error: (error) => {
            this.loading.hide();
            console.log("🚀 ~ file: medicos-e-especialistas.component.ts:40 ~ MedicosEEspecialistasComponent ~ ngOnInit ~ error:", error)
          }
        }
      );
  }

  selectItem(item: any) {
    this.selected = item;
    this.selectedFilter = {...item};
  }

  filter(event: any, isMedico: boolean = false) {
    const normalizeString = (str:any) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if(isMedico){
      this.selectedFilter.Medicos = this.selected.Medicos.filter((item: any) => {
        return normalizeString(item.NOME.toLowerCase()).includes(normalizeString(event.target.value.toLowerCase()));
      });
      return;
    }
    this.especialidades_servicos_filter = this.especialidades_servicos.filter((item: any) => {
      return normalizeString(item.NomeRecurso.toLowerCase()).includes(normalizeString(event.target.value.toLowerCase()));
    });
  }

  select() {
    localStorage.setItem('procedimento', this.selected?.ProcedimentoDefault?.Codigo);
    localStorage.setItem('medico', this.selectedMedico?.CRM);
    localStorage.setItem('nomeMedico', this.selectedMedico?.NOME);
    localStorage.setItem('object', JSON.stringify(this.selected));
    localStorage.setItem('medicStep', 'true');
  }

}
