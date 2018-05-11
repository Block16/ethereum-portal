import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataShareService {
  public showSidebar = new BehaviorSubject(false);
  public recentTransactions = new BehaviorSubject([]);
  public navLocation = new BehaviorSubject('history');
  constructor() { }
  
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
