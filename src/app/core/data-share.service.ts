import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataShareService {
  public showSidebar = new BehaviorSubject(false);
  public recentTransactions = new BehaviorSubject([]);
  public userPreferences = new BehaviorSubject({});

  constructor() { }

  /*

    Necessary styles for a theme:
    highlightStyle
    - ::selection background color

    backgroundStyle
    - Background color (default newspaper white)

    textStyle
    - Color
    - Border color

    buttonStyle
    - Background color
    - Color

    toggleSwitchStyle
    - background color
    - --hoverBackgroundColor
    - --enabledBackgroundColor
    - --beforeBackgroundColor (knob)

    selectStyle
    - background color
    - color

    transactionDotStyle (include option to override with an image?)
    - --processingColor
    - --failedColor
    - --confirmedColor



    */

  getShowSidebar() {
    return this.showSidebar.asObservable();
  }

  getRecentTransactions() {
    return this.recentTransactions.asObservable();
  }

  getUserPreferences() {
    return this.userPreferences.asObservable();
  }

}
