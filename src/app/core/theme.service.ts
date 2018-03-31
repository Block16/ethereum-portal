import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
	public op1 = .05;
	public op2 = .1;
	public op3 = .2;
	public op4 = .4;
	public backgroundColor = '#EFF1F2';
	public black = '#000000';
	public yellow = '#f6eb0f';
	public green = '#00CF34';
	public red = '#ED466E';
	
	public themeSources = {
  		'Default': {
  			'primaryColor': this.black,
  			'backgroundColor': this.backgroundColor,
  			'processingColor': this.yellow,
  			'failedColor': this.red,
  			'confirmedColor': this.green,
  			'op1': this.op1,
  			'op2': this.op2,
  			'op3': this.op3,
  			'op4': this.op4
  		},
  		'Dark': {
  			'primaryColor': this.backgroundColor,
  			'backgroundColor': this.black,
  			'processingColor': this.yellow,
  			'failedColor': this.red,
  			'confirmedColor': this.green,
  			'op1': this.op1,
  			'op2': this.op2,
  			'op3': this.op3,
  			'op4': this.op4
  		}
  	}
	
  constructor() {}
	
	hexToRgb(hex) {
		// console.log(hex)
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    // console.log(result);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
	}
	
	constructTheme(themeSource) {
		console.log('themeSource: '+themeSource);
		let theme = {}
		
		let primaryColorRGB = this.hexToRgb(themeSource['primaryColor']);
		let bgColorRGB = this.hexToRgb(themeSource['backgroundColor']);
		
		theme['mainStyle'] = {
			'background-color': themeSource.backgroundColor,
			'color': themeSource.primaryColor,
			'border-color': themeSource.primaryColor
		}
		theme['backgroundStyle'] = {
			'background-color': themeSource.backgroundColor
		}
		theme['primaryBackgroundStyle'] = {
			'background-color': themeSource.primaryColor
		}
		theme['textStyle'] = {
			'color': themeSource.primaryColor,
			'border-color': themeSource.primaryColor
		}
		theme['buttonStyle'] = {
			'color': themeSource.backgroundColor,
			'background-color': themeSource.primaryColor
		}
		theme['toggleSwitchOffStyle'] = {
			'background-color': 'rgba('+
													primaryColorRGB.r+','+
													primaryColorRGB.g+','+
													primaryColorRGB.b+','+
													themeSource.op2+')',
		}
		theme['toggleSwitchOnStyle'] = {
			'background-color': 'rgba('+
													primaryColorRGB.r+','+
													primaryColorRGB.g+','+
													primaryColorRGB.b+','+
													themeSource.op4+')',
		}
		theme['selectStyle'] = {
			'background-color': 'rgba('+
													primaryColorRGB.r+','+
													primaryColorRGB.g+','+
													primaryColorRGB.b+','+
													themeSource.op2+')',
		}
		theme['processingBackgroundStyle'] = {
			'background-color': themeSource.processingColor
		}
		theme['confirmedBackgroundStyle'] = {
			'background-color': themeSource.confirmedColor
		}
		theme['failedBackgroundStyle'] = {
			'background-color': themeSource.failedColor
		}
		return theme;
	}
	
	getTheme(themeName: string) {
		console.log(themeName);
		console.log(this.themeSources[themeName])
		if (this.themeSources[themeName]) {
			return this.constructTheme(this.themeSources[themeName]);
		} else {
			console.log('Theme not found!');
		}
	}
	

}
