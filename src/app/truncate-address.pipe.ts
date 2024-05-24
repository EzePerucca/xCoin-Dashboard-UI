import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateAddress'
})
export class TruncateAddressPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return `${value.substring(0, 6)}...${value.substring(value.length - 4)}`;
  }

}
