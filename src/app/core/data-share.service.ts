import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataShareService {
  public showSidebar = new BehaviorSubject(false);
  public recentTransactions = new BehaviorSubject([]);
  constructor() { }

  getShowSidebar() {
    return this.showSidebar.asObservable();
  }

  getRecentTransactions() {
    return this.recentTransactions.asObservable();
  }
}
