import { OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class DataShareService {
	public showSidebar = new BehaviorSubject(false);
	public recentTransactions = new BehaviorSubject([]);
	public userPreferences = new BehaviorSubject({});
	
	getShowSidebar() {
	  return this.showSidebar.asObservable();
	}
	
	getRecentTransactions() {
	  return this.recentTransactions.asObservable();
	}
	
	getUserPreferences() {
		console.log('hi');
	  return this.userPreferences.asObservable();
	}
	
  constructor() { }

}
