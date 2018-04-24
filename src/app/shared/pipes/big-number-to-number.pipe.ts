import { Pipe, PipeTransform } from '@angular/core';
import {BigNumber} from "bignumber.js";

@Pipe({
  name: 'bigNumberToNumber'
})
export class BigNumberToNumberPipe implements PipeTransform {

  transform(value: BigNumber, args?: any): any {
  	// debugger;
    return value.Value;
  }

}
