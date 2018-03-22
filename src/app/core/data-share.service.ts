import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class DataShareService {
	public recentTransactions = new BehaviorSubject([]);
	
	getRecentTransactions() {
	  return this.recentTransactions.asObservable();
	}
	
  constructor() { }

}
