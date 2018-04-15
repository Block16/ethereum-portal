import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as tokendata from './static-models/ethereum-tokens.json';

@Injectable()
export class TokenSymbolService {

  constructor() {
  	console.log(tokendata);
  }

  public checkTokenSymbol(address) {
  	let result = tokendata.filter(function( obj ) {
  	  return obj.contract_address == address;
  	});
  	return result[0];
  }

}
