import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EthereumTokens } from "./ethereum-tokens";

@Injectable()
export class TokenSymbolService {
	
  constructor() {
  	console.log(EthereumTokens);
  }
  
  public checkTokenSymbol(address) {
  	// let result = EthereumTokens.filter(function( obj ) {
  	//   return obj.contract_address == address;
  	// });
  	return 'hi';
  }
  
}