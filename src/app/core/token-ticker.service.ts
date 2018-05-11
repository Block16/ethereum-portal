import {Injectable} from '@angular/core';
import {EthereumTokens} from './static-models/ethereum-tokens';

@Injectable()
export class TokenTickerService {

  constructor() { }

  public checkTokenSymbol(address) {
  	// debugger;
  	return EthereumTokens.find(obj => obj.contractAddress === address);
  }

}
