import {Injectable} from '@angular/core';
import {isNullOrUndefined} from "util";
import {ThemeSource} from "../shared/model/theme-source";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

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
    <ThemeSource> {
      'name': 'Default',
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
    <ThemeSource> {
      'name': 'Dark',
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
  ];

  public themes: any[];
  public theme: BehaviorSubject<any>;

  constructor() {
    this.theme = new BehaviorSubject({});
    this.themes = [];
    this.themeSources.forEach((themeSource: ThemeSource) => {
      this.themes.push(ThemeService.constructTheme(themeSource));
    });
  }

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static constructTheme(themeSource: ThemeSource) {

    const theme = {};

    const primaryColorRGB = ThemeService.hexToRgb(themeSource.primaryColor);
    const bgColorRGB = ThemeService.hexToRgb(themeSource.backgroundColor);

    theme['mainStyle'] = {
      'background-color': themeSource.backgroundColor,
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    };

    theme['backgroundStyle'] = {
      'background-color': themeSource.backgroundColor
    };

    theme['primaryBackgroundStyle'] = {
      'background-color': themeSource.primaryColor
    };

    theme['textStyle'] = {
      'color': themeSource.primaryColor,
      'border-color': themeSource.primaryColor
    };

    theme['buttonStyle'] = {
      'color': themeSource.backgroundColor,
      'background-color': themeSource.primaryColor
    };

    theme['toggleSwitchOffStyle'] = {
      'background-color': 'rgba(' +
      primaryColorRGB.r + ',' +
      primaryColorRGB.g + ',' +
      primaryColorRGB.b + ',' +
      themeSource.op2 + ')',
    };

    theme['toggleSwitchOnStyle'] = {
      'background-color': 'rgba(' +
      primaryColorRGB.r + ',' +
      primaryColorRGB.g + ',' +
      primaryColorRGB.b + ',' +
      themeSource.op4 + ')',
    };

    theme['selectStyle'] = {
      'background-color': 'rgba(' +
      primaryColorRGB.r + ',' +
      primaryColorRGB.g + ',' +
      primaryColorRGB.b + ',' +
      themeSource.op2 + ')',
    };

    theme['processingBackgroundStyle'] = {
      'background-color': themeSource.processingColor
    };

    theme['confirmedBackgroundStyle'] = {
      'background-color': themeSource.confirmedColor
    };

    theme['failedBackgroundStyle'] = {
      'background-color': themeSource.failedColor
    };

    return theme;
  }

  getTheme(themeName: string) {
    const themeSource = this.themeSources.find(t => t.name === themeName);
    if (isNullOrUndefined(themeSource)) {
      throw new Error("Theme with name: " + themeName + " was not found.");
    }
    return ThemeService.constructTheme(themeSource);
  }

  setTheme() {

  }
}
