import { Pipe, PipeTransform } from '@angular/core';
import { NajaService } from '../service/naja.service';

@Pipe({
  name: 'doutor',
  standalone: false
})
export class DoutorPipe implements PipeTransform {

  constructor(private najaService: NajaService) {}
  async transform(value: string, crm: string): Promise<string> {
    const doutor = await this.najaService.getMedicoByCRM(crm).toPromise() as any;
    return `${doutor?.title || 'Dr(a).'} ${value}`;
  }

}
