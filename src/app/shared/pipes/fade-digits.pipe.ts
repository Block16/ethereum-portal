import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fadeDigits'
})
export class FadeDigitsPipe implements PipeTransform {

  transform(value: any, decimalPlaces?: any): any {
  	if (!decimalPlaces) decimalPlaces = 3;
  	decimalPlaces += 1;
  	let valueString = value.toString();
  	let periodIndex = valueString.indexOf('.');
  	
  	let lightIndex = periodIndex >= 0 ? 
  			periodIndex + decimalPlaces :
  			valueString.length
  			
  	let string = `
  		<span class="test" [ngStyle]="theme.accentTextStyle">` + valueString.slice(0,lightIndex) + `</span><span class="op3">` + valueString.slice(lightIndex, valueString.length) + `
  		</span>
  	`
    return string;
  }

}
