import {Injectable} from '@angular/core';
import {isNullOrUndefined} from "util";
import {ThemeSource} from "../shared/model/theme-source";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Theme} from "../shared/model/theme/theme";

@Injectable()
export class ThemeService {
  private op1 = .05;
  private op2 = .1;
  private op3 = .2;
  private op4 = .4;
  private backgroundColor = '#EFF1F2';
  private black = '#000000';
  private yellow = '#f6eb0f';
  private green = '#00CF34';
  private red = '#ED466E';

  public themeSources: ThemeSource[] = [
    {
      'name': 'Default',
      'primaryColor': this.black,
      'secondaryColor': this.backgroundColor,
      'processingColor': this.yellow,
      'failedColor': this.red,
      'confirmedColor': this.green,
      'op1': this.op1,
      'op2': this.op2,
      'op3': this.op3,
      'op4': this.op4
    },
    {
      'name': 'Dark',
      'primaryColor': this.backgroundColor,
      'secondaryColor': this.black,
      'processingColor': this.yellow,
      'failedColor': this.red,
      'confirmedColor': this.green,
      'op1': this.op1,
      'op2': this.op2,
      'op3': this.op3,
      'op4': this.op4
    }
  ];

  public themes: Theme[];
  public theme: BehaviorSubject<Theme>;

  constructor() {
    this.themes = [];
    this.themeSources.forEach((themeSource: ThemeSource) => {
      this.themes.push(ThemeService.constructTheme(themeSource));
    });
    // Set the default theme initially
    this.theme = new BehaviorSubject(this.themes[0]);
    
  }
  
  public updateSVGs(primaryColor, secondaryColor) {
    // This is part of a hack-ey (but seemingly necessary) solution to dynamically change the color of SVG images/icons to match the theme. It is used alongside ng-inline-svg, and the .primary-svg or .secondary-svg class must be placed on the element with the [inlineSVG] directive, to indicate its color in relationt o the theme. I also manually edit the .svg files so that their height and width attributes are 100%, so they can be sized by their parent element
    
    if (primaryColor) {
      let primaryColorSVGs = document.querySelectorAll('.primary-svg svg path');
      for(let i = 0; i < primaryColorSVGs.length; i++) {
        console.log(i);
        console.log(primaryColorSVGs[i]);
        primaryColorSVGs[i].setAttribute('fill', primaryColor);
      }
    }
    if (secondaryColor) {
      let secondaryColorSVGs = document.querySelectorAll('.secondary-svg svg path');
      for(let i = 0; i < secondaryColorSVGs.length; i++) {
        console.log(i);
        console.log(secondaryColorSVGs[i]);
        secondaryColorSVGs[i].setAttribute('fill', secondaryColor);
      }
    }
  }
  
  static hexToHSL(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    s = s*100;
    s = Math.round(s);
    l = l*100;
    l = Math.round(l);
    h = Math.round(360*h);
    
    let hsl = {
      'h': h,
      's': s,
      'l': l
    }

    var colorInHSL = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    
    console.log(hsl);
    return hsl;
  }
  
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static constructTheme(themeSource: ThemeSource): Theme {

    const theme: Theme = <Theme>{};

    const primaryColorRGB = ThemeService.hexToRgb(themeSource.primaryColor);
    const bgColorRGB = ThemeService.hexToRgb(themeSource.secondaryColor);

    theme.name = themeSource.name;
    
    theme.primaryColor = themeSource.primaryColor;
    theme.secondaryColor = themeSource.secondaryColor;
    
    theme.mainStyle = {
      'background-color': themeSource.secondaryColor,
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    };

    theme.backgroundStyle = {
      'background-color': themeSource.secondaryColor
    };

    theme.primaryBackgroundStyle = {
      'background-color': themeSource.primaryColor
    };

    theme.textStyle = {
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    };

    theme.buttonStyle = {
      'color': themeSource.secondaryColor,
      'background-color': themeSource.primaryColor
    };

    theme.toggleSwitchOffStyle = {
      'background-color': 'rgba(' +
      primaryColorRGB.r + ',' +
      primaryColorRGB.g + ',' +
      primaryColorRGB.b + ',' +
      themeSource.op2 + ')',
    };

    theme.toggleSwitchOnStyle = {
      'background-color': 'rgba(' +
      primaryColorRGB.r + ',' +
      primaryColorRGB.g + ',' +
      primaryColorRGB.b + ',' +
      themeSource.op4 + ')',
    };

    theme.selectStyle = {
      'background-color': 'rgba(' +
      primaryColorRGB.r + ',' +
      primaryColorRGB.g + ',' +
      primaryColorRGB.b + ',' +
      themeSource.op2 + ')',
    };

    theme.processingBackgroundStyle = {
      'background-color': themeSource.processingColor
    };

    theme.confirmedBackgroundStyle = {
      'background-color': themeSource.confirmedColor
    };

    theme.failedBackgroundStyle = {
      'background-color': themeSource.failedColor
    };

    return theme;
  }

  setTheme(themeName: string) {
    const theme = this.themes.find(t => t.name === themeName);
    if (isNullOrUndefined(theme)) {
      throw new Error("Theme with name: " + themeName + " was not found.");
    }
    this.theme.next(theme);
  }
}
