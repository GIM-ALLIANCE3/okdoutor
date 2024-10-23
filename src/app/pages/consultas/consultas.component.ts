import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent implements OnInit {
  especialidades_servicos: any = [
    { "id": 1, "nome": "Imunologia", "valor": "R$ 200", "valor_cartao": "R$ 190" },
    { "id": 2, "nome": "Angiologia/Cirurgia Vascular", "valor": "R$ 250", "valor_cartao": "R$ 240" },
    { "id": 3, "nome": "Cardiologia", "valor": "R$ 220", "valor_cartao": "R$ 210" },
    { "id": 4, "nome": "Cirurgia Geral", "valor": "R$ 280", "valor_cartao": "R$ 270" },
    { "id": 5, "nome": "Cirurgia Plástica", "valor": "R$ 300", "valor_cartao": "R$ 290" },
    { "id": 6, "nome": "Cirurgia De Cabeça E Pescoço", "valor": "R$ 270", "valor_cartao": "R$ 260" },
    { "id": 7, "nome": "Clínica Geral", "valor": "R$ 180", "valor_cartao": "R$ 170" },
    { "id": 8, "nome": "Dermatologia", "valor": "R$ 230", "valor_cartao": "R$ 220" },
    { "id": 9, "nome": "Endocrinologia", "valor": "R$ 210", "valor_cartao": "R$ 200" },
    { "id": 10, "nome": "Endocrinopediatria", "valor": "R$ 215", "valor_cartao": "R$ 205" }
  ]

  constructor(private route: Router, private najaService: NajaService, private loading: LoadingService) { }

  ngOnInit(): void {
    this.loading.show();
    this.najaService.getConsultas()
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
            // console.log(data);
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

  especialidades_servicos_filter = [...this.especialidades_servicos];

  filter(event: any) {
    const normalizeString = (str: any) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    this.especialidades_servicos_filter = this.especialidades_servicos.filter((item: any) => {
      return normalizeString(item.pro_nome.toLowerCase()).includes(normalizeString(event.target.value.toLowerCase()));
    });
  }

  selectItem(item: any) {
    localStorage.setItem('procedimento', item.pro_cod);
    localStorage.setItem('object', JSON.stringify(item));
    this.route.navigate(['/pre-agendamento']);
  }

}
