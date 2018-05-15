import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataShareService {
  public showSidebar = new BehaviorSubject(false);
  public recentTransactions = new BehaviorSubject([]);
  public navLocation = new BehaviorSubject('send');
  public tabletMaxBreakPoint = 1000;
  public mobileMaxBreakPoint = 500;
  constructor() { }
  
  windowSize(windowWidth) {
    if (windowWidth <= this.mobileMaxBreakPoint) {
      return 'mobile';
    } else if (windowWidth > this.mobileMaxBreakPoint && windowWidth <= this.tabletMaxBreakPoint) {
      return 'tablet';
    } else if (windowWidth > this.tabletMaxBreakPoint) {
      return 'desktop';
    }
  }
  
  isMobileSize(windowWidth) {
    return windowWidth <= this.mobileMaxBreakPoint;
  }
  
  isTabletSize(windowWidth) {
    return windowWidth > this.mobileMaxBreakPoint && windowWidth <= this.tabletMaxBreakPoint;
  }
  
  isDesktopSize(windowWidth) {
    return windowWidth > this.tabletMaxBreakPoint;
  }
  
  getNavLocation() {
  	return this.navLocation.asObservable();
  }
  
  getShowSidebar() {
    return this.showSidebar.asObservable();
  }

  getRecentTransactions() {
    return this.recentTransactions.asObservable();
  }
}
