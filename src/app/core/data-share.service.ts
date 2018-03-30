import { OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class DataShareService {
	public showSidebar = new BehaviorSubject(false);
	public recentTransactions = new BehaviorSubject([]);
	public userPreferences = new BehaviorSubject({});
	
	public themes = {
		'Default': {
			'color': 'black',
			'background-color': 'lightgray'
		},
		'Dark': {
			'color': 'white',
			'background-color': 'black'
		}
	}
	
	getShowSidebar() {
	  return this.showSidebar.asObservable();
	}
	
	getTheme(themeName: string) {
		if (this.themes[themeName]) {
			return this.themes[themeName];
		} else {
			console.log('Theme name error!');
		}
	}
	
	getRecentTransactions() {
	  return this.recentTransactions.asObservable();
	}
	
	getUserPreferences() {
	  return this.userPreferences.asObservable();
	}
	
  constructor() { }

}
