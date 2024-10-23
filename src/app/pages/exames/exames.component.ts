import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';
import { NajaService } from 'src/app/service/naja.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-exames',
    templateUrl: './exames.component.html',
    styleUrls: ['./exames.component.scss']
})
export class ExamesComponent {
    constructor(private najaService: NajaService, private loading: LoadingService, private route: Router) { }
    step = 0;

    selected: any;

    exames_servicos: any = [];

    exames_servicos_filter: any = [];

    selected_exames_filter: any = [];

    selectPro(item: any) {
        localStorage.setItem('procedimento', item.pro_cod);
        localStorage.setItem('object', JSON.stringify(item));
        this.route.navigate(['/pre-agendamento']);
    }

    ngOnInit(): void {
        this.loading.show();
        this.najaService.getGrupoExames()
            .pipe(
                catchError(error => {
                    console.error('Ocorreu um erro ao buscar procedimentos com especialistas:', error);
                    throw error(error); // Re-lança o erro para ser tratado em outros lugares, se necessário.
                })
            )
            .subscribe(
                {
                    next: (data: any) => {
                        this.loading.hide();
                        // console.log(data);
                        this.exames_servicos = data;
                        for (const iterator of this.exames_servicos) {
                            const parts = iterator.subgrupo.sgr_nome.split('(');
                            const nomeSemAbreviacao = parts[0];
                            iterator.subgrupo.sgr_nome = nomeSemAbreviacao;
                        }
                        console.log("🚀 ~ file: exames.component.ts:36 ~ ExamesComponent ~ ngOnInit ~ this.exames_servicos:", this.exames_servicos)
                        this.exames_servicos_filter = [...this.exames_servicos];
                    },
                    error: (error) => {
                        this.loading.hide();
                        console.log("🚀 ~ file: medicos-e-especialistas.component.ts:40 ~ MedicosEEspecialistasComponent ~ ngOnInit ~ error:", error)
                    }
                }
            );
    }

    filter(event: any) {
        this.exames_servicos_filter = this.exames_servicos.filter((item: any) => {
            return item.subgrupo.sgr_nome.toLowerCase().includes(event.target.value.toLowerCase());
        });
    }

    filterPro(event: any) {
        this.selected_exames_filter.exames = this.selected.exames.filter((item: any) => {
            return item.pro_nome.toLowerCase().includes(event.target.value.toLowerCase());
        });
    }

    selectItem(item: any) {
        this.step = 1;
        this.selected = item;
        this.selected_exames_filter = { ...this.selected };
    }
}
