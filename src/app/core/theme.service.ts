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
  private op5 = .6
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
      'accentColor': this.black,
      'processingColor': this.yellow,
      'failedColor': this.red,
      'confirmedColor': this.green,
      'op1': this.op1,
      'op2': this.op2,
      'op3': this.op3,
      'op4': this.op4,
      'op5': this.op5
    },
    {
      'name': 'Dark',
      'primaryColor': this.backgroundColor,
      'secondaryColor': this.black,
      'accentColor': this.backgroundColor,
      'processingColor': this.yellow,
      'failedColor': this.red,
      'confirmedColor': this.green,
      'op1': this.op1 * 2.5,
      'op2': this.op1 * 2.5,
      'op3': this.op2 * 2.5,
      'op4': this.op3 * 2.5,
      'op5': this.op5
    },
    {
      'name': 'Blueprint',
      'primaryColor': '#FFF4E6',
      'secondaryColor': '#143EB3',
      'accentColor': '#FFF4E6',
      'processingColor': '#F3FFC2',
      'failedColor': '#FF7598',
      'confirmedColor': '#40E38F',
      'op1': this.op1,
      'op2': this.op2,
      'op3': this.op3,
      'op4': this.op4,
      'op5': this.op5
    },
    {
      'name': 'Leet',
      'primaryColor': '#F5007E',
      'secondaryColor': '#FFFFFF',
      'accentColor': '#F5007E',
      'processingColor': '#FFDD18',
      'failedColor': '#F5007E',
      'confirmedColor': '#12FF8B', 
      'op1': this.op1,
      'op2': this.op2,
      'op3': this.op3,
      'op4': this.op4 * 2,
      'op5': this.op5 * 1.3
    },
    {
      'name': 'Brown',
      'primaryColor': '#6E2C00',
      'secondaryColor': '#DBC39C',
      'accentColor': '#6E2C00',
      'processingColor': '#FFF5BA',
      'failedColor': '#BF8B41',
      'confirmedColor': '#78AB85', 
      'op1': this.op1,
      'op2': this.op2,
      'op3': this.op3,
      'op4': this.op4,
      'op5': this.op5
    },
    {
      'name': 'Capsule',
      'primaryColor': '#E6FAF1',
      'secondaryColor': '#848599',
      'accentColor': '#38F5A7',
      'processingColor': '#FFED82',
      'failedColor': '#F77562',
      'confirmedColor': '#38F5A7', 
      'op1': this.op1,
      'op2': this.op2,
      'op3': this.op3,
      'op4': this.op4,
      'op5': this.op5
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
  
  public updateSVGs(theme) {
    // This is part of a hack-ey (but seemingly necessary) solution to dynamically change the color of SVG images/icons to match the theme. It is used alongside ng-inline-svg, and the .primary-svg or .secondary-svg class must be placed on the element with the [inlineSVG] directive, to indicate its color in relationt o the theme. I also manually edit the .svg files so that their height and width attributes are 100%, so they can be sized by their parent element
    
    if (theme.primaryColor) {
      let primaryColorPaths = document.querySelectorAll('.primary-svg svg path');
      for(let i = 0; i < primaryColorPaths.length; i++) {
        // console.log(i);
        // console.log(primaryColorPaths[i]);
        primaryColorPaths[i].setAttribute('fill', theme.primaryColor);
        // primaryColorPaths[i].style.fill = primaryColor;
      }
      let primaryColorPolygons = document.querySelectorAll('.primary-svg svg polygon');
      for(let i = 0; i < primaryColorPolygons.length; i++) {
        // console.log(i);
        // console.log(primaryColorPolygons[i]);
        primaryColorPolygons[i].setAttribute('fill', theme.primaryColor);
        // primaryColorPolygons[i].style.fill = primaryColor;
      }
    }
    if (theme.secondaryColor) {
      let secondaryColorPaths = document.querySelectorAll('.secondary-svg svg path');
      for(let i = 0; i < secondaryColorPaths.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPaths[i]);
        secondaryColorPaths[i].setAttribute('fill', theme.secondaryColor);
        // secondaryColorPaths[i].style.fill = secondaryColor;
      }
      let secondaryColorPolygons = document.querySelectorAll('.secondary-svg svg polygon');
      for(let i = 0; i < secondaryColorPolygons.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPolygons[i]);
        secondaryColorPolygons[i].setAttribute('fill', theme.secondaryColor);
        // secondaryColorPolygons[i].style.fill = secondaryColor;
      }
    }
    if (theme.accentColor) {
      let accentColorPaths = document.querySelectorAll('.accent-svg svg path');
      for(let i = 0; i < accentColorPaths.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPaths[i]);
        accentColorPaths[i].setAttribute('fill', theme.accentColor);
        // secondaryColorPaths[i].style.fill = secondaryColor;
      }
      let accentColorPolygons = document.querySelectorAll('.accent-svg svg polygon');
      for(let i = 0; i < accentColorPolygons.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPolygons[i]);
        accentColorPolygons[i].setAttribute('fill', theme.accentColor);
        // secondaryColorPolygons[i].style.fill = secondaryColor;
      }
    }
  }
  
  
  static luma(hex) { // returns a value which represents brightness adjusted for human perception.
    var rgb = this.hexToRgb(hex);
    return (0.2126 * rgb.r) + (0.7152 * rgb.g) + (0.0722 * rgb.b); // SMPTE C, Rec. 709 weightings
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

    const primaryColorRgb = ThemeService.hexToRgb(themeSource.primaryColor);
    const bgColorRGB = ThemeService.hexToRgb(themeSource.secondaryColor);
    const accentColorRgb = this.hexToRgb(themeSource.accentColor);

    theme.name = themeSource.name;
    
    theme.primaryColor = themeSource.primaryColor;
    theme.primaryColorRgb = this.hexToRgb(themeSource.primaryColor);
    theme.secondaryColor = themeSource.secondaryColor;
    theme.secondaryColorRgb = this.hexToRgb(themeSource.secondaryColor);
    theme.accentColor = themeSource.accentColor;
    theme.accentColorRgb = this.hexToRgb(themeSource.accentColor);
    theme.op1 = themeSource.op1;
    theme.op2 = themeSource.op2;
    theme.op3 = themeSource.op3;
    theme.op4 = themeSource.op4;
    theme.op5 = themeSource.op5;
    
    theme.isDark = this.luma(theme.primaryColor) > this.luma(theme.secondaryColor) ?
    true :
    false;
    
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
    theme.accentBackgroundStyle = {
      'background-color': themeSource.accentColor
    };
    
    theme.overlayStyle = {
      
      'background': 'rgba('+
                    accentColorRgb.r+','+
                    accentColorRgb.g+','+
                    accentColorRgb.b+','+
                    theme.op5+')',
    }

    theme.textStyle = {
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    };
    
    theme.secondaryTextStyle = {
      'color': themeSource.secondaryColor,
      'border-color': themeSource.secondaryColor
    };
    theme.accentTextStyle = {
      'color': themeSource.accentColor,
      'border-color': themeSource.accentColor
    };
    
    theme.textInputFocusStyle = {
      'background': 'rgba('+
                    theme.primaryColorRgb.r+','+
                    theme.primaryColorRgb.g+','+
                    theme.primaryColorRgb.b+','+
                    theme.op1+')',
      'border-left': '4px solid ' + themeSource.accentColor;
    }
    
    theme.textInputBlurStyle = {
      'background': 'rgba('+
                    theme.primaryColorRgb.r+','+
                    theme.primaryColorRgb.g+','+
                    theme.primaryColorRgb.b+','+
                    theme.op1+')',
      'border-left': '4px solid ' + 'rgba('+
                     theme.accentColorRgb.r+','+
                     theme.accentColorRgb.g+','+
                     theme.accentColorRgb.b+','+
                     theme.op4+')';
    }
    
    theme.newTransactionTextStyle = this.luma(themeSource.primaryColor) > this.luma(themeSource.secondaryColor) ? 
    {
      'color': themeSource.secondaryColor,
      'border-color': themeSource.secondaryColor
    } : 
    {
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    }

    theme.buttonStyle = {
      'color': themeSource.secondaryColor,
      'background-color': themeSource.primaryColor
    };
    theme.secondaryButtonStyle = {
      'color': themeSource.primaryColor,
      'background-color': themeSource.secondaryColor
    };
    theme.accentButtonStyle = {
      'color': themeSource.accentColor,
      'background-color': themeSource.accentColor
    };
    
    theme.primaryBorderStyle = {
      'border-color': themeSource.primaryColor
    }
    
    theme.secondaryBorderStyle = {
      'border-color': themeSource.secondaryColor
    }
    
    theme.accentBorderStyle = {
      'border-color': themeSource.accentColor
    }

    theme.toggleSwitchOffStyle = {
      'background-color': 'rgba(' +
      primaryColorRgb.r + ',' +
      primaryColorRgb.g + ',' +
      primaryColorRgb.b + ',' +
      themeSource.op2 + ')',
    };

    theme.toggleSwitchOnStyle = theme.primaryColor == theme.accentColor ? {
      'background-color': 'rgba(' +
      accentColorRgb.r + ',' +
      accentColorRgb.g + ',' +
      accentColorRgb.b + ',' +
      theme.op4 + ')',
    } : {
      'background-color': 'rgba(' +
      accentColorRgb.r + ',' +
      accentColorRgb.g + ',' +
      accentColorRgb.b + ',' +
      1 + ')',
    };

    theme.selectStyle = {
      'background-color': 'rgba(' +
      primaryColorRgb.r + ',' +
      primaryColorRgb.g + ',' +
      primaryColorRgb.b + ',' +
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
