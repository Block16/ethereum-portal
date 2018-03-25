import {BehaviorSubject} from 'rxjs/BehaviorSubject';
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
	  return this.userPreferences.asObservable();
	}
	
	ngOnInit() {
		let defaultPreferences = {
			'viewGeneratedTransaction': false,
			'manualGas': false,
			'darkMode': false
		}
    this.userPreferences.next(defaultPreferences);
	}
	
  constructor() { }

}
