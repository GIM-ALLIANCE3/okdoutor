import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCpf',
  standalone: false
})
export class FormatCpfPipe implements PipeTransform {

  transform(value: 'string'): unknown {
    const valor = value.replace(/\D/g, '');
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4');
  }

}
