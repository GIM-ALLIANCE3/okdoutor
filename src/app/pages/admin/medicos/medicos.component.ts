import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';

@Component({
  selector: 'app-medicos',
  standalone: false,
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.scss'
})
export class MedicosComponent implements OnInit {
  pesquisa: string = '';
  display = false;

  crm: any = '';
  title: any = 'Dr.';
  description: any = '';
  medicos = [];

  filteredMedicos: any = [];

  selected: any;

  update = false;

  constructor(private loading: LoadingService, private najaService: NajaService) { }

  ngOnInit(): void {
    this.getMedicos();
  }

  getMedicos() {
    this.loading.show();
    this.najaService.getMedicos()
      .subscribe({
        next: (data) => {
          this.medicos = data;
          this.filteredMedicos = [...data];
          this.loading.hide();
        },
        error: (error) => {
          this.loading.hide();
          console.log("🚀 ~ file: medicos.component.ts:40 ~ MedicosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  createMedico() {
    this.loading.show();
    this.najaService.postMedico({ crm: this.crm, description: this.description, title: this.title})
      .subscribe({
        next: (data) => {
          this.loading.hide();
          this.getMedicos();
          this.crm = '';
          this.description = '';
          this.display = false;
        },
        error: (error) => {
          this.loading.hide();
          console.log("🚀 ~ file: medicos.component.ts:40 ~ MedicosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  deleteMedico(id: any) {
    this.loading.show();
    this.najaService.deleteMedico(id)
      .subscribe({
        next: (data) => {
          this.loading.hide();
          this.getMedicos();
        },
        error: (error) => {
          this.loading.hide();
          console.log("🚀 ~ file: medicos.component.ts:40 ~ MedicosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  selectMedico(medico: any) {
    this.selected = medico;
    this.crm = medico.crm;
    this.title = medico.title;
    this.description = medico.description;
    this.update = true;
  }

  updateMedico() {
    this.loading.show();
    this.najaService.updateMedico({ id: this.selected.id, crm: this.crm, description: this.description, title: this.title})
      .subscribe({
        next: (data) => {
          this.loading.hide();
          this.getMedicos();
          this.crm = '';
          this.description = '';
          this.title = '';
          this.display = false;
        },
        error: (error) => {
          this.loading.hide();
          console.log("🚀 ~ file: medicos.component.ts:40 ~ MedicosComponent ~ ngOnInit ~ error:", error)
        }
      });
  }

  pesquisar(){
      if(this.pesquisa === ''){
        this.filteredMedicos = [...this.medicos];
        return;
      }
    this.filteredMedicos = this.medicos.filter((medico: any) => {
      return medico.crm.toLowerCase().includes(this.pesquisa.toLowerCase());
    });
  }
}
