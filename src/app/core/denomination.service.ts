import { Injectable } from '@angular/core';


@Injectable()
export class DenominationService {

  constructor() { }
  
  public denominate(asset, amount, denomination) {
  	// we need to talk to some API for this
  	// asset should probably be smart contract address
  	return '$' + 25000 + ' ' + denomination;
  }
  
}
