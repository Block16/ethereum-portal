import {Injectable} from '@angular/core';
import {isNullOrUndefined} from "util";
import {ThemeSource, ThemeSources} from "./static-models/theme-source";

@Injectable()
export class ThemeService {

  constructor() { }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  constructTheme(themeSource: ThemeSource) {

    const theme = {};

    const primaryColorRGB = this.hexToRgb(themeSource.primaryColor);
    const bgColorRGB = this.hexToRgb(themeSource.backgroundColor);

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
    const themeSource = ThemeSources.find(t => t.name === themeName);
    if (isNullOrUndefined(themeSource)) {
      throw new Error("Theme with name: " + themeName + " was not found.");
    }
    return this.constructTheme(themeSource);
  }
}
