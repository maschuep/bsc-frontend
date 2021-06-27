import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kWh'
})
export class KWhPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if(value / 1000 > 1){
      return `${Math.round((value / 1000) * 100) / 100} kWh`;
    }
    return `${value} Wh`
  }

}
