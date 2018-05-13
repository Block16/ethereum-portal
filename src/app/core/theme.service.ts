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
  private op5 = .6;
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
    'sendColor': this.red,
    'receiveColor': this.green,
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
    'sendColor': '#DC6466',
    'receiveColor': '#9EE283',
    'op1': this.op1 * 2.5,
    'op2': this.op1 * 2.5,
    'op3': this.op2 * 2.5,
    'op4': this.op3 * 2.5,
    'op5': this.op5
  },
  {
    'name': 'Blueprint',
    'primaryColor': '#FFFFFF',
    'secondaryColor': '#0048FF',
    'accentColor': '#FFFFFF',
    'processingColor': '#FFFFFF',
    'sendColor': '#83A6FF',
    'receiveColor': '#FFFFFF',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Blueprint #2',
    'primaryColor': '#0048FF',
    'secondaryColor': '#FFFFFF',
    'accentColor': '#0048FF',
    'processingColor': '#0048FF',
    'sendColor': '#0048FF',
    'receiveColor': '#0048FF',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Brown',
    'primaryColor': '#6E2C00',
    'secondaryColor': '#DBC39C',
    'accentColor': '#6E2C00',
    'processingColor': '#FFF5BA',
    'sendColor': '#BF8B41',
    'receiveColor': '#78AB85',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Capsule',
    'primaryColor': '#cadbd3',
    'secondaryColor': '#3d3e47',
    'accentColor': '#22f59e',
    'processingColor': '#FFED82',
    'sendColor': '#F77562',
    'receiveColor': '#22f59e',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Clay',
    'primaryColor': '#47463E',
    'secondaryColor': '#F2F1EF',
    'accentColor': '#BA350B',
    'processingColor': '#E8D47B',
    'sendColor': '#B83C25', 
    'receiveColor': '#22b5cb',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Cloud',
    'primaryColor': '#657474',
    'secondaryColor': '#E6F5F3',
    'accentColor': '#6FB2B3',
    'processingColor': '#EDE5C9',
    'sendColor': '#CF9A93',
    'receiveColor': '#8DCCA5',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Cotton Candy',
    'primaryColor': '#667575',
    'secondaryColor': '#F0F3FA',
    'accentColor': '#D685BF',
    'processingColor': '#F5DFE9',
    'sendColor': '#E1A7E8',
    'receiveColor': '#9BEBC2',
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
    'sendColor': '#F5007E',
    'receiveColor': '#12FF8B',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4 * 2,
    'op5': this.op5 * 1.3
  },
  {
    'name': 'Neon',
    'primaryColor': '#0095FF',
    'secondaryColor': '#FFFFFF',
    'accentColor': '#FF12DB',
    'processingColor': '#F7FF05',
    'sendColor': '#FB2ED9',
    'receiveColor': '#0095FF',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Zap! Electric shock!',
    'primaryColor': '#FFFFFF',
    'secondaryColor': '#0095FF',
    'accentColor': '#FF13AC',
    'processingColor': '#FFFFFF',
    'sendColor': '#FF12DB',
    'receiveColor': '#08FFAB',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Peach',
    'primaryColor': '#F3754F',
    'secondaryColor': '#FFECD3',
    'accentColor': '#FF9EA0',
    'processingColor': '#FFEA8C',
    'sendColor': '#F3754F',
    'receiveColor': '#A2C24C',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Lavender',
    'primaryColor': '#B15D93',
    'secondaryColor': '#FBE2F3',
    'accentColor': '#766285',
    'processingColor': '#FFF2F7',
    'sendColor': '#B15D93',
    'receiveColor': '#9dad90',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Nu',
    'primaryColor': '#60635b',
    'secondaryColor': '#fcfff2',
    'accentColor': '#6597EB',
    'processingColor': '#f0f06a',
    'sendColor': '#e15895',
    'receiveColor': '#33dc71',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'B & W',
    'primaryColor': '#000000',
    'secondaryColor': '#FFFFFF',
    'accentColor': '#000000',
    'processingColor': '#000000',
    'sendColor': '#000000',
    'receiveColor': '#000000',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'B & W #2',
    'primaryColor': '#FFFFFF',
    'secondaryColor': '#000000',
    'accentColor': '#FFFFFF',
    'processingColor': '#FFFFFF',
    'sendColor': '#888888',
    'receiveColor': '#FFFFFF',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Orange',
    'primaryColor': '#fc7033',
    'secondaryColor': '#FFFFFF',
    'accentColor': '#fc7033',
    'processingColor': '#fc7033',
    'sendColor': '#fc7033',
    'receiveColor': '#58d68a',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Orange #2',
    'primaryColor': '#FFFFFF',
    'secondaryColor': '#fc7033',
    'accentColor': '#FFFFFF',
    'processingColor': '#FFFFFF',
    'sendColor': '#FCA985',
    'receiveColor': '#FFFFFF',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Red',
    'primaryColor': '#FF0000',
    'secondaryColor': '#FFFFFF',
    'accentColor': '#FF0000',
    'processingColor': '#FF0000',
    'sendColor': '#FFA3A5',
    'receiveColor': '#FF0000',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Red #2',
    'primaryColor': '#FFFFFF',
    'secondaryColor': '#FF0000',
    'accentColor': '#FFFFFF',
    'processingColor': '#FFFFFF',
    'sendColor': '#FF9698',
    'receiveColor': '#FFFFFF',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Seal',
    'primaryColor': '#363636',
    'secondaryColor': '#fcfff2',
    'accentColor': '#cf4d53',
    'processingColor': '#fdcf8c',
    'sendColor': '#cf4d53',
    'receiveColor': '#9fbd5e',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Crimson',
    'primaryColor': '#e8d9c5',
    'secondaryColor': '#6e2428',
    'accentColor': '#e8d9c5',
    'processingColor': '#7b3035',
    'sendColor': '#C36F71',
    'receiveColor': '#e8d9c5',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Navy',
    'primaryColor': '#e8e1cc',
    'secondaryColor': '#242f4d',
    'accentColor': '#e8e1cc',
    'processingColor': '#e8e1cc',
    'sendColor': '#0e0e29',
    'receiveColor': '#5e8771',
    'op1': this.op1,
    'op2': this.op2,
    'op3': this.op3,
    'op4': this.op4,
    'op5': this.op5
  },
  {
    'name': 'Bumblebee',
    'primaryColor': '#eff2dc',
    'secondaryColor': '#272b30',
    'accentColor': '#fee65d',
    'processingColor': '#fee65d',
    'sendColor': '#e98235',
    'receiveColor': '#A6FD56',
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
      const primaryColorPaths = document.querySelectorAll('.primary-svg svg path');
      for (let i = 0; i < primaryColorPaths.length; i++) {
        // console.log(i);
        // console.log(primaryColorPaths[i]);
        primaryColorPaths[i].setAttribute('fill', theme.primaryColor);
        // primaryColorPaths[i].style.fill = primaryColor;
      }
      const primaryColorPolygons = document.querySelectorAll('.primary-svg svg polygon');
      for (let i = 0; i < primaryColorPolygons.length; i++) {
        // console.log(i);
        // console.log(primaryColorPolygons[i]);
        primaryColorPolygons[i].setAttribute('fill', theme.primaryColor);
        // primaryColorPolygons[i].style.fill = primaryColor;
      }
    }
    if (theme.secondaryColor) {
      const secondaryColorPaths = document.querySelectorAll('.secondary-svg svg path');
      for (let i = 0; i < secondaryColorPaths.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPaths[i]);
        secondaryColorPaths[i].setAttribute('fill', theme.secondaryColor);
        // secondaryColorPaths[i].style.fill = secondaryColor;
      }
      const secondaryColorPolygons = document.querySelectorAll('.secondary-svg svg polygon');
      for (let i = 0; i < secondaryColorPolygons.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPolygons[i]);
        secondaryColorPolygons[i].setAttribute('fill', theme.secondaryColor);
        // secondaryColorPolygons[i].style.fill = secondaryColor;
      }
    }
    if (theme.accentColor) {
      const accentColorPaths = document.querySelectorAll('.accent-svg svg path');
      for (let i = 0; i < accentColorPaths.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPaths[i]);
        accentColorPaths[i].setAttribute('fill', theme.accentColor);
        // secondaryColorPaths[i].style.fill = secondaryColor;
      }
      const accentColorPolygons = document.querySelectorAll('.accent-svg svg polygon');
      for (let i = 0; i < accentColorPolygons.length; i++) {
        // console.log(i);
        // console.log(secondaryColorPolygons[i]);
        accentColorPolygons[i].setAttribute('fill', theme.accentColor);
        // secondaryColorPolygons[i].style.fill = secondaryColor;
      }
    }
  }


  static luma(hex) { // returns a value which represents brightness adjusted for human perception.
    const rgb = this.hexToRgb(hex);
    return (0.2126 * rgb.r) + (0.7152 * rgb.g) + (0.0722 * rgb.b); // SMPTE C, Rec. 709 weightings
  }

  static hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    const hsl = {
      'h': h,
      's': s,
      'l': l
    };

    const colorInHSL = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

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

  static hexToRgba(hex, opacity) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgba = 'rgba(' +
            parseInt(result[1], 16) +
            ',' + parseInt(result[2], 16) +
            ',' + parseInt(result[3], 16) +
            ',' + opacity + ')';
    return rgba;
  }

  static constructTheme(themeSource: ThemeSource): Theme {

    const theme: Theme = <Theme>{};

    const primaryColorRgb = ThemeService.hexToRgb(themeSource.primaryColor);
    const secondaryColorRgb = ThemeService.hexToRgb(themeSource.secondaryColor);
    const accentColorRgb = this.hexToRgb(themeSource.accentColor);
    const bgColorRGB = ThemeService.hexToRgb(themeSource.secondaryColor);

    theme.name = themeSource.name;

    theme.primaryColor = themeSource.primaryColor;
    theme.primaryColorRgb = this.hexToRgb(themeSource.primaryColor);
    theme.primaryColorOp1 = this.hexToRgba(themeSource.primaryColor, themeSource.op1);
    theme.primaryColorOp2 = this.hexToRgba(themeSource.primaryColor, themeSource.op2);
    theme.primaryColorOp3 = this.hexToRgba(themeSource.primaryColor, themeSource.op3);
    theme.primaryColorOp4 = this.hexToRgba(themeSource.primaryColor, themeSource.op4);

    theme.secondaryColor = themeSource.secondaryColor;
    theme.secondaryColorRgb = this.hexToRgb(themeSource.secondaryColor);
    theme.secondaryColorOp1 = this.hexToRgba(themeSource.secondaryColor, themeSource.op1);
    theme.secondaryColorOp2 = this.hexToRgba(themeSource.secondaryColor, themeSource.op2);
    theme.secondaryColorOp3 = this.hexToRgba(themeSource.secondaryColor, themeSource.op3);
    theme.secondaryColorOp4 = this.hexToRgba(themeSource.secondaryColor, themeSource.op4);

    theme.accentColor = themeSource.accentColor;
    theme.accentColorRgb = this.hexToRgb(themeSource.accentColor);
    theme.accentColorRgb = this.hexToRgb(themeSource.accentColor);
    theme.accentColorOp1 = this.hexToRgba(themeSource.accentColor, themeSource.op1);
    theme.accentColorOp2 = this.hexToRgba(themeSource.accentColor, themeSource.op2);
    theme.accentColorOp3 = this.hexToRgba(themeSource.accentColor, themeSource.op3);
    theme.accentColorOp4 = this.hexToRgba(themeSource.accentColor, themeSource.op4);

    theme.op1 = themeSource.op1;
    theme.op2 = themeSource.op2;
    theme.op3 = themeSource.op3;
    theme.op4 = themeSource.op4;
    theme.op5 = themeSource.op5;

    theme.isDark = this.luma(theme.primaryColor) > this.luma(theme.secondaryColor) ?
      true :
      false;

    theme.mainStyle = {
      'background': themeSource.secondaryColor,
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    };
    theme.inverseMainStyle = {
      'background': themeSource.primaryColor,
      'color': themeSource.secondaryColor,
      'border-color': themeSource.primaryColor
    };
    theme.accentMainStyle = {
      'background': themeSource.accentColor,
      'color': themeSource.secondaryColor,
      'border-color': themeSource.accentColor
    };


    theme.primaryBackgroundStyle = {
      'background-color': themeSource.primaryColor
    };
    theme.secondaryBackgroundStyle = {
      'background-color': themeSource.secondaryColor
    };
    theme.accentBackgroundStyle = {
      'background-color': themeSource.accentColor
    };

    theme.overlayStyle = this.luma(theme.accentColor) > this.luma(theme.secondaryColor) && theme.accentColor == theme.primaryColor ?
    {
      'background': 'rgba('+
                    (secondaryColorRgb.r - 30)+','+
                    (secondaryColorRgb.g - 30)+','+
                    (secondaryColorRgb.b - 30)+','+
                    theme.op5+')',
    } :
    {
      'background': 'rgba('+
                    accentColorRgb.r+','+
                    accentColorRgb.g+','+
                    accentColorRgb.b+','+
                    theme.op5+')',
    }

    theme.primaryTextStyle = {
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
    
    theme.sectionHeaderStyle = {
      'background': theme.secondaryColor,
      'color': 'rgba(' +
               theme.primaryColorRgb.r + ',' +
               theme.primaryColorRgb.g + ',' +
               theme.primaryColorRgb.b + ',' +
               theme.op4 + ')',
      'border-bottom': '1px solid ' + 'rgba(' +
                       theme.primaryColorRgb.r + ',' +
                       theme.primaryColorRgb.g + ',' +
                       theme.primaryColorRgb.b + ',' +
                       theme.op2 + ')'
    }

    theme.textInputFocusStyle = {
      'background': 'rgba(' +
      theme.primaryColorRgb.r + ',' +
      theme.primaryColorRgb.g + ',' +
      theme.primaryColorRgb.b + ',' +
      theme.op1 + ')',
      'border-left': '4px solid ' + themeSource.accentColor,
      'color': theme.primaryColor
    };

    theme.textInputBlurStyle = {
      'background': 'rgba(' +
      theme.primaryColorRgb.r + ',' +
      theme.primaryColorRgb.g + ',' +
      theme.primaryColorRgb.b + ',' +
      theme.op1 + ')',
      'border-left': '4px solid ' + 'rgba(' +
      theme.accentColorRgb.r + ',' +
      theme.accentColorRgb.g + ',' +
      theme.accentColorRgb.b + ',' +
      theme.op4 + ')',
      'color': theme.primaryColor
    };

    theme.selectOverlayStyle = {
      'background':
      'linear-gradient(' + 'rgba(' +
      theme.primaryColorRgb.r + ',' +
      theme.primaryColorRgb.g + ',' +
      theme.primaryColorRgb.b + ',' +
      theme.op2 + ')' + ',' + 'rgba(' +
      theme.primaryColorRgb.r + ',' +
      theme.primaryColorRgb.g + ',' +
      theme.primaryColorRgb.b + ',' +
      theme.op2 + ')' + '), ' +
      theme.secondaryColor,
      'color': theme.primaryColor
    };

    theme.selectArrowStyle = {
      'border-color': theme.primaryColor + ' transparent transparent transparent'
    };

    theme.newTransactionTextStyle = this.luma(themeSource.primaryColor) > this.luma(themeSource.secondaryColor) ?
      {
        'color': themeSource.secondaryColor,
        'border-color': themeSource.secondaryColor
      } :
      {
        'color': themeSource.primaryColor,
        'border-color': themeSource.primaryColor
      };

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

    theme.maxButtonOffStyle = {
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    };
    theme.maxButtonOnStyle = {
      'color': themeSource.secondaryColor,
      'border': 'none',
      'background': themeSource.accentColor
    };

    theme.primaryBorderStyle = {
      'border-color': themeSource.primaryColor
    };

    theme.secondaryBorderStyle = {
      'border-color': themeSource.secondaryColor
    };

    theme.accentBorderStyle = {
      'border-color': themeSource.accentColor
    };

    theme.toggleButtonOffStyle = {
      'border': '1px solid ' + 'rgba(' +
      primaryColorRgb.r + ',' +
      primaryColorRgb.g + ',' +
      primaryColorRgb.b + ',' +
      themeSource.op4 + ')',
      'background': 'transparent',
      'color': 'rgba(' +
               primaryColorRgb.r + ',' +
               primaryColorRgb.g + ',' +
               primaryColorRgb.b + ',' +
               themeSource.op5 + ')'
    };

    theme.toggleButtonOnStyle = {
      'border': 'none',
      'background': 'rgba(' +
                    primaryColorRgb.r + ',' +
                    primaryColorRgb.g + ',' +
                    primaryColorRgb.b + ',' +
                    themeSource.op5 + ')',
      'color': theme.secondaryColor
    };

    theme.toggleSwitchOffStyle = {
      'background-color': 'rgba(' +
      primaryColorRgb.r + ',' +
      primaryColorRgb.g + ',' +
      primaryColorRgb.b + ',' +
      themeSource.op2 + ')',
    };

    theme.toggleSwitchOnStyle = theme.primaryColor === theme.accentColor ? {
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
      theme.op4 + ')',
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

    theme.processingBackgroundStyle = {
      'background-color': themeSource.processingColor
    };

    theme.receiveColor = themeSource.receiveColor;

    theme.sendColor = themeSource.sendColor;

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
