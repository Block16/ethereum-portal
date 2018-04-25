import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'splitDecimal'
})
export class SplitDecimalPipe implements PipeTransform {

  transform(value: any, section: number, decimalPlaces?: any): any {
    // "section" is an integer 1 or 2, and refers to which half of the split string is being processed
    if (value) {
      if (!decimalPlaces) decimalPlaces = 3;
      decimalPlaces += 1;
      let valueString: string = value.toString();
      let periodIndex = valueString.indexOf('.');

      let middleIndex = periodIndex >= 0 ?
        periodIndex + decimalPlaces :
        valueString.length;

      if (section == 1) {
        valueString = valueString.slice(0, middleIndex);
      } else if (section == 2) {
        valueString = valueString.slice(middleIndex + 1, valueString.length);
      }

      return valueString;

    } else {
      return 'error';
    }

  }

}
