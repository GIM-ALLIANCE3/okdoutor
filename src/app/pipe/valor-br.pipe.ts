import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valorBr',
  standalone: false
})
export class ValorBrPipe implements PipeTransform {
  intl = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  transform(value: any): unknown {
    const valor: any = value;
    if (typeof value !== 'number') {
      value = parseFloat(valor);
    }
    return this.intl.format(value);
  }

}
